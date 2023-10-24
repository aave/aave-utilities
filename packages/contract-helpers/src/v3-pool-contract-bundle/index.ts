import { Signature, splitSignature } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction, constants, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  BorrowTxBuilder,
  InterestRate,
  ProtocolAction,
  RepayTxBuilder,
  RepayWithATokensTxBuilder,
  tEthereumAddress,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  gasLimitRecommendations,
} from '../commons/utils';
import { ERC20_2612Service, ERC20_2612Interface } from '../erc20-2612';
import {
  ApproveType,
  ERC20Service,
  IERC20ServiceInterface,
  TokenOwner,
} from '../erc20-contract';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  LendingPoolMarketConfigV3,
  Pool,
  PoolInterface as V3PoolInterface,
} from '../v3-pool-contract';
import {
  LPBorrowParamsType,
  LPSignedSupplyParamsType,
  LPSupplyParamsType,
} from '../v3-pool-contract/lendingPoolTypes';
import { IPool, IPoolInterface } from '../v3-pool-contract/typechain/IPool';
import { IPool__factory } from '../v3-pool-contract/typechain/IPool__factory';
import { L2Pool, L2PoolInterface } from '../v3-pool-rollups';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';

export type SupplyTxBuilder = {
  generateTxData: ({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
    useOptimizedPath,
    encodedTxData,
  }: LPSupplyParamsType) => PopulatedTransaction;
  generateSignedTxData: ({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
    useOptimizedPath,
    signature,
    encodedTxData,
  }: LPSignedSupplyParamsType) => PopulatedTransaction;
  getApprovedAmount: ({ user, token }: TokenOwner) => Promise<ApproveType>;
  encodeSupplyParams: ({
    reserve,
    amount,
    referralCode,
  }: Pick<
    LPSupplyParamsType,
    'reserve' | 'amount' | 'referralCode'
  >) => Promise<string>;
  encodeSupplyWithPermitParams: ({
    reserve,
    amount,
    referralCode,
    signature,
  }: Pick<
    LPSignedSupplyParamsType,
    'reserve' | 'amount' | 'referralCode' | 'signature' | 'deadline'
  >) => Promise<[string, string, string]>;
};

export interface PoolBundleInterface {
  supplyTxBuilder: SupplyTxBuilder;
}

export class PoolBundle
  extends BaseService<IPool>
  implements PoolBundleInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly poolAddress: tEthereumAddress;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  readonly erc20_2612Service: ERC20_2612Interface;

  readonly l2EncoderAddress: string;

  readonly l2PoolAddress: string;

  readonly l2PoolService: L2PoolInterface;

  readonly v3PoolService: V3PoolInterface;

  readonly wethGatewayAddress: tEthereumAddress;

  readonly contractInterface: IPoolInterface;

  supplyTxBuilder: SupplyTxBuilder;
  borrowTxBuilder: BorrowTxBuilder;
  repayTxBuilder: RepayTxBuilder;
  repayWithATokensTxBuilder: RepayWithATokensTxBuilder;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfigV3,
  ) {
    super(provider, IPool__factory);

    const { POOL, WETH_GATEWAY, L2_ENCODER } = lendingPoolConfig ?? {};

    this.poolAddress = POOL ?? '';
    this.l2EncoderAddress = L2_ENCODER ?? '';
    this.wethGatewayAddress = WETH_GATEWAY ?? '';
    this.v3PoolService = new Pool(provider, lendingPoolConfig);

    // initialize services
    this.erc20_2612Service = new ERC20_2612Service(provider);
    this.erc20Service = new ERC20Service(provider);
    this.synthetixService = new SynthetixService(provider);
    this.wethGatewayService = new WETHGatewayService(
      provider,
      this.erc20Service,
      WETH_GATEWAY,
    );

    this.l2PoolService = new L2Pool(provider, {
      l2PoolAddress: this.poolAddress,
      encoderAddress: this.l2EncoderAddress,
    });

    this.contractInterface = IPool__factory.createInterface();

    this.supplyTxBuilder = {
      getApprovedAmount: async (props: TokenOwner): Promise<ApproveType> => {
        const spender =
          props.token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
            ? this.wethGatewayAddress
            : this.poolAddress;
        const amount = await this.erc20Service.approvedAmount({
          ...props,
          spender,
        });
        return {
          ...props,
          spender,
          amount: amount.toString(),
        };
      },
      generateTxData: ({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        useOptimizedPath,
        encodedTxData,
      }: LPSupplyParamsType): PopulatedTransaction => {
        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedSupplyTxData({
            encodedTxData,
            user,
          });
        }

        let actionTx: PopulatedTransaction = {};
        const onBehalfOfParam = onBehalfOf ?? user;
        const referralCodeParam = referralCode ?? '0';
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
          actionTx = this.wethGatewayService.generateDepositEthTxData({
            lendingPool: this.poolAddress,
            user,
            amount,
            onBehalfOf: onBehalfOfParam,
            referralCode: referralCodeParam,
          });
        } else {
          const txData = this.contractInterface.encodeFunctionData('supply', [
            reserve,
            amount,
            onBehalfOfParam,
            referralCodeParam,
          ]);
          actionTx.to = this.poolAddress;
          actionTx.from = user;
          actionTx.data = txData;
          actionTx.gasLimit = BigNumber.from(
            gasLimitRecommendations[ProtocolAction.supply].recommended,
          );
        }

        return actionTx;
      },
      generateSignedTxData: ({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
        useOptimizedPath,
        signature,
        deadline,
        encodedTxData,
      }: LPSignedSupplyParamsType): PopulatedTransaction => {
        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedSupplyWithPermitTxData({
            encodedTxData,
            user,
            signature,
          });
        }

        const decomposedSignature: Signature = splitSignature(signature);
        const populatedTx: PopulatedTransaction = {};
        const onBehalfOfParam = onBehalfOf ?? user;
        const referralCodeParam = referralCode ?? '0';
        const txData = this.contractInterface.encodeFunctionData(
          'supplyWithPermit',
          [
            reserve,
            amount,
            onBehalfOfParam,
            referralCodeParam,
            deadline,
            decomposedSignature.v,
            decomposedSignature.r,
            decomposedSignature.s,
          ],
        );
        populatedTx.to = this.poolAddress;
        populatedTx.from = user;
        populatedTx.data = txData;
        populatedTx.gasLimit = BigNumber.from(
          gasLimitRecommendations[ProtocolAction.supplyWithPermit].recommended,
        );

        return populatedTx;
      },
      encodeSupplyParams: async ({
        reserve,
        amount,
        referralCode,
      }): Promise<string> => {
        return this.l2PoolService
          .getEncoder()
          .encodeSupplyParams(reserve, amount, referralCode ?? '0');
      },
      encodeSupplyWithPermitParams: async ({
        reserve,
        amount,
        signature,
        deadline,
        referralCode,
      }): Promise<[string, string, string]> => {
        const decomposedSignature: Signature = splitSignature(signature);
        return this.l2PoolService
          .getEncoder()
          .encodeSupplyWithPermitParams(
            reserve,
            amount,
            referralCode ?? '0',
            deadline,
            decomposedSignature.v,
            decomposedSignature.r,
            decomposedSignature.s,
          );
      },
    };

    this.borrowTxBuilder = {
      generateTxData: ({
        user,
        reserve,
        amount,
        interestRateMode,
        debtTokenAddress,
        onBehalfOf,
        referralCode,
        useOptimizedPath,
        encodedTxData,
      }: LPBorrowParamsType): PopulatedTransaction => {
        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedBorrowTxData({
            encodedTxData,
            user,
          });
        }

        let actionTx: PopulatedTransaction = {};
        const referralCodeParam = referralCode ?? '0';
        const onBehalfOfParam = onBehalfOf ?? user;
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
          if (!debtTokenAddress) {
            throw new Error(
              `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
            );
          }

          actionTx = this.wethGatewayService.generateBorrowEthTxData({
            lendingPool: this.poolAddress,
            user,
            amount,
            debtTokenAddress,
            interestRateMode,
            referralCode: referralCodeParam,
          });
        } else {
          const txData = this.contractInterface.encodeFunctionData('borrow', [
            reserve,
            amount,
            numericRateMode,
            referralCodeParam,
            onBehalfOfParam,
          ]);
          actionTx.to = this.poolAddress;
          actionTx.from = user;
          actionTx.data = txData;
          actionTx.gasLimit = BigNumber.from(
            gasLimitRecommendations[ProtocolAction.borrow].recommended,
          );
        }

        return actionTx;
      },
      encodeBorrowParams: async ({
        reserve,
        amount,
        interestRateMode,
        referralCode,
      }): Promise<string> => {
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;

        return this.l2PoolService
          .getEncoder()
          .encodeBorrowParams(
            reserve,
            amount,
            numericRateMode,
            referralCode ?? '0',
          );
      },
    };

    this.repayTxBuilder = {
      generateTxData: ({
        user,
        reserve,
        amount,
        interestRateMode,
        onBehalfOf,
        useOptimizedPath,
        encodedTxData,
      }) => {
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;
        const onBehalfOfParam = onBehalfOf ?? user;
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
          return this.wethGatewayService.generateRepayEthTxData({
            lendingPool: this.poolAddress,
            user,
            amount,
            interestRateMode,
            onBehalfOf: onBehalfOfParam,
          });
        }

        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedRepayTxData({
            encodedTxData,
            user,
          });
        }

        const actionTx: PopulatedTransaction = {};
        const txData = this.contractInterface.encodeFunctionData('repay', [
          reserve,
          amount === '-1' ? constants.MaxUint256.toString() : amount,
          numericRateMode,
          onBehalfOfParam,
        ]);
        actionTx.to = this.poolAddress;
        actionTx.from = user;
        actionTx.data = txData;
        actionTx.gasLimit = BigNumber.from(
          gasLimitRecommendations[ProtocolAction.repay].recommended,
        );
        return actionTx;
      },
      generateSignedTxData: ({
        onBehalfOf,
        signature,
        deadline,
        user,
        reserve,
        amount,
        interestRateMode,
        useOptimizedPath,
        encodedTxData,
      }) => {
        const decomposedSignature: Signature = splitSignature(signature);
        const populatedTx: PopulatedTransaction = {};
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;
        const onBehalfOfParam = onBehalfOf ?? user;
        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedRepayWithPermitTxData({
            encodedTxData,
            user,
            signature,
          });
        }

        const txData = this.contractInterface.encodeFunctionData(
          'repayWithPermit',
          [
            reserve,
            amount === '-1' ? constants.MaxUint256.toString() : amount,
            numericRateMode,
            onBehalfOfParam,
            deadline,
            decomposedSignature.v,
            decomposedSignature.r,
            decomposedSignature.s,
          ],
        );
        populatedTx.to = this.poolAddress;
        populatedTx.from = user;
        populatedTx.data = txData;
        populatedTx.gasLimit = BigNumber.from(
          gasLimitRecommendations[ProtocolAction.repayWithPermit].recommended,
        );
        return populatedTx;
      },
      encodeRepayParams: async ({ reserve, amount, interestRateMode }) => {
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;

        const repayAmount =
          amount === '-1' ? constants.MaxUint256.toString() : amount;

        return this.l2PoolService
          .getEncoder()
          .encodeRepayParams(reserve, repayAmount, numericRateMode);
      },
      encodeRepayWithPermitParams: async ({
        reserve,
        amount,
        interestRateMode,
        signature,
        deadline,
      }) => {
        const decomposedSignature: Signature = splitSignature(signature);
        const numericRateMode =
          interestRateMode === InterestRate.Variable ? 2 : 1;
        const repayAmount =
          amount === '-1' ? constants.MaxUint256.toString() : amount;

        return this.l2PoolService
          .getEncoder()
          .encodeRepayWithPermitParams(
            reserve,
            repayAmount,
            numericRateMode,
            deadline,
            decomposedSignature.v,
            decomposedSignature.r,
            decomposedSignature.s,
          );
      },
    };

    this.repayWithATokensTxBuilder = {
      generateTxData: ({
        rateMode,
        user,
        amount,
        reserve,
        useOptimizedPath,
        encodedTxData,
      }) => {
        const actionTx: PopulatedTransaction = {};
        const numericRateMode = rateMode === InterestRate.Variable ? 2 : 1;
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
          throw new Error(
            'Can not repay with aTokens with eth. Should be WETH instead',
          );
        }

        if (useOptimizedPath && encodedTxData) {
          return this.l2PoolService.generateEncodedRepayWithATokensTxData({
            encodedTxData,
            user,
          });
        }

        const txData = this.contractInterface.encodeFunctionData(
          'repayWithATokens',
          [
            reserve,
            amount === '-1' ? constants.MaxUint256.toString() : amount,
            numericRateMode,
          ],
        );
        actionTx.to = this.poolAddress;
        actionTx.from = user;
        actionTx.data = txData;
        actionTx.gasLimit = BigNumber.from(
          gasLimitRecommendations[ProtocolAction.repayWithATokens].recommended,
        );

        return actionTx;
      },
      encodeRepayWithATokensParams: async ({ reserve, amount, rateMode }) => {
        const numericRateMode = rateMode === InterestRate.Variable ? 2 : 1;
        const repayAmount =
          amount === '-1' ? constants.MaxUint256.toString() : amount;

        return this.l2PoolService
          .getEncoder()
          .encodeRepayWithATokensParams(reserve, repayAmount, numericRateMode);
      },
    };
  }
}

import { Signature, splitSignature } from '@ethersproject/bytes';
import { PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { DEFAULT_DEADLINE, tEthereumAddress } from '../commons/types';
import { API_ETH_MOCK_ADDRESS } from '../commons/utils';
import { ERC20_2612Service, ERC20_2612Interface } from '../erc20-2612';
import {
  ApproveType,
  ERC20Service,
  IERC20ServiceInterface,
  SignedApproveType,
  TokenOwner,
} from '../erc20-contract';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  LendingPoolMarketConfigV3,
  Pool,
  PoolInterface as V3PoolInterface,
} from '../v3-pool-contract';
import {
  LPSignedSupplyParamsType,
  LPSupplyParamsType,
} from '../v3-pool-contract/lendingPoolTypes';
import { IPool, IPoolInterface } from '../v3-pool-contract/typechain/IPool';
import { IPool__factory } from '../v3-pool-contract/typechain/IPool__factory';
import { L2Pool, L2PoolInterface } from '../v3-pool-rollups';
import { LPSupplyWithPermitType as LPSupplyWithPermitTypeL2 } from '../v3-pool-rollups/poolTypes';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';

export type SupplyTxBuilder = {
  generateApprovalTxData: ({
    user,
    token,
    spender,
    amount,
  }: ApproveType) => PopulatedTransaction;
  generateApprovalSignatureData: ({
    user,
    token,
    spender,
    amount,
    deadline,
  }: SignedApproveType) => Promise<string>;
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

    // Initialize supplyTxBuilder
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
      generateApprovalTxData: (props: ApproveType): PopulatedTransaction => {
        return this.erc20Service.approveTxData(props);
      },
      generateApprovalSignatureData: async (
        props: SignedApproveType,
      ): Promise<string> => {
        return this.v3PoolService.signERC20Approval({
          ...props,
          reserve: props.token,
          deadline: props.deadline ?? DEFAULT_DEADLINE,
        });
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
        } else if (useOptimizedPath) {
          if (encodedTxData) {
            actionTx = this.l2PoolService.generateEncodedSupplyTxData({
              encodedTxData,
              user,
            });
          } else {
            const args: LPSupplyParamsType = {
              user,
              reserve,
              amount,
              onBehalfOf: onBehalfOfParam,
              referralCode: referralCodeParam,
            };
            actionTx = this.l2PoolService.generateSupplyTxData(args);
          }
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
        const decomposedSignature: Signature = splitSignature(signature);
        let populatedTx: PopulatedTransaction = {};
        const onBehalfOfParam = onBehalfOf ?? user;
        const referralCodeParam = referralCode ?? '0';
        if (useOptimizedPath) {
          if (encodedTxData) {
            populatedTx =
              this.l2PoolService.generateEncodedSupplyWithPermitTxData({
                encodedTxData,
                user,
                signature,
              });
          } else {
            const args: LPSupplyWithPermitTypeL2 = {
              user,
              reserve,
              amount,
              referralCode: referralCodeParam,
              onBehalfOf: onBehalfOfParam,
              permitR: decomposedSignature.r,
              permitS: decomposedSignature.s,
              permitV: decomposedSignature.v,
              deadline: Number(deadline),
            };
            populatedTx =
              this.l2PoolService.generateSupplyWithPermitTxData(args);
          }
        } else {
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
        }

        return populatedTx;
      },
    };
  }
}

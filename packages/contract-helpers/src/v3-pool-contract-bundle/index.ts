import { Signature, splitSignature } from '@ethersproject/bytes';
import { PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  ActionBundle,
  DEFAULT_DEADLINE,
  ProtocolAction,
  SignedActionRequest,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  convertPopulatedTx,
  DEFAULT_APPROVE_AMOUNT,
  gasLimitRecommendations,
  valueToWei,
} from '../commons/utils';
import { LPValidatorV3 } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ERC20_2612Service, ERC20_2612Interface } from '../erc20-2612';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import {
  LiquiditySwapAdapterInterface,
  LiquiditySwapAdapterService,
} from '../paraswap-liquiditySwapAdapter-contract';
import {
  ParaswapRepayWithCollateral,
  ParaswapRepayWithCollateralInterface,
} from '../paraswap-repayWithCollateralAdapter-contract';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  LendingPoolMarketConfigV3,
  Pool,
  PoolInterface as V3PoolInterface,
} from '../v3-pool-contract';
import { LPSupplyParamsType } from '../v3-pool-contract/lendingPoolTypes';
import { IPool, IPoolInterface } from '../v3-pool-contract/typechain/IPool';
import { IPool__factory } from '../v3-pool-contract/typechain/IPool__factory';
import { L2Pool, L2PoolInterface } from '../v3-pool-rollups';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';

export interface PoolBundleInterface {
  supplyBundle: (args: LPSupplyParamsBundleType) => Promise<ActionBundle>;
}

export type LPSupplyParamsBundleType = LPSupplyParamsType & {
  skipApprovalChecks?: boolean;
  skipGasEstimation?: boolean;
  deadline?: string;
};

export class PoolBundle
  extends BaseService<IPool>
  implements PoolBundleInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly poolAddress: string;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  readonly liquiditySwapAdapterService: LiquiditySwapAdapterInterface;

  readonly paraswapRepayWithCollateralAdapterService: ParaswapRepayWithCollateralInterface;

  readonly erc20_2612Service: ERC20_2612Interface;

  readonly flashLiquidationAddress: string;

  readonly swapCollateralAddress: string;

  readonly repayWithCollateralAddress: string;

  readonly l2EncoderAddress: string;

  readonly l2PoolAddress: string;

  readonly l2PoolService: L2PoolInterface;

  readonly v3PoolService: V3PoolInterface;

  readonly contractInterface: IPoolInterface;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfigV3,
  ) {
    super(provider, IPool__factory);

    const {
      POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
      L2_ENCODER,
    } = lendingPoolConfig ?? {};

    this.poolAddress = POOL ?? '';
    this.flashLiquidationAddress = FLASH_LIQUIDATION_ADAPTER ?? '';
    this.swapCollateralAddress = SWAP_COLLATERAL_ADAPTER ?? '';
    this.repayWithCollateralAddress = REPAY_WITH_COLLATERAL_ADAPTER ?? '';
    this.l2EncoderAddress = L2_ENCODER ?? '';
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
    this.liquiditySwapAdapterService = new LiquiditySwapAdapterService(
      provider,
      SWAP_COLLATERAL_ADAPTER,
    );

    this.paraswapRepayWithCollateralAdapterService =
      new ParaswapRepayWithCollateral(provider, REPAY_WITH_COLLATERAL_ADAPTER);

    this.l2PoolService = new L2Pool(provider, {
      l2PoolAddress: this.poolAddress,
      encoderAddress: this.l2EncoderAddress,
    });

    this.contractInterface = IPool__factory.createInterface();
  }

  @LPValidatorV3
  public async supplyBundle(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    {
      user,
      reserve,
      amount,
      onBehalfOf,
      referralCode,
      useOptimizedPath,
      skipApprovalChecks,
      skipGasEstimation,
      deadline,
    }: LPSupplyParamsBundleType,
  ): Promise<ActionBundle> {
    let actionTx: PopulatedTransaction = {};
    let approved = true;
    const approvals: PopulatedTransaction[] = [];
    const signatureRequests: string[] = [];

    const generateSignedAction = async ({
      signatures,
    }: SignedActionRequest) => {
      const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
      const convertedAmount: string = valueToWei(
        amount,
        await decimalsOf(reserve),
      );
      const sig: Signature = splitSignature(signatures[0]);
      const fundsAvailable: boolean =
        await this.synthetixService.synthetixValidation({
          user,
          reserve,
          amount: convertedAmount,
        });
      if (!fundsAvailable) {
        throw new Error('Not enough funds to execute operation');
      }

      let populatedTx: PopulatedTransaction = {};
      if (useOptimizedPath) {
        const legacyTx = await this.l2PoolService.supplyWithPermit(
          {
            user,
            reserve,
            amount: convertedAmount,
            referralCode,
            deadline: DEFAULT_DEADLINE,
            permitV: sig.v,
            permitR: sig.r,
            permitS: sig.s,
          },
          [],
        );
        const executedTx = await legacyTx[0].tx();
        populatedTx = convertPopulatedTx(executedTx);
      } else {
        const txData = this.contractInterface.encodeFunctionData(
          'supplyWithPermit',
          [
            reserve,
            convertedAmount,
            onBehalfOf ?? user,
            referralCode ?? '0',
            DEFAULT_DEADLINE,
            sig.v,
            sig.r,
            sig.s,
          ],
        );
        populatedTx.to = this.poolAddress;
        populatedTx.from = user;
        populatedTx.data = txData;
      }

      populatedTx = await this.estimateGasLimit({
        tx: populatedTx,
        action: ProtocolAction.supplyWithPermit,
        skipGasEstimation,
      });

      return populatedTx;
    };

    // Base asset supplies are routed to WETHGateway
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      const depositEth = this.wethGatewayService.depositETH({
        lendingPool: this.poolAddress,
        user,
        amount,
        onBehalfOf,
        referralCode,
      });
      const txData = await depositEth[0].tx();
      actionTx = convertPopulatedTx(txData);

      actionTx = await this.estimateGasLimit({
        tx: actionTx,
        action: ProtocolAction.supply,
        skipGasEstimation,
      });
    } else {
      // Handle mon-base asset supplies
      const { isApproved, decimalsOf, approveTxData }: IERC20ServiceInterface =
        this.erc20Service;
      const reserveDecimals: number = await decimalsOf(reserve);
      const convertedAmount: string = valueToWei(amount, reserveDecimals);

      const fundsAvailable: boolean =
        await this.synthetixService.synthetixValidation({
          user,
          reserve,
          amount: convertedAmount,
        });
      if (!fundsAvailable) {
        throw new Error('Not enough funds to execute operation');
      }

      // Generate approval and signature requests, optional
      if (!skipApprovalChecks) {
        approved = await isApproved({
          token: reserve,
          user,
          spender: this.poolAddress,
          amount,
        });

        if (!approved) {
          const approveTx = await approveTxData({
            user,
            token: reserve,
            spender: this.poolAddress,
            amount: DEFAULT_APPROVE_AMOUNT,
            skipGasEstimation,
          });

          const signatureRequest = await this.v3PoolService.signERC20Approval({
            user,
            reserve,
            amount,
            deadline: deadline ?? DEFAULT_DEADLINE,
          });
          approvals.push(approveTx);
          signatureRequests.push(signatureRequest);
        }
      }

      // compress calldata for L2Pool
      if (useOptimizedPath) {
        const legacyL2SupplyTx = await this.l2PoolService.supply(
          { user, reserve, amount: convertedAmount, referralCode },
          [],
        );
        const executedTx = await legacyL2SupplyTx[0].tx();
        actionTx = convertPopulatedTx(executedTx);
      } else {
        const txData = this.contractInterface.encodeFunctionData('supply', [
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
          referralCode ?? '0',
        ]);
        actionTx.to = this.poolAddress;
        actionTx.from = user;
        actionTx.data = txData;
      }

      actionTx = await this.estimateGasLimit({
        tx: actionTx,
        action: ProtocolAction.supply,
        skipGasEstimation,
      });
    }

    return {
      action: actionTx,
      approvalRequired: !approved,
      approvals,
      signatureRequests,
      generateSignedAction,
      signedActionGasEstimate:
        gasLimitRecommendations[ProtocolAction.supplyWithPermit].limit,
    };
  }
}

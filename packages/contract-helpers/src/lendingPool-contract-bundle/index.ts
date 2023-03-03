import { providers, PopulatedTransaction } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  ProtocolAction,
  LendingPoolMarketConfig,
  ActionBundle,
} from '../commons/types';
import {
  valueToWei,
  API_ETH_MOCK_ADDRESS,
  DEFAULT_APPROVE_AMOUNT,
  convertPopulatedTx,
} from '../commons/utils';
import { LPValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { LPDepositParamsType } from '../lendingPool-contract/lendingPoolTypes';
import { ILendingPool } from '../lendingPool-contract/typechain/ILendingPool';
import { ILendingPool__factory } from '../lendingPool-contract/typechain/ILendingPool__factory';
import {
  LiquiditySwapAdapterInterface,
  LiquiditySwapAdapterService,
} from '../paraswap-liquiditySwapAdapter-contract';
import {
  ParaswapRepayWithCollateral,
  ParaswapRepayWithCollateralInterface,
} from '../paraswap-repayWithCollateralAdapter-contract';
import {
  RepayWithCollateralAdapterInterface,
  RepayWithCollateralAdapterService,
} from '../repayWithCollateralAdapter-contract';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';

export type LPDepositParamsBundleType = LPDepositParamsType & {
  skipApprovalChecks?: boolean;
  skipGasEstimation?: boolean;
};

export interface LendingPoolBundleInterface {
  depositBundle: (args: LPDepositParamsBundleType) => Promise<ActionBundle>;
}

export class LendingPoolBundle
  extends BaseService<ILendingPool>
  implements LendingPoolBundleInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly lendingPoolAddress: string;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  readonly liquiditySwapAdapterService: LiquiditySwapAdapterInterface;

  readonly repayWithCollateralAdapterService: RepayWithCollateralAdapterInterface;

  readonly flashLiquidationAddress: string;

  readonly swapCollateralAddress: string;

  readonly repayWithCollateralAddress: string;

  readonly paraswapRepayWithCollateralAdapterService: ParaswapRepayWithCollateralInterface;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfig,
  ) {
    super(provider, ILendingPool__factory);

    const {
      LENDING_POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
    } = lendingPoolConfig ?? {};

    this.lendingPoolAddress = LENDING_POOL ?? '';
    this.flashLiquidationAddress = FLASH_LIQUIDATION_ADAPTER ?? '';
    this.swapCollateralAddress = SWAP_COLLATERAL_ADAPTER ?? '';
    this.repayWithCollateralAddress = REPAY_WITH_COLLATERAL_ADAPTER ?? '';

    // initialize services
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
    this.repayWithCollateralAdapterService =
      new RepayWithCollateralAdapterService(
        provider,
        REPAY_WITH_COLLATERAL_ADAPTER,
      );

    this.paraswapRepayWithCollateralAdapterService =
      new ParaswapRepayWithCollateral(provider, REPAY_WITH_COLLATERAL_ADAPTER);
  }

  @LPValidator
  public async depositBundle(
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
      skipApprovalChecks,
      skipGasEstimation,
    }: LPDepositParamsBundleType,
  ): Promise<ActionBundle> {
    let actionTx: PopulatedTransaction = {};
    const approvals: PopulatedTransaction[] = [];

    // Base asset supplies are routed to WETHGateway
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      const depositEth = this.wethGatewayService.depositETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        onBehalfOf,
        referralCode,
      });
      const txData = await depositEth[0].tx();
      actionTx = convertPopulatedTx(txData);
      if (!skipGasEstimation) {
        actionTx = await this.estimateGasLimit({
          tx: actionTx,
          action: ProtocolAction.deposit,
        });
      }
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
        const approved = await isApproved({
          token: reserve,
          user,
          spender: this.lendingPoolAddress,
          amount,
        });

        if (!approved) {
          let approveTx = await approveTxData({
            user,
            token: reserve,
            spender: this.lendingPoolAddress,
            amount: DEFAULT_APPROVE_AMOUNT,
          });
          if (!skipGasEstimation) {
            approveTx = await this.estimateGasLimit({ tx: approveTx });
          }

          approvals.push(approveTx);
        }
      }

      // Generate deposit tx
      const lendingPoolContract: ILendingPool = this.getContractInstance(
        this.lendingPoolAddress,
      );

      actionTx = await lendingPoolContract.populateTransaction.deposit(
        reserve,
        convertedAmount,
        onBehalfOf ?? user,
        referralCode ?? '0',
      );
      actionTx.from = user;
    }

    if (!skipGasEstimation) {
      actionTx = await this.estimateGasLimit({
        tx: actionTx,
        action: ProtocolAction.deposit,
      });
    }

    return {
      action: actionTx,
      approvals,
      signatureRequests: [],
      generateSignedAction: async () => Promise.resolve({}),
    };
  }
}

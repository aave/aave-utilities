import { constants, utils, BigNumberish, BytesLike, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  transactionType,
  tEthereumAddress,
  LendingPoolMarketConfig,
} from '../commons/types';
import {
  getTxValue,
  valueToWei,
  API_ETH_MOCK_ADDRESS,
  DEFAULT_APPROVE_AMOUNT,
  SURPLUS,
  augustusToAmountOffsetFromCalldata,
} from '../commons/utils';
import {
  LPFlashLiquidationValidator,
  LPRepayWithCollateralValidator,
  LPSwapCollateralValidator,
  LPValidator,
} from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import {
  LiquiditySwapAdapterInterface,
  augustusFromAmountOffsetFromCalldata,
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
import {
  LPBorrowParamsType,
  LPDepositParamsType,
  LPLiquidationCall,
  LPRepayParamsType,
  LPRepayWithCollateral,
  LPSetUsageAsCollateral,
  LPSwapBorrowRateMode,
  LPSwapCollateral,
  LPWithdrawParamsType,
  LPFlashLiquidation,
  LPParaswapRepayWithCollateral,
} from './lendingPoolTypes';
import { ILendingPool } from './typechain/ILendingPool';
import { ILendingPool__factory } from './typechain/ILendingPool__factory';

const buildParaSwapLiquiditySwapParams = (
  assetToSwapTo: tEthereumAddress,
  minAmountToReceive: BigNumberish,
  swapAllBalanceOffset: BigNumberish,
  swapCalldata: string | Buffer | BytesLike,
  augustus: tEthereumAddress,
  permitAmount: BigNumberish,
  deadline: BigNumberish,
  v: BigNumberish,
  r: string | Buffer | BytesLike,
  s: string | Buffer | BytesLike,
) => {
  return utils.defaultAbiCoder.encode(
    [
      'address',
      'uint256',
      'uint256',
      'bytes',
      'address',
      'tuple(uint256,uint256,uint8,bytes32,bytes32)',
    ],
    [
      assetToSwapTo,
      minAmountToReceive,
      swapAllBalanceOffset,
      swapCalldata,
      augustus,
      [permitAmount, deadline, v, r, s],
    ],
  );
};

export interface LendingPoolInterface {
  deposit: (
    args: LPDepositParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdraw: (
    args: LPWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  borrow: (
    args: LPBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repay: (
    args: LPRepayParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode: (
    args: LPSwapBorrowRateMode,
  ) => EthereumTransactionTypeExtended[];
  setUsageAsCollateral: (
    args: LPSetUsageAsCollateral,
  ) => EthereumTransactionTypeExtended[];
  liquidationCall: (
    args: LPLiquidationCall,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapCollateral: (
    args: LPSwapCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithCollateral: (
    args: LPRepayWithCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  flashLiquidation(
    args: LPFlashLiquidation,
  ): Promise<EthereumTransactionTypeExtended[]>;
  paraswapRepayWithCollateral(
    args: LPParaswapRepayWithCollateral,
  ): Promise<EthereumTransactionTypeExtended[]>;
}

export class LendingPool
  extends BaseService<ILendingPool>
  implements LendingPoolInterface
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
  public async deposit(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, onBehalfOf, referralCode }: LPDepositParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.depositETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        onBehalfOf,
        referralCode,
      });
    }

    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
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

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.lendingPoolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const lendingPoolContract: ILendingPool = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.deposit(
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
          referralCode ?? '0',
        ),
      from: user,
      value: getTxValue(reserve, convertedAmount),
      action: ProtocolAction.deposit,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.deposit,
      ),
    });

    return txs;
  }

  @LPValidator
  public async withdraw(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveOrMinusOneAmount('amount')
    @isEthAddress('onBehalfOf')
    @isEthAddress('aTokenAddress')
    { user, reserve, amount, onBehalfOf, aTokenAddress }: LPWithdrawParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      if (!aTokenAddress) {
        throw new Error(
          'To withdraw ETH you need to pass the aWETH token address',
        );
      }

      return this.wethGatewayService.withdrawETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
    }

    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(reserve);

    const convertedAmount: string =
      amount === '-1'
        ? constants.MaxUint256.toString()
        : valueToWei(amount, decimals);

    const lendingPoolContract: ILendingPool = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.withdraw(
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
        ),
      from: user,
      action: ProtocolAction.withdraw,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.withdraw,
        ),
      },
    ];
  }

  @LPValidator
  public async borrow(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('debtTokenAddress')
    @isEthAddress('onBehalfOf')
    {
      user,
      reserve,
      amount,
      interestRateMode,
      debtTokenAddress,
      onBehalfOf,
      referralCode,
    }: LPBorrowParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      if (!debtTokenAddress) {
        throw new Error(
          `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
        );
      }

      return this.wethGatewayService.borrowETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
        referralCode,
      });
    }

    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const reserveDecimals = await decimalsOf(reserve);
    const formatAmount: string = valueToWei(amount, reserveDecimals);

    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.borrow(
          reserve,
          formatAmount,
          numericRateMode,
          referralCode ?? 0,
          onBehalfOf ?? user,
        ),
      from: user,
      action: ProtocolAction.borrow,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.borrow,
        ),
      },
    ];
  }

  @LPValidator
  public async repay(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveOrMinusOneAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, interestRateMode, onBehalfOf }: LPRepayParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.repayETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        interestRateMode,
        onBehalfOf,
      });
    }

    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );
    const { populateTransaction }: ILendingPool = lendingPoolContract;
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
    const decimals: number = await decimalsOf(reserve);

    const convertedAmount: string =
      amount === '-1'
        ? constants.MaxUint256.toString()
        : valueToWei(amount, decimals);

    if (amount !== '-1') {
      const fundsAvailable: boolean =
        await this.synthetixService.synthetixValidation({
          user,
          reserve,
          amount: convertedAmount,
        });
      if (!fundsAvailable) {
        throw new Error('Not enough funds to execute operation');
      }
    }

    const approved: boolean = await isApproved({
      token: reserve,
      user,
      spender: this.lendingPoolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        populateTransaction.repay(
          reserve,
          convertedAmount,
          numericRateMode,
          onBehalfOf ?? user,
        ),
      from: user,
      value: getTxValue(reserve, convertedAmount),
      action: ProtocolAction.repay,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.repay,
      ),
    });

    return txs;
  }

  @LPValidator
  public swapBorrowRateMode(
    @isEthAddress('user')
    @isEthAddress('reserve')
    { user, reserve, interestRateMode }: LPSwapBorrowRateMode,
  ): EthereumTransactionTypeExtended[] {
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.swapBorrowRateMode(
          reserve,
          numericRateMode,
        ),
      from: user,
    });

    return [
      {
        txType: eEthereumTxType.DLP_ACTION,
        tx: txCallback,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @LPValidator
  public setUsageAsCollateral(
    @isEthAddress('user')
    @isEthAddress('reserve')
    { user, reserve, usageAsCollateral }: LPSetUsageAsCollateral,
  ): EthereumTransactionTypeExtended[] {
    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.setUserUseReserveAsCollateral(
          reserve,
          usageAsCollateral,
        ),
      from: user,
      action: ProtocolAction.setUsageAsCollateral,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.setUsageAsCollateral,
        ),
      },
    ];
  }

  @LPValidator
  public async liquidationCall(
    @isEthAddress('liquidator')
    @isEthAddress('liquidatedUser')
    @isEthAddress('debtReserve')
    @isEthAddress('collateralReserve')
    @isPositiveAmount('purchaseAmount')
    {
      liquidator,
      liquidatedUser,
      debtReserve,
      collateralReserve,
      purchaseAmount,
      getAToken,
      liquidateAll,
    }: LPLiquidationCall,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;

    const approved = await isApproved({
      token: debtReserve,
      user: liquidator,
      spender: this.lendingPoolAddress,
      amount: purchaseAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user: liquidator,
        token: debtReserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });

      txs.push(approveTx);
    }

    let convertedAmount = constants.MaxUint256.toString();
    if (!liquidateAll) {
      const reserveDecimals = await decimalsOf(debtReserve);
      convertedAmount = valueToWei(purchaseAmount, reserveDecimals);
    }

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.liquidationCall(
          collateralReserve,
          debtReserve,
          liquidatedUser,
          convertedAmount,
          getAToken ?? false,
        ),
      from: liquidator,
      value: getTxValue(debtReserve, convertedAmount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.liquidationCall,
      ),
    });

    return txs;
  }

  @LPSwapCollateralValidator
  public async swapCollateral(
    @isEthAddress('user')
    @isEthAddress('fromAsset')
    @isEthAddress('fromAToken')
    @isEthAddress('toAsset')
    @isEthAddress('onBehalfOf')
    @isEthAddress('augustus')
    @isPositiveAmount('fromAmount')
    @isPositiveAmount('minToAmount')
    {
      user,
      flash,
      fromAsset,
      fromAToken,
      toAsset,
      fromAmount,
      minToAmount,
      permitSignature,
      swapAll,
      onBehalfOf,
      referralCode,
      augustus,
      swapCallData,
    }: LPSwapCollateral,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const permitParams = permitSignature ?? {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const approved: boolean = await this.erc20Service.isApproved({
      token: fromAToken,
      user,
      spender: this.swapCollateralAddress,
      amount: fromAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended =
        this.erc20Service.approve({
          user,
          token: fromAToken,
          spender: this.swapCollateralAddress,
          amount: constants.MaxUint256.toString(),
        });

      txs.push(approveTx);
    }

    const tokenDecimals: number = await this.erc20Service.decimalsOf(fromAsset);

    const convertedAmount: string = valueToWei(fromAmount, tokenDecimals);

    const tokenToDecimals: number = await this.erc20Service.decimalsOf(toAsset);

    const amountSlippageConverted: string = valueToWei(
      minToAmount,
      tokenToDecimals,
    );

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    if (flash) {
      const params = buildParaSwapLiquiditySwapParams(
        toAsset,
        amountSlippageConverted,
        swapAll
          ? augustusFromAmountOffsetFromCalldata(swapCallData as string)
          : 0,
        swapCallData,
        augustus,
        permitParams.amount,
        permitParams.deadline,
        permitParams.v,
        permitParams.r,
        permitParams.s,
      );

      const amountWithSurplus: string = (
        Number(fromAmount) +
        (Number(fromAmount) * Number(SURPLUS)) / 100
      ).toString();

      const convertedAmountWithSurplus: string = valueToWei(
        amountWithSurplus,
        tokenDecimals,
      );

      const txCallback: () => Promise<transactionType> =
        this.generateTxCallback({
          rawTxMethod: async () =>
            lendingPoolContract.populateTransaction.flashLoan(
              this.swapCollateralAddress,
              [fromAsset],
              swapAll ? [convertedAmountWithSurplus] : [convertedAmount],
              [0], // interest rate mode to NONE for flashloan to not open debt
              onBehalfOf ?? user,
              params,
              referralCode ?? '0',
            ),
          from: user,
          action: ProtocolAction.swapCollateral,
        });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          txs,
          txCallback,
          ProtocolAction.swapCollateral,
        ),
      });
      return txs;
    }

    // Direct call to swap and deposit
    const swapAndDepositTx: EthereumTransactionTypeExtended =
      this.liquiditySwapAdapterService.swapAndDeposit(
        {
          user,
          assetToSwapFrom: fromAsset,
          assetToSwapTo: toAsset,
          amountToSwap: convertedAmount,
          minAmountToReceive: amountSlippageConverted,
          swapAll,
          swapCallData,
          augustus,
          permitParams,
        },
        txs,
      );

    txs.push(swapAndDepositTx);
    return txs;
  }

  @LPRepayWithCollateralValidator
  public async repayWithCollateral(
    @isEthAddress('user')
    @isEthAddress('fromAsset')
    @isEthAddress('fromAToken')
    @isEthAddress('assetToRepay')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('repayWithAmount')
    @isPositiveAmount('repayAmount')
    {
      user,
      fromAsset,
      fromAToken,
      assetToRepay,
      repayWithAmount,
      repayAmount,
      permitSignature,
      repayAllDebt,
      rateMode,
      onBehalfOf,
      referralCode,
      flash,
      useEthPath,
    }: LPRepayWithCollateral,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const permitParams = permitSignature ?? {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const approved: boolean = await this.erc20Service.isApproved({
      token: fromAToken,
      user,
      spender: this.repayWithCollateralAddress,
      amount: repayWithAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended =
        this.erc20Service.approve({
          user,
          token: fromAToken,
          spender: this.repayWithCollateralAddress,
          amount: constants.MaxUint256.toString(),
        });

      txs.push(approveTx);
    }

    const fromDecimals: number = await this.erc20Service.decimalsOf(fromAsset);
    const convertedRepayWithAmount: string = valueToWei(
      repayWithAmount,
      fromDecimals,
    );

    const repayAmountWithSurplus: string = (
      Number(repayAmount) +
      (Number(repayAmount) * Number(SURPLUS)) / 100
    ).toString();

    const decimals: number = await this.erc20Service.decimalsOf(assetToRepay);
    const convertedRepayAmount: string = repayAllDebt
      ? valueToWei(repayAmountWithSurplus, decimals)
      : valueToWei(repayAmount, decimals);

    const numericInterestRate = rateMode === InterestRate.Stable ? 1 : 2;

    if (flash) {
      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
          'bool',
        ],
        [
          fromAsset,
          convertedRepayWithAmount,
          numericInterestRate,
          permitParams.amount,
          permitParams.deadline,
          permitParams.v,
          permitParams.r,
          permitParams.s,
          useEthPath ?? false,
        ],
      );

      const lendingPoolContract = this.getContractInstance(
        this.lendingPoolAddress,
      );

      const txCallback: () => Promise<transactionType> =
        this.generateTxCallback({
          rawTxMethod: async () =>
            lendingPoolContract.populateTransaction.flashLoan(
              this.repayWithCollateralAddress,
              [assetToRepay],
              [convertedRepayAmount],
              [0], // interest rate mode to NONE for flashloan to not open debt
              onBehalfOf ?? user,
              params,
              referralCode ?? '0',
            ),
          from: user,
          action: ProtocolAction.repayCollateral,
        });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          txs,
          txCallback,
          ProtocolAction.repayCollateral,
        ),
      });

      return txs;
    }

    const swapAndRepayTx: EthereumTransactionTypeExtended =
      this.repayWithCollateralAdapterService.swapAndRepay(
        {
          user,
          collateralAsset: fromAsset,
          debtAsset: assetToRepay,
          collateralAmount: convertedRepayWithAmount,
          debtRepayAmount: convertedRepayAmount,
          debtRateMode: rateMode,
          permit: permitParams,
          useEthPath,
        },
        txs,
      );

    txs.push(swapAndRepayTx);

    return txs;
  }

  @LPRepayWithCollateralValidator
  public async paraswapRepayWithCollateral(
    @isEthAddress('user')
    @isEthAddress('fromAsset')
    @isEthAddress('fromAToken')
    @isEthAddress('assetToRepay')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('repayWithAmount')
    @isPositiveAmount('repayAmount')
    @isEthAddress('augustus')
    {
      user,
      fromAsset,
      fromAToken,
      assetToRepay,
      repayWithAmount,
      repayAmount,
      permitSignature,
      repayAllDebt,
      rateMode,
      onBehalfOf,
      referralCode,
      flash,
      swapAndRepayCallData,
      augustus,
    }: LPParaswapRepayWithCollateral,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const permitParams = permitSignature ?? {
      amount: '0',
      deadline: '0',
      v: 0,
      r: '0x0000000000000000000000000000000000000000000000000000000000000000',
      s: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const approved: boolean = await this.erc20Service.isApproved({
      token: fromAToken,
      user,
      spender: this.repayWithCollateralAddress,
      amount: repayWithAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended =
        this.erc20Service.approve({
          user,
          token: fromAToken,
          spender: this.repayWithCollateralAddress,
          amount: constants.MaxUint256.toString(),
        });

      txs.push(approveTx);
    }

    const fromDecimals: number = await this.erc20Service.decimalsOf(fromAsset);
    const convertedRepayWithAmount: string = valueToWei(
      repayWithAmount,
      fromDecimals,
    );

    const repayWithAmountWithSurplus: string = (
      Number(repayWithAmount) +
      (Number(repayWithAmount) * Number(SURPLUS)) / 100
    ).toString();

    const convertedRepayWithAmountWithSurplus: string = valueToWei(
      repayWithAmountWithSurplus,
      fromDecimals,
    );

    const decimals: number = await this.erc20Service.decimalsOf(assetToRepay);
    const convertedRepayAmount: string = valueToWei(repayAmount, decimals);

    const numericInterestRate = rateMode === InterestRate.Stable ? 1 : 2;

    if (flash) {
      const callDataEncoded = utils.defaultAbiCoder.encode(
        ['bytes', 'address'],
        [swapAndRepayCallData, augustus],
      );

      const params: string = utils.defaultAbiCoder.encode(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'bytes',
          'uint256',
          'uint256',
          'uint8',
          'bytes32',
          'bytes32',
        ],
        [
          assetToRepay,
          convertedRepayAmount,
          repayAllDebt
            ? augustusToAmountOffsetFromCalldata(swapAndRepayCallData as string)
            : 0,
          numericInterestRate,
          callDataEncoded,
          permitParams.amount,
          permitParams.deadline,
          permitParams.v,
          permitParams.r,
          permitParams.s,
        ],
      );

      const poolContract = this.getContractInstance(this.lendingPoolAddress);

      const txCallback: () => Promise<transactionType> =
        this.generateTxCallback({
          rawTxMethod: async () =>
            poolContract.populateTransaction.flashLoan(
              this.repayWithCollateralAddress,
              [fromAsset],
              repayAllDebt
                ? [convertedRepayWithAmountWithSurplus]
                : [convertedRepayWithAmount],
              [0], // interest rate mode to NONE for flashloan to not open debt
              onBehalfOf ?? user,
              params,
              referralCode ?? '0',
            ),
          from: user,
          action: ProtocolAction.repayCollateral,
        });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          txs,
          txCallback,
          ProtocolAction.repayCollateral,
        ),
      });

      return txs;
    }

    const swapAndRepayTx: EthereumTransactionTypeExtended =
      this.paraswapRepayWithCollateralAdapterService.swapAndRepay(
        {
          user,
          collateralAsset: fromAsset,
          debtAsset: assetToRepay,
          collateralAmount: convertedRepayWithAmount,
          debtRepayAmount: convertedRepayAmount,
          debtRateMode: rateMode,
          permitParams,
          repayAll: repayAllDebt ?? false,
          swapAndRepayCallData,
          augustus,
        },
        txs,
      );

    txs.push(swapAndRepayTx);

    return txs;
  }

  @LPFlashLiquidationValidator
  public async flashLiquidation(
    @isEthAddress('user')
    @isEthAddress('collateralAsset')
    @isEthAddress('borrowedAsset')
    @isPositiveAmount('debtTokenCover')
    @isEthAddress('initiator')
    {
      user,
      collateralAsset,
      borrowedAsset,
      debtTokenCover,
      liquidateAll,
      initiator,
      useEthPath,
    }: LPFlashLiquidation,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const addSurplus = (amount: string): string => {
      return (
        Number(amount) +
        (Number(amount) * Number(amount)) / 100
      ).toString();
    };

    const txs: EthereumTransactionTypeExtended[] = [];

    const lendingPoolContract: ILendingPool = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const tokenDecimals: number = await this.erc20Service.decimalsOf(
      borrowedAsset,
    );

    const convertedDebt = valueToWei(debtTokenCover, tokenDecimals);

    const convertedDebtTokenCover: string = liquidateAll
      ? constants.MaxUint256.toString()
      : convertedDebt;

    const flashBorrowAmount = liquidateAll
      ? valueToWei(addSurplus(debtTokenCover), tokenDecimals)
      : convertedDebt;

    const params: string = utils.defaultAbiCoder.encode(
      ['address', 'address', 'address', 'uint256', 'bool'],
      [
        collateralAsset,
        borrowedAsset,
        user,
        convertedDebtTokenCover,
        useEthPath ?? false,
      ],
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.flashLoan(
          this.flashLiquidationAddress,
          [borrowedAsset],
          [flashBorrowAmount],
          [0],
          initiator,
          params,
          '0',
        ),
      from: initiator,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.liquidationFlash,
      ),
    });
    return txs;
  }
}

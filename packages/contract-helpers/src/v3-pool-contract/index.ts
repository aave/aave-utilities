import { Signature } from '@ethersproject/bytes';
import { constants, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  DEFAULT_APPROVE_AMOUNT,
  getTxValue,
  valueToWei,
} from '../commons/utils';
import { LPValidatorV3 } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import {
  LiquiditySwapAdapterInterface,
  LiquiditySwapAdapterService,
} from '../paraswap-liquiditySwapAdapter-contract';
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
  LPSignSupplyType,
  LPSupplyWithPermitType,
  LPWithdrawParamsType,
} from './lendingPoolTypes';
import { IPool } from './typechain/IPool';
import { IPoolFactory } from './typechain/IPoolFactory';

export interface PoolInterface {
  deposit: (
    args: LPDepositParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  supply: (
    args: LPDepositParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  signSupply: (args: LPSignSupplyType) => Promise<string>;
  supplyWithPermit: (
    args: LPSupplyWithPermitType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export type LendingPoolMarketConfig = {
  POOL: tEthereumAddress;
  WETH_GATEWAY?: tEthereumAddress;
  FLASH_LIQUIDATION_ADAPTER?: tEthereumAddress;
  REPAY_WITH_COLLATERAL_ADAPTER?: tEthereumAddress;
  SWAP_COLLATERAL_ADAPTER?: tEthereumAddress;
};

export class Pool extends BaseService<IPool> implements PoolInterface {
  readonly erc20Service: IERC20ServiceInterface;

  readonly poolAddress: string;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  readonly liquiditySwapAdapterService: LiquiditySwapAdapterInterface;

  readonly repayWithCollateralAdapterService: RepayWithCollateralAdapterInterface;

  readonly flashLiquidationAddress: string;

  readonly swapCollateralAddress: string;

  readonly repayWithCollateralAddress: string;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfig,
  ) {
    super(provider, IPoolFactory);

    const {
      POOL,
      FLASH_LIQUIDATION_ADAPTER,
      REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY,
    } = lendingPoolConfig ?? {};

    this.poolAddress = POOL ?? '';
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
  }

  @LPValidatorV3
  public async deposit(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, onBehalfOf, referralCode }: LPDepositParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.depositETH({
        lendingPool: this.poolAddress,
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
      spender: this.poolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.poolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const lendingPoolContract: IPool = this.getContractInstance(
      this.poolAddress,
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

  @LPValidatorV3
  public async supply(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, onBehalfOf, referralCode }: LPDepositParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.depositETH({
        lendingPool: this.poolAddress,
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
      spender: this.poolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.poolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const lendingPoolContract: IPool = this.getContractInstance(
      this.poolAddress,
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

  // Sign permit supply
  @LPValidatorV3
  public async signSupply(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    { user, reserve, amount }: LPSignSupplyType,
  ): Promise<string> {
    const { getTokenData } = this.erc20Service;
    const { name, decimals } = await getTokenData(reserve);
    const convertedAmount: string = valueToWei(amount, decimals);

    const { chainId } = await this.provider.getNetwork();
    const nonce = await this.provider.getTransactionCount(user);

    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Permit',
      domain: {
        name,
        version: '1',
        chainId,
        verifyingContract: reserve,
      },
      message: {
        owner: user,
        spender: this.poolAddress,
        value: convertedAmount,
        nonce,
        deadline: constants.MaxUint256.toString(),
      },
    };

    return JSON.stringify(typeData);
  }

  @LPValidatorV3
  public async supplyWithPermit(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('amount')
    @isPositiveAmount('referralCode')
    {
      user,
      reserve,
      onBehalfOf,
      amount,
      referralCode,
      signature,
    }: LPSupplyWithPermitType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { decimalsOf } = this.erc20Service;
    const poolContract: IPool = this.getContractInstance(this.poolAddress);
    const stakedTokenDecimals: number = await decimalsOf(reserve);
    const convertedAmount: string = valueToWei(amount, stakedTokenDecimals);
    const sig: Signature = utils.splitSignature(signature);

    const fundsAvailable: boolean =
      await this.synthetixService.synthetixValidation({
        user,
        reserve,
        amount: convertedAmount,
      });
    if (!fundsAvailable) {
      throw new Error('Not enough funds to execute operation');
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        poolContract.populateTransaction.supplyWithPermit(
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
          referralCode ?? 0,
          constants.MaxUint256.toString(),
          sig.v,
          sig.r,
          sig.s,
        ),
      from: user,
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

  @LPValidatorV3
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
        lendingPool: this.poolAddress,
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

    const poolContract: IPool = this.getContractInstance(this.poolAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        poolContract.populateTransaction.withdraw(
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

  @LPValidatorV3
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
        lendingPool: this.poolAddress,
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

    const lendingPoolContract = this.getContractInstance(this.poolAddress);

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
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}

import { constants, providers } from 'ethers';
import { BaseDebtTokenInterface } from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  LendingPoolMarketConfig,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { parseNumber } from '../commons/utils';
import { WETHValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IWETHGateway } from './typechain/IWETHGateway';
import { IWETHGateway__factory } from './typechain/IWETHGateway__factory';

export type WETHDepositParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  onBehalfOf?: tEthereumAddress;
  referralCode?: string;
};

export type WETHWithdrawParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  aTokenAddress: tEthereumAddress;
  onBehalfOf?: tEthereumAddress;
};

export type WETHRepayParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: tEthereumAddress;
};

export type WETHBorrowParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  debtTokenAddress: tEthereumAddress;
  interestRateMode: InterestRate;
  referralCode?: string;
};

export interface WETHGatewayInterface {
  depositETH: (
    args: WETHDepositParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdrawETH: (
    args: WETHWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayETH: (
    args: WETHRepayParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  borrowETH: (
    args: WETHBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export default class WETHGatewayService
  extends BaseService<IWETHGateway>
  implements WETHGatewayInterface
{
  readonly wethGatewayAddress: string;

  readonly baseDebtTokenService: BaseDebtTokenInterface;

  readonly erc20Service: IERC20ServiceInterface;

  readonly wethGatewayConfig: LendingPoolMarketConfig | undefined;

  constructor(
    provider: providers.Provider,
    baseDebtTokenService: BaseDebtTokenInterface,
    erc20Service: IERC20ServiceInterface,
    wethGatewayConfig: LendingPoolMarketConfig | undefined,
  ) {
    super(provider, IWETHGateway__factory);
    this.wethGatewayConfig = wethGatewayConfig;
    this.baseDebtTokenService = baseDebtTokenService;
    this.erc20Service = erc20Service;

    this.wethGatewayAddress = this.wethGatewayConfig?.WETH_GATEWAY ?? '';
  }

  @WETHValidator
  public async depositETH(
    @isEthAddress('lendingPool')
    @isEthAddress('user')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('amount')
    {
      lendingPool,
      user,
      amount,
      onBehalfOf,
      referralCode,
    }: WETHDepositParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const convertedAmount: string = parseNumber(amount, 18);

    const wethGatewayContract: IWETHGateway = this.getContractInstance(
      this.wethGatewayAddress,
    );
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.depositETH(
          lendingPool,
          onBehalfOf ?? user,
          referralCode ?? '0',
        ),
      from: user,
      value: convertedAmount,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @WETHValidator
  public async borrowETH(
    @isEthAddress('lendingPool')
    @isEthAddress('user')
    @isPositiveAmount('amount')
    @isEthAddress('debtTokenAddress')
    {
      lendingPool,
      user,
      amount,
      debtTokenAddress,
      interestRateMode,
      referralCode,
    }: WETHBorrowParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const convertedAmount: string = parseNumber(amount, 18);
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;

    const delegationApproved: boolean =
      await this.baseDebtTokenService.isDelegationApproved(
        debtTokenAddress,
        user,
        this.wethGatewayAddress,
        amount,
      );

    if (!delegationApproved) {
      const approveDelegationTx: EthereumTransactionTypeExtended =
        this.baseDebtTokenService.approveDelegation(
          user,
          this.wethGatewayAddress,
          debtTokenAddress,
          constants.MaxUint256.toString(),
        );

      txs.push(approveDelegationTx);
    }

    const wethGatewayContract: IWETHGateway = this.getContractInstance(
      this.wethGatewayAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.borrowETH(
          lendingPool,
          convertedAmount,
          numericRateMode,
          referralCode ?? '0',
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.borrowETH,
      ),
    });

    return txs;
  }

  @WETHValidator
  public async withdrawETH(
    @isEthAddress('lendingPool')
    @isEthAddress('user')
    @isEthAddress('onBehalfOf')
    @isPositiveOrMinusOneAmount('amount')
    @isEthAddress('aTokenAddress')
    {
      lendingPool,
      user,
      amount,
      onBehalfOf,
      aTokenAddress,
    }: WETHWithdrawParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve }: IERC20ServiceInterface = this.erc20Service;
    const convertedAmount: string =
      amount === '-1'
        ? constants.MaxUint256.toString()
        : parseNumber(amount, 18);

    const approved: boolean = await isApproved({
      token: aTokenAddress,
      user,
      spender: this.wethGatewayAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: aTokenAddress,
        spender: this.wethGatewayAddress,
        amount: constants.MaxUint256.toString(),
      });
      txs.push(approveTx);
    }

    const wethGatewayContract: IWETHGateway = this.getContractInstance(
      this.wethGatewayAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.withdrawETH(
          lendingPool,
          convertedAmount,
          onBehalfOf ?? user,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.withdrawETH,
      ),
    });

    return txs;
  }

  @WETHValidator
  public async repayETH(
    @isEthAddress('lendingPool')
    @isEthAddress('user')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('amount')
    {
      lendingPool,
      user,
      amount,
      interestRateMode,
      onBehalfOf,
    }: WETHRepayParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const convertedAmount: string = parseNumber(amount, 18);
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
    const wethGatewayContract: IWETHGateway = this.getContractInstance(
      this.wethGatewayAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.repayETH(
          lendingPool,
          convertedAmount,
          numericRateMode,
          onBehalfOf ?? user,
        ),
      gasSurplus: 30,
      from: user,
      value: convertedAmount,
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

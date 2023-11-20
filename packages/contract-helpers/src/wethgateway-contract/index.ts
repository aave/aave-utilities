import { BigNumber, constants, PopulatedTransaction, providers } from 'ethers';
import {
  BaseDebtToken,
  BaseDebtTokenInterface,
} from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { WETHValidator } from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IWETHGateway, IWETHGatewayInterface } from './typechain/IWETHGateway';
import { IWETHGateway__factory } from './typechain/IWETHGateway__factory';

export type WETHDepositParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string; // normal
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
  debtTokenAddress?: tEthereumAddress;
  interestRateMode: InterestRate;
  referralCode?: string;
};

export interface WETHGatewayInterface {
  generateDepositEthTxData: (
    args: WETHDepositParamsType,
  ) => PopulatedTransaction;
  generateBorrowEthTxData: (args: WETHBorrowParamsType) => PopulatedTransaction;
  generateRepayEthTxData: (args: WETHRepayParamsType) => PopulatedTransaction;
  depositETH: (
    args: WETHDepositParamsType,
  ) => EthereumTransactionTypeExtended[];
  withdrawETH: (
    args: WETHWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayETH: (args: WETHRepayParamsType) => EthereumTransactionTypeExtended[];
  borrowETH: (
    args: WETHBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class WETHGatewayService
  extends BaseService<IWETHGateway>
  implements WETHGatewayInterface
{
  readonly wethGatewayAddress: string;

  readonly baseDebtTokenService: BaseDebtTokenInterface;

  readonly erc20Service: IERC20ServiceInterface;

  readonly wethGatewayInstance: IWETHGatewayInterface;

  generateDepositEthTxData: (
    args: WETHDepositParamsType,
  ) => PopulatedTransaction;

  generateBorrowEthTxData: (args: WETHBorrowParamsType) => PopulatedTransaction;

  generateRepayEthTxData: (args: WETHRepayParamsType) => PopulatedTransaction;

  constructor(
    provider: providers.Provider,
    erc20Service: IERC20ServiceInterface,
    wethGatewayAddress?: string,
  ) {
    super(provider, IWETHGateway__factory);
    this.erc20Service = erc20Service;

    this.baseDebtTokenService = new BaseDebtToken(
      this.provider,
      this.erc20Service,
    );

    this.wethGatewayAddress = wethGatewayAddress ?? '';

    this.depositETH = this.depositETH.bind(this);
    this.withdrawETH = this.withdrawETH.bind(this);
    this.repayETH = this.repayETH.bind(this);
    this.borrowETH = this.borrowETH.bind(this);
    this.wethGatewayInstance = IWETHGateway__factory.createInterface();
    this.generateDepositEthTxData = (
      args: WETHDepositParamsType,
    ): PopulatedTransaction => {
      const txData = this.wethGatewayInstance.encodeFunctionData('depositETH', [
        args.lendingPool,
        args.onBehalfOf ?? args.user,
        args.referralCode ?? '0',
      ]);
      const actionTx: PopulatedTransaction = {
        data: txData,
        to: this.wethGatewayAddress,
        from: args.user,
        value: BigNumber.from(args.amount),
        gasLimit: BigNumber.from(
          gasLimitRecommendations[ProtocolAction.deposit].limit,
        ),
      };
      return actionTx;
    };

    this.generateBorrowEthTxData = (
      args: WETHBorrowParamsType,
    ): PopulatedTransaction => {
      const numericRateMode =
        args.interestRateMode === InterestRate.Variable ? 2 : 1;
      const txData = this.wethGatewayInstance.encodeFunctionData('borrowETH', [
        args.lendingPool,
        args.amount,
        numericRateMode,
        args.referralCode ?? '0',
      ]);
      const actionTx: PopulatedTransaction = {
        data: txData,
        to: this.wethGatewayAddress,
        from: args.user,
        gasLimit: BigNumber.from(
          gasLimitRecommendations[ProtocolAction.borrowETH].limit,
        ),
      };
      return actionTx;
    };

    this.generateRepayEthTxData = ({
      interestRateMode,
      lendingPool,
      amount,
      user,
      onBehalfOf,
    }) => {
      const numericRateMode =
        interestRateMode === InterestRate.Variable ? 2 : 1;
      const txData = this.wethGatewayInstance.encodeFunctionData('repayETH', [
        lendingPool,
        amount,
        numericRateMode,
        onBehalfOf ?? user,
      ]);
      const actionTx: PopulatedTransaction = {
        data: txData,
        to: this.wethGatewayAddress,
        from: user,
        value: BigNumber.from(amount),
        gasLimit: BigNumber.from(
          gasLimitRecommendations[ProtocolAction.repayETH].limit,
        ),
      };
      return actionTx;
    };
  }

  @WETHValidator
  public depositETH(
    @isEthAddress('lendingPool')
    @isEthAddress('user')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('amount')
    @is0OrPositiveAmount('referralCode')
    {
      lendingPool,
      user,
      amount,
      onBehalfOf,
      referralCode,
    }: WETHDepositParamsType,
  ): EthereumTransactionTypeExtended[] {
    const convertedAmount: string = valueToWei(amount, 18);

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
    @is0OrPositiveAmount('referralCode')
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
    const convertedAmount: string = valueToWei(amount, 18);
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
    if (!debtTokenAddress) {
      throw new Error(
        `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
      );
    }

    const delegationApproved: boolean =
      await this.baseDebtTokenService.isDelegationApproved({
        debtTokenAddress,
        allowanceGiver: user,
        allowanceReceiver: this.wethGatewayAddress,
        amount,
      });

    if (!delegationApproved) {
      const approveDelegationTx: EthereumTransactionTypeExtended =
        this.baseDebtTokenService.approveDelegation({
          user,
          delegatee: this.wethGatewayAddress,
          debtTokenAddress,
          amount: constants.MaxUint256.toString(),
        });

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
        : valueToWei(amount, 18);

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
  public repayETH(
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
  ): EthereumTransactionTypeExtended[] {
    const convertedAmount: string = valueToWei(amount, 18);
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

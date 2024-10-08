import { BigNumber, constants, PopulatedTransaction, providers } from 'ethers';
import {
  BaseDebtToken,
  BaseDebtTokenInterface,
} from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
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
import {
  WrappedTokenGatewayV3,
  WrappedTokenGatewayV3Interface,
} from './typechain/WrappedTokenGatewayV3';
import { WrappedTokenGatewayV3__factory } from './typechain/WrappedTokenGatewayV3__factory';

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
  onBehalfOf?: tEthereumAddress;
};

export type WETHBorrowParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  debtTokenAddress?: tEthereumAddress;
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
  extends BaseService<WrappedTokenGatewayV3>
  implements WETHGatewayInterface
{
  readonly wethGatewayAddress: string;

  readonly baseDebtTokenService: BaseDebtTokenInterface;

  readonly erc20Service: IERC20ServiceInterface;

  readonly wethGatewayInstance: WrappedTokenGatewayV3Interface;

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
    super(provider, WrappedTokenGatewayV3__factory);
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
    this.wethGatewayInstance = WrappedTokenGatewayV3__factory.createInterface();
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
      const txData = this.wethGatewayInstance.encodeFunctionData('borrowETH', [
        args.lendingPool,
        args.amount,
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
      lendingPool,
      amount,
      user,
      onBehalfOf,
    }) => {
      const txData = this.wethGatewayInstance.encodeFunctionData('repayETH', [
        lendingPool,
        amount,
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

    const wethGatewayContract: WrappedTokenGatewayV3 = this.getContractInstance(
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
      referralCode,
    }: WETHBorrowParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const convertedAmount: string = valueToWei(amount, 18);
    if (!debtTokenAddress) {
      throw new Error(
        `To borrow ETH you need to pass the variable WETH debt Token Address`,
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

    const wethGatewayContract: WrappedTokenGatewayV3 = this.getContractInstance(
      this.wethGatewayAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.borrowETH(
          lendingPool,
          convertedAmount,
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

    const wethGatewayContract: WrappedTokenGatewayV3 = this.getContractInstance(
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
    { lendingPool, user, amount, onBehalfOf }: WETHRepayParamsType,
  ): EthereumTransactionTypeExtended[] {
    const convertedAmount: string = valueToWei(amount, 18);
    const wethGatewayContract: WrappedTokenGatewayV3 = this.getContractInstance(
      this.wethGatewayAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        wethGatewayContract.populateTransaction.repayETH(
          lendingPool,
          convertedAmount,
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

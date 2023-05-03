import { BigNumber, ethers, PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { DebtTokenValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { IERC20ServiceInterface } from '../erc20-contract';
import {
  IDebtTokenBase,
  IDebtTokenBaseInterface,
} from './typechain/IDebtTokenBase';
import { IDebtTokenBase__factory } from './typechain/IDebtTokenBase__factory';

export interface BaseDebtTokenInterface {
  approveDelegation: (
    args: ApproveDelegationType,
  ) => EthereumTransactionTypeExtended;
  generateApproveDelegationTxData: (
    args: ApproveDelegationType,
  ) => PopulatedTransaction;
  approvedDelegationAmount: (
    args: Omit<ApproveDelegationType, 'amount'>,
  ) => Promise<number>;
  isDelegationApproved: (args: DelegationApprovedType) => Promise<boolean>;
}

export type ApproveDelegationType = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress;
  debtTokenAddress: tEthereumAddress;
  amount: string; // wei
};

export type DelegationApprovedType = {
  debtTokenAddress: tEthereumAddress;
  allowanceGiver: tEthereumAddress;
  allowanceReceiver: tEthereumAddress;
  amount: string; // normal  by default
  nativeDecimals?: boolean;
};

export class BaseDebtToken
  extends BaseService<IDebtTokenBase>
  implements BaseDebtTokenInterface
{
  readonly erc20Service: IERC20ServiceInterface;
  readonly debtTokenInterface: IDebtTokenBaseInterface;

  constructor(
    provider: providers.Provider,
    erc20Service: IERC20ServiceInterface,
  ) {
    super(provider, IDebtTokenBase__factory);
    this.erc20Service = erc20Service;
    this.debtTokenInterface = IDebtTokenBase__factory.createInterface();
  }

  @DebtTokenValidator
  public approveDelegation(
    @isEthAddress('user')
    @isEthAddress('delegatee')
    @isEthAddress('debtTokenAddress')
    @isPositiveAmount('amount')
    { user, delegatee, debtTokenAddress, amount }: ApproveDelegationType,
  ): EthereumTransactionTypeExtended {
    const debtTokenContract: IDebtTokenBase =
      this.getContractInstance(debtTokenAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        debtTokenContract.populateTransaction.approveDelegation(
          delegatee,
          amount,
        ),
      from: user,
    });

    return {
      tx: txCallback,
      txType: eEthereumTxType.ERC20_APPROVAL,
      gas: this.generateTxPriceEstimation([], txCallback),
    };
  }

  @DebtTokenValidator
  public async approvedDelegationAmount(
    @isEthAddress('user')
    @isEthAddress('delegatee')
    @isEthAddress('debtTokenAddress')
    {
      user,
      delegatee,
      debtTokenAddress,
    }: Omit<ApproveDelegationType, 'amount'>,
  ): Promise<number> {
    const debtTokenContract: IDebtTokenBase =
      this.getContractInstance(debtTokenAddress);
    const allowance: BigNumber = await debtTokenContract.borrowAllowance(
      user,
      delegatee,
    );
    const decimals = await this.erc20Service.decimalsOf(debtTokenAddress);
    return Number(ethers.utils.formatUnits(allowance, decimals));
  }

  @DebtTokenValidator
  public generateApproveDelegationTxData(
    @isEthAddress('user')
    @isEthAddress('delegatee')
    @isEthAddress('debtTokenAddress')
    @isPositiveAmount('amount')
    { user, delegatee, debtTokenAddress, amount }: ApproveDelegationType,
  ): PopulatedTransaction {
    const txData = this.debtTokenInterface.encodeFunctionData(
      'approveDelegation',
      [delegatee, amount],
    );
    const approveDelegationTx: PopulatedTransaction = {
      data: txData,
      to: debtTokenAddress,
      from: user,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.creditDelegationApproval]
          .recommended,
      ),
    };
    return approveDelegationTx;
  }

  @DebtTokenValidator
  public async isDelegationApproved(
    @isEthAddress('debtTokenAddress')
    @isEthAddress('allowanceGiver')
    @isEthAddress('allowanceReceiver')
    @isPositiveAmount('amount')
    {
      debtTokenAddress,
      allowanceGiver,
      allowanceReceiver,
      amount,
      nativeDecimals,
    }: DelegationApprovedType,
  ): Promise<boolean> {
    const decimals: number = await this.erc20Service.decimalsOf(
      debtTokenAddress,
    );
    const debtTokenContract: IDebtTokenBase =
      this.getContractInstance(debtTokenAddress);
    const delegatedAllowance: BigNumber =
      await debtTokenContract.borrowAllowance(
        allowanceGiver,
        allowanceReceiver,
      );

    const amountBNWithDecimals: BigNumber = nativeDecimals
      ? BigNumber.from(amount)
      : BigNumber.from(valueToWei(amount, decimals));

    return delegatedAllowance.gte(amountBNWithDecimals);
  }
}

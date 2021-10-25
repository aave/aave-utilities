import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { parseNumber } from '../commons/utils';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IDebtTokenBase } from './typechain/IDebtTokenBase';
import { IDebtTokenBase__factory } from './typechain/IDebtTokenBase__factory';

export interface BaseDebtTokenInterface {
  approveDelegation: (
    user: tEthereumAddress,
    delegatee: tEthereumAddress,
    debtTokenAddress: tEthereumAddress,
    amount: string, // wei
  ) => EthereumTransactionTypeExtended;
  isDelegationApproved: (
    debtTokenAddress: tEthereumAddress,
    allowanceGiver: tEthereumAddress,
    spender: tEthereumAddress,
    amount: string, // normal
  ) => Promise<boolean>;
}

export default class BaseDebtToken
  extends BaseService<IDebtTokenBase>
  implements BaseDebtTokenInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  constructor(
    provider: providers.Provider,
    erc20Service: IERC20ServiceInterface,
  ) {
    super(provider, IDebtTokenBase__factory);
    this.erc20Service = erc20Service;
  }

  public approveDelegation(
    user: tEthereumAddress,
    delegatee: tEthereumAddress,
    debtTokenAddress: tEthereumAddress,
    amount: string,
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

  public async isDelegationApproved(
    debtTokenAddress: tEthereumAddress,
    allowanceGiver: tEthereumAddress,
    allowanceReceiver: tEthereumAddress,
    amount: string,
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
    const amountBNWithDecimals: BigNumber = BigNumber.from(
      parseNumber(amount, decimals),
    );

    return delegatedAllowance.gt(amountBNWithDecimals);
  }
}

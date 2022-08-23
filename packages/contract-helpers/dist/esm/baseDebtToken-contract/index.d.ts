import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  tEthereumAddress,
} from '../commons/types';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IDebtTokenBase } from './typechain/IDebtTokenBase';
export interface BaseDebtTokenInterface {
  approveDelegation: (
    args: ApproveDelegationType,
  ) => EthereumTransactionTypeExtended;
  isDelegationApproved: (args: DelegationApprovedType) => Promise<boolean>;
}
export declare type ApproveDelegationType = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress;
  debtTokenAddress: tEthereumAddress;
  amount: string;
};
export declare type DelegationApprovedType = {
  debtTokenAddress: tEthereumAddress;
  allowanceGiver: tEthereumAddress;
  allowanceReceiver: tEthereumAddress;
  amount: string;
};
export declare class BaseDebtToken
  extends BaseService<IDebtTokenBase>
  implements BaseDebtTokenInterface
{
  readonly erc20Service: IERC20ServiceInterface;
  constructor(
    provider: providers.Provider,
    erc20Service: IERC20ServiceInterface,
  );
  approveDelegation({
    user,
    delegatee,
    debtTokenAddress,
    amount,
  }: ApproveDelegationType): EthereumTransactionTypeExtended;
  isDelegationApproved({
    debtTokenAddress,
    allowanceGiver,
    allowanceReceiver,
    amount,
  }: DelegationApprovedType): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map

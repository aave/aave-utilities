import { providers } from 'ethers';
import { BaseDebtTokenInterface } from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  InterestRate,
  tEthereumAddress,
} from '../commons/types';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IWETHGateway } from './typechain/IWETHGateway';
export declare type WETHDepositParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  onBehalfOf?: tEthereumAddress;
  referralCode?: string;
};
export declare type WETHWithdrawParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  aTokenAddress: tEthereumAddress;
  onBehalfOf?: tEthereumAddress;
};
export declare type WETHRepayParamsType = {
  lendingPool: tEthereumAddress;
  user: tEthereumAddress;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: tEthereumAddress;
};
export declare type WETHBorrowParamsType = {
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
  ) => EthereumTransactionTypeExtended[];
  withdrawETH: (
    args: WETHWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayETH: (args: WETHRepayParamsType) => EthereumTransactionTypeExtended[];
  borrowETH: (
    args: WETHBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}
export declare class WETHGatewayService
  extends BaseService<IWETHGateway>
  implements WETHGatewayInterface
{
  readonly wethGatewayAddress: string;
  readonly baseDebtTokenService: BaseDebtTokenInterface;
  readonly erc20Service: IERC20ServiceInterface;
  constructor(
    provider: providers.Provider,
    erc20Service: IERC20ServiceInterface,
    wethGatewayAddress?: string,
  );
  depositETH({
    lendingPool,
    user,
    amount,
    onBehalfOf,
    referralCode,
  }: WETHDepositParamsType): EthereumTransactionTypeExtended[];
  borrowETH({
    lendingPool,
    user,
    amount,
    debtTokenAddress,
    interestRateMode,
    referralCode,
  }: WETHBorrowParamsType): Promise<EthereumTransactionTypeExtended[]>;
  withdrawETH({
    lendingPool,
    user,
    amount,
    onBehalfOf,
    aTokenAddress,
  }: WETHWithdrawParamsType): Promise<EthereumTransactionTypeExtended[]>;
  repayETH({
    lendingPool,
    user,
    amount,
    interestRateMode,
    onBehalfOf,
  }: WETHRepayParamsType): EthereumTransactionTypeExtended[];
}
//# sourceMappingURL=index.d.ts.map

import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import { BigNumber } from 'ethers';

export type ContractContext = EthersContractContextV5<
  WalletBalanceProvider,
  WalletBalanceProviderMethodNames,
  WalletBalanceProviderEventsContext,
  WalletBalanceProviderEvents
>;

export interface EventFilter {
  address?: string;
  topics?: string[];
  fromBlock?: string | number;
  toBlock?: string | number;
}

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<unknown>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<unknown>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type WalletBalanceProviderEvents = undefined;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WalletBalanceProviderEventsContext {}
export type WalletBalanceProviderMethodNames =
  | 'balanceOf'
  | 'batchBalanceOf'
  | 'getUserWalletBalances';
export interface GetUserWalletBalancesResponse {
  result0: string[];
  0: string[];
  result1: BigNumber[];
  1: BigNumber[];
  length: 2;
}
export interface WalletBalanceProvider {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param token Type: address, Indexed: false
   */
  balanceOf(
    user: string,
    token: string,
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param users Type: address[], Indexed: false
   * @param tokens Type: address[], Indexed: false
   */
  batchBalanceOf(
    users: string[],
    tokens: string[],
    overrides?: ContractCallOverrides,
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getUserWalletBalances(
    provider: string,
    user: string,
    overrides?: ContractCallOverrides,
  ): Promise<GetUserWalletBalancesResponse>;
}

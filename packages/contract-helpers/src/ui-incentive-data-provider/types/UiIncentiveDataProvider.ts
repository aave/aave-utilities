import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import { BigNumber, ContractTransaction } from 'ethers';

export type ContractContext = EthersContractContextV5<
  UiIncentiveDataProvider,
  UiIncentiveDataProviderMethodNames,
  UiIncentiveDataProviderEventsContext,
  UiIncentiveDataProviderEvents
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
export type UiIncentiveDataProviderEvents = undefined;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UiIncentiveDataProviderEventsContext {}
export type UiIncentiveDataProviderMethodNames =
  | 'new'
  | 'getFullReservesIncentiveData'
  | 'getReservesIncentivesData'
  | 'getUserReservesIncentivesData';
export interface AIncentiveDataResponse {
  emissionPerSecond: BigNumber;
  0: AIncentiveDataResponse;
  incentivesLastUpdateTimestamp: BigNumber;
  1: AIncentiveDataResponse;
  tokenIncentivesIndex: BigNumber;
  2: AIncentiveDataResponse;
  emissionEndTimestamp: BigNumber;
  3: AIncentiveDataResponse;
  tokenAddress: string;
  4: AIncentiveDataResponse;
  rewardTokenAddress: string;
  5: AIncentiveDataResponse;
}
export interface VIncentiveDataResponse {
  emissionPerSecond: BigNumber;
  0: VIncentiveDataResponse;
  incentivesLastUpdateTimestamp: BigNumber;
  1: VIncentiveDataResponse;
  tokenIncentivesIndex: BigNumber;
  2: VIncentiveDataResponse;
  emissionEndTimestamp: BigNumber;
  3: VIncentiveDataResponse;
  tokenAddress: string;
  4: VIncentiveDataResponse;
  rewardTokenAddress: string;
  5: VIncentiveDataResponse;
}
export interface SIncentiveDataResponse {
  emissionPerSecond: BigNumber;
  0: SIncentiveDataResponse;
  incentivesLastUpdateTimestamp: BigNumber;
  1: SIncentiveDataResponse;
  tokenIncentivesIndex: BigNumber;
  2: SIncentiveDataResponse;
  emissionEndTimestamp: BigNumber;
  3: SIncentiveDataResponse;
  tokenAddress: string;
  4: SIncentiveDataResponse;
  rewardTokenAddress: string;
  5: SIncentiveDataResponse;
}
export interface AggregatedreserveincentivedataResponse {
  underlyingAsset: string;
  0: string;
  aIncentiveData: AIncentiveDataResponse;
  1: AIncentiveDataResponse;
  vIncentiveData: VIncentiveDataResponse;
  2: VIncentiveDataResponse;
  sIncentiveData: SIncentiveDataResponse;
  3: SIncentiveDataResponse;
}
export interface ATokenIncentivesUserDataResponse {
  tokenincentivesUserIndex: BigNumber;
  0: ATokenIncentivesUserDataResponse;
  userUnclaimedRewards: BigNumber;
  1: ATokenIncentivesUserDataResponse;
  tokenAddress: string;
  2: ATokenIncentivesUserDataResponse;
  rewardTokenAddress: string;
  3: ATokenIncentivesUserDataResponse;
}
export interface VTokenIncentivesUserDataResponse {
  tokenincentivesUserIndex: BigNumber;
  0: VTokenIncentivesUserDataResponse;
  userUnclaimedRewards: BigNumber;
  1: VTokenIncentivesUserDataResponse;
  tokenAddress: string;
  2: VTokenIncentivesUserDataResponse;
  rewardTokenAddress: string;
  3: VTokenIncentivesUserDataResponse;
}
export interface STokenIncentivesUserDataResponse {
  tokenincentivesUserIndex: BigNumber;
  0: STokenIncentivesUserDataResponse;
  userUnclaimedRewards: BigNumber;
  1: STokenIncentivesUserDataResponse;
  tokenAddress: string;
  2: STokenIncentivesUserDataResponse;
  rewardTokenAddress: string;
  3: STokenIncentivesUserDataResponse;
}
export interface UserreserveincentivedataResponse {
  underlyingAsset: string;
  0: string;
  aTokenIncentivesUserData: ATokenIncentivesUserDataResponse;
  1: ATokenIncentivesUserDataResponse;
  vTokenIncentivesUserData: VTokenIncentivesUserDataResponse;
  2: VTokenIncentivesUserDataResponse;
  sTokenIncentivesUserData: STokenIncentivesUserDataResponse;
  3: STokenIncentivesUserDataResponse;
}
export interface GetFullReservesIncentiveDataResponse {
  result0: AggregatedreserveincentivedataResponse[];
  0: AggregatedreserveincentivedataResponse[];
  result1: UserreserveincentivedataResponse[];
  1: UserreserveincentivedataResponse[];
  length: 2;
}
export interface UiIncentiveDataProvider {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getFullReservesIncentiveData(
    provider: string,
    user: string,
    overrides?: ContractCallOverrides,
  ): Promise<GetFullReservesIncentiveDataResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   */
  getReservesIncentivesData(
    provider: string,
    overrides?: ContractCallOverrides,
  ): Promise<AggregatedreserveincentivedataResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getUserReservesIncentivesData(
    provider: string,
    user: string,
    overrides?: ContractCallOverrides,
  ): Promise<UserreserveincentivedataResponse[]>;
}

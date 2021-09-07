import { EthersContractContextV5 } from 'ethereum-abi-types-generator';
import { BigNumber, ContractTransaction } from 'ethers';

export type ContractContext = EthersContractContextV5<
  UiPoolDataProvider,
  UiPoolDataProviderMethodNames,
  UiPoolDataProviderEventsContext,
  UiPoolDataProviderEvents
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

export type UiPoolDataProviderEvents = undefined;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UiPoolDataProviderEventsContext {}
export type UiPoolDataProviderMethodNames =
  | 'new'
  | 'getReservesList'
  | 'getSimpleReservesData'
  | 'getUserReservesData'
  | 'getReservesData';
export interface ReserveDataResponse {
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: BigNumber;
  baseLTVasCollateral: BigNumber;
  reserveLiquidationThreshold: BigNumber;
  reserveLiquidationBonus: BigNumber;
  reserveFactor: BigNumber;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: BigNumber;
  variableBorrowIndex: BigNumber;
  liquidityRate: BigNumber;
  variableBorrowRate: BigNumber;
  stableBorrowRate: BigNumber;
  lastUpdateTimestamp: BigNumber;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  availableLiquidity: BigNumber;
  totalPrincipalStableDebt: BigNumber;
  averageStableRate: BigNumber;
  stableDebtLastUpdateTimestamp: BigNumber;
  totalScaledVariableDebt: BigNumber;
  priceForAsset: BigNumber;
  variableRateSlope1: BigNumber;
  variableRateSlope2: BigNumber;
  stableRateSlope1: BigNumber;
  stableRateSlope2: BigNumber;
}
export interface UserReserveDataResponse {
  underlyingAsset: string;
  scaledATokenBalance: BigNumber;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: BigNumber;
  scaledVariableDebt: BigNumber;
  principalStableDebt: BigNumber;
  stableBorrowLastUpdateTimestamp: BigNumber;
}
export interface AllReserveDataResponse {
  reserves: ReserveDataResponse[];
  userReserves: UserReserveDataResponse[];
  usdPriceEth: BigNumber;
}
export interface UiPoolDataProvider {
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
   */
  getReservesList(
    provider: string,
    overrides?: ContractCallOverrides,
  ): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   */
  getSimpleReservesData(
    provider: string,
    overrides?: ContractCallOverrides,
  ): Promise<ReserveDataResponse[]>;

  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getUserReservesData(
    provider: string,
    user: string,
    overrides?: ContractCallOverrides,
  ): Promise<UserReserveDataResponse[]>;

  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param provider Type: address, Indexed: false
   * @param user Type: address, Indexed: false
   */
  getReservesData(
    provider: string,
    user: string,
    overrides?: ContractCallOverrides,
  ): Promise<AllReserveDataResponse>;
}

import { providers } from 'ethers';
import {
  ReservesData,
  UserReserveData,
  ReservesDataHumanized,
  UserReserveDataHumanized,
} from './types/UiPoolDataProviderTypes';
export * from './types/UiPoolDataProviderTypes';
export interface UiPoolDataProviderContext {
  uiPoolDataProviderAddress: string;
  provider: providers.Provider;
  chainId: number;
}
export interface UiPoolDataProviderInterface {
  getReservesList: (lendingPoolAddressProvider: string) => Promise<string[]>;
  getReservesData: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReservesData>;
  getUserReservesData: (
    lendingPoolAddressProvider: string,
    user: string,
  ) => Promise<UserReserveData[]>;
  getReservesHumanized: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReservesDataHumanized>;
  getUserReservesHumanized: (
    lendingPoolAddressProvider: string,
    user: string,
  ) => Promise<UserReserveDataHumanized[]>;
}
export declare class UiPoolDataProvider implements UiPoolDataProviderInterface {
  private readonly _contract;
  private readonly chainId;
  /**
   * Constructor
   * @param context The ui pool data provider context
   */
  constructor(context: UiPoolDataProviderContext);
  /**
   * Get the underlying asset address for each lending pool reserve
   */
  getReservesList(lendingPoolAddressProvider: string): Promise<string[]>;
  /**
   * Get data for each lending pool reserve
   */
  getReservesData(lendingPoolAddressProvider: string): Promise<ReservesData>;
  /**
   * Get data for each user reserve on the lending pool
   */
  getUserReservesData(
    lendingPoolAddressProvider: string,
    user: string,
  ): Promise<UserReserveData[]>;
  getReservesHumanized(
    lendingPoolAddressProvider: string,
  ): Promise<ReservesDataHumanized>;
  getUserReservesHumanized(
    lendingPoolAddressProvider: string,
    user: string,
  ): Promise<UserReserveDataHumanized[]>;
}
//# sourceMappingURL=index.d.ts.map

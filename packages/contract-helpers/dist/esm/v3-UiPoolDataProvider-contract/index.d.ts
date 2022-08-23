import { providers } from 'ethers';
import { ReservesHelperInput, UserReservesHelperInput } from '../index';
import {
  ReservesData,
  UserReserveData,
  ReservesDataHumanized,
  UserReserveDataHumanized,
} from './types';
export * from './types';
export interface UiPoolDataProviderContext {
  uiPoolDataProviderAddress: string;
  provider: providers.Provider;
  chainId: number;
}
export interface UiPoolDataProviderInterface {
  getReservesList: (args: ReservesHelperInput) => Promise<string[]>;
  getReservesData: (args: ReservesHelperInput) => Promise<ReservesData>;
  getUserReservesData: (
    args: UserReservesHelperInput,
  ) => Promise<UserReserveData>;
  getReservesHumanized: (
    args: ReservesHelperInput,
  ) => Promise<ReservesDataHumanized>;
  getUserReservesHumanized: (args: UserReservesHelperInput) => Promise<{
    userReserves: UserReserveDataHumanized[];
    userEmodeCategoryId: number;
  }>;
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
  getReservesList({
    lendingPoolAddressProvider,
  }: ReservesHelperInput): Promise<string[]>;
  /**
   * Get data for each lending pool reserve
   */
  getReservesData({
    lendingPoolAddressProvider,
  }: ReservesHelperInput): Promise<ReservesData>;
  /**
   * Get data for each user reserve on the lending pool
   */
  getUserReservesData({
    lendingPoolAddressProvider,
    user,
  }: UserReservesHelperInput): Promise<UserReserveData>;
  getReservesHumanized({
    lendingPoolAddressProvider,
  }: ReservesHelperInput): Promise<ReservesDataHumanized>;
  getUserReservesHumanized({
    lendingPoolAddressProvider,
    user,
  }: UserReservesHelperInput): Promise<{
    userReserves: UserReserveDataHumanized[];
    userEmodeCategoryId: number;
  }>;
}
//# sourceMappingURL=index.d.ts.map

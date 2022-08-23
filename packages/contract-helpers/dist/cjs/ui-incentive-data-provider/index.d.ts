import { providers } from 'ethers';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './typechain/UiIncentiveDataProvider';
import {
  FullReservesIncentiveDataResponse,
  ReserveIncentiveDataHumanizedResponse,
  ReserveIncentiveDataResponse,
  ReserveIncentiveWithFeedsResponse,
  UserReserveIncentiveDataHumanizedResponse,
  UserReserveIncentiveDataResponse,
} from './types/UiIncentiveDataProviderTypes';
export * from './types/UiIncentiveDataProviderTypes';
export interface UiIncentiveDataProviderInterface {
  getFullReservesIncentiveData: (
    user: string,
    incentiveDataProviderAddress: string,
    lendingPoolAddressProvider: string,
  ) => Promise<FullReservesIncentiveDataResponse>;
  getReservesIncentivesData: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReserveIncentiveDataResponse[]>;
  getUserReservesIncentivesData: (
    user: string,
    lendingPoolAddressProvider: string,
  ) => Promise<UserReserveIncentiveDataResponse[]>;
  getReservesIncentivesDataHumanized: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReserveIncentiveDataHumanizedResponse[]>;
  getUserReservesIncentivesDataHumanized: (
    user: string,
    lendingPoolAddressProvider: string,
  ) => Promise<UserReserveIncentiveDataHumanizedResponse[]>;
  getIncentivesDataWithPrice: (
    args: GetIncentivesDataWithPriceType,
  ) => Promise<ReserveIncentiveWithFeedsResponse[]>;
}
export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  provider: providers.Provider;
  chainId: number;
}
export interface FeedResultSuccessful {
  rewardTokenAddress: string;
  answer: string;
  updatedAt: number;
  decimals: number;
}
export interface GetIncentivesDataWithPriceType {
  lendingPoolAddressProvider: string;
  chainlinkFeedsRegistry?: string;
  quote?: Denominations;
}
export declare class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface
{
  readonly _contract: UiIncentiveDataProviderContract;
  private readonly _chainlinkFeedsRegistries;
  private readonly _context;
  private readonly chainId;
  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  constructor(context: UiIncentiveDataProviderContext);
  /**
   *  Get the full reserve incentive data for the lending pool and the user
   * @param user The user address
   */
  getFullReservesIncentiveData(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<FullReservesIncentiveDataResponse>;
  /**
   *  Get the reserve incentive data for the lending pool
   */
  getReservesIncentivesData(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataResponse[]>;
  getReservesIncentivesDataHumanized(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataHumanizedResponse[]>;
  getUserReservesIncentivesDataHumanized(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataHumanizedResponse[]>;
  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  getUserReservesIncentivesData(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataResponse[]>;
  getIncentivesDataWithPrice({
    lendingPoolAddressProvider,
    chainlinkFeedsRegistry,
    quote,
  }: GetIncentivesDataWithPriceType): Promise<
    ReserveIncentiveWithFeedsResponse[]
  >;
  private readonly _getFeed;
  private _formatIncentiveData;
  private _formatUserIncentiveData;
}
//# sourceMappingURL=index.d.ts.map

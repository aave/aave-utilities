import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './typechain/UiIncentiveDataProvider';
import { UiIncentiveDataProviderFactory } from './typechain/UiIncentiveDataProviderFactory';
import {
  FullReservesIncentiveDataResponse,
  ReserveIncentiveDataResponse,
  UserReserveIncentiveDataResponse,
} from './types/UiIncentiveDataProviderTypes';
export * from './types/UiIncentiveDataProviderTypes';

export interface UiIncentiveDataProviderInterface {
  getAllIncentives: (
    user: string,
    incentiveDataProviderAddress: string,
    lendingPoolAddressProvider: string,
  ) => Promise<FullReservesIncentiveDataResponse>;
  getReservesIncentives: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReserveIncentiveDataResponse[]>;
  getUserReservesIncentives: (
    user: string,
    lendingPoolAddressProvider: string,
  ) => Promise<UserReserveIncentiveDataResponse[]>;
}
export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  provider: providers.Provider;
}
export class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface {
  private readonly _contract: UiIncentiveDataProviderContract;

  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor(context: UiIncentiveDataProviderContext) {
    if (!isAddress(context.incentiveDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    this._contract = UiIncentiveDataProviderFactory.connect(
      context.incentiveDataProviderAddress,
      context.provider,
    );
  }

  /**
   *  Get the full reserve incentive data for the lending pool and the user
   * @param user The user address
   */
  public async getAllIncentives(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<FullReservesIncentiveDataResponse> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getFullReservesIncentiveData(
      lendingPoolAddressProvider,
      user,
    );
  }

  /**
   *  Get the reserve incentive data for the lending pool
   */
  public async getReservesIncentives(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataResponse[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    return this._contract.getReservesIncentivesData(lendingPoolAddressProvider);
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  public async getUserReservesIncentives(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataResponse[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesIncentivesData(
      lendingPoolAddressProvider,
      user,
    );
  }
}

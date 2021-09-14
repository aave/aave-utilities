import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './types/UiIncentiveDataProvider';
import { UiIncentiveDataProviderFactory } from './types/UiIncentiveDataProviderFactory';
import {
  FullReservesIncentiveDataResponse,
  ReserveIncentiveDataResponse,
  UserReserveIncentiveDataResponse,
} from './types/UiIncentiveDataProviderTypes';
export * from './types/UiIncentiveDataProviderTypes';

export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  lendingPoolAddressProvider: string;
  provider: providers.Provider;
}

export class UiIncentiveDataProvider {
  private readonly _contract: UiIncentiveDataProviderContract;

  private readonly _lendingPoolAddressProvider: string;

  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor(context: UiIncentiveDataProviderContext) {
    if (!isAddress(context.incentiveDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    if (!isAddress(context.lendingPoolAddressProvider)) {
      throw new Error('Lending pool address is not valid');
    }

    this._lendingPoolAddressProvider = context.lendingPoolAddressProvider;

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
  ): Promise<FullReservesIncentiveDataResponse> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getFullReservesIncentiveData(
      this._lendingPoolAddressProvider,
      user,
    );
  }

  /**
   *  Get the reserve incentive data for the lending pool
   */
  public async getReservesIncentives(): Promise<
    ReserveIncentiveDataResponse[]
  > {
    return this._contract.getReservesIncentivesData(
      this._lendingPoolAddressProvider,
    );
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  public async getUserReservesIncentives(
    user: string,
  ): Promise<UserReserveIncentiveDataResponse[]> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesIncentivesData(
      this._lendingPoolAddressProvider,
      user,
    );
  }
}

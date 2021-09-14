/* eslint-disable @typescript-eslint/require-await */
import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { UiPoolDataProvider as UiPoolDataProviderContract } from './typechain/UiPoolDataProvider';
import { UiPoolDataProviderFactory } from './typechain/UiPoolDataProviderFactory';
import {
  ReserveDataResponse,
  UserReserveDataResponse,
  AllReserveDataResponse,
} from './types/UiPoolDataProviderTypes';

export interface UiPoolDataProviderContext {
  uiPoolDataProviderAddress: string;
  lendingPoolAddressProvider: string;
  provider: providers.Provider;
}

export class UiPoolDataProvider {
  private readonly _contract: UiPoolDataProviderContract;

  private readonly _lendingPoolAddressProvider: string;

  /**
   * Constructor
   * @param context The ui pool data provider context
   */
  public constructor(context: UiPoolDataProviderContext) {
    if (!isAddress(context.uiPoolDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    if (!isAddress(context.lendingPoolAddressProvider)) {
      throw new Error('Lending pool address is not valid');
    }

    this._lendingPoolAddressProvider = context.lendingPoolAddressProvider;

    this._contract = UiPoolDataProviderFactory.connect(
      context.uiPoolDataProviderAddress,
      context.provider,
    );
  }

  /**
   * Get the underlying asset address for each lending pool reserve
   */
  public async getReservesList(): Promise<string[]> {
    return this._contract.getReservesList(this._lendingPoolAddressProvider);
  }

  /**
   * Get data for each lending pool reserve
   */
  public async getReserves(): Promise<ReserveDataResponse[]> {
    return this._contract.getSimpleReservesData(
      this._lendingPoolAddressProvider,
    );
  }

  /**
   * Get data for each user reserve on the lending pool
   */
  public async getUserReserves(
    user: string,
  ): Promise<UserReserveDataResponse[]> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesData(
      this._lendingPoolAddressProvider,
      user,
    );
  }

  /**
   * Get data for each lending pool reserve and user reserve
   */
  public async getAllReserves(user: string): Promise<AllReserveDataResponse> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getReservesData(
      this._lendingPoolAddressProvider,
      user,
    );
  }
}

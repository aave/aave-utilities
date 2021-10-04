import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './typechain/UiIncentiveDataProvider';
import { UiIncentiveDataProviderFactory } from './typechain/UiIncentiveDataProviderFactory';
import {
  FullReservesIncentiveDataResponse,
  IncentiveData,
  IncentiveDataHumanized,
  ReserveIncentiveDataHumanizedResponse,
  ReserveIncentiveDataResponse,
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
}
export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  provider: providers.Provider;
}
export class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface {
  public readonly _contract: UiIncentiveDataProviderContract;

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
  public async getFullReservesIncentiveData(
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
  public async getReservesIncentivesData(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataResponse[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    return this._contract.getReservesIncentivesData(lendingPoolAddressProvider);
  }

  public async getReservesIncentivesDataHumanized(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataHumanizedResponse[]> {
    const response = await this.getReservesIncentivesData(
      lendingPoolAddressProvider,
    );

    return response.map(r => ({
      ...r,
      aIncentiveData: this._formatIncentiveData(r.aIncentiveData),
      vIncentiveData: this._formatIncentiveData(r.vIncentiveData),
      sIncentiveData: this._formatIncentiveData(r.sIncentiveData),
    }));
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  public async getUserReservesIncentivesData(
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

  private _formatIncentiveData(data: IncentiveData): IncentiveDataHumanized {
    return {
      ...data,
      emissionPerSecond: data.emissionPerSecond.toString(),
      incentivesLastUpdateTimestamp: data.incentivesLastUpdateTimestamp.toNumber(),
      tokenIncentivesIndex: data.tokenIncentivesIndex.toString(),
      emissionEndTimestamp: data.emissionEndTimestamp.toNumber(),
    };
  }
}

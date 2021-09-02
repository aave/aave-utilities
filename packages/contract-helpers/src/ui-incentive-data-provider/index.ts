import { ethers, providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { abi } from './abi';
import {
  AggregatedreserveincentivedataResponse,
  ContractContext,
  GetFullReservesIncentiveDataResponse,
  UserreserveincentivedataResponse,
} from './types/UiIncentiveDataProvider';

export {
  AggregatedreserveincentivedataResponse,
  GetFullReservesIncentiveDataResponse,
  UserreserveincentivedataResponse,
} from './types/UiIncentiveDataProvider';

export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  lendingPoolAddress: string;
  provider: providers.Provider;
}

export class UiIncentiveDataProvider {
  private readonly _contract: ContractContext;

  private readonly _lendingPoolAddress: string;

  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor(context: UiIncentiveDataProviderContext) {
    if (!isAddress(context.incentiveDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    if (!isAddress(context.lendingPoolAddress)) {
      throw new Error('Lending pool address is not valid');
    }

    this._lendingPoolAddress = context.lendingPoolAddress;

    this._contract = (new ethers.Contract(
      context.incentiveDataProviderAddress,
      abi,
      context.provider,
    ) as unknown) as ContractContext;
  }

  /**
   *  Get the full reserve incentive data for the lending pool and the user
   * @param user The user address
   */
  public async getFullReserves(
    user: string,
  ): Promise<GetFullReservesIncentiveDataResponse> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getFullReservesIncentiveData(
      this._lendingPoolAddress,
      user,
    );
  }

  /**
   *  Get the reserve incentive data for the lending pool
   */
  public async getReserves(): Promise<
    AggregatedreserveincentivedataResponse[]
  > {
    return this._contract.getReservesIncentivesData(this._lendingPoolAddress);
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  public async getUserReserves(
    user: string,
  ): Promise<UserreserveincentivedataResponse[]> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesIncentivesData(
      this._lendingPoolAddress,
      user,
    );
  }
}

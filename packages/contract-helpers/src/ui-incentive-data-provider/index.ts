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

export class UiIncentiveDataProvider {
  private readonly _contract: ContractContext;

  private readonly _lendingPoolAddress: string;

  public constructor(
    contractAddress: string,
    lendingPoolAddress: string,
    provider: providers.Provider,
  ) {
    if (!isAddress(contractAddress)) {
      throw new Error('contract address is not valid');
    }

    if (!isAddress(lendingPoolAddress)) {
      throw new Error('Lending pool address is not valid');
    }

    this._lendingPoolAddress = lendingPoolAddress;

    this._contract = (new ethers.Contract(
      contractAddress,
      abi,
      provider,
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

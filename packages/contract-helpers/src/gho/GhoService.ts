import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { tEthereumAddress } from '../commons/types';
import { IUiGhoDataProvider } from './typechain/IUiGhoDataProvider';
import { IUiGhoDataProvider__factory } from './typechain/IUiGhoDataProvider__factory';
import { GhoReserveData, GhoUserData } from './types';

export interface IGhoService {
  getGhoReserveData: () => Promise<GhoReserveData>;
  getGhoUserData: (
    userAddress: tEthereumAddress,
    ghoDiscountTokenAddress?: tEthereumAddress,
  ) => Promise<GhoUserData>;
}

// Wrapper service for fetching gho reserve, discount, facilitator, and user data for UI purposes
export class GhoService implements IGhoService {
  readonly ghoDataProviderService: IUiGhoDataProvider;
  constructor({
    provider,
    uiGhoDataProviderAddress,
  }: {
    provider: providers.Provider;
    uiGhoDataProviderAddress: tEthereumAddress;
  }) {
    if (!isAddress(uiGhoDataProviderAddress)) {
      throw new Error('UiGhoDataProvider contract address is not valid');
    }

    this.ghoDataProviderService = IUiGhoDataProvider__factory.connect(
      uiGhoDataProviderAddress,
      provider,
    );
  }

  /**
   * Fetches Gho reserve, discount, facilitator data
   * @returns - instance of GhoReserveData with reserve, discount, facilitator data
   */
  public async getGhoReserveData(): Promise<GhoReserveData> {
    const ghoReserveData =
      await this.ghoDataProviderService.getGhoReserveData();

    return {
      ghoBaseVariableBorrowRate:
        ghoReserveData.ghoBaseVariableBorrowRate.toString(),
      ghoDiscountedPerToken: ghoReserveData.ghoDiscountedPerToken.toString(),
      ghoDiscountRate: ghoReserveData.ghoDiscountRate.toString(),
      aaveFacilitatorBucketMaxCapacity:
        ghoReserveData.aaveFacilitatorBucketMaxCapacity.toString(),
      aaveFacilitatorBucketLevel:
        ghoReserveData.aaveFacilitatorBucketLevel.toString(),
      ghoMinDebtTokenBalanceForDiscount:
        ghoReserveData.ghoMinDebtTokenBalanceForDiscount.toString(),
      ghoMinDiscountTokenBalanceForDiscount:
        ghoReserveData.ghoMinDiscountTokenBalanceForDiscount.toString(),
      ghoCurrentBorrowIndex: ghoReserveData.ghoCurrentBorrowIndex.toString(),
      ghoReserveLastUpdateTimestamp:
        ghoReserveData.ghoReserveLastUpdateTimestamp.toString(),
    };
  }

  /**
   * Fetches Gho user data for UI display
   * @param userAddress - Address of user to fetch ghoDiscountRate, ghoDiscountTokenBalance, and gho balance indeces
   * @returns - instance of GhoUserData
   */
  public async getGhoUserData(
    userAddress: tEthereumAddress,
  ): Promise<GhoUserData> {
    if (!isAddress(userAddress)) {
      throw new Error('user address is not valid');
    }

    const ghoUserData = await this.ghoDataProviderService.getGhoUserData(
      userAddress,
    );

    return {
      userGhoDiscountPercent: ghoUserData.userGhoDiscountPercent.toString(),
      userDiscountTokenBalance: ghoUserData.userDiscountTokenBalance.toString(),
      userGhoScaledBorrowBalance:
        ghoUserData.userGhoScaledBorrowBalance.toString(),
      userPreviousGhoBorrowIndex:
        ghoUserData.userPreviousGhoBorrowIndex.toString(),
    };
  }
}

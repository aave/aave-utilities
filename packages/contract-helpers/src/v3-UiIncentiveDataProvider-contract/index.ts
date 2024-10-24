import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { UiIncentiveDataProviderValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { ReservesHelperInput, UserReservesHelperInput } from '../index';
import { UiIncentiveDataProviderV3 } from './typechain/IUiIncentiveDataProviderV3';
import { UiIncentiveDataProviderV3__factory } from './typechain/IUiIncentiveDataProviderV3__factory';
import {
  FullReservesIncentiveDataResponse,
  IncentiveData,
  IncentiveDataHumanized,
  ReservesIncentiveData,
  ReservesIncentiveDataHumanized,
  RewardInfo,
  UserIncentiveData,
  UserIncentiveDataHumanized,
  UserReservesIncentivesData,
  UserReservesIncentivesDataHumanized,
  UserRewardInfo,
} from './types';
export * from './types';

export interface UiIncentiveDataProviderInterface {
  getFullReservesIncentiveData: (
    args: UserReservesHelperInput,
  ) => Promise<FullReservesIncentiveDataResponse>;
  getReservesIncentivesData: (
    args: ReservesHelperInput,
  ) => Promise<ReservesIncentiveData[]>;
  getUserReservesIncentivesData: (
    args: UserReservesHelperInput,
  ) => Promise<UserReservesIncentivesData[]>;
  getReservesIncentivesDataHumanized: (
    args: ReservesHelperInput,
  ) => Promise<ReservesIncentiveDataHumanized[]>;
  getUserReservesIncentivesDataHumanized: (
    args: UserReservesHelperInput,
  ) => Promise<UserReservesIncentivesDataHumanized[]>;
}
export interface FeedResultSuccessful {
  rewardTokenAddress: string;
  answer: string;
  updatedAt: number;
  decimals: number;
}

export interface UiIncentiveDataProviderContext {
  uiIncentiveDataProviderAddress: string;
  provider: providers.Provider;
  chainId: number;
}

export class UiIncentiveDataProvider
  extends BaseService<UiIncentiveDataProviderV3>
  implements UiIncentiveDataProviderInterface
{
  readonly uiIncentiveDataProviderAddress: string;

  readonly chainId: number;

  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor({
    provider,
    uiIncentiveDataProviderAddress,
    chainId,
  }: UiIncentiveDataProviderContext) {
    super(provider, UiIncentiveDataProviderV3__factory);
    this.uiIncentiveDataProviderAddress = uiIncentiveDataProviderAddress;
    this.chainId = chainId;
  }

  /**
   *  Get the full reserve incentive data for the lending pool and the user
   * @param user The user address
   */
  @UiIncentiveDataProviderValidator
  public async getFullReservesIncentiveData(
    @isEthAddress('user')
    @isEthAddress('lendingPoolAddressProvider')
    { user, lendingPoolAddressProvider }: UserReservesHelperInput,
  ): Promise<FullReservesIncentiveDataResponse> {
    const uiIncentiveContract = this.getContractInstance(
      this.uiIncentiveDataProviderAddress,
    );

    return uiIncentiveContract.getFullReservesIncentiveData(
      lendingPoolAddressProvider,
      user,
    );
  }

  /**
   *  Get the reserve incentive data for the lending pool
   */
  @UiIncentiveDataProviderValidator
  public async getReservesIncentivesData(
    @isEthAddress('lendingPoolAddressProvider')
    { lendingPoolAddressProvider }: ReservesHelperInput,
  ): Promise<ReservesIncentiveData[]> {
    const uiIncentiveContract = this.getContractInstance(
      this.uiIncentiveDataProviderAddress,
    );

    return uiIncentiveContract.getReservesIncentivesData(
      lendingPoolAddressProvider,
    );
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  @UiIncentiveDataProviderValidator
  public async getUserReservesIncentivesData(
    @isEthAddress('user')
    @isEthAddress('lendingPoolAddressProvider')
    { user, lendingPoolAddressProvider }: UserReservesHelperInput,
  ): Promise<UserReservesIncentivesData[]> {
    const uiIncentiveContract = this.getContractInstance(
      this.uiIncentiveDataProviderAddress,
    );

    return uiIncentiveContract.getUserReservesIncentivesData(
      lendingPoolAddressProvider,
      user,
    );
  }

  @UiIncentiveDataProviderValidator
  public async getReservesIncentivesDataHumanized(
    @isEthAddress('lendingPoolAddressProvider')
    { lendingPoolAddressProvider }: ReservesHelperInput,
  ): Promise<ReservesIncentiveDataHumanized[]> {
    const response: ReservesIncentiveData[] =
      await this.getReservesIncentivesData({ lendingPoolAddressProvider });

    return response.map(r => ({
      id: `${this.chainId}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      aIncentiveData: this._formatIncentiveData(r.aIncentiveData),
      vIncentiveData: this._formatIncentiveData(r.vIncentiveData),
    }));
  }

  @UiIncentiveDataProviderValidator
  public async getUserReservesIncentivesDataHumanized(
    @isEthAddress('user')
    @isEthAddress('lendingPoolAddressProvider')
    { user, lendingPoolAddressProvider }: UserReservesHelperInput,
  ): Promise<UserReservesIncentivesDataHumanized[]> {
    const response: UserReservesIncentivesData[] =
      await this.getUserReservesIncentivesData({
        user,
        lendingPoolAddressProvider,
      });

    return response.map(r => ({
      id: `${this.chainId}-${user}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      aTokenIncentivesUserData: this._formatUserIncentiveData(
        r.aTokenIncentivesUserData,
      ),
      vTokenIncentivesUserData: this._formatUserIncentiveData(
        r.vTokenIncentivesUserData,
      ),
    }));
  }

  private _formatIncentiveData(data: IncentiveData): IncentiveDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      rewardsTokenInformation: data.rewardsTokenInformation.map(
        (rawRewardInfo: RewardInfo) => ({
          precision: rawRewardInfo.precision,
          rewardTokenAddress: rawRewardInfo.rewardTokenAddress,
          rewardTokenDecimals: rawRewardInfo.rewardTokenDecimals,
          emissionPerSecond: rawRewardInfo.emissionPerSecond.toString(),
          incentivesLastUpdateTimestamp:
            rawRewardInfo.incentivesLastUpdateTimestamp.toNumber(),
          tokenIncentivesIndex: rawRewardInfo.tokenIncentivesIndex.toString(),
          emissionEndTimestamp: rawRewardInfo.emissionEndTimestamp.toNumber(),
          rewardTokenSymbol: rawRewardInfo.rewardTokenSymbol,
          rewardOracleAddress: rawRewardInfo.rewardOracleAddress,
          rewardPriceFeed: rawRewardInfo.rewardPriceFeed.toString(),
          priceFeedDecimals: rawRewardInfo.priceFeedDecimals,
        }),
      ),
    };
  }

  private _formatUserIncentiveData(
    data: UserIncentiveData,
  ): UserIncentiveDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      userRewardsInformation: data.userRewardsInformation.map(
        (userRewardInformation: UserRewardInfo) => ({
          rewardTokenAddress: userRewardInformation.rewardTokenAddress,
          rewardTokenDecimals: userRewardInformation.rewardTokenDecimals,
          tokenIncentivesUserIndex:
            userRewardInformation.tokenIncentivesUserIndex.toString(),
          userUnclaimedRewards:
            userRewardInformation.userUnclaimedRewards.toString(),
          rewardTokenSymbol: userRewardInformation.rewardTokenSymbol,
          rewardOracleAddress: userRewardInformation.rewardOracleAddress,
          rewardPriceFeed: userRewardInformation.rewardPriceFeed.toString(),
          priceFeedDecimals: userRewardInformation.priceFeedDecimals,
        }),
      ),
    };
  }
}

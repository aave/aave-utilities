import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import {
  ChainlinkFeedsRegistry,
  ChainlinkFeedsRegistryInterface,
  PriceFeed,
} from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './typechain/UiIncentiveDataProvider';
import { UiIncentiveDataProviderFactory } from './typechain/UiIncentiveDataProviderFactory';
import {
  FullReservesIncentiveDataResponse,
  IncentiveData,
  IncentiveDataHumanized,
  IncentiveUserData,
  IncentiveUserDataHumanized,
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

export class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface
{
  public readonly _contract: UiIncentiveDataProviderContract;

  private readonly _chainlinkFeedsRegistries: Record<
    string,
    ChainlinkFeedsRegistryInterface
  >;

  private readonly _context: UiIncentiveDataProviderContext;

  private readonly chainId: number;

  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor(context: UiIncentiveDataProviderContext) {
    if (!isAddress(context.incentiveDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    this._context = context;

    this._chainlinkFeedsRegistries = {};

    this._contract = UiIncentiveDataProviderFactory.connect(
      context.incentiveDataProviderAddress,
      context.provider,
    );

    this.chainId = context.chainId;
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
      id: `${this.chainId}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      aIncentiveData: this._formatIncentiveData(r.aIncentiveData),
      vIncentiveData: this._formatIncentiveData(r.vIncentiveData),
      sIncentiveData: this._formatIncentiveData(r.sIncentiveData),
    }));
  }

  public async getUserReservesIncentivesDataHumanized(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataHumanizedResponse[]> {
    const response = await this.getUserReservesIncentivesData(
      user,
      lendingPoolAddressProvider,
    );

    return response.map(r => ({
      id: `${this.chainId}-${user}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      aTokenIncentivesUserData: this._formatUserIncentiveData(
        r.aTokenIncentivesUserData,
      ),
      vTokenIncentivesUserData: this._formatUserIncentiveData(
        r.vTokenIncentivesUserData,
      ),
      sTokenIncentivesUserData: this._formatUserIncentiveData(
        r.sTokenIncentivesUserData,
      ),
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

  public async getIncentivesDataWithPrice({
    lendingPoolAddressProvider,
    chainlinkFeedsRegistry,
    quote = Denominations.eth,
  }: GetIncentivesDataWithPriceType): Promise<
    ReserveIncentiveWithFeedsResponse[]
  > {
    const incentives: ReserveIncentiveDataHumanizedResponse[] =
      await this.getReservesIncentivesDataHumanized(lendingPoolAddressProvider);
    const feeds: FeedResultSuccessful[] = [];

    if (chainlinkFeedsRegistry && isAddress(chainlinkFeedsRegistry)) {
      if (!this._chainlinkFeedsRegistries[chainlinkFeedsRegistry]) {
        this._chainlinkFeedsRegistries[chainlinkFeedsRegistry] =
          new ChainlinkFeedsRegistry({
            provider: this._context.provider,
            chainlinkFeedsRegistry,
          });
      }

      const allIncentiveRewardTokens: Set<string> = new Set();

      incentives.forEach(incentive => {
        allIncentiveRewardTokens.add(
          incentive.aIncentiveData.rewardTokenAddress,
        );
        allIncentiveRewardTokens.add(
          incentive.vIncentiveData.rewardTokenAddress,
        );
        allIncentiveRewardTokens.add(
          incentive.sIncentiveData.rewardTokenAddress,
        );
      });

      const incentiveRewardTokens: string[] = Array.from(
        allIncentiveRewardTokens,
      );

      // eslint-disable-next-line @typescript-eslint/promise-function-async
      const rewardFeedPromises = incentiveRewardTokens.map(rewardToken =>
        this._getFeed(rewardToken, chainlinkFeedsRegistry, quote),
      );

      const feedResults = await Promise.allSettled(rewardFeedPromises);

      feedResults.forEach(feedResult => {
        if (feedResult.status === 'fulfilled') feeds.push(feedResult.value);
      });
    }

    return incentives.map(
      (incentive: ReserveIncentiveDataHumanizedResponse) => {
        const aFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.aIncentiveData.rewardTokenAddress,
        );
        const vFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.vIncentiveData.rewardTokenAddress,
        );
        const sFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.sIncentiveData.rewardTokenAddress,
        );

        return {
          underlyingAsset: incentive.underlyingAsset,
          aIncentiveData: {
            ...incentive.aIncentiveData,
            priceFeed: aFeed ? aFeed.answer : '0',
            priceFeedTimestamp: aFeed ? aFeed.updatedAt : 0,
            priceFeedDecimals: aFeed ? aFeed.decimals : 0,
          },
          vIncentiveData: {
            ...incentive.vIncentiveData,
            priceFeed: vFeed ? vFeed.answer : '0',
            priceFeedTimestamp: vFeed ? vFeed.updatedAt : 0,
            priceFeedDecimals: vFeed ? vFeed.decimals : 0,
          },
          sIncentiveData: {
            ...incentive.sIncentiveData,
            priceFeed: sFeed ? sFeed.answer : '0',
            priceFeedTimestamp: sFeed ? sFeed.updatedAt : 0,
            priceFeedDecimals: sFeed ? sFeed.decimals : 0,
          },
        };
      },
    );
  }

  private readonly _getFeed = async (
    rewardToken: string,
    chainlinkFeedsRegistry: string,
    quote: Denominations,
  ): Promise<FeedResultSuccessful> => {
    const feed: PriceFeed = await this._chainlinkFeedsRegistries[
      chainlinkFeedsRegistry
    ].getPriceFeed(rewardToken, quote);

    return {
      ...feed,
      rewardTokenAddress: rewardToken,
    };
  };

  private _formatIncentiveData(data: IncentiveData): IncentiveDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      precision: data.precision,
      rewardTokenAddress: data.rewardTokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      rewardTokenDecimals: data.rewardTokenDecimals,
      emissionPerSecond: data.emissionPerSecond.toString(),
      incentivesLastUpdateTimestamp:
        data.incentivesLastUpdateTimestamp.toNumber(),
      tokenIncentivesIndex: data.tokenIncentivesIndex.toString(),
      emissionEndTimestamp: data.emissionEndTimestamp.toNumber(),
    };
  }

  private _formatUserIncentiveData(
    data: IncentiveUserData,
  ): IncentiveUserDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      rewardTokenAddress: data.rewardTokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      rewardTokenDecimals: data.rewardTokenDecimals,
      tokenIncentivesUserIndex: data.tokenincentivesUserIndex.toString(),
      userUnclaimedRewards: data.userUnclaimedRewards.toString(),
    };
  }
}

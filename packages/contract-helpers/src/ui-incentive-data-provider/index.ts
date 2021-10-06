/* eslint-disable require-atomic-updates */
import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import {
  ChainlinkFeedsRegistry,
  ChainlinkFeedsRegistryInterface,
  Denominations,
  PriceFeed,
} from '../cl-feed-registry/index';
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
}
export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  provider: providers.Provider;
}

export interface FeedResultSuccessful {
  rewardTokenAddress: string;
  answer: string;
  updatedAt: number;
  decimals: number;
}

export class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface {
  public readonly _contract: UiIncentiveDataProviderContract;

  private readonly _chainlinkFeedsRegistries: {
    [address: string]: ChainlinkFeedsRegistryInterface;
  };

  private readonly _context: UiIncentiveDataProviderContext;

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
      underlyingAsset: r.underlyingAsset,
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
      underlyingAsset: r.underlyingAsset,
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

  public async getIncentivesDataWithPrice(
    lendingPoolAddressProvider: string,
    chainlinkFeedsRegistry: string,
    quote: Denominations,
  ): Promise<ReserveIncentiveWithFeedsResponse[]> {
    const incentives: ReserveIncentiveDataHumanizedResponse[] = await this.getReservesIncentivesDataHumanized(
      lendingPoolAddressProvider,
    );

    if (!this._chainlinkFeedsRegistries[chainlinkFeedsRegistry]) {
      this._chainlinkFeedsRegistries[
        chainlinkFeedsRegistry
      ] = new ChainlinkFeedsRegistry({
        provider: this._context.provider,
        chainlinkFeedsRegistry,
      });
    }

    const incentiveRewardTokens: string[] = [];

    incentives.forEach((incentive: ReserveIncentiveDataHumanizedResponse) => {
      if (
        !incentiveRewardTokens.includes(
          incentive.aIncentiveData.rewardTokenAddress,
        )
      ) {
        incentiveRewardTokens.push(incentive.aIncentiveData.rewardTokenAddress);
      }

      if (
        !incentiveRewardTokens.includes(
          incentive.vIncentiveData.rewardTokenAddress,
        )
      ) {
        incentiveRewardTokens.push(incentive.vIncentiveData.rewardTokenAddress);
      }

      if (
        !incentiveRewardTokens.includes(
          incentive.sIncentiveData.rewardTokenAddress,
        )
      ) {
        incentiveRewardTokens.push(incentive.sIncentiveData.rewardTokenAddress);
      }
    });

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const rewardFeedPromises = incentiveRewardTokens.map(rewardToken =>
      this._getFeed(rewardToken, chainlinkFeedsRegistry, quote),
    );

    const feedResults = await Promise.allSettled(rewardFeedPromises);
    const feeds: FeedResultSuccessful[] = [];

    feedResults.forEach(feedResult => {
      if (feedResult.status === 'fulfilled') feeds.push(feedResult.value);
    });

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

    // const tokensToGetFeed: { [tokenAddress: string]: PriceFeed } = {};
    // for (const incentive of incentives) {
    //   if (!tokensToGetFeed[incentive.aIncentiveData.rewardTokenAddress]) {
    //     try {
    //       tokensToGetFeed[
    //         incentive.aIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = await this._chainlinkFeedsRegistries[
    //         chainlinkFeedsRegistry
    //       ].getPriceFeed(incentive.aIncentiveData.rewardTokenAddress, quote);
    //     } catch (error) {
    //       console.error(
    //         `feed not found for token: ${incentive.aIncentiveData.rewardTokenAddress} and quote: ${quote} with error: ${error}`,
    //       );
    //       tokensToGetFeed[
    //         incentive.aIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = {
    //         answer: '0',
    //         updatedAt: 0,
    //         decimals: 0,
    //       };
    //     }
    //   }

    //   if (!tokensToGetFeed[incentive.vIncentiveData.rewardTokenAddress]) {
    //     try {
    //       tokensToGetFeed[
    //         incentive.vIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = await this._chainlinkFeedsRegistries[
    //         chainlinkFeedsRegistry
    //       ].getPriceFeed(incentive.vIncentiveData.rewardTokenAddress, quote);
    //     } catch (error) {
    //       console.error(
    //         `feed not found for token: ${incentive.vIncentiveData.rewardTokenAddress} and quote: ${quote} with error: ${error}`,
    //       );
    //       tokensToGetFeed[
    //         incentive.vIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = {
    //         answer: '0',
    //         updatedAt: 0,
    //         decimals: 0,
    //       };
    //     }
    //   }

    //   if (!tokensToGetFeed[incentive.sIncentiveData.rewardTokenAddress]) {
    //     try {
    //       tokensToGetFeed[
    //         incentive.sIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = await this._chainlinkFeedsRegistries[
    //         chainlinkFeedsRegistry
    //       ].getPriceFeed(incentive.sIncentiveData.rewardTokenAddress, quote);
    //     } catch (error) {
    //       console.error(
    //         `feed not found for token: ${incentive.sIncentiveData.rewardTokenAddress} and quote: ${quote} with error: ${error}`,
    //       );
    //       tokensToGetFeed[
    //         incentive.sIncentiveData.rewardTokenAddress
    //         // eslint-disable-next-line no-await-in-loop
    //       ] = {
    //         answer: '0',
    //         updatedAt: 0,
    //         decimals: 0,
    //       };
    //     }
    //   }
    // }

    // return incentives.map(
    //   (incentive: ReserveIncentiveDataHumanizedResponse) => ({
    //     underlyingAsset: incentive.underlyingAsset,
    //     aIncentiveData: {
    //       ...incentive.aIncentiveData,
    //       priceFeed:
    //         tokensToGetFeed[incentive.aIncentiveData.rewardTokenAddress].answer,
    //       priceFeedTimestamp:
    //         tokensToGetFeed[incentive.aIncentiveData.rewardTokenAddress]
    //           .updatedAt,
    //       priceFeedDecimals:
    //         tokensToGetFeed[incentive.aIncentiveData.rewardTokenAddress]
    //           .decimals,
    //     },
    //     vIncentiveData: {
    //       ...incentive.vIncentiveData,
    //       priceFeed:
    //         tokensToGetFeed[incentive.vIncentiveData.rewardTokenAddress].answer,
    //       priceFeedTimestamp:
    //         tokensToGetFeed[incentive.vIncentiveData.rewardTokenAddress]
    //           .updatedAt,
    //       priceFeedDecimals:
    //         tokensToGetFeed[incentive.vIncentiveData.rewardTokenAddress]
    //           .decimals,
    //     },
    //     sIncentiveData: {
    //       ...incentive.sIncentiveData,
    //       priceFeed:
    //         tokensToGetFeed[incentive.sIncentiveData.rewardTokenAddress].answer,
    //       priceFeedTimestamp:
    //         tokensToGetFeed[incentive.sIncentiveData.rewardTokenAddress]
    //           .updatedAt,
    //       priceFeedDecimals:
    //         tokensToGetFeed[incentive.sIncentiveData.rewardTokenAddress]
    //           .decimals,
    //     },
    //   }),
    // );
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
      incentivesLastUpdateTimestamp: data.incentivesLastUpdateTimestamp.toNumber(),
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
      tokenincentivesUserIndex: data.tokenincentivesUserIndex.toString(),
      userUnclaimedRewards: data.userUnclaimedRewards.toString(),
    };
  }
}

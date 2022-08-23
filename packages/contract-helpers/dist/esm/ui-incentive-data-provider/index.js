import { isAddress } from 'ethers/lib/utils';
import { ChainlinkFeedsRegistry, } from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import { UiIncentiveDataProviderFactory } from './typechain/UiIncentiveDataProviderFactory';
export * from './types/UiIncentiveDataProviderTypes';
export class UiIncentiveDataProvider {
    /**
     * Constructor
     * @param context The ui incentive data provider context
     */
    constructor(context) {
        this._getFeed = async (rewardToken, chainlinkFeedsRegistry, quote) => {
            const feed = await this._chainlinkFeedsRegistries[chainlinkFeedsRegistry].getPriceFeed(rewardToken, quote);
            return Object.assign(Object.assign({}, feed), { rewardTokenAddress: rewardToken });
        };
        if (!isAddress(context.incentiveDataProviderAddress)) {
            throw new Error('contract address is not valid');
        }
        this._context = context;
        this._chainlinkFeedsRegistries = {};
        this._contract = UiIncentiveDataProviderFactory.connect(context.incentiveDataProviderAddress, context.provider);
        this.chainId = context.chainId;
    }
    /**
     *  Get the full reserve incentive data for the lending pool and the user
     * @param user The user address
     */
    async getFullReservesIncentiveData(user, lendingPoolAddressProvider) {
        if (!isAddress(lendingPoolAddressProvider)) {
            throw new Error('Lending pool address provider is not valid');
        }
        if (!isAddress(user)) {
            throw new Error('User address is not a valid ethereum address');
        }
        return this._contract.getFullReservesIncentiveData(lendingPoolAddressProvider, user);
    }
    /**
     *  Get the reserve incentive data for the lending pool
     */
    async getReservesIncentivesData(lendingPoolAddressProvider) {
        if (!isAddress(lendingPoolAddressProvider)) {
            throw new Error('Lending pool address provider is not valid');
        }
        return this._contract.getReservesIncentivesData(lendingPoolAddressProvider);
    }
    async getReservesIncentivesDataHumanized(lendingPoolAddressProvider) {
        const response = await this.getReservesIncentivesData(lendingPoolAddressProvider);
        return response.map(r => ({
            id: `${this.chainId}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
            underlyingAsset: r.underlyingAsset.toLowerCase(),
            aIncentiveData: this._formatIncentiveData(r.aIncentiveData),
            vIncentiveData: this._formatIncentiveData(r.vIncentiveData),
            sIncentiveData: this._formatIncentiveData(r.sIncentiveData),
        }));
    }
    async getUserReservesIncentivesDataHumanized(user, lendingPoolAddressProvider) {
        const response = await this.getUserReservesIncentivesData(user, lendingPoolAddressProvider);
        return response.map(r => ({
            id: `${this.chainId}-${user}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
            underlyingAsset: r.underlyingAsset.toLowerCase(),
            aTokenIncentivesUserData: this._formatUserIncentiveData(r.aTokenIncentivesUserData),
            vTokenIncentivesUserData: this._formatUserIncentiveData(r.vTokenIncentivesUserData),
            sTokenIncentivesUserData: this._formatUserIncentiveData(r.sTokenIncentivesUserData),
        }));
    }
    /**
     *  Get the reserve incentive data for the user
     * @param user The user address
     */
    async getUserReservesIncentivesData(user, lendingPoolAddressProvider) {
        if (!isAddress(lendingPoolAddressProvider)) {
            throw new Error('Lending pool address provider is not valid');
        }
        if (!isAddress(user)) {
            throw new Error('User address is not a valid ethereum address');
        }
        return this._contract.getUserReservesIncentivesData(lendingPoolAddressProvider, user);
    }
    async getIncentivesDataWithPrice({ lendingPoolAddressProvider, chainlinkFeedsRegistry, quote = Denominations.eth, }) {
        const incentives = await this.getReservesIncentivesDataHumanized(lendingPoolAddressProvider);
        const feeds = [];
        if (chainlinkFeedsRegistry && isAddress(chainlinkFeedsRegistry)) {
            if (!this._chainlinkFeedsRegistries[chainlinkFeedsRegistry]) {
                this._chainlinkFeedsRegistries[chainlinkFeedsRegistry] =
                    new ChainlinkFeedsRegistry({
                        provider: this._context.provider,
                        chainlinkFeedsRegistry,
                    });
            }
            const allIncentiveRewardTokens = new Set();
            incentives.forEach(incentive => {
                allIncentiveRewardTokens.add(incentive.aIncentiveData.rewardTokenAddress);
                allIncentiveRewardTokens.add(incentive.vIncentiveData.rewardTokenAddress);
                allIncentiveRewardTokens.add(incentive.sIncentiveData.rewardTokenAddress);
            });
            const incentiveRewardTokens = Array.from(allIncentiveRewardTokens);
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const rewardFeedPromises = incentiveRewardTokens.map(rewardToken => this._getFeed(rewardToken, chainlinkFeedsRegistry, quote));
            const feedResults = await Promise.allSettled(rewardFeedPromises);
            feedResults.forEach(feedResult => {
                if (feedResult.status === 'fulfilled')
                    feeds.push(feedResult.value);
            });
        }
        return incentives.map((incentive) => {
            const aFeed = feeds.find(feed => feed.rewardTokenAddress ===
                incentive.aIncentiveData.rewardTokenAddress);
            const vFeed = feeds.find(feed => feed.rewardTokenAddress ===
                incentive.vIncentiveData.rewardTokenAddress);
            const sFeed = feeds.find(feed => feed.rewardTokenAddress ===
                incentive.sIncentiveData.rewardTokenAddress);
            return {
                underlyingAsset: incentive.underlyingAsset,
                aIncentiveData: Object.assign(Object.assign({}, incentive.aIncentiveData), { priceFeed: aFeed ? aFeed.answer : '0', priceFeedTimestamp: aFeed ? aFeed.updatedAt : 0, priceFeedDecimals: aFeed ? aFeed.decimals : 0 }),
                vIncentiveData: Object.assign(Object.assign({}, incentive.vIncentiveData), { priceFeed: vFeed ? vFeed.answer : '0', priceFeedTimestamp: vFeed ? vFeed.updatedAt : 0, priceFeedDecimals: vFeed ? vFeed.decimals : 0 }),
                sIncentiveData: Object.assign(Object.assign({}, incentive.sIncentiveData), { priceFeed: sFeed ? sFeed.answer : '0', priceFeedTimestamp: sFeed ? sFeed.updatedAt : 0, priceFeedDecimals: sFeed ? sFeed.decimals : 0 }),
            };
        });
    }
    _formatIncentiveData(data) {
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
    _formatUserIncentiveData(data) {
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
//# sourceMappingURL=index.js.map
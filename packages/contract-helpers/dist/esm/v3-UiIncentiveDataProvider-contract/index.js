import { __decorate, __metadata, __param } from "tslib";
import { isAddress } from 'ethers/lib/utils';
import { ChainlinkFeedsRegistry, } from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import BaseService from '../commons/BaseService';
import { UiIncentiveDataProviderValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IUiIncentiveDataProviderV3__factory } from './typechain/IUiIncentiveDataProviderV3__factory';
export * from './types';
export class UiIncentiveDataProvider extends BaseService {
    /**
     * Constructor
     * @param context The ui incentive data provider context
     */
    constructor({ provider, uiIncentiveDataProviderAddress, chainId, }) {
        super(provider, IUiIncentiveDataProviderV3__factory);
        this._getFeed = async (rewardToken, chainlinkFeedsRegistry, quote) => {
            const feed = await this._chainlinkFeedsRegistries[chainlinkFeedsRegistry].getPriceFeed(rewardToken, quote);
            return Object.assign(Object.assign({}, feed), { rewardTokenAddress: rewardToken });
        };
        this.uiIncentiveDataProviderAddress = uiIncentiveDataProviderAddress;
        this._chainlinkFeedsRegistries = {};
        this.chainId = chainId;
    }
    /**
     *  Get the full reserve incentive data for the lending pool and the user
     * @param user The user address
     */
    async getFullReservesIncentiveData({ user, lendingPoolAddressProvider }) {
        const uiIncentiveContract = this.getContractInstance(this.uiIncentiveDataProviderAddress);
        return uiIncentiveContract.getFullReservesIncentiveData(lendingPoolAddressProvider, user);
    }
    /**
     *  Get the reserve incentive data for the lending pool
     */
    async getReservesIncentivesData({ lendingPoolAddressProvider }) {
        const uiIncentiveContract = this.getContractInstance(this.uiIncentiveDataProviderAddress);
        return uiIncentiveContract.getReservesIncentivesData(lendingPoolAddressProvider);
    }
    /**
     *  Get the reserve incentive data for the user
     * @param user The user address
     */
    async getUserReservesIncentivesData({ user, lendingPoolAddressProvider }) {
        const uiIncentiveContract = this.getContractInstance(this.uiIncentiveDataProviderAddress);
        return uiIncentiveContract.getUserReservesIncentivesData(lendingPoolAddressProvider, user);
    }
    async getReservesIncentivesDataHumanized({ lendingPoolAddressProvider }) {
        const response = await this.getReservesIncentivesData({ lendingPoolAddressProvider });
        return response.map(r => ({
            id: `${this.chainId}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
            underlyingAsset: r.underlyingAsset.toLowerCase(),
            aIncentiveData: this._formatIncentiveData(r.aIncentiveData),
            vIncentiveData: this._formatIncentiveData(r.vIncentiveData),
            sIncentiveData: this._formatIncentiveData(r.sIncentiveData),
        }));
    }
    async getUserReservesIncentivesDataHumanized({ user, lendingPoolAddressProvider }) {
        const response = await this.getUserReservesIncentivesData({
            user,
            lendingPoolAddressProvider,
        });
        return response.map(r => ({
            id: `${this.chainId}-${user}-${r.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
            underlyingAsset: r.underlyingAsset.toLowerCase(),
            aTokenIncentivesUserData: this._formatUserIncentiveData(r.aTokenIncentivesUserData),
            vTokenIncentivesUserData: this._formatUserIncentiveData(r.vTokenIncentivesUserData),
            sTokenIncentivesUserData: this._formatUserIncentiveData(r.sTokenIncentivesUserData),
        }));
    }
    async getIncentivesDataWithPriceLegacy({ lendingPoolAddressProvider, chainlinkFeedsRegistry, quote = Denominations.eth, }) {
        const incentives = await this.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider,
        });
        const feeds = [];
        if (chainlinkFeedsRegistry && isAddress(chainlinkFeedsRegistry)) {
            if (!this._chainlinkFeedsRegistries[chainlinkFeedsRegistry]) {
                this._chainlinkFeedsRegistries[chainlinkFeedsRegistry] =
                    new ChainlinkFeedsRegistry({
                        provider: this.provider,
                        chainlinkFeedsRegistry,
                    });
            }
            const allIncentiveRewardTokens = new Set();
            incentives.forEach(incentive => {
                incentive.aIncentiveData.rewardsTokenInformation.map(rewardInfo => allIncentiveRewardTokens.add(rewardInfo.rewardTokenAddress));
                incentive.vIncentiveData.rewardsTokenInformation.map(rewardInfo => allIncentiveRewardTokens.add(rewardInfo.rewardTokenAddress));
                incentive.sIncentiveData.rewardsTokenInformation.map(rewardInfo => allIncentiveRewardTokens.add(rewardInfo.rewardTokenAddress));
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
            return {
                id: `${this.chainId}-${incentive.underlyingAsset}-${lendingPoolAddressProvider}`.toLowerCase(),
                underlyingAsset: incentive.underlyingAsset,
                aIncentiveData: Object.assign(Object.assign({}, incentive.aIncentiveData), { rewardsTokenInformation: incentive.aIncentiveData.rewardsTokenInformation.map(rewardTokenInfo => {
                        const feed = feeds.find(feed => feed.rewardTokenAddress ===
                            rewardTokenInfo.rewardTokenAddress);
                        return Object.assign(Object.assign({}, rewardTokenInfo), { rewardPriceFeed: (feed === null || feed === void 0 ? void 0 : feed.answer)
                                ? feed.answer
                                : rewardTokenInfo.rewardPriceFeed, priceFeedDecimals: (feed === null || feed === void 0 ? void 0 : feed.decimals)
                                ? feed.decimals
                                : rewardTokenInfo.priceFeedDecimals });
                    }) }),
                vIncentiveData: Object.assign(Object.assign({}, incentive.vIncentiveData), { rewardsTokenInformation: incentive.vIncentiveData.rewardsTokenInformation.map(rewardTokenInfo => {
                        const feed = feeds.find(feed => feed.rewardTokenAddress ===
                            rewardTokenInfo.rewardTokenAddress);
                        return Object.assign(Object.assign({}, rewardTokenInfo), { rewardPriceFeed: (feed === null || feed === void 0 ? void 0 : feed.answer)
                                ? feed.answer
                                : rewardTokenInfo.rewardPriceFeed, priceFeedDecimals: (feed === null || feed === void 0 ? void 0 : feed.decimals)
                                ? feed.decimals
                                : rewardTokenInfo.priceFeedDecimals });
                    }) }),
                sIncentiveData: Object.assign(Object.assign({}, incentive.sIncentiveData), { rewardsTokenInformation: incentive.sIncentiveData.rewardsTokenInformation.map(rewardTokenInfo => {
                        const feed = feeds.find(feed => feed.rewardTokenAddress ===
                            rewardTokenInfo.rewardTokenAddress);
                        return Object.assign(Object.assign({}, rewardTokenInfo), { rewardPriceFeed: (feed === null || feed === void 0 ? void 0 : feed.answer)
                                ? feed.answer
                                : rewardTokenInfo.rewardPriceFeed, priceFeedDecimals: (feed === null || feed === void 0 ? void 0 : feed.decimals)
                                ? feed.decimals
                                : rewardTokenInfo.priceFeedDecimals });
                    }) }),
            };
        });
    }
    _formatIncentiveData(data) {
        return {
            tokenAddress: data.tokenAddress,
            incentiveControllerAddress: data.incentiveControllerAddress,
            rewardsTokenInformation: data.rewardsTokenInformation.map((rawRewardInfo) => ({
                precision: rawRewardInfo.precision,
                rewardTokenAddress: rawRewardInfo.rewardTokenAddress,
                rewardTokenDecimals: rawRewardInfo.rewardTokenDecimals,
                emissionPerSecond: rawRewardInfo.emissionPerSecond.toString(),
                incentivesLastUpdateTimestamp: rawRewardInfo.incentivesLastUpdateTimestamp.toNumber(),
                tokenIncentivesIndex: rawRewardInfo.tokenIncentivesIndex.toString(),
                emissionEndTimestamp: rawRewardInfo.emissionEndTimestamp.toNumber(),
                rewardTokenSymbol: rawRewardInfo.rewardTokenSymbol,
                rewardOracleAddress: rawRewardInfo.rewardOracleAddress,
                rewardPriceFeed: rawRewardInfo.rewardPriceFeed.toString(),
                priceFeedDecimals: rawRewardInfo.priceFeedDecimals,
            })),
        };
    }
    _formatUserIncentiveData(data) {
        return {
            tokenAddress: data.tokenAddress,
            incentiveControllerAddress: data.incentiveControllerAddress,
            userRewardsInformation: data.userRewardsInformation.map((userRewardInformation) => ({
                rewardTokenAddress: userRewardInformation.rewardTokenAddress,
                rewardTokenDecimals: userRewardInformation.rewardTokenDecimals,
                tokenIncentivesUserIndex: userRewardInformation.tokenIncentivesUserIndex.toString(),
                userUnclaimedRewards: userRewardInformation.userUnclaimedRewards.toString(),
                rewardTokenSymbol: userRewardInformation.rewardTokenSymbol,
                rewardOracleAddress: userRewardInformation.rewardOracleAddress,
                rewardPriceFeed: userRewardInformation.rewardPriceFeed.toString(),
                priceFeedDecimals: userRewardInformation.priceFeedDecimals,
            })),
        };
    }
}
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getFullReservesIncentiveData", null);
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getReservesIncentivesData", null);
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getUserReservesIncentivesData", null);
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getReservesIncentivesDataHumanized", null);
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getUserReservesIncentivesDataHumanized", null);
__decorate([
    UiIncentiveDataProviderValidator,
    __param(0, isEthAddress('lendingPoolAddressProvider')),
    __param(0, isEthAddress('chainlinkFeedsRegistry')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getIncentivesDataWithPriceLegacy", null);
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiIncentiveDataProvider = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("ethers/lib/utils");
const index_1 = require("../cl-feed-registry/index");
const ChainlinkFeedsRegistryTypes_1 = require("../cl-feed-registry/types/ChainlinkFeedsRegistryTypes");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IUiIncentiveDataProviderV3__factory_1 = require("./typechain/IUiIncentiveDataProviderV3__factory");
(0, tslib_1.__exportStar)(require("./types"), exports);
class UiIncentiveDataProvider extends BaseService_1.default {
    /**
     * Constructor
     * @param context The ui incentive data provider context
     */
    constructor({ provider, uiIncentiveDataProviderAddress, chainId, }) {
        super(provider, IUiIncentiveDataProviderV3__factory_1.IUiIncentiveDataProviderV3__factory);
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
    async getIncentivesDataWithPriceLegacy({ lendingPoolAddressProvider, chainlinkFeedsRegistry, quote = ChainlinkFeedsRegistryTypes_1.Denominations.eth, }) {
        const incentives = await this.getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider,
        });
        const feeds = [];
        if (chainlinkFeedsRegistry && (0, utils_1.isAddress)(chainlinkFeedsRegistry)) {
            if (!this._chainlinkFeedsRegistries[chainlinkFeedsRegistry]) {
                this._chainlinkFeedsRegistries[chainlinkFeedsRegistry] =
                    new index_1.ChainlinkFeedsRegistry({
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
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getFullReservesIncentiveData", null);
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getReservesIncentivesData", null);
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getUserReservesIncentivesData", null);
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getReservesIncentivesDataHumanized", null);
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getUserReservesIncentivesDataHumanized", null);
(0, tslib_1.__decorate)([
    methodValidators_1.UiIncentiveDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('lendingPoolAddressProvider')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('chainlinkFeedsRegistry')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiIncentiveDataProvider.prototype, "getIncentivesDataWithPriceLegacy", null);
exports.UiIncentiveDataProvider = UiIncentiveDataProvider;
//# sourceMappingURL=index.js.map
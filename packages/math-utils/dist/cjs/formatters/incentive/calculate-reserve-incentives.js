"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReserveIncentives = exports.calculateRewardTokenPrice = void 0;
const bignumber_1 = require("../../bignumber");
const calculate_incentive_apr_1 = require("./calculate-incentive-apr");
function calculateRewardTokenPrice(reserves, address, priceFeed, priceFeedDecimals) {
    // For V3 incentives, all rewards will have attached price feed
    if (Number(priceFeed) > 0) {
        return (0, bignumber_1.normalize)(priceFeed, priceFeedDecimals);
    }
    address = address.toLowerCase();
    // For stkAave incentives, use Aave price feed
    if (address.toLowerCase() === '0x4da27a545c0c5b758a6ba100e3a049001de870f5') {
        address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
    }
    // For V2 incentives, reward price feed comes from the reserves
    const rewardReserve = reserves.find(reserve => reserve.underlyingAsset.toLowerCase() === address);
    if (rewardReserve) {
        return rewardReserve.formattedPriceInMarketReferenceCurrency;
    }
    return '0';
}
exports.calculateRewardTokenPrice = calculateRewardTokenPrice;
// Determine is reward emsission is active or distribution has ended
const rewardEmissionActive = (reward) => {
    if (reward.emissionEndTimestamp > reward.incentivesLastUpdateTimestamp) {
        return true;
    }
    return false;
};
// Calculate supply, variableBorrow, and stableBorrow incentives APR for a reserve asset
function calculateReserveIncentives({ reserves, reserveIncentiveData, totalLiquidity, totalVariableDebt, totalStableDebt, decimals, priceInMarketReferenceCurrency, }) {
    const aIncentivesData = reserveIncentiveData.aIncentiveData.rewardsTokenInformation.map(reward => {
        const aIncentivesAPR = rewardEmissionActive(reward)
            ? (0, calculate_incentive_apr_1.calculateIncentiveAPR)({
                emissionPerSecond: reward.emissionPerSecond,
                rewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reward.rewardTokenAddress, reward.rewardPriceFeed, reward.priceFeedDecimals),
                priceInMarketReferenceCurrency,
                totalTokenSupply: totalLiquidity,
                decimals,
                rewardTokenDecimals: reward.rewardTokenDecimals,
            })
            : '0';
        const aIncentiveData = {
            incentiveAPR: aIncentivesAPR,
            rewardTokenAddress: reward.rewardTokenAddress,
            rewardTokenSymbol: reward.rewardTokenSymbol,
        };
        return aIncentiveData;
    });
    const vIncentivesData = reserveIncentiveData.vIncentiveData.rewardsTokenInformation.map(reward => {
        const vIncentivesAPR = rewardEmissionActive(reward)
            ? (0, calculate_incentive_apr_1.calculateIncentiveAPR)({
                emissionPerSecond: reward.emissionPerSecond,
                rewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reward.rewardTokenAddress, reward.rewardPriceFeed, reward.priceFeedDecimals),
                priceInMarketReferenceCurrency,
                totalTokenSupply: totalVariableDebt,
                decimals,
                rewardTokenDecimals: reward.rewardTokenDecimals,
            })
            : '0';
        const vIncentiveData = {
            incentiveAPR: vIncentivesAPR,
            rewardTokenAddress: reward.rewardTokenAddress,
            rewardTokenSymbol: reward.rewardTokenSymbol,
        };
        return vIncentiveData;
    });
    const sIncentivesData = reserveIncentiveData.sIncentiveData.rewardsTokenInformation.map(reward => {
        const sIncentivesAPR = rewardEmissionActive(reward)
            ? (0, calculate_incentive_apr_1.calculateIncentiveAPR)({
                emissionPerSecond: reward.emissionPerSecond,
                rewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reward.rewardTokenAddress, reward.rewardPriceFeed, reward.priceFeedDecimals),
                priceInMarketReferenceCurrency,
                totalTokenSupply: totalStableDebt,
                decimals,
                rewardTokenDecimals: reward.rewardTokenDecimals,
            })
            : '0';
        const sIncentiveData = {
            incentiveAPR: sIncentivesAPR,
            rewardTokenAddress: reward.rewardTokenAddress,
            rewardTokenSymbol: reward.rewardTokenSymbol,
        };
        return sIncentiveData;
    });
    return {
        underlyingAsset: reserveIncentiveData.underlyingAsset,
        aIncentivesData,
        vIncentivesData,
        sIncentivesData,
    };
}
exports.calculateReserveIncentives = calculateReserveIncentives;
//# sourceMappingURL=calculate-reserve-incentives.js.map
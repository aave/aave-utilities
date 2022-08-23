"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateUserReserveIncentives = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const bignumber_1 = require("../../bignumber");
const ray_math_1 = require("../../ray.math");
const calculate_accrued_incentives_1 = require("./calculate-accrued-incentives");
// Calculate user supply and borrow incentives for an individual reserve asset
function calculateUserReserveIncentives({ reserveIncentives, userIncentives, currentTimestamp, userReserveData, }) {
    const calculatedUserIncentives = [];
    // Compute incentive data for each reward linked to supply of this reserve
    userIncentives.aTokenIncentivesUserData.userRewardsInformation.forEach(userReserveIncentive => {
        const reserveIncentive = reserveIncentives.aIncentiveData.rewardsTokenInformation.find(reward => reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress);
        if (reserveIncentive) {
            // Calculating accrued rewards is only required if user has an active aToken balance
            const accruedRewards = userReserveData
                ? (0, calculate_accrued_incentives_1.calculateAccruedIncentives)({
                    principalUserBalance: new bignumber_js_1.default(userReserveData.scaledATokenBalance),
                    reserveIndex: new bignumber_js_1.default(reserveIncentive.tokenIncentivesIndex),
                    userIndex: new bignumber_js_1.default(userReserveIncentive.tokenIncentivesUserIndex),
                    precision: reserveIncentive.precision,
                    reserveIndexTimestamp: reserveIncentive.incentivesLastUpdateTimestamp,
                    emissionPerSecond: new bignumber_js_1.default(reserveIncentive.emissionPerSecond),
                    totalSupply: (0, ray_math_1.rayDiv)(new bignumber_js_1.default(userReserveData.reserve.totalLiquidity).shiftedBy(userReserveData.reserve.decimals), new bignumber_js_1.default(userReserveData.reserve.liquidityIndex)),
                    currentTimestamp,
                    emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
                })
                : new bignumber_js_1.default('0');
            calculatedUserIncentives.push({
                tokenAddress: userIncentives.aTokenIncentivesUserData.tokenAddress,
                incentiveController: userIncentives.aTokenIncentivesUserData.incentiveControllerAddress,
                rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
                rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
                accruedRewards,
                unclaimedRewards: new bignumber_js_1.default(userReserveIncentive.userUnclaimedRewards),
                rewardPriceFeed: (0, bignumber_1.normalize)(userReserveIncentive.rewardPriceFeed, userReserveIncentive.priceFeedDecimals),
                rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
            });
        }
    });
    // Compute incentive data for each reward linked to variable borrows of this reserve
    userIncentives.vTokenIncentivesUserData.userRewardsInformation.forEach(userReserveIncentive => {
        const reserveIncentive = reserveIncentives.vIncentiveData.rewardsTokenInformation.find(reward => reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress);
        if (reserveIncentive) {
            // Calculating accrued rewards is only required if user has an active variableDebt token balance
            const accruedRewards = userReserveData
                ? (0, calculate_accrued_incentives_1.calculateAccruedIncentives)({
                    principalUserBalance: new bignumber_js_1.default(userReserveData.scaledVariableDebt),
                    reserveIndex: new bignumber_js_1.default(reserveIncentive.tokenIncentivesIndex),
                    userIndex: new bignumber_js_1.default(userReserveIncentive.tokenIncentivesUserIndex),
                    precision: reserveIncentive.precision,
                    reserveIndexTimestamp: reserveIncentive.incentivesLastUpdateTimestamp,
                    emissionPerSecond: new bignumber_js_1.default(reserveIncentive.emissionPerSecond),
                    totalSupply: new bignumber_js_1.default(userReserveData.reserve.totalScaledVariableDebt).shiftedBy(userReserveData.reserve.decimals),
                    currentTimestamp,
                    emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
                })
                : new bignumber_js_1.default('0');
            calculatedUserIncentives.push({
                tokenAddress: userIncentives.vTokenIncentivesUserData.tokenAddress,
                incentiveController: userIncentives.vTokenIncentivesUserData.incentiveControllerAddress,
                rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
                rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
                accruedRewards,
                unclaimedRewards: new bignumber_js_1.default(userReserveIncentive.userUnclaimedRewards),
                rewardPriceFeed: (0, bignumber_1.normalize)(userReserveIncentive.rewardPriceFeed, userReserveIncentive.priceFeedDecimals),
                rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
            });
        }
    });
    // Compute incentive data for each reward linked to stable borrows of this reserve
    userIncentives.sTokenIncentivesUserData.userRewardsInformation.forEach(userReserveIncentive => {
        const reserveIncentive = reserveIncentives.sIncentiveData.rewardsTokenInformation.find(reward => reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress);
        if (reserveIncentive) {
            // Calculating accrued rewards is only required if user has an active stableDebtToken balance
            const accruedRewards = userReserveData
                ? (0, calculate_accrued_incentives_1.calculateAccruedIncentives)({
                    principalUserBalance: new bignumber_js_1.default(userReserveData.principalStableDebt),
                    reserveIndex: new bignumber_js_1.default(reserveIncentive.tokenIncentivesIndex),
                    userIndex: new bignumber_js_1.default(userReserveIncentive.tokenIncentivesUserIndex),
                    precision: reserveIncentive.precision,
                    reserveIndexTimestamp: reserveIncentive.incentivesLastUpdateTimestamp,
                    emissionPerSecond: new bignumber_js_1.default(reserveIncentive.emissionPerSecond),
                    totalSupply: new bignumber_js_1.default(userReserveData.reserve.totalPrincipalStableDebt).shiftedBy(userReserveData.reserve.decimals),
                    currentTimestamp,
                    emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
                })
                : new bignumber_js_1.default('0');
            calculatedUserIncentives.push({
                tokenAddress: userIncentives.sTokenIncentivesUserData.tokenAddress,
                incentiveController: userIncentives.sTokenIncentivesUserData.incentiveControllerAddress,
                rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
                rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
                accruedRewards,
                unclaimedRewards: new bignumber_js_1.default(userReserveIncentive.userUnclaimedRewards),
                rewardPriceFeed: (0, bignumber_1.normalize)(userReserveIncentive.rewardPriceFeed, userReserveIncentive.priceFeedDecimals),
                rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
            });
        }
    });
    return calculatedUserIncentives;
}
exports.calculateUserReserveIncentives = calculateUserReserveIncentives;
//# sourceMappingURL=calculate-user-reserve-incentives.js.map
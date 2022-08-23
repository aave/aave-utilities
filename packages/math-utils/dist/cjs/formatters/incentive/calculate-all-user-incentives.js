"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAllUserIncentives = void 0;
const calculate_user_reserve_incentives_1 = require("./calculate-user-reserve-incentives");
function calculateAllUserIncentives({ reserveIncentives, userIncentives, userReserves, currentTimestamp, }) {
    // calculate incentive per token
    const allRewards = userIncentives
        .map((userIncentive) => {
        const reserve = reserveIncentives.find((reserve) => reserve.underlyingAsset === userIncentive.underlyingAsset);
        const userReserve = userReserves.find((userReserve) => userReserve.reserve.underlyingAsset ===
            userIncentive.underlyingAsset);
        if (reserve) {
            const reserveRewards = (0, calculate_user_reserve_incentives_1.calculateUserReserveIncentives)({
                reserveIncentives: reserve,
                userIncentives: userIncentive,
                userReserveData: userReserve,
                currentTimestamp,
            });
            return reserveRewards;
        }
        return [];
    })
        .flat();
    // From the array of all deposit and borrow incentives, create dictionary indexed by reward token address
    const incentiveDict = {};
    allRewards.forEach(reward => {
        if (!incentiveDict[reward.rewardTokenAddress]) {
            incentiveDict[reward.rewardTokenAddress] = {
                assets: [],
                rewardTokenSymbol: reward.rewardTokenSymbol,
                claimableRewards: reward.unclaimedRewards,
                incentiveControllerAddress: reward.incentiveController,
                rewardTokenDecimals: reward.rewardTokenDecimals,
                rewardPriceFeed: reward.rewardPriceFeed,
            };
        }
        if (reward.accruedRewards.gt(0)) {
            incentiveDict[reward.rewardTokenAddress].claimableRewards = incentiveDict[reward.rewardTokenAddress].claimableRewards.plus(reward.accruedRewards);
            incentiveDict[reward.rewardTokenAddress].assets.push(reward.tokenAddress);
        }
    });
    return incentiveDict;
}
exports.calculateAllUserIncentives = calculateAllUserIncentives;
//# sourceMappingURL=calculate-all-user-incentives.js.map
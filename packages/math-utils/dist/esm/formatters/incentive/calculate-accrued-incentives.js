import BigNumber from 'bignumber.js';
// Calculate incentives earned by user since reserveIndexTimestamp
// Incentives earned before reserveIndexTimestamp are tracked seperately (userUnclaimedRewards from UiIncentiveDataProvider)
// This function is used for deposit, variableDebt, and stableDebt incentives
export function calculateAccruedIncentives({ principalUserBalance, reserveIndex, userIndex, precision, reserveIndexTimestamp, emissionPerSecond, totalSupply, currentTimestamp, emissionEndTimestamp, }) {
    if (totalSupply.isEqualTo(new BigNumber(0))) {
        return new BigNumber(0);
    }
    const actualCurrentTimestamp = currentTimestamp > emissionEndTimestamp
        ? emissionEndTimestamp
        : currentTimestamp;
    const timeDelta = actualCurrentTimestamp - reserveIndexTimestamp;
    let currentReserveIndex;
    if (reserveIndexTimestamp >= Number(currentTimestamp) ||
        reserveIndexTimestamp >= emissionEndTimestamp) {
        currentReserveIndex = reserveIndex;
    }
    else {
        currentReserveIndex = emissionPerSecond
            .multipliedBy(timeDelta)
            .shiftedBy(precision)
            .dividedBy(totalSupply)
            .plus(reserveIndex);
    }
    const reward = principalUserBalance
        .multipliedBy(currentReserveIndex.minus(userIndex))
        .shiftedBy(precision * -1);
    return reward;
}
//# sourceMappingURL=calculate-accrued-incentives.js.map
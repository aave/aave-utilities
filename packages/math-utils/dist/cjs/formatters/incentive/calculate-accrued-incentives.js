"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAccruedIncentives = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
// Calculate incentives earned by user since reserveIndexTimestamp
// Incentives earned before reserveIndexTimestamp are tracked seperately (userUnclaimedRewards from UiIncentiveDataProvider)
// This function is used for deposit, variableDebt, and stableDebt incentives
function calculateAccruedIncentives({ principalUserBalance, reserveIndex, userIndex, precision, reserveIndexTimestamp, emissionPerSecond, totalSupply, currentTimestamp, emissionEndTimestamp, }) {
    if (totalSupply.isEqualTo(new bignumber_js_1.default(0))) {
        return new bignumber_js_1.default(0);
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
exports.calculateAccruedIncentives = calculateAccruedIncentives;
//# sourceMappingURL=calculate-accrued-incentives.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCompoundedInterest = void 0;
const bignumber_1 = require("../../bignumber");
const constants_1 = require("../../constants");
const ray_math_1 = require("../../ray.math");
function calculateCompoundedInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = (0, bignumber_1.valueToZDBigNumber)(currentTimestamp - lastUpdateTimestamp);
    const ratePerSecond = (0, bignumber_1.valueToZDBigNumber)(rate).dividedBy(constants_1.SECONDS_PER_YEAR);
    return (0, ray_math_1.binomialApproximatedRayPow)(ratePerSecond, timeDelta);
}
exports.calculateCompoundedInterest = calculateCompoundedInterest;
//# sourceMappingURL=calculate-compounded-interest.js.map
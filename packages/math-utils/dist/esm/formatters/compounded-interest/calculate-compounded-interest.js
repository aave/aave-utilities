import { valueToZDBigNumber } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';
import { binomialApproximatedRayPow } from '../../ray.math';
export function calculateCompoundedInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp);
    const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR);
    return binomialApproximatedRayPow(ratePerSecond, timeDelta);
}
//# sourceMappingURL=calculate-compounded-interest.js.map
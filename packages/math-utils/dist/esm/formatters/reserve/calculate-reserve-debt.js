import { rayMul } from '../../ray.math';
import { calculateCompoundedInterest } from '../compounded-interest/calculate-compounded-interest';
export function calculateReserveDebt(reserveDebt, currentTimestamp) {
    const totalVariableDebt = getTotalVariableDebt(reserveDebt, currentTimestamp);
    const totalStableDebt = getTotalStableDebt(reserveDebt, currentTimestamp);
    const totalDebt = totalVariableDebt.plus(totalStableDebt);
    const totalLiquidity = totalDebt.plus(reserveDebt.availableLiquidity);
    return {
        totalVariableDebt,
        totalStableDebt,
        totalDebt,
        totalLiquidity,
    };
}
function getTotalVariableDebt(reserveDebt, currentTimestamp) {
    return rayMul(rayMul(reserveDebt.totalScaledVariableDebt, reserveDebt.variableBorrowIndex), calculateCompoundedInterest({
        rate: reserveDebt.variableBorrowRate,
        currentTimestamp,
        lastUpdateTimestamp: reserveDebt.lastUpdateTimestamp,
    }));
}
function getTotalStableDebt(reserveDebt, currentTimestamp) {
    return rayMul(reserveDebt.totalPrincipalStableDebt, calculateCompoundedInterest({
        rate: reserveDebt.averageStableRate,
        currentTimestamp,
        lastUpdateTimestamp: reserveDebt.stableDebtLastUpdateTimestamp,
    }));
}
//# sourceMappingURL=calculate-reserve-debt.js.map
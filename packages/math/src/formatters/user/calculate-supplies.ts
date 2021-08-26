import BigNumber from 'bignumber.js';
import { calculateCompoundedInterest } from '../../pool-math';
import { rayMul } from '../../ray.math';

export interface Supplies {
  totalVariableDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalLiquidity: BigNumber;
}

export interface ReserveSupplyData {
  totalScaledVariableDebt: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  totalPrincipalStableDebt: string;
  averageStableRate: string;
  availableLiquidity: string;
  stableDebtLastUpdateTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateSupplies(
  reserve: ReserveSupplyData,
  currentTimestamp: number,
): Supplies {
  const {
    totalVariableDebt,
    totalStableDebt,
  } = calculateReserveDebtSuppliesRaw(reserve, currentTimestamp);

  const totalDebt = totalVariableDebt.plus(totalStableDebt);

  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
  return {
    totalVariableDebt,
    totalStableDebt,
    totalLiquidity,
  };
}

/**
 * Calculates the debt accrued to a given point in time.
 * @param reserve
 * @param currentTimestamp unix timestamp which must be higher than reserve.lastUpdateTimestamp
 */
export function calculateReserveDebtSuppliesRaw(
  reserve: ReserveSupplyData,
  currentTimestamp: number,
) {
  const totalVariableDebt = rayMul(
    rayMul(reserve.totalScaledVariableDebt, reserve.variableBorrowIndex),
    calculateCompoundedInterest(
      reserve.variableBorrowRate,
      currentTimestamp,
      reserve.lastUpdateTimestamp,
    ),
  );
  const totalStableDebt = rayMul(
    reserve.totalPrincipalStableDebt,
    calculateCompoundedInterest(
      reserve.averageStableRate,
      currentTimestamp,
      reserve.stableDebtLastUpdateTimestamp,
    ),
  );
  return { totalVariableDebt, totalStableDebt };
}

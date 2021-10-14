import BigNumber from 'bignumber.js';
import { calculateCompoundedInterest } from '../../pool-math';
import { rayMul } from '../../ray.math';

export interface SuppliesRequest {
  reserve: ReserveSupplyData;
  currentTimestamp: number;
}

export interface SuppliesResponse {
  totalVariableDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalLiquidity: BigNumber;
}

interface ReserveSupplyData {
  totalScaledVariableDebt: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  totalPrincipalStableDebt: string;
  averageStableRate: string;
  availableLiquidity: string;
  stableDebtLastUpdateTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateSupplies({
  reserve,
  currentTimestamp,
}: SuppliesRequest): SuppliesResponse {
  const { totalVariableDebt, totalStableDebt } =
    calculateReserveDebtSuppliesRaw({
      reserve,
      currentTimestamp,
    });

  const totalDebt = totalVariableDebt.plus(totalStableDebt);

  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
  return {
    totalVariableDebt,
    totalStableDebt,
    totalLiquidity,
  };
}

interface ReserveDebtSuppliesRawRequest {
  reserve: ReserveSupplyData;
  currentTimestamp: number;
}

interface ReserveDebtSuppliesRawResponse {
  totalVariableDebt: BigNumber;
  totalStableDebt: BigNumber;
}

/**
 * Calculates the debt accrued to a given point in time.
 * @param reserve
 * @param currentTimestamp unix timestamp which must be higher than reserve.lastUpdateTimestamp
 */
function calculateReserveDebtSuppliesRaw({
  reserve,
  currentTimestamp,
}: ReserveDebtSuppliesRawRequest): ReserveDebtSuppliesRawResponse {
  const totalVariableDebt = rayMul(
    rayMul(reserve.totalScaledVariableDebt, reserve.variableBorrowIndex),
    calculateCompoundedInterest({
      rate: reserve.variableBorrowRate,
      currentTimestamp,
      lastUpdateTimestamp: reserve.lastUpdateTimestamp,
    }),
  );
  const totalStableDebt = rayMul(
    reserve.totalPrincipalStableDebt,
    calculateCompoundedInterest({
      rate: reserve.averageStableRate,
      currentTimestamp,
      lastUpdateTimestamp: reserve.stableDebtLastUpdateTimestamp,
    }),
  );
  return { totalVariableDebt, totalStableDebt };
}

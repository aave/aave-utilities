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

export function calculateSupplies(request: SuppliesRequest): SuppliesResponse {
  const {
    totalVariableDebt,
    totalStableDebt,
  } = calculateReserveDebtSuppliesRaw({
    reserve: request.reserve,
    currentTimestamp: request.currentTimestamp,
  });

  const totalDebt = totalVariableDebt.plus(totalStableDebt);

  const totalLiquidity = totalDebt.plus(request.reserve.availableLiquidity);
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
function calculateReserveDebtSuppliesRaw(
  request: ReserveDebtSuppliesRawRequest,
): ReserveDebtSuppliesRawResponse {
  const totalVariableDebt = rayMul(
    rayMul(
      request.reserve.totalScaledVariableDebt,
      request.reserve.variableBorrowIndex,
    ),
    calculateCompoundedInterest({
      rate: request.reserve.variableBorrowRate,
      currentTimestamp: request.currentTimestamp,
      lastUpdateTimestamp: request.reserve.lastUpdateTimestamp,
    }),
  );
  const totalStableDebt = rayMul(
    request.reserve.totalPrincipalStableDebt,
    calculateCompoundedInterest({
      rate: request.reserve.averageStableRate,
      currentTimestamp: request.currentTimestamp,
      lastUpdateTimestamp: request.reserve.stableDebtLastUpdateTimestamp,
    }),
  );
  return { totalVariableDebt, totalStableDebt };
}

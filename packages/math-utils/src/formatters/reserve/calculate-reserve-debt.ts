import BigNumber from 'bignumber.js';
import { calculateCompoundedInterest } from '../../pool-math';
import { rayMul } from '../../ray.math';

export interface CalculateReserveDebtRequest {
  totalScaledVariableDebt: string;
  variableBorrowIndex: string;
  availableLiquidity: string;
  variableBorrowRate: string;
  lastUpdateTimestamp: number;
  virtualUnderlyingBalance: string;
}

export interface CalculateReserveDebtResponse {
  totalVariableDebt: BigNumber;
  totalDebt: BigNumber;
  totalLiquidity: BigNumber;
}

export function calculateReserveDebt(
  reserveDebt: CalculateReserveDebtRequest,
  currentTimestamp: number,
): CalculateReserveDebtResponse {
  const totalVariableDebt = getTotalVariableDebt(reserveDebt, currentTimestamp);
  const totalDebt = totalVariableDebt;
  const totalLiquidity = totalDebt.plus(reserveDebt.availableLiquidity);
  return {
    totalVariableDebt,
    totalDebt,
    totalLiquidity,
  };
}

function getTotalVariableDebt(
  reserveDebt: CalculateReserveDebtRequest,
  currentTimestamp: number,
): BigNumber {
  return rayMul(
    rayMul(
      reserveDebt.totalScaledVariableDebt,
      reserveDebt.variableBorrowIndex,
    ),
    calculateCompoundedInterest({
      rate: reserveDebt.variableBorrowRate,
      currentTimestamp,
      lastUpdateTimestamp: reserveDebt.lastUpdateTimestamp,
    }),
  );
}

import BigNumber from 'bignumber.js'
import { rayMul } from 'math/src/ray.math'
import calculateCompoundedInterest from './calculate-compounded-interest'

export interface CalculateReserveDebtRequest {
  totalScaledVariableDebt: string
  variableBorrowIndex: string
  totalPrincipalStableDebt: string
  variableBorrowRate: string
  lastUpdateTimestamp: number
  averageStableRate: string
  stableDebtLastUpdateTimestamp: number
}

export interface CalculateReserveDebtResponse {
  totalVariableDebt: BigNumber
  totalStableDebt: BigNumber
  totalDebt: BigNumber
}

export function calculateReserveDebt(
  reserveDebt: CalculateReserveDebtRequest,
  currentTimestamp?: number | undefined,
): CalculateReserveDebtResponse {
  const totalVariableDebt = getTotalVariableDebt(
    reserveDebt,
    currentTimestamp || reserveDebt.lastUpdateTimestamp,
  )
  const totalStableDebt = getTotalStableDebt(
    reserveDebt,
    currentTimestamp || reserveDebt.lastUpdateTimestamp,
  )
  return {
    totalVariableDebt,
    totalStableDebt,
    totalDebt: totalStableDebt.plus(totalStableDebt),
  }
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
  )
}

function getTotalStableDebt(
  reserveDebt: CalculateReserveDebtRequest,
  currentTimestamp: number,
): BigNumber {
  return rayMul(
    reserveDebt.totalPrincipalStableDebt,
    calculateCompoundedInterest({
      rate: reserveDebt.averageStableRate,
      currentTimestamp,
      lastUpdateTimestamp: reserveDebt.stableDebtLastUpdateTimestamp,
    }),
  )
}

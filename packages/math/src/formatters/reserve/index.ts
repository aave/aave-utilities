import BigNumber from 'bignumber.js'
import { LTV_PRECISION } from 'math/src'
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber'
import { ETH_DECIMALS, RAY_DECIMALS } from '../../constants'
import { calculateAPYs } from './calculate-apy'
import { calculateReserveDebt } from './calculate-reserve-debt'

export interface FormatReserveResponse {
  reserveFactor: string
  baseLTVasCollateral: string
  liquidityIndex: string
  reserveLiquidationThreshold: string
  reserveLiquidationBonus: string
  variableBorrowIndex: string
  variableBorrowRate: string
  availableLiquidity: string
  stableBorrowRate: string
  liquidityRate: string
  totalPrincipalStableDebt: string
  totalScaledVariableDebt: string
  price: {
    priceInEth: string
  }
  utilizationRate: string
  totalStableDebt: string
  totalVariableDebt: string
  totalDebt: string
  totalLiquidity: string
  depositIncentivesAPY: string
  variableDebtIncentivesAPY: string
  stableDebtIncentivesAPY: string
}

export interface FormatReserveRequest {
  reserve: ReserveData
  currentTimestamp?: number
  rewardTokenPriceEth?: string
  emissionEndTimestamp?: number
}

export interface ReserveData {
  decimals: number
  reserveFactor: string
  baseLTVasCollateral: string
  averageStableRate: string
  stableDebtLastUpdateTimestamp: number
  liquidityIndex: string
  reserveLiquidationThreshold: string
  reserveLiquidationBonus: string
  variableBorrowIndex: string
  variableBorrowRate: string
  availableLiquidity: string
  stableBorrowRate: string
  liquidityRate: string
  totalPrincipalStableDebt: string
  totalScaledVariableDebt: string
  lastUpdateTimestamp: number
  price: {
    priceInEth: string
  }
  depositIncentivesEmissionPerSecond: string
  variableDebtIncentivesEmissionPerSecond: string
  stableDebtIncentivesEmissionPerSecond: string
}

export function formatReserves(
  request: FormatReserveRequest,
): FormatReserveResponse {
  const calculateReserveDebtResult = calculateReserveDebt(
    request.reserve,
    request.currentTimestamp || request.reserve.lastUpdateTimestamp,
  )

  const totalLiquidity = calculateTotalLiquidity(
    calculateReserveDebtResult.totalDebt,
    request.reserve.availableLiquidity,
  )

  const incentivesAPYs = calculateAPYs({
    emissionEndTimestamp: request.emissionEndTimestamp,
    currentTimestamp: request.currentTimestamp,
    depositIncentivesEmissionPerSecond:
      request.reserve.depositIncentivesEmissionPerSecond,
    stableDebtIncentivesEmissionPerSecond:
      request.reserve.stableDebtIncentivesEmissionPerSecond,
    variableDebtIncentivesEmissionPerSecond:
      request.reserve.variableDebtIncentivesEmissionPerSecond,
    totalLiquidity,
    rewardTokenPriceEth: request.rewardTokenPriceEth,
    priceInEth: request.reserve.price.priceInEth,
    totalVariableDebt: calculateReserveDebtResult.totalVariableDebt,
    totalStableDebt: calculateReserveDebtResult.totalStableDebt,
  })

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, request.reserve.decimals)

  return {
    totalVariableDebt: normalizeWithReserve(
      calculateReserveDebtResult.totalVariableDebt,
    ),
    totalStableDebt: normalizeWithReserve(
      calculateReserveDebtResult.totalVariableDebt,
    ),
    totalLiquidity: totalLiquidity.toFixed(),
    availableLiquidity: request.reserve.availableLiquidity,
    utilizationRate: !totalLiquidity.eq(0)
      ? calculateReserveDebtResult.totalDebt.dividedBy(totalLiquidity).toFixed()
      : '0',
    depositIncentivesAPY: incentivesAPYs.depositIncentives.toFixed(),
    variableDebtIncentivesAPY: incentivesAPYs.variableDebtIncentives.toFixed(),
    stableDebtIncentivesAPY: incentivesAPYs.stableDebtIncentives.toFixed(),
    totalDebt: calculateReserveDebtResult.totalDebt.toFixed(),
    price: {
      priceInEth: normalize(request.reserve.price.priceInEth, ETH_DECIMALS),
    },
    baseLTVasCollateral: normalize(
      request.reserve.baseLTVasCollateral,
      LTV_PRECISION,
    ),
    reserveFactor: normalize(request.reserve.reserveFactor, LTV_PRECISION),
    variableBorrowRate: normalize(
      request.reserve.variableBorrowRate,
      RAY_DECIMALS,
    ),
    stableBorrowRate: normalize(request.reserve.stableBorrowRate, RAY_DECIMALS),
    liquidityRate: normalize(request.reserve.liquidityRate, RAY_DECIMALS),
    liquidityIndex: normalize(request.reserve.liquidityIndex, RAY_DECIMALS),
    reserveLiquidationThreshold: normalize(
      request.reserve.reserveLiquidationThreshold,
      4,
    ),
    reserveLiquidationBonus: normalize(
      valueToBigNumber(request.reserve.reserveLiquidationBonus).shiftedBy(
        LTV_PRECISION,
      ),
      4,
    ),
    totalScaledVariableDebt: normalizeWithReserve(
      request.reserve.totalScaledVariableDebt,
    ),
    totalPrincipalStableDebt: normalizeWithReserve(
      request.reserve.totalPrincipalStableDebt,
    ),
    variableBorrowIndex: normalize(
      request.reserve.variableBorrowIndex,
      RAY_DECIMALS,
    ),
  }
}

function calculateTotalLiquidity(
  totalDebt: BigNumber,
  availableLiquidity: string,
): BigNumber {
  return totalDebt.plus(availableLiquidity)
}

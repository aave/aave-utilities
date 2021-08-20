import BigNumber from 'bignumber.js'
import { LTV_PRECISION } from 'math/src'
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber'
import { ETH_DECIMALS, RAY_DECIMALS } from '../../constants'
import { calculateAPYs } from './calculate-apy'
import { calculateReserveDebt } from './calculate-reserve-debt'
import { FormatReserveRequest, FormatReserveResponse } from './models'

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
    aEmissionPerSecond: request.reserve.aEmissionPerSecond,
    sEmissionPerSecond: request.reserve.sEmissionPerSecond,
    vEmissionPerSecond: request.reserve.vEmissionPerSecond,
    totalLiquidity,
    rewardTokenPriceEth: request.rewardTokenPriceEth,
    priceInEth: request.reserve.price.priceInEth,
    totalVariableDebt: calculateReserveDebtResult.totalVariableDebt,
    totalStableDebt: calculateReserveDebtResult.totalStableDebt,
  })

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, request.reserve.decimals)

  return {
    ...request.reserve,
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
    aIncentivesAPY: incentivesAPYs.aIncentives.toFixed(),
    vIncentivesAPY: incentivesAPYs.vIncentives.toFixed(),
    sIncentivesAPY: incentivesAPYs.sIncentives.toFixed(),
    totalDebt: calculateReserveDebtResult.totalDebt.toFixed(),
    price: {
      ...request.reserve.price,
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

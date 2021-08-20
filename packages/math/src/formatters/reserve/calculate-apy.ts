import { BigNumber } from 'bignumber.js'
import { calculateIncentivesAPY } from './calculate-incentives-apy'

export interface CalculateAPYRequest {
  emissionEndTimestamp?: number | undefined
  currentTimestamp?: number | undefined
  aEmissionPerSecond: string
  vEmissionPerSecond: string
  sEmissionPerSecond: string
  totalLiquidity: BigNumber
  rewardTokenPriceEth?: string | undefined
  priceInEth: string
  totalVariableDebt: BigNumber
  totalStableDebt: BigNumber
}

export interface CalculateAPYResponse {
  aIncentives: BigNumber
  vIncentives: BigNumber
  sIncentives: BigNumber
}

interface CalculateAPYBase {
  hasEmission: boolean
  rewardTokenPriceEth: string
  priceInEth: string
}

interface CalculateAAPY extends CalculateAPYBase {
  aEmissionPerSecond: string
  totalLiquidity: BigNumber
}

interface CalculateVAPY extends CalculateAPYBase {
  aEmissionPerSecond: string
  totalVariableDebt: BigNumber
}

interface CalculateSAPY extends CalculateAPYBase {
  aEmissionPerSecond: string
  totalStableDebt: BigNumber
}

export function calculateAPYs(
  request: CalculateAPYRequest,
): CalculateAPYResponse {
  const hasEmission = workoutOutIfHasEmission(
    request.emissionEndTimestamp,
    request.currentTimestamp,
  )

  let rewardTokenPriceEth = '0'
  if (request.rewardTokenPriceEth) {
    rewardTokenPriceEth = request.rewardTokenPriceEth
  }

  return {
    aIncentives: calculateAIncentivesAPY({
      hasEmission,
      rewardTokenPriceEth,
      priceInEth: request.priceInEth,
      aEmissionPerSecond: request.aEmissionPerSecond,
      totalLiquidity: request.totalLiquidity,
    }),
    vIncentives: calculateVIncentivesAPY({
      hasEmission,
      rewardTokenPriceEth,
      priceInEth: request.priceInEth,
      aEmissionPerSecond: request.aEmissionPerSecond,
      totalVariableDebt: request.totalVariableDebt,
    }),
    sIncentives: calculateSIncentivesAPY({
      hasEmission,
      rewardTokenPriceEth,
      priceInEth: request.priceInEth,
      aEmissionPerSecond: request.aEmissionPerSecond,
      totalStableDebt: request.totalStableDebt,
    }),
  }
}

function workoutOutIfHasEmission(
  emissionEndTimestamp?: number | undefined,
  currentTimestamp?: number | undefined,
): boolean {
  if (emissionEndTimestamp === undefined) {
    return false
  }

  return (
    emissionEndTimestamp > (currentTimestamp || Math.floor(Date.now() / 1000))
  )
}

function calculateAIncentivesAPY(request: CalculateAAPY): BigNumber {
  return request.hasEmission && !request.totalLiquidity.eq(0)
    ? calculateIncentivesAPY({
        emissionPerSecond: request.aEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenTotalSupplyNormalized: request.totalLiquidity,
        tokenPriceInEth: request.priceInEth,
      })
    : new BigNumber(0)
}

function calculateVIncentivesAPY(request: CalculateVAPY): BigNumber {
  return request.hasEmission && !request.totalVariableDebt.eq(0)
    ? calculateIncentivesAPY({
        emissionPerSecond: request.aEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenTotalSupplyNormalized: request.totalVariableDebt,
        tokenPriceInEth: request.priceInEth,
      })
    : new BigNumber(0)
}

function calculateSIncentivesAPY(request: CalculateSAPY): BigNumber {
  return request.hasEmission && !request.totalStableDebt.eq(0)
    ? calculateIncentivesAPY({
        emissionPerSecond: request.aEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenTotalSupplyNormalized: request.totalStableDebt,
        tokenPriceInEth: request.priceInEth,
      })
    : new BigNumber(0)
}

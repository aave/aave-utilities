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
  aEmissionPerSecond: string
  hasEmission: boolean
  rewardTokenPriceEth: string
  priceInEth: string
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
    aIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        aEmissionPerSecond: request.aEmissionPerSecond,
      },
      request.totalLiquidity,
    ),
    vIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        aEmissionPerSecond: request.aEmissionPerSecond,
      },
      request.totalVariableDebt,
    ),
    sIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        aEmissionPerSecond: request.aEmissionPerSecond,
      },
      request.totalStableDebt,
    ),
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

function _calculateIncentivesAPY(
  request: CalculateAPYBase,
  tokenTotalSupply: BigNumber,
): BigNumber {
  return request.hasEmission && !tokenTotalSupply.eq(0)
    ? calculateIncentivesAPY({
        emissionPerSecond: request.aEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenTotalSupply: tokenTotalSupply,
        tokenPriceInEth: request.priceInEth,
      })
    : new BigNumber(0)
}

import { BigNumber } from 'bignumber.js'
import { calculateIncentivesAPY } from './calculate-incentives-apy'

export interface CalculateAPYRequest {
  emissionEndTimestamp?: number | undefined
  currentTimestamp?: number | undefined
  depositIncentivesEmissionPerSecond: string
  variableDebtIncentivesEmissionPerSecond: string
  stableDebtIncentivesEmissionPerSecond: string
  totalLiquidity: BigNumber
  rewardTokenPriceEth?: string | undefined
  priceInEth: string
  totalVariableDebt: BigNumber
  totalStableDebt: BigNumber
}

export interface CalculateAPYResponse {
  depositIncentives: BigNumber
  variableDebtIncentives: BigNumber
  stableDebtIncentives: BigNumber
}

interface CalculateAPYBase {
  emissionPerSecond: string
  hasEmission: boolean
  // TODO > This might not be in ETH should change name but other work will apply for this change
  rewardTokenPriceEth: string
  // TODO > This might not be in ETH should change name but other work will apply for this change
  priceInEth: string
}

export function calculateAPYs(
  request: CalculateAPYRequest,
): CalculateAPYResponse {
  const hasEmission = _hasEmission(
    request.emissionEndTimestamp,
    request.currentTimestamp,
  )

  let rewardTokenPriceEth = '0'
  if (request.rewardTokenPriceEth) {
    rewardTokenPriceEth = request.rewardTokenPriceEth
  }

  return {
    depositIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        emissionPerSecond: request.depositIncentivesEmissionPerSecond,
      },
      request.totalLiquidity,
    ),
    variableDebtIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        emissionPerSecond: request.variableDebtIncentivesEmissionPerSecond,
      },
      request.totalVariableDebt,
    ),
    stableDebtIncentives: _calculateIncentivesAPY(
      {
        hasEmission,
        rewardTokenPriceEth,
        priceInEth: request.priceInEth,
        emissionPerSecond: request.stableDebtIncentivesEmissionPerSecond,
      },
      request.totalStableDebt,
    ),
  }
}

function _hasEmission(
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
        emissionPerSecond: request.emissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenTotalSupply,
        tokenPriceInEth: request.priceInEth,
      })
    : new BigNumber(0)
}

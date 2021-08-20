import BigNumber from 'bignumber.js'
import { normalizeBN } from 'math/src/bignumber'
import { ETH_DECIMALS, SECONDS_PER_YEAR } from 'math/src/constants'

export interface CalculateIncentivesAPYRequest {
  emissionPerSecond: string
  rewardTokenPriceInEth: string
  tokenTotalSupply: BigNumber
  tokenPriceInEth: string
}

export function calculateIncentivesAPY(
  request: CalculateIncentivesAPYRequest,
): BigNumber {
  const emissionPerSecondNormalized = normalizeBN(
    request.emissionPerSecond,
    ETH_DECIMALS,
  ).multipliedBy(request.rewardTokenPriceInEth)
  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  )

  const totalSupplyNormalized = request.tokenTotalSupply.multipliedBy(
    request.tokenPriceInEth,
  )

  return emissionPerYear.dividedBy(totalSupplyNormalized)
}

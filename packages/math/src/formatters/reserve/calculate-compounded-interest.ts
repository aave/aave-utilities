import BigNumber from 'bignumber.js'
import { BigNumberValue, valueToZDBigNumber } from 'math/src/bignumber'
import { SECONDS_PER_YEAR } from 'math/src/constants'
import { binomialApproximatedRayPow } from 'math/src/ray.math'

export interface CalculateCompoundedInterestRequest {
  rate: BigNumberValue
  currentTimestamp: number
  lastUpdateTimestamp: number
}

export default function calculateCompoundedInterest(
  request: CalculateCompoundedInterestRequest,
): BigNumber {
  const timeDelta = valueToZDBigNumber(
    request.currentTimestamp - request.lastUpdateTimestamp,
  )
  const ratePerSecond = valueToZDBigNumber(request.rate).dividedBy(
    SECONDS_PER_YEAR,
  )
  return binomialApproximatedRayPow(ratePerSecond, timeDelta)
}

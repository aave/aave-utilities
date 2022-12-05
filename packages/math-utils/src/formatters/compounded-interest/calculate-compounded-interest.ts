import BigNumber from 'bignumber.js';
import { valueToZDBigNumber } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';
import { binomialApproximatedRayPow, RAY, rayPow } from '../../ray.math';
import {
  CalculateCompoundedInterestRateRequest,
  CalculateCompoundedRateRequest,
} from './types';

export function calculateCompoundedInterestRate({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: CalculateCompoundedInterestRateRequest): BigNumber {
  const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp);
  const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR);
  return binomialApproximatedRayPow(ratePerSecond, timeDelta);
}

export function calculateCompoundedRate({
  rate,
  duration,
}: CalculateCompoundedRateRequest): BigNumber {
  return rayPow(
    valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    duration,
  ).minus(RAY);
}

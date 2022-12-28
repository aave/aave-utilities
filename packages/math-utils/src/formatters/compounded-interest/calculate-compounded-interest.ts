import BigNumber from 'bignumber.js';
import { valueToZDBigNumber } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';
import { RAY, rayPow } from '../../ray.math';
import { CalculateCompoundedRateRequest } from './types';

export function calculateCompoundedRate({
  rate,
  duration,
}: CalculateCompoundedRateRequest): BigNumber {
  return rayPow(
    valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    duration,
  ).minus(RAY);
}

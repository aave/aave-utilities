import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';

export function normalizedToUsd(
  value: BigNumber,
  marketRefPriceInUsd: BigNumberValue,
  marketRefCurrencyDecimals: number,
): BigNumber {
  return value
    .multipliedBy(marketRefPriceInUsd)
    .shiftedBy(marketRefCurrencyDecimals * -1);
}

import BigNumber from 'bignumber.js';
import { BigNumberValue, valueToBigNumber } from '../../bignumber';

interface NativeToUSD {
  amount: BigNumber;
  currencyDecimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  normalizedMarketReferencePriceInUsd: BigNumberValue;
}

export function nativeToUSD({
  amount,
  currencyDecimals,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  normalizedMarketReferencePriceInUsd,
}: NativeToUSD) {
  return valueToBigNumber(amount.toString())
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(normalizedMarketReferencePriceInUsd)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        currencyDecimals + marketReferenceCurrencyDecimals,
      ),
    )
    .toString();
}

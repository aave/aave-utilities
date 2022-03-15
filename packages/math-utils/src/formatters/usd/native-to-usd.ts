import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';

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
  console.log(`native to usd:
    amount: ${amount.toString()}
    currencyDecimals: ${currencyDecimals}
    priceInMarketRefCurr: ${priceInMarketReferenceCurrency.toString()}
    marketRefCurrDecimals: ${marketReferenceCurrencyDecimals}
    normlizedMarketRefPriceInUsd: ${normalizedMarketReferencePriceInUsd.toString()}
    currencyDecimals
  `);
  return amount
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(normalizedMarketReferencePriceInUsd)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        currencyDecimals + marketReferenceCurrencyDecimals,
      ),
    )
    .toString();
}

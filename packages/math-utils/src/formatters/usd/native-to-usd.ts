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
  const calcs = amount
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(normalizedMarketReferencePriceInUsd)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        Number(currencyDecimals) + Number(marketReferenceCurrencyDecimals),
      ),
    )
    .toString();
  console.log(`native to usd:
    amount: ${amount.toString()}
    currencyDecimals: ${currencyDecimals}
    priceInMarketRefCurr: ${priceInMarketReferenceCurrency.toString()}
    marketRefCurrDecimals: ${marketReferenceCurrencyDecimals}
    normlizedMarketRefPriceInUsd: ${normalizedMarketReferencePriceInUsd.toString()}
    --------
    calculated: ${calcs}
  `);

  return calcs;
}

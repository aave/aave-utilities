import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS } from '../../constants';

interface NativeToUSD {
  amount: BigNumber;
  currencyDecimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketRefCurrencyDecimals: number;
  marketRefPriceInUsd: BigNumberValue;
}

export function nativeToUSD({
  amount,
  currencyDecimals,
  priceInMarketReferenceCurrency,
  marketRefCurrencyDecimals,
  marketRefPriceInUsd,
}: NativeToUSD) {
  return amount
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        currencyDecimals + marketRefCurrencyDecimals + USD_DECIMALS,
      ),
    )
    .toString();
}

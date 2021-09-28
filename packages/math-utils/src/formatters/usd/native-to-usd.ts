import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS_FIXED } from '../../constants';

interface NativeToUSD {
  amount: BigNumber;
  currencyDecimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  usdPriceMarketReferenceCurrency: BigNumberValue;
}

export function nativeToUSD({
  amount,
  currencyDecimals,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  usdPriceMarketReferenceCurrency,
}: NativeToUSD) {
  return amount
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(usdPriceMarketReferenceCurrency)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        currencyDecimals + marketReferenceCurrencyDecimals + USD_DECIMALS_FIXED,
      ),
    )
    .toString();
}

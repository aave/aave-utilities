import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS } from '../../constants';

interface NativeToUSD {
  amount: BigNumber;
  currencyDecimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  marketReferencePriceInUsd: BigNumberValue;
}

export function nativeToUSD({
  amount,
  currencyDecimals,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  marketReferencePriceInUsd,
}: NativeToUSD) {
  return amount
    .multipliedBy(priceInMarketReferenceCurrency)
    .multipliedBy(marketReferencePriceInUsd)
    .dividedBy(
      new BigNumber(1).shiftedBy(
        currencyDecimals + marketReferenceCurrencyDecimals + USD_DECIMALS,
      ),
    )
    .toString();
}

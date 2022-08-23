import BigNumber from 'bignumber.js';
import { valueToBigNumber } from '../../bignumber';
export function nativeToUSD({ amount, currencyDecimals, priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals, normalizedMarketReferencePriceInUsd, }) {
    return valueToBigNumber(amount.toString())
        .multipliedBy(priceInMarketReferenceCurrency)
        .multipliedBy(normalizedMarketReferencePriceInUsd)
        .dividedBy(new BigNumber(1).shiftedBy(currencyDecimals + marketReferenceCurrencyDecimals))
        .toString();
}
//# sourceMappingURL=native-to-usd.js.map
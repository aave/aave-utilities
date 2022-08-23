import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
interface NativeToUSD {
  amount: BigNumber;
  currencyDecimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  normalizedMarketReferencePriceInUsd: BigNumberValue;
}
export declare function nativeToUSD({
  amount,
  currencyDecimals,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  normalizedMarketReferencePriceInUsd,
}: NativeToUSD): string;
export {};
//# sourceMappingURL=native-to-usd.d.ts.map

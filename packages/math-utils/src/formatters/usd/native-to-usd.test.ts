import BigNumber from 'bignumber.js';
import { nativeToUSD } from './native-to-usd';

describe('nativeToUSD', () => {
  it('should return 1$', () => {
    const dec18 = nativeToUSD({
      amount: new BigNumber(1).shiftedBy(18),
      currencyDecimals: 18,
      priceInMarketReferenceCurrency: new BigNumber(1).shiftedBy(18),
      marketReferenceCurrencyDecimals: 18,
      normalizedMarketReferencePriceInUsd: new BigNumber(1),
    });

    expect(dec18).toBe('1');

    const dec8 = nativeToUSD({
      amount: new BigNumber(1).shiftedBy(8),
      currencyDecimals: 8,
      priceInMarketReferenceCurrency: new BigNumber(1).shiftedBy(18),
      marketReferenceCurrencyDecimals: 18,
      normalizedMarketReferencePriceInUsd: new BigNumber(1),
    });

    expect(dec8).toBe('1');

    const price2 = nativeToUSD({
      amount: new BigNumber(1).shiftedBy(8),
      currencyDecimals: 8,
      priceInMarketReferenceCurrency: new BigNumber(1).shiftedBy(18),
      marketReferenceCurrencyDecimals: 18,
      normalizedMarketReferencePriceInUsd: new BigNumber(2),
    });

    expect(price2).toBe('2');

    const valuep5 = nativeToUSD({
      amount: new BigNumber(1).shiftedBy(8),
      currencyDecimals: 8,
      priceInMarketReferenceCurrency: new BigNumber(0.5).shiftedBy(18),
      marketReferenceCurrencyDecimals: 18,
      normalizedMarketReferencePriceInUsd: new BigNumber(2),
    });

    expect(valuep5).toBe('1');
  });
});

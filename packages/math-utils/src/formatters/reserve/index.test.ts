import BigNumber from 'bignumber.js';
import { normalize } from '../../bignumber';
import { ReserveMock } from '../../mocks';
import { formatReserve, formatReserveUSD } from './index';

describe('formatReserve', () => {
  it('should accrue over time', () => {
    const reserve = new ReserveMock().addVariableDebt(100);

    const first = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });

    const second = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp:
        reserve.reserve.lastUpdateTimestamp + 60 * 60 * 24 * 350,
    });

    expect(new BigNumber(second.totalDebt).gt(first.totalDebt)).toBe(true);
  });

  it('should properly calculate utilization', () => {
    const reserve = new ReserveMock();
    // no liquidity
    const zeroLiquidity = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(zeroLiquidity.utilizationRate).toEqual('0');

    // no borrows
    reserve.addLiquidity(100);
    const onlyLiquidity = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(onlyLiquidity.utilizationRate).toEqual('0');

    // borrows
    reserve.addVariableDebt(100);
    const fiftyPercent = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(fiftyPercent.utilizationRate).toEqual('0.5');
  });

  it('should calculate usd values', () => {
    // 100 liquidity with a marketPrice of 2, should be 200
    const reserve = new ReserveMock().addLiquidity(100);

    const formattedReserve = formatReserveUSD({
      reserve: {
        ...reserve.reserve,
        priceInMarketReferenceCurrency: normalize(2, -8), // 2
      },
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
      marketReferencePriceInUsd: normalize(1, -8), // 1
      marketReferenceCurrencyDecimals: 8,
    });

    expect(formattedReserve.availableLiquidityUSD).toBe('200');
    expect(formattedReserve.priceInUSD).toBe('2');
  });
});

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
    expect(zeroLiquidity.borrowUsageRatio).toEqual('0');
    expect(zeroLiquidity.supplyUsageRatio).toEqual('0');

    // no borrows
    reserve.addLiquidity(100);
    const onlyLiquidity = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(onlyLiquidity.borrowUsageRatio).toEqual('0');
    expect(onlyLiquidity.supplyUsageRatio).toEqual('0');

    // borrows
    reserve.addVariableDebt(100);
    const fiftyPercent = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(fiftyPercent.borrowUsageRatio).toEqual('0.5');
    expect(fiftyPercent.supplyUsageRatio).toEqual('0.5');

    // add unbacked supplies
    reserve.addUnbacked(200);
    const unbacked = formatReserve({
      reserve: reserve.reserve,
      currentTimestamp: reserve.reserve.lastUpdateTimestamp,
    });
    expect(unbacked.borrowUsageRatio).toEqual('0.5');
    expect(unbacked.supplyUsageRatio).toEqual('0.25');
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

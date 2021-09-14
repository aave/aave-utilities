import { formatUserReserve } from './format-user-reserve';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import { usdcUserReserve } from './user.mocks';
import { ComputedUserReserve } from './index';

describe('formatUserReserve', () => {
  const usdPriceMarketReferenceCurrency = 309519442156873;
  const currentTimestamp = 1629942229;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: usdcUserReserve,
      usdPriceMarketReferenceCurrency,
      currentTimestamp,
    },
  );

  const formattedReserve: ComputedUserReserve = formatUserReserve({
    reserve: rawUSDCSummary,
    marketReferenceCurrencyDecimals: 18,
  });

  it('should format a user reserve ', () => {
    expect(formattedReserve.underlyingBalance).toEqual('2441.092444');
    expect(formattedReserve.underlyingBalanceETH).toEqual(
      '0.75727728035882069805',
    );
    expect(formattedReserve.underlyingBalanceUSD).toEqual('2446.6226582788');
    expect(formattedReserve.totalBorrows).toEqual('52.314205');
    expect(formattedReserve.totalBorrowsETH).toEqual('0.01622894658656106985');
    expect(formattedReserve.totalBorrowsUSD).toEqual('52.4327211029');
    expect(formattedReserve.totalLiquidity).toEqual('5735355757.091039');
    expect(formattedReserve.totalStableDebt).toEqual('47382349.631778');
    expect(formattedReserve.totalVariableDebt).toEqual('5129957324.438749');
    expect(formattedReserve.usageAsCollateralEnabledOnUser).toEqual(true);
    expect(formattedReserve.variableBorrowIndex).toEqual('0');
    expect(formattedReserve.variableBorrows).toEqual('52.314205');
    expect(formattedReserve.variableBorrowsETH).toEqual(
      '0.01622894658656106985',
    );
    expect(formattedReserve.variableBorrowsUSD).toEqual('52.4327211029');
  });
});

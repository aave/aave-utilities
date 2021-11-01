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
      marketReferenceCurrencyDecimals: 18,
    },
  );

  const formattedReserve: ComputedUserReserve = formatUserReserve({
    reserve: rawUSDCSummary,
    marketReferenceCurrencyDecimals: 18,
  });

  it('should format a user reserve ', () => {
    expect(formattedReserve.underlyingBalance).toEqual('2441.092444');
    expect(formattedReserve.underlyingBalanceMarketReferenceCurrency).toEqual(
      '0.75727728035882069805',
    );
    expect(formattedReserve.underlyingBalanceUSD).toEqual(
      '2343920.41374736101038959119',
    );
    expect(formattedReserve.totalBorrows).toEqual('52.314205');
    expect(formattedReserve.totalBorrowsMarketReferenceCurrency).toEqual(
      '0.01622894658656106985',
    );
    expect(formattedReserve.totalBorrowsUSD).toEqual(
      '50231.74494266070576822784',
    );
    expect(formattedReserve.totalLiquidity).toEqual('5735355757.091039');
    expect(formattedReserve.totalStableDebt).toEqual('47382349.631778');
    expect(formattedReserve.totalVariableDebt).toEqual('5129957324.438749');
    expect(formattedReserve.usageAsCollateralEnabledOnUser).toEqual(true);
    expect(formattedReserve.variableBorrows).toEqual('52.314205');
    expect(formattedReserve.variableBorrowsMarketReferenceCurrency).toEqual(
      '0.01622894658656106985',
    );
    expect(formattedReserve.variableBorrowsUSD).toEqual(
      '50231.74494266070576822784',
    );
  });
});

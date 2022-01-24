import { UserReserveMock } from '../../mocks';
import { formatUserReserve } from './format-user-reserve';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

import { ComputedUserReserve } from './index';

describe('formatUserReserve', () => {
  // 1 reserve token = 10 marketReferenceCurrency tokens = 100 USD
  const marketReferencePriceInUsdNormalized = 10;
  const marketReferenceCurrencyDecimals = 18;
  const currentTimestamp = 1;
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(500)
    .variableBorrow(100)
    .stableBorrow(100);
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: {
        ...usdcUserMock.userReserve,
        reserve: usdcUserMock.reserve,
      },
      marketReferencePriceInUsdNormalized,
      currentTimestamp,
      marketReferenceCurrencyDecimals,
    },
  );

  const formattedReserve: ComputedUserReserve = formatUserReserve({
    reserve: rawUSDCSummary,
    marketReferenceCurrencyDecimals,
  });

  it('should format a user reserve ', () => {
    expect(formattedReserve.underlyingBalance).toEqual('500');
    expect(formattedReserve.underlyingBalanceMarketReferenceCurrency).toEqual(
      '5000',
    );
    expect(formattedReserve.underlyingBalanceUSD).toEqual('50000');
    expect(formattedReserve.totalBorrows).toEqual('200');
    expect(formattedReserve.totalBorrowsMarketReferenceCurrency).toEqual(
      '2000',
    );
    expect(formattedReserve.totalBorrowsUSD).toEqual('20000');
    expect(formattedReserve.usageAsCollateralEnabledOnUser).toEqual(true);
    expect(formattedReserve.variableBorrows).toEqual('100');
    expect(formattedReserve.variableBorrowsMarketReferenceCurrency).toEqual(
      '1000',
    );
    expect(formattedReserve.variableBorrowsUSD).toEqual('10000');
  });
});

import { UserReserveMock } from '../../mocks';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

describe('generateUserReserveSummary', () => {
  // 1 reserve token = 10 marketReferenceCurrency tokens = 100 USD
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
  const { decimals } = usdcUserMock.reserve;
  const marketReferenceCurrencyDecimals = 18;
  const rawSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: { ...usdcUserMock.userReserve, reserve: usdcUserMock.reserve },
    marketReferencePriceInUsdNormalized: 10,
    marketReferenceCurrencyDecimals,
    currentTimestamp: 1,
  });

  it('should generate a summary for an individual user reserve', () => {
    // Computed totals will be in BigNumber units, so expected values are normalized
    expect(rawSummary.underlyingBalance.shiftedBy(-decimals).toFixed()).toEqual(
      '200',
    );
    expect(
      rawSummary.underlyingBalanceMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toFixed(),
    ).toEqual('2000');
    expect(rawSummary.underlyingBalanceUSD.toFixed()).toEqual('20000');
    expect(rawSummary.variableBorrows.shiftedBy(-decimals).toFixed()).toEqual(
      '50',
    );
    expect(
      rawSummary.variableBorrowsMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toFixed(),
    ).toEqual('500');
    expect(rawSummary.variableBorrowsUSD.toFixed()).toEqual('5000');
    expect(rawSummary.stableBorrows.shiftedBy(-decimals).toFixed()).toEqual(
      '50',
    );
    expect(
      rawSummary.stableBorrowsMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toFixed(),
    ).toEqual('500');
    expect(rawSummary.stableBorrowsUSD.toFixed()).toEqual('5000');
    expect(rawSummary.totalBorrows.shiftedBy(-decimals).toFixed()).toEqual(
      '100',
    );
    expect(
      rawSummary.totalBorrowsMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toFixed(),
    ).toEqual('1000');
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual('10000');
  });
});

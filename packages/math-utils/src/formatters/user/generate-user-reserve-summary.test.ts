import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import { usdcUserReserve } from './user.mocks';

describe('generateUserReserveSummary', () => {
  const rawSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: usdcUserReserve,
    usdPriceMarketReferenceCurrency: 309519442156873,
    marketReferenceCurrencyDecimals: 18,
    currentTimestamp: 1629942229,
  });

  it('should generate a summary for an individual user reserve', () => {
    expect(rawSummary.underlyingBalance.toFixed()).toEqual('2441092444');
    expect(
      rawSummary.underlyingBalanceMarketReferenceCurrency.toFixed(),
    ).toEqual('757277280358820698.04594');
    expect(rawSummary.underlyingBalanceUSD.toFixed()).toEqual('24466226582788');
    expect(rawSummary.variableBorrows.toFixed()).toEqual('52314205');
    expect(rawSummary.variableBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '16228946586561069.850175',
    );
    expect(rawSummary.variableBorrowsUSD.toFixed()).toEqual('524327211029');
    expect(rawSummary.stableBorrows.toFixed()).toEqual('0');
    expect(rawSummary.stableBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '0',
    );
    expect(rawSummary.stableBorrowsUSD.toFixed()).toEqual('0');
    expect(rawSummary.totalBorrows.toFixed()).toEqual('52314205');
    expect(rawSummary.totalBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '16228946586561069.850175',
    );
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual('524327211029');
    expect(rawSummary.totalLiquidity.toFixed()).toEqual('5735355757091039');
    expect(rawSummary.totalStableDebt.toFixed()).toEqual('47382349631778');
    expect(rawSummary.totalVariableDebt.toFixed()).toEqual('5129957324438749');
  });
});

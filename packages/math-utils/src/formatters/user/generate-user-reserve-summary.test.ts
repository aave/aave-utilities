import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import { usdcUserReserveEthMarket } from './user.mocks';

describe('generateUserReserveSummary', () => {
  const rawSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: usdcUserReserveEthMarket,
    marketRefPriceInUsd: 4569742419970000000000,
    marketRefCurrencyDecimals: 18,
    currentTimestamp: 1629942229,
  });

  it('should generate a summary for an individual user reserve', () => {
    expect(rawSummary.underlyingBalance.toFixed()).toEqual('2441092444');
    expect(
      rawSummary.underlyingBalanceMarketReferenceCurrency.toFixed(),
    ).toEqual('537565709595797680');
    expect(rawSummary.underlyingBalanceUSD.toFixed()).toEqual(
      '2456536826661190740745.7116696',
    );
    expect(rawSummary.variableBorrows.toFixed()).toEqual('52314205');
    expect(rawSummary.variableBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '11520384163200100',
    );
    expect(rawSummary.variableBorrowsUSD.toFixed()).toEqual(
      '52645188204926088393.345997',
    );
    expect(rawSummary.stableBorrows.toFixed()).toEqual('0');
    expect(rawSummary.stableBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '0',
    );
    expect(rawSummary.stableBorrowsUSD.toFixed()).toEqual('0');
    expect(rawSummary.totalBorrows.toFixed()).toEqual('52314205');
    expect(rawSummary.totalBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '11520384163200100',
    );
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual(
      '52645188204926088393.345997',
    );
    expect(rawSummary.totalLiquidity.toFixed()).toEqual('5735355757091039');
    expect(rawSummary.totalStableDebt.toFixed()).toEqual('47382349631778');
    expect(rawSummary.totalVariableDebt.toFixed()).toEqual('5129957324438749');
  });
});

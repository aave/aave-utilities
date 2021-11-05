import { formatUserReserve } from './format-user-reserve';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import { usdcUserReserveEthMarket } from './user.mocks';
import { ComputedUserReserve } from './index';

describe('formatUserReserve', () => {
  const marketRefPriceInUsd = 4569.74241997;
  const currentTimestamp = 1629942229;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: usdcUserReserveEthMarket,
      marketRefPriceInUsd,
      currentTimestamp,
      marketRefCurrencyDecimals: 18,
    },
  );

  const formattedReserve: ComputedUserReserve = formatUserReserve({
    reserve: rawUSDCSummary,
    marketRefCurrencyDecimals: 18,
  });

  it('should format a user reserve ', () => {
    expect(formattedReserve.underlyingBalance).toEqual('2441.092444');
    expect(formattedReserve.underlyingBalanceMarketReferenceCurrency).toEqual(
      '0.53756570959579768',
    );
    expect(formattedReserve.underlyingBalanceUSD).toEqual(
      '2456.5368266611907407457116696',
    );
    expect(formattedReserve.totalBorrows).toEqual('52.314205');
    expect(formattedReserve.totalBorrowsMarketReferenceCurrency).toEqual(
      '0.0115203841632001',
    );
    expect(formattedReserve.totalBorrowsUSD).toEqual(
      '52.645188204926088393345997',
    );
    expect(formattedReserve.totalLiquidity).toEqual('5735355757.091039');
    expect(formattedReserve.totalStableDebt).toEqual('47382349.631778');
    expect(formattedReserve.totalVariableDebt).toEqual('5129957324.438749');
    expect(formattedReserve.usageAsCollateralEnabledOnUser).toEqual(true);
    expect(formattedReserve.variableBorrows).toEqual('52.314205');
    expect(formattedReserve.variableBorrowsMarketReferenceCurrency).toEqual(
      '0.0115203841632001',
    );
    expect(formattedReserve.variableBorrowsUSD).toEqual(
      '52.645188204926088393345997',
    );
  });
});

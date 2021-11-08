import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import {
  usdcUserReserveEthMarket,
  ethUserReserveEthMarket,
} from './user.mocks';

describe('calculateUserReserveTotals', () => {
  const marketRefPriceInUsd = 309519442156873;
  const currentTimestamp = 1629942229;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: usdcUserReserveEthMarket,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: ethUserReserveEthMarket,
    marketRefPriceInUsd,
    marketRefCurrencyDecimals: 18,
    currentTimestamp,
  });

  it('should compute totals from user reserve array', () => {
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
    });
    expect(
      userReserveTotals.totalLiquidityMarketReferenceCurrency.toFixed(),
    ).toEqual('11819951652201573862');
    expect(
      userReserveTotals.totalBorrowsMarketReferenceCurrency.toFixed(),
    ).toEqual('1788570685417553847');
    expect(
      userReserveTotals.totalCollateralMarketReferenceCurrency.toFixed(),
    ).toEqual('11819951652201573862');
    expect(userReserveTotals.currentLtv.toFixed()).toEqual('8000');
    expect(userReserveTotals.currentLiquidationThreshold.toFixed()).toEqual(
      '8261.3698796199320993174',
    );
  });

  it('should not compute collateral or LTV if usageAsCollateralEnabledOnUser is false', () => {
    const rawUSDCSummary: UserReserveSummaryResponse =
      generateUserReserveSummary({
        userReserve: {
          ...usdcUserReserveEthMarket,
          usageAsCollateralEnabledOnUser: false,
        },
        marketRefPriceInUsd,
        marketRefCurrencyDecimals: 18,
        currentTimestamp,
      });
    const rawETHSummary: UserReserveSummaryResponse =
      generateUserReserveSummary({
        userReserve: {
          ...ethUserReserveEthMarket,
          usageAsCollateralEnabledOnUser: false,
        },
        marketRefPriceInUsd,
        marketRefCurrencyDecimals: 18,
        currentTimestamp,
      });
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
    });
    expect(
      userReserveTotals.totalCollateralMarketReferenceCurrency.toFixed(),
    ).toEqual('0');
    expect(userReserveTotals.currentLtv.toFixed()).toEqual('0');
    expect(userReserveTotals.currentLiquidationThreshold.toFixed()).toEqual(
      '0',
    );
  });
});

import { UserReserveMock } from '../../mocks';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

describe('calculateUserReserveTotals', () => {
  // 1 reserve token = 10 marketReferenceCurrency tokens = 100 USD
  const usdcReserveMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(100);
  const marketReferencePriceInUsdNormalized = 10;
  const marketReferenceCurrencyDecimals = 18;
  const currentTimestamp = 1;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: {
        ...usdcReserveMock.userReserve,
        reserve: { ...usdcReserveMock.reserve },
      },
      marketReferencePriceInUsdNormalized,
      marketReferenceCurrencyDecimals,
      currentTimestamp,
    },
  );

  const ethReserveMock = new UserReserveMock({ decimals: 18 })
    .supply(200)
    .stableBorrow(100);
  const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: {
      ...ethReserveMock.userReserve,
      reserve: {
        ...ethReserveMock.reserve,
        debtCeiling: '1',
      },
    },
    marketReferencePriceInUsdNormalized,
    marketReferenceCurrencyDecimals,
    currentTimestamp,
  });

  it('should compute totals from user reserve array', () => {
    // Computed totals will be in BigNumber units, so expected values are normalized
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
      userEmodeCategoryId: 0,
    });
    expect(
      userReserveTotals.totalLiquidityMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toString(),
    ).toEqual('4000');
    expect(
      userReserveTotals.totalBorrowsMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toString(),
    ).toEqual('2000');
    expect(
      userReserveTotals.totalCollateralMarketReferenceCurrency
        .shiftedBy(-marketReferenceCurrencyDecimals)
        .toString(),
    ).toEqual('4000');
    expect(userReserveTotals.currentLtv.toFixed()).toEqual('5000');
    expect(userReserveTotals.currentLiquidationThreshold.toFixed()).toEqual(
      '6000',
    );
    const userReserveEModeTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
      userEmodeCategoryId: 1,
    });
    expect(userReserveEModeTotals.currentLtv.toFixed()).toEqual('6000');
    expect(
      userReserveEModeTotals.currentLiquidationThreshold.toFixed(),
    ).toEqual('7000');
  });

  it('should not compute collateral or LTV if usageAsCollateralEnabledOnUser is false', () => {
    const rawUSDCSummary: UserReserveSummaryResponse =
      generateUserReserveSummary({
        userReserve: {
          ...usdcReserveMock.userReserve,
          reserve: usdcReserveMock.reserve,
          usageAsCollateralEnabledOnUser: false,
        },
        marketReferencePriceInUsdNormalized,
        marketReferenceCurrencyDecimals,
        currentTimestamp,
      });
    const rawETHSummary: UserReserveSummaryResponse =
      generateUserReserveSummary({
        userReserve: {
          ...ethReserveMock.userReserve,
          reserve: ethReserveMock.reserve,
          usageAsCollateralEnabledOnUser: false,
        },
        marketReferencePriceInUsdNormalized,
        marketReferenceCurrencyDecimals,
        currentTimestamp,
      });
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
      userEmodeCategoryId: 0,
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

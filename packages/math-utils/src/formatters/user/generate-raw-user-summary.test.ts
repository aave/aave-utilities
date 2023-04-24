import { normalize } from '../../bignumber';
import { UserReserveMock } from '../../mocks';
import {
  generateRawUserSummary,
  RawUserSummaryResponse,
} from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

describe('generateRawUserSummary', () => {
  // 1 reserve token = 10 marketReferenceCurrency tokens = 100 USD
  const marketReferencePriceInUsd = 10 ** 19;
  const marketReferencePriceInUsdNormalized = 10;
  const marketReferenceCurrencyDecimals = 18;
  const currentTimestamp = 1;
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(100);
  const ethUserMock = new UserReserveMock().supply(200).variableBorrow(100);
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: {
        ...usdcUserMock.userReserve,
        reserve: usdcUserMock.reserve,
      },
      marketReferencePriceInUsdNormalized,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: {
      ...ethUserMock.userReserve,
      reserve: ethUserMock.reserve,
    },
    marketReferencePriceInUsdNormalized,
    marketReferenceCurrencyDecimals: 18,
    currentTimestamp,
  });

  const rawSummary: RawUserSummaryResponse = generateRawUserSummary({
    userReserves: [rawUSDCSummary, rawETHSummary],
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    userEmodeCategoryId: 0,
  });

  const rawUSDCSummaryModified: UserReserveSummaryResponse =
    generateUserReserveSummary({
      userReserve: {
        ...usdcUserMock.userReserve,
        scaledATokenBalance: (
          Number(usdcUserMock.userReserve.scaledATokenBalance) * 2
        ).toString(),
        reserve: usdcUserMock.reserve,
      },
      marketReferencePriceInUsdNormalized,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    });

  const rawETHSummaryModified: UserReserveSummaryResponse =
    generateUserReserveSummary({
      userReserve: {
        ...ethUserMock.userReserve,
        scaledVariableDebt: (
          Number(ethUserMock.userReserve.scaledVariableDebt) * 2
        ).toString(),
        reserve: {
          ...ethUserMock.reserve,
          debtCeiling: '100000000000000000000000000',
        },
      },
      marketReferencePriceInUsdNormalized,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    });

  const rawSummaryCollateralChange: RawUserSummaryResponse =
    generateRawUserSummary({
      userReserves: [rawUSDCSummaryModified, rawETHSummary],
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      userEmodeCategoryId: 0,
    });

  const rawSummaryEMode: RawUserSummaryResponse = generateRawUserSummary({
    userReserves: [rawUSDCSummary, rawETHSummary],
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    userEmodeCategoryId: 1,
  });

  const rawSummaryBorrowChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummary, rawETHSummaryModified],
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      userEmodeCategoryId: 0,
    },
  );

  it('should generate the correct user summary ', () => {
    // Computed totals will be in BigNumber units, so expected values are normalized
    expect(
      normalize(rawSummary.totalLiquidityUSD, marketReferenceCurrencyDecimals),
    ).toEqual('40000');
    expect(
      normalize(rawSummary.totalCollateralUSD, marketReferenceCurrencyDecimals),
    ).toEqual('40000');
    expect(
      normalize(rawSummary.totalBorrowsUSD, marketReferenceCurrencyDecimals),
    ).toEqual('20000');
    expect(
      normalize(
        rawSummary.totalLiquidityMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('4000');
    expect(
      normalize(
        rawSummary.totalCollateralMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('4000');
    expect(
      normalize(
        rawSummary.totalBorrowsMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('2000');
    expect(
      normalize(
        rawSummary.availableBorrowsMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('0');
    expect(
      normalize(
        rawSummary.availableBorrowsUSD,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('0');
    expect(rawSummary.currentLoanToValue.toFixed()).toEqual('5000');
    expect(rawSummary.currentLiquidationThreshold.toFixed()).toEqual('6000');
    expect(rawSummary.healthFactor.toFixed()).toEqual('1.2');
  });

  it('should not allow negative available borrows if debtCeiling is exceeded ', () => {
    const rawETHSummaryDebtCeilingExceeded: UserReserveSummaryResponse =
      generateUserReserveSummary({
        userReserve: {
          ...ethUserMock.userReserve,
          reserve: {
            ...ethUserMock.reserve,
            debtCeiling: '100',
            isolationModeTotalDebt: '101',
          },
        },
        marketReferencePriceInUsdNormalized,
        marketReferenceCurrencyDecimals: 18,
        currentTimestamp,
      });

    const rawSummaryDebtCeilingExceeded: RawUserSummaryResponse =
      generateRawUserSummary({
        userReserves: [rawETHSummaryDebtCeilingExceeded],
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        userEmodeCategoryId: 0,
      });

    expect(
      normalize(
        rawSummaryDebtCeilingExceeded.availableBorrowsMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('0');
  });

  it('should generate the correct user summary for user in stablecoin eMode', () => {
    expect(
      normalize(
        rawSummaryEMode.availableBorrowsMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('400');
    expect(
      normalize(
        rawSummaryEMode.availableBorrowsUSD,
        marketReferenceCurrencyDecimals,
      ),
    ).toEqual('4000');
    expect(rawSummaryEMode.currentLoanToValue.toFixed()).toEqual('6000');
    expect(rawSummaryEMode.currentLiquidationThreshold.toFixed()).toEqual(
      '7000',
    );
    expect(rawSummaryEMode.healthFactor.toFixed()).toEqual('1.4');
  });

  it('should increase health factor on collateral increase', () => {
    expect(
      rawSummary.healthFactor.lt(rawSummaryCollateralChange.healthFactor),
    ).toEqual(true);

    expect(
      rawSummary.healthFactor.lt(rawSummaryCollateralChange.healthFactor),
    ).toEqual(true);
  });

  it('should decrease health factor on variable debt increase', () => {
    expect(
      rawSummary.healthFactor.gt(rawSummaryBorrowChange.healthFactor),
    ).toEqual(true);
  });
});

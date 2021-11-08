import {
  generateRawUserSummary,
  RawUserSummaryResponse,
} from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import {
  usdcUserReserveEthMarket,
  ethUserReserveEthMarket,
} from './user.mocks';

describe('generateRawUserSummary', () => {
  const marketRefPriceInUsd = 4569742419970000000000;
  const marketRefCurrencyDecimals = 18;
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

  const rawSummary: RawUserSummaryResponse = generateRawUserSummary({
    userReserves: [rawUSDCSummary, rawETHSummary],
    marketRefPriceInUsd,
    marketRefCurrencyDecimals,
  });

  const rawUSDCSummaryModified: UserReserveSummaryResponse =
    generateUserReserveSummary({
      userReserve: {
        ...usdcUserReserveEthMarket,
        scaledATokenBalance: '2528085146',
      },
      marketRefPriceInUsd,
      marketRefCurrencyDecimals: 18,
      currentTimestamp,
    });

  const rawETHSummaryModified: UserReserveSummaryResponse =
    generateUserReserveSummary({
      userReserve: {
        ...ethUserReserveEthMarket,
        scaledVariableDebt: '1961463562232346784',
      },
      marketRefPriceInUsd,
      marketRefCurrencyDecimals: 18,
      currentTimestamp,
    });

  const rawSummaryCollateralChange: RawUserSummaryResponse =
    generateRawUserSummary({
      userReserves: [rawUSDCSummaryModified, rawETHSummary],
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    });

  const rawSummaryBorrowChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummary, rawETHSummaryModified],
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    },
  );

  it('should generate the correct user summary ', () => {
    expect(rawSummary.totalLiquidityUSD.toFixed()).toEqual(
      '54014134467060019918378.57882414',
    );
    expect(rawSummary.totalCollateralUSD.toFixed()).toEqual(
      '54014134467060019918378.57882414',
    );
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual(
      '8173307332267414106707.56312459',
    );
    expect(rawSummary.totalLiquidityMarketReferenceCurrency.toFixed()).toEqual(
      '11819951652201573862',
    );
    expect(rawSummary.totalCollateralMarketReferenceCurrency.toFixed()).toEqual(
      '11819951652201573862',
    );
    expect(rawSummary.totalBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '1788570685417553847',
    );
    expect(
      rawSummary.availableBorrowsMarketReferenceCurrency.toFixed(),
    ).toEqual('7667390636343705242.6');
    expect(rawSummary.availableBorrowsUSD.toFixed()).toEqual(
      '35038000241380601827995.299934722',
    );
    expect(rawSummary.currentLoanToValue.toFixed()).toEqual('8000');
    expect(rawSummary.currentLiquidationThreshold.toFixed()).toEqual(
      '8261.3698796199320993174',
    );
    expect(rawSummary.healthFactor.toFixed()).toEqual('5.45961047859090456897');
  });

  it('should increase health factor on collateral increase', () => {
    expect(
      rawSummary.currentLiquidationThreshold.lt(
        rawSummaryCollateralChange.currentLiquidationThreshold,
      ),
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

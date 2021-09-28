import {
  generateRawUserSummary,
  RawUserSummaryResponse,
} from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import {
  usdcUserReserve,
  ethUserReserve,
  xSushiUserReserve,
} from './user.mocks';

describe('generateRawUserSummary', () => {
  const usdPriceMarketReferenceCurrency = 309519442156873;
  const currentTimestamp = 1629942229;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: usdcUserReserve,
      usdPriceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawXSUSHISummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: xSushiUserReserve,
      usdPriceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: ethUserReserve,
    usdPriceMarketReferenceCurrency,
    marketReferenceCurrencyDecimals: 18,
    currentTimestamp,
  });

  const rawSummary: RawUserSummaryResponse = generateRawUserSummary({
    userReserves: [rawUSDCSummary, rawXSUSHISummary, rawETHSummary],
    usdPriceMarketReferenceCurrency,
  });

  const rawUSDCSummaryModified: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: { ...usdcUserReserve, scaledATokenBalance: '2528085146' },
      usdPriceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawETHSummaryModified: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: {
        ...ethUserReserve,
        scaledVariableDebt: '1961463562232346784',
      },
      usdPriceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals: 18,
      currentTimestamp,
    },
  );

  const rawSummaryCollateralChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummaryModified, rawXSUSHISummary, rawETHSummary],
      usdPriceMarketReferenceCurrency,
    },
  );

  const rawSummaryBorrowChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummary, rawXSUSHISummary, rawETHSummaryModified],
      usdPriceMarketReferenceCurrency,
    },
  );

  it('should generate the correct user summary ', () => {
    expect(rawSummary.totalLiquidityUSD.toFixed()).toEqual('176460370343148');
    expect(rawSummary.totalCollateralUSD.toFixed()).toEqual('176460370343148');
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual('57937531656962');
    expect(rawSummary.totalLiquidityMarketReferenceCurrency.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(rawSummary.totalCollateralMarketReferenceCurrency.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(rawSummary.totalBorrowsMarketReferenceCurrency.toFixed()).toEqual(
      '1793279247840914816.850175',
    );
    expect(
      rawSummary.availableBorrowsMarketReferenceCurrency.toFixed(),
    ).toEqual('43720934944528524.254955658577905715676693391313689916981584');
    expect(rawSummary.currentLoanToValue.toFixed()).toEqual(
      '3363.36560928956611758556',
    );
    expect(rawSummary.currentLiquidationThreshold.toFixed()).toEqual(
      '5123.32086463568964151797',
    );
    expect(rawSummary.healthFactor.toFixed()).toEqual('1.56041010257942924677');
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

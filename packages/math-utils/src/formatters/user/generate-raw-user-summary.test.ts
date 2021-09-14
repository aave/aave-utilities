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
  const usdPriceEth = 309519442156873;
  const currentTimestamp = 1629942229;
  const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: usdcUserReserve,
      usdPriceEth,
      currentTimestamp,
    },
  );

  const rawXSUSHISummary: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: xSushiUserReserve,
      usdPriceEth,
      currentTimestamp,
    },
  );

  const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: ethUserReserve,
    usdPriceEth,
    currentTimestamp,
  });

  const rawSummary: RawUserSummaryResponse = generateRawUserSummary({
    userReserves: [rawUSDCSummary, rawXSUSHISummary, rawETHSummary],
    usdPriceEth,
  });

  const rawUSDCSummaryModified: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: { ...usdcUserReserve, scaledATokenBalance: '2528085146' },
      usdPriceEth,
      currentTimestamp,
    },
  );

  const rawETHSummaryModified: UserReserveSummaryResponse = generateUserReserveSummary(
    {
      userReserve: {
        ...ethUserReserve,
        scaledVariableDebt: '1961463562232346784',
      },
      usdPriceEth,
      currentTimestamp,
    },
  );

  const rawSummaryCollateralChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummaryModified, rawXSUSHISummary, rawETHSummary],
      usdPriceEth,
    },
  );

  const rawSummaryBorrowChange: RawUserSummaryResponse = generateRawUserSummary(
    {
      userReserves: [rawUSDCSummary, rawXSUSHISummary, rawETHSummaryModified],
      usdPriceEth,
    },
  );

  it('should generate the correct user summary ', () => {
    expect(rawSummary.totalLiquidityUSD.toFixed()).toEqual('176460370343148');
    expect(rawSummary.totalCollateralUSD.toFixed()).toEqual('176460370343148');
    expect(rawSummary.totalBorrowsUSD.toFixed()).toEqual('57937531656962');
    expect(rawSummary.totalLiquidityETH.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(rawSummary.totalCollateralETH.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(rawSummary.totalBorrowsETH.toFixed()).toEqual(
      '1793279247840914816.850175',
    );
    expect(rawSummary.availableBorrowsETH.toFixed()).toEqual(
      '43720934944528524.254955658577905715676693391313689916981584',
    );
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

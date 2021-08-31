import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import {
  usdcUserReserve,
  xSushiUserReserve,
  ethUserReserve,
} from './user.mocks';

describe('calculateUserReserveTotals', () => {
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

  it('should compute totals from user reserve array', () => {
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawXSUSHISummary, rawETHSummary],
    });
    expect(userReserveTotals.totalLiquidityETH.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(userReserveTotals.totalBorrowsETH.toFixed()).toEqual(
      '1793279247840914816.850175',
    );
    expect(userReserveTotals.totalCollateralETH.toFixed()).toEqual(
      '5461791539140663086.919458539672351564',
    );
    expect(userReserveTotals.currentLtv.toFixed()).toEqual(
      '3363.36560928956611758556',
    );
    expect(userReserveTotals.currentLiquidationThreshold.toFixed()).toEqual(
      '5123.32086463568964151797',
    );
  });

  it('should not compute collateral or LTV if usageAsCollateralEnabledOnUser is false', () => {
    const rawUSDCSummary: UserReserveSummaryResponse = generateUserReserveSummary(
      {
        userReserve: {
          ...usdcUserReserve,
          usageAsCollateralEnabledOnUser: false,
        },
        usdPriceEth,
        currentTimestamp,
      },
    );
    const rawETHSummary: UserReserveSummaryResponse = generateUserReserveSummary(
      {
        userReserve: {
          ...ethUserReserve,
          usageAsCollateralEnabledOnUser: false,
        },
        usdPriceEth,
        currentTimestamp,
      },
    );
    const userReserveTotals = calculateUserReserveTotals({
      userReserves: [rawUSDCSummary, rawETHSummary],
    });
    expect(userReserveTotals.totalCollateralETH.toFixed()).toEqual('0');
    expect(userReserveTotals.currentLtv.toFixed()).toEqual('0');
    expect(userReserveTotals.currentLiquidationThreshold.toFixed()).toEqual(
      '0',
    );
  });
});

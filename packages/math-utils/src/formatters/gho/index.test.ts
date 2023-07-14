import { GhoMock, UserReserveMock } from '../../mocks';
import { formatUserSummary, FormatUserSummaryRequest } from '../user';
import {
  formatGhoReserveData,
  formatGhoUserData,
  formatUserSummaryWithDiscount,
} from './index';

describe('formatGhoData', () => {
  const ghoMock = new GhoMock();
  it('properly formats gho reserve data', () => {
    const result = formatGhoReserveData({
      ghoReserveData: ghoMock.ghoReserveData,
    });

    expect(result.aaveFacilitatorBucketLevel).toEqual(10);
    expect(result.aaveFacilitatorBucketMaxCapacity).toEqual(100);
    expect(result.aaveFacilitatorRemainingCapacity).toEqual(90);
    expect(result.aaveFacilitatorMintedPercent).toEqual(0.1);
    expect(result.ghoBaseVariableBorrowRate).toEqual(1); // 10%
    expect(result.ghoVariableBorrowAPY).toBeCloseTo(1.71828, 5); // 17.18%
    expect(result.ghoDiscountedPerToken).toEqual(100);
    expect(result.ghoDiscountRate).toEqual(0.2);
    expect(result.ghoMinDebtTokenBalanceForDiscount).toEqual(1);
    expect(result.ghoMinDiscountTokenBalanceForDiscount).toEqual(1);
    expect(result.ghoBorrowAPYWithMaxDiscount).toEqual(1.3746254282887769); // 17.18% - 20% discount = 13.75%
  });

  it('properly formats gho user data', () => {
    const result = formatGhoUserData({
      ghoReserveData: ghoMock.ghoReserveData,
      ghoUserData: ghoMock.ghoUserData,
      currentTimestamp: 2,
    });

    expect(result.userGhoDiscountPercent).toEqual(0.1);
    expect(result.userGhoAvailableToBorrowAtDiscount).toEqual(10000);
    expect(result.userDiscountTokenBalance).toEqual(100);
    expect(result.userGhoBorrowBalance).toEqual(1.1000000063419584);
    expect(result.userDiscountedGhoInterest).toEqual(0.9000000570776255);
  });

  it('calculates the amount of GHO available to borrow at discount', () => {
    const result = formatGhoUserData({
      ghoReserveData: ghoMock.ghoReserveData,
      ghoUserData: {
        ...ghoMock.ghoUserData,
        userDiscountTokenBalance: (10 ** 17).toString(),
      },
      currentTimestamp: 2,
    });

    expect(result.userGhoDiscountPercent).toEqual(0.1);
    expect(result.userGhoAvailableToBorrowAtDiscount).toEqual(0);
    expect(result.userDiscountTokenBalance).toEqual(0.1);
    expect(result.userGhoBorrowBalance).toEqual(1.1000000063419584);
    expect(result.userDiscountedGhoInterest).toEqual(0.9000000570776255);
  });

  it('properly formats user summary with GHO discount', () => {
    const usdcUserMock = new UserReserveMock({ decimals: 6 })
      .supply(200)
      .variableBorrow(50)
      .stableBorrow(10);
    const marketReferencePriceInUsd = 10 ** 9; // 10
    const marketReferenceCurrencyDecimals = 18;
    const request: FormatUserSummaryRequest = {
      userReserves: [usdcUserMock.userReserve],
      formattedReserves: [usdcUserMock.reserve],
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      currentTimestamp: 1,
      userEmodeCategoryId: 0,
    };
    const userSummary = formatUserSummary(request);

    expect(userSummary.totalBorrowsMarketReferenceCurrency).toEqual('600');
    expect(userSummary.totalBorrowsUSD).toEqual('6000');
    expect(userSummary.netWorthUSD).toEqual('14000');
    expect(userSummary.availableBorrowsUSD).toEqual('4000');
    expect(userSummary.availableBorrowsMarketReferenceCurrency).toEqual('400');
    expect(userSummary.healthFactor).toEqual('2');

    const result = formatUserSummaryWithDiscount({
      userGhoDiscountedInterest: 100,
      user: userSummary,
      marketReferenceCurrencyPriceUSD: 10,
    });

    expect(result.totalBorrowsMarketReferenceCurrency).toEqual('590');
    expect(result.totalBorrowsUSD).toEqual('5900');
    expect(result.netWorthUSD).toEqual('14100');
    expect(result.availableBorrowsUSD).toEqual('4100');
    expect(result.availableBorrowsMarketReferenceCurrency).toEqual('410');
    expect(result.healthFactor).toEqual('2.0338983050847457');
  });
});

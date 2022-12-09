import { GhoMock } from '../../mocks';
import { formatGhoReserveData, formatGhoUserData } from './index';

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
    expect(result.ghoDiscountLockPeriod).toEqual(1000);
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

    expect(result.userGhoDiscountRate).toEqual(0.1);
    expect(result.userGhoAvailableToBorrowAtDiscount).toEqual(10000);
    expect(result.userDiscountTokenBalance).toEqual(100);
    expect(result.userDiscountLockPeriodEndTimestamp).toEqual(1);
    expect(result.userGhoBorrowBalance).toEqual(1.1000000063419584);
    expect(result.userDiscountedGhoInterest).toEqual(0.9000000570776255);
  });
});

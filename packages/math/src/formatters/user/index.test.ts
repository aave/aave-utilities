import BigNumber from 'bignumber.js';
import { formatUserSummaryRequest } from './user.mocks';
import {
  ComputedUserReserve,
  formatUserSummary,
  FormatUserSummaryRequest,
} from './index';

describe('formatUserSummary', () => {
  const request: FormatUserSummaryRequest = formatUserSummaryRequest;

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityETH).toEqual('5.46179153914066308692');
    expect(result.totalLiquidityUSD).toEqual('17646.0370343148');
    expect(result.totalCollateralETH).toEqual('5.46179153914066308692');
    expect(result.totalCollateralUSD).toEqual('17646.0370343148');
    expect(result.totalBorrowsETH).toEqual('1.79327924784091481685');
    expect(result.totalBorrowsUSD).toEqual('5793.7531656962');
    expect(result.availableBorrowsETH).toEqual('0.04372093494452852425');
    expect(result.currentLoanToValue).toEqual('0.33633656092895661176');
    expect(result.currentLiquidationThreshold).toEqual(
      '0.51233208646356896415',
    );
    expect(result.healthFactor).toEqual('1.56041010257942924677');
  });

  it('should increase debt over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1629942229,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 1629942230,
    });

    expect(
      new BigNumber(second.totalBorrowsETH).gt(first.totalBorrowsETH),
    ).toEqual(true);
  });

  it('should increase collateral over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1629942229,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 1629942230,
    });

    expect(
      new BigNumber(second.totalCollateralETH).gt(first.totalCollateralETH),
    ).toEqual(true);
  });

  it('should sort by symbol', () => {
    const isSorted = (arr: ComputedUserReserve[]) => {
      if (arr.length <= 1) {
        return true;
      }

      for (let i = 1; i < arr.length; i++) {
        const condition = arr[i].reserve.symbol < arr[i - 1].reserve.symbol;
        if (condition) {
          return false;
        }
      }

      return true;
    };

    const result = formatUserSummary(request);
    expect(isSorted(result.userReservesData)).toEqual(true);
  });
});

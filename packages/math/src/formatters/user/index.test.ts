import BigNumber from 'bignumber.js';
import { formatUserSummary, FormatUserSummaryRequest } from './index';
import { formatUserSummaryRequest } from './user.mocks';

describe('formatUserSummary', () => {
  const request: FormatUserSummaryRequest = formatUserSummaryRequest;

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(Number(result.totalLiquidityETH)).toBeCloseTo(5.461791537890080662);
    expect(Number(result.totalLiquidityUSD)).toBeCloseTo(17646.0370302744);
    expect(Number(result.totalCollateralETH)).toBeCloseTo(5.461791537890080662);
    expect(Number(result.totalCollateralUSD)).toBeCloseTo(17646.0370302744);
    expect(Number(result.totalBorrowsETH)).toBeCloseTo(1.793279247517556825);
    expect(Number(result.totalBorrowsUSD)).toBeCloseTo(5793.7531646515);
    expect(Number(result.availableBorrowsETH)).toBeCloseTo(
      0.043521246674877301,
    );
    expect(Number(result.currentLoanToValue)).toBeCloseTo(0.3363);
    expect(Number(result.currentLiquidationThreshold)).toBeCloseTo(0.5123);
    expect(Number(result.healthFactor)).toBeCloseTo(1.56031237674471231051);
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
      new BigNumber(second.totalBorrowsETH).gte(first.totalBorrowsETH),
    ).toBe(true);
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
      new BigNumber(second.totalCollateralETH).gte(first.totalCollateralETH),
    ).toBe(true);
  });
});

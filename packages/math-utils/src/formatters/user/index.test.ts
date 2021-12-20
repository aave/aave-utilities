import BigNumber from 'bignumber.js';
import { UserReserveMock } from '../../mocks';
import {
  reserveIncentives,
  userIncentives,
} from '../incentive/incentive.mocks';
import {
  formatUserSummary,
  formatUserSummaryAndIncentives,
  FormatUserSummaryAndIncentivesRequest,
  FormatUserSummaryRequest,
} from './index';

describe('formatUserSummaryETHMarket', () => {
  const ethUserMock = new UserReserveMock({ decimals: 18 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
  const marketReferencePriceInUsd = 10 ** 9; // 10
  const marketReferenceCurrencyDecimals = 18;
  const request: FormatUserSummaryRequest = {
    userReserves: [ethUserMock.userReserve, usdcUserMock.userReserve],
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    currentTimestamp: 1,
    userEmodeCategoryId: 0,
  };

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityMarketReferenceCurrency).toEqual('4000');
    expect(result.totalLiquidityUSD).toEqual('40000');
    expect(result.totalCollateralMarketReferenceCurrency).toEqual('4000');
    expect(result.totalCollateralUSD).toEqual('40000');
    expect(result.totalBorrowsMarketReferenceCurrency).toEqual('2000');
    expect(result.totalBorrowsUSD).toEqual('20000');
    expect(result.availableBorrowsMarketReferenceCurrency).toEqual('0');
    expect(result.availableBorrowsUSD).toEqual('0');
    expect(result.currentLoanToValue).toEqual('0.5');
    expect(result.currentLiquidationThreshold).toEqual('0.6');
    expect(result.healthFactor).toEqual('1.2');
  });

  it('should increase debt over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 2,
    });

    expect(
      new BigNumber(second.totalBorrowsMarketReferenceCurrency).gt(
        first.totalBorrowsMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });

  it('should increase collateral over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 2000,
    });

    expect(
      new BigNumber(second.totalCollateralMarketReferenceCurrency).gt(
        first.totalCollateralMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });

  it('should increase debt over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 2,
    });

    expect(
      new BigNumber(second.totalBorrowsMarketReferenceCurrency).gt(
        first.totalBorrowsMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });

  it('should increase collateral over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 2,
    });

    expect(
      new BigNumber(second.totalCollateralMarketReferenceCurrency).gt(
        first.totalCollateralMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });
});

describe('formatUserSummaryAndIncentives', () => {
  const ethUserMock = new UserReserveMock({ decimals: 18 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
  const marketReferencePriceInUsd = 10 ** 18;
  const marketReferenceCurrencyDecimals = 18;
  const request: FormatUserSummaryAndIncentivesRequest = {
    userReserves: [ethUserMock.userReserve, usdcUserMock.userReserve],
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    currentTimestamp: 1,
    userEmodeCategoryId: 0,
    reserveIncentives,
    userIncentives,
  };

  it('should calculate correct user incentives', () => {
    const summary = formatUserSummaryAndIncentives(request);
    expect(
      summary.calculatedUserIncentives[
        '0x4da27a545c0c5b758a6ba100e3a049001de870f5'
      ].claimableRewards.toString(),
    ).toEqual('43921819137644870');
  });
});

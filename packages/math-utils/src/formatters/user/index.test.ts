import BigNumber from 'bignumber.js';
import { formatReserves } from '../..';
import {
  ReserveIncentiveMock,
  ReserveMock,
  UserIncentiveMock,
  UserReserveMock,
} from '../../mocks';
import {
  formatUserSummary,
  formatUserSummaryAndIncentives,
  FormatUserSummaryAndIncentivesRequest,
  FormatUserSummaryRequest,
} from './index';

describe('formatUserSummaryETHMarket', () => {
  const usdcUserMock = new UserReserveMock({ decimals: 6 })
    .supply(200)
    .variableBorrow(50)
    .stableBorrow(50);
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

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityMarketReferenceCurrency).toEqual('2000');
    expect(result.totalLiquidityUSD).toEqual('20000');
    expect(result.totalCollateralMarketReferenceCurrency).toEqual('2000');
    expect(result.totalCollateralUSD).toEqual('20000');
    expect(result.totalBorrowsMarketReferenceCurrency).toEqual('1000');
    expect(result.totalBorrowsUSD).toEqual('10000');
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
  const ethUserMock = new UserReserveMock({ decimals: 18 }).stableBorrow(50);
  const usdcUserMock = new UserReserveMock({ decimals: 6 }).stableBorrow(100);
  const reserveIncentiveMock = new ReserveIncentiveMock();
  const userIncentiveMock = new UserIncentiveMock();
  const marketReferencePriceInUsd = '10';
  const marketReferenceCurrencyDecimals = 18;
  const reserveMock = new ReserveMock();
  const formattedReserves = formatReserves({
    reserves: [{ ...reserveMock.reserve, priceInMarketReferenceCurrency: '0' }],
    currentTimestamp: 0,
    marketReferenceCurrencyDecimals: 0,
    marketReferencePriceInUsd: '1',
  });
  const request: FormatUserSummaryAndIncentivesRequest = {
    userReserves: [ethUserMock.userReserve, usdcUserMock.userReserve],
    formattedReserves,
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    currentTimestamp: 1,
    userEmodeCategoryId: 0,
    reserveIncentives: [reserveIncentiveMock.reserveIncentive],
    userIncentives: [userIncentiveMock.userIncentive],
  };

  it('should calculate correct user incentives', () => {
    const summary = formatUserSummaryAndIncentives(request);
    expect(
      summary.calculatedUserIncentives[
        '0x0000000000000000000000000000000000000000'
      ].claimableRewards.toString(),
    ).toEqual('1');
  });
});

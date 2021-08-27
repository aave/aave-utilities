import { ComputedUserReserve } from '.';
import {
  formatUserReserve,
  FormatUserReserveRequest,
} from './format-user-reserve';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';
import { usdcUserReserve } from './user.mocks';

describe('generateUserReserveSummary', () => {
  const rawSummary: UserReserveSummaryResponse = generateUserReserveSummary({
    userReserve: usdcUserReserve,
    usdPriceEth: 309519442156873,
    currentTimestamp: 1629942229,
  });
  const request: FormatUserReserveRequest = {
    reserve: rawSummary,
  };

  it('should generate a summary for an individual user reserve', () => {
    const result: ComputedUserReserve = formatUserReserve(request);
    expect(Number(result.underlyingBalance)).toBeCloseTo(2441.09244);
    expect(Number(result.underlyingBalanceETH)).toBeCloseTo(
      0.757277279117938105,
    );
    expect(Number(result.underlyingBalanceUSD)).toBeCloseTo(2446.6226542697);
    expect(Number(result.variableBorrows)).toBeCloseTo(52.314205);
    expect(Number(result.variableBorrowsETH)).toBeCloseTo(0.016228946586561069);
    expect(Number(result.variableBorrowsUSD)).toBeCloseTo(52.4327211029);
    expect(Number(result.stableBorrows)).toBeCloseTo(0);
    expect(Number(result.stableBorrowsETH)).toBeCloseTo(0);
    expect(Number(result.stableBorrowsUSD)).toBeCloseTo(0);
    expect(Number(result.totalBorrows)).toBeCloseTo(52.314205);
    expect(Number(result.totalBorrowsETH)).toBeCloseTo(0.016228946586561069);
    expect(Number(result.totalBorrowsUSD)).toBeCloseTo(52.4327211029);
    expect(Number(result.totalLiquidity)).toBeCloseTo(5735355757.091039);
    expect(Number(result.totalStableDebt)).toBeCloseTo(47382349.631778);
    expect(Number(result.totalVariableDebt)).toBeCloseTo(5129957324.438749);
  });
});

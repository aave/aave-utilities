import { normalize } from '../../bignumber';
import {
  calculateTotalUserIncentives,
  CalculateTotalUserIncentivesRequest,
} from './calculate-total-user-incentives';
import {
  reserveIncentives,
  userReserveIncentives,
  reserveIncentivesMissingUSDC,
  userReserves,
} from './incentive.mocks';

describe('calculateTotalUserIncentives', () => {
  const totalUserIncentivesRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives,
    userReserves,
    userUnclaimedRewards: '43921819137644870',
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct total incentives for mock user', () => {
    const result = calculateTotalUserIncentives(totalUserIncentivesRequest);
    expect(normalize(result, 18)).toBe('0.08915763270718076481');
  });

  const totalUserIncentivesMissingDataRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives: reserveIncentivesMissingUSDC,
    userReserveIncentives,
    userReserves,
    userUnclaimedRewards: '43921819137644870',
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct total incentives for mock user minus USDC', () => {
    const result = calculateTotalUserIncentives(
      totalUserIncentivesMissingDataRequest,
    );
    expect(normalize(result, 18)).toBe('0.07029534828528322115');
  });
});

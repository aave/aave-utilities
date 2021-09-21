import { normalize } from '../../bignumber';
import { userReserves } from '../user/user.mocks';
import {
  calculateTotalUserIncentives,
  CalculateTotalUserIncentivesRequest,
} from './calculate-total-user-incentives';
import { reserveIncentives, userReserveIncentives } from './incentive.mocks';

describe('calculateTotalUserIncentives', () => {
  const totalUserIncentivesRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives,
    userReserves,
    currentTimestamp: 1631587561,
    precision: 18,
  };

  it('should calculate the correct total incentives for mock user', () => {
    const result = calculateTotalUserIncentives(totalUserIncentivesRequest);
    expect(normalize(result, 18)).toBe('0.0918520934972476496');
  });
});

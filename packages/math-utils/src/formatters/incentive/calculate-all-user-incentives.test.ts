import { normalize } from '../../bignumber';
import {
  calculateAllUserIncentives,
  CalculateAllUserIncentivesRequest,
} from './calculate-all-user-incentives';
import {
  reserveIncentives,
  userIncentives,
  reserveIncentivesMissingUSDC,
  userReserves,
} from './incentive.mocks';

describe('calculateAllUserIncentives', () => {
  const allUserIncentivesRequest: CalculateAllUserIncentivesRequest = {
    reserveIncentives,
    userIncentives,
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct incentives for all reserves of mock user', () => {
    const result = calculateAllUserIncentives(allUserIncentivesRequest);
    const claimable =
      result['0x4da27a545c0c5b758a6ba100e3a049001de870f5'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.08915763270718076481');
  });

  const totalUserIncentivesMissingDataRequest: CalculateAllUserIncentivesRequest =
    {
      reserveIncentives: reserveIncentivesMissingUSDC,
      userIncentives,
      userReserves,
      currentTimestamp: 1631587561,
    };

  it('should calculate the correct incentives for all reserves of mock user minus USDC', () => {
    const result = calculateAllUserIncentives(
      totalUserIncentivesMissingDataRequest,
    );
    const claimable =
      result['0x4da27a545c0c5b758a6ba100e3a049001de870f5'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.07029534828528322115');
  });

  const totalUserIncentivesWithoutUserReserves: CalculateAllUserIncentivesRequest =
    {
      reserveIncentives,
      userIncentives,
      userReserves: [],
      currentTimestamp: 1631587561,
    };

  it('should return userUnclaimedRewards even if userReserves is empty', () => {
    const result = calculateAllUserIncentives(
      totalUserIncentivesWithoutUserReserves,
    );
    const claimable =
      result['0x4da27a545c0c5b758a6ba100e3a049001de870f5'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.04392181913764487');
  });
});

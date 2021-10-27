import { normalize } from '../../bignumber';
import {
  calculateAllUserIncentives,
  CalculateAllUserIncentivesRequest,
} from './calculate-all-user-incentives';
import {
  reserveIncentives,
  userReserveIncentives,
  reserveIncentivesMissingUSDC,
  aUSDCUserIncentiveDataMultiController,
  userReserves,
} from './incentive.mocks';

describe('calculateAllUserIncentives', () => {
  const allUserIncentivesRequest: CalculateAllUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives,
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct incentives for all reserves of mock user', () => {
    const result = calculateAllUserIncentives(allUserIncentivesRequest);
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.08915763270718076481');
  });

  const totalUserIncentivesMissingDataRequest: CalculateAllUserIncentivesRequest =
    {
      reserveIncentives: reserveIncentivesMissingUSDC,
      userReserveIncentives,
      userReserves,
      currentTimestamp: 1631587561,
    };

  it('should calculate the correct incentives for all reserves of mock user minus USDC', () => {
    const result = calculateAllUserIncentives(
      totalUserIncentivesMissingDataRequest,
    );
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.07029534828528322115');
  });

  const totalUserIncentivesWithoutUserReserves: CalculateAllUserIncentivesRequest =
    {
      reserveIncentives,
      userReserveIncentives,
      userReserves: [],
      currentTimestamp: 1631587561,
    };

  it('should return userUnclaimedRewards even if userReserves is empty', () => {
    const result = calculateAllUserIncentives(
      totalUserIncentivesWithoutUserReserves,
    );
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.04392181913764487');
  });
});

describe('calculateAllUserIncentives for multiple IncentiveControllers', () => {
  const allUserIncentivesRequest: CalculateAllUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives: [aUSDCUserIncentiveDataMultiController],
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate incentives for isolated IncentiveControllers', () => {
    const result = calculateAllUserIncentives(allUserIncentivesRequest);
    const claimableController1 =
      result['0x0000000000000000000000000000000000000001'].claimableRewards;

    // Will be userUnclaimedRewards + accumulated deposit incentives
    expect(normalize(claimableController1, 18)).toBe('0.06174637776527728642');

    expect(
      result['0x0000000000000000000000000000000000000001'].assets,
    ).toStrictEqual(['0x000000000000000000000000000000000000000a']);

    const claimableController2 =
      result['0x0000000000000000000000000000000000000002'].claimableRewards;
    // Will be userUnclaimedRewards + accumulated variable debt incentives
    expect(normalize(claimableController2, 18)).toBe('0.04495954493190999725');

    expect(
      result['0x0000000000000000000000000000000000000002'].assets,
    ).toStrictEqual(['0x000000000000000000000000000000000000000v']);
  });
});

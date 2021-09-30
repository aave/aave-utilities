import { normalize } from '../../bignumber';
import {
  calculateTotalUserIncentives,
  CalculateTotalUserIncentivesRequest,
} from './calculate-total-user-incentives';
import {
  reserveIncentives,
  userReserveIncentives,
  reserveIncentivesMissingUSDC,
  aUSDCUserIncentiveDataMultiController,
  userReserves,
} from './incentive.mocks';

describe('calculateTotalUserIncentives', () => {
  const totalUserIncentivesRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives,
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct total incentives for mock user', () => {
    const result = calculateTotalUserIncentives(totalUserIncentivesRequest);
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.08915763270718076481');
  });

  const totalUserIncentivesMissingDataRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives: reserveIncentivesMissingUSDC,
    userReserveIncentives,
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate the correct total incentives for mock user minus USDC', () => {
    const result = calculateTotalUserIncentives(
      totalUserIncentivesMissingDataRequest,
    );
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    expect(normalize(claimable, 18)).toBe('0.07029534828528322115');
  });
});

describe('calculateTotalUserIncentives for multiple IncentiveControllers', () => {
  const totalUserIncentivesRequest: CalculateTotalUserIncentivesRequest = {
    reserveIncentives,
    userReserveIncentives: [aUSDCUserIncentiveDataMultiController],
    userReserves,
    currentTimestamp: 1631587561,
  };

  it('should calculate incentives for isolated IncentiveControllers', () => {
    const result = calculateTotalUserIncentives(totalUserIncentivesRequest);
    const claimableController1 =
      result['0x0000000000000000000000000000000000000001'].claimableRewards;

    // Will be userUnclaimedRewards + accumulated deposit incentives
    expect(normalize(claimableController1, 18)).toBe('0.06174637776527728642');

    expect(
      result['0x0000000000000000000000000000000000000001'].assets.includes(
        '0x0000000000000000000000000000000000000005',
      ),
    ).toBe(false);

    const claimableController2 =
      result['0x0000000000000000000000000000000000000002'].claimableRewards;
    // Will be userUnclaimedRewards + accumulated variable debt incentives
    expect(normalize(claimableController2, 18)).toBe('0.04495954493190999725');

    expect(
      result['0x0000000000000000000000000000000000000002'].assets.includes(
        '0x0000000000000000000000000000000000000004',
      ),
    ).toBe(false);
  });
});

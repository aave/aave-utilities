import { normalize } from '../../bignumber';
import {
  ReserveIncentiveMock,
  ReserveMock,
  UserIncentiveMock,
  UserReserveMock,
} from '../../mocks';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import {
  calculateAllUserIncentives,
  CalculateAllUserIncentivesRequest,
} from './calculate-all-user-incentives';

describe('calculateAllUserIncentives', () => {
  // Accrued rewards = 200000000000, unclaimedRewards = 000000000000000001
  const reserveMock = new ReserveMock();
  const userMock = new UserReserveMock()
    .supply(100)
    .variableBorrow(200)
    .stableBorrow(300);
  const reserveIncentiveMock = new ReserveIncentiveMock();
  const userIncentiveMock = new UserIncentiveMock();

  const currentTimestamp = 1;
  const { totalLiquidity } = calculateReserveDebt(
    reserveMock.reserve,
    currentTimestamp,
  );

  const allUserIncentivesRequest: CalculateAllUserIncentivesRequest = {
    reserveIncentives: [reserveIncentiveMock.reserveIncentive],
    userIncentives: [userIncentiveMock.userIncentive],
    userReserves: [
      {
        ...userMock.userReserve,
        reserve: {
          ...userMock.reserve,
          totalLiquidity: totalLiquidity.toString(),
        },
      },
    ],
    currentTimestamp,
  };

  it('should calculate the correct incentives for all reserves of mock user', () => {
    const result = calculateAllUserIncentives(allUserIncentivesRequest);
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    // accrued + unclaimed rewards
    expect(normalize(claimable, 18)).toBe('200000000000.000000000000000001');
  });

  it('should return empty if reserve incentives missing', () => {
    const totalUserIncentivesWithoutReserveIncentives: CalculateAllUserIncentivesRequest =
      {
        reserveIncentives: [
          { ...reserveIncentiveMock.reserveIncentive, underlyingAsset: '0x0' },
        ],
        userIncentives: [userIncentiveMock.userIncentive],
        userReserves: [
          {
            ...userMock.userReserve,
            reserve: {
              ...userMock.reserve,
              totalLiquidity: totalLiquidity.toString(),
            },
          },
        ],
        currentTimestamp,
      };
    const result = calculateAllUserIncentives(
      totalUserIncentivesWithoutReserveIncentives,
    );

    expect(result['0x0000000000000000000000000000000000000000']).toBe(
      undefined,
    );
  });

  it('should return userUnclaimedRewards even if userReserves is empty', () => {
    const totalUserIncentivesWithoutUserReserves: CalculateAllUserIncentivesRequest =
      {
        reserveIncentives: [reserveIncentiveMock.reserveIncentive],
        userIncentives: [userIncentiveMock.userIncentive],
        userReserves: [],
        currentTimestamp,
      };
    const result = calculateAllUserIncentives(
      totalUserIncentivesWithoutUserReserves,
    );
    const claimable =
      result['0x0000000000000000000000000000000000000000'].claimableRewards;
    // only unclaimed rewards
    expect(normalize(claimable, 18)).toBe('0.000000000000000001');
  });
});

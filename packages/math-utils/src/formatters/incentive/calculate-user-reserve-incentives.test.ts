import BigNumber from 'bignumber.js';
import { normalize } from '../../bignumber';
import {
  ReserveIncentiveMock,
  ReserveMock,
  UserIncentiveMock,
  UserReserveMock,
} from '../../mocks';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesRequest,
} from './calculate-user-reserve-incentives';

describe('calculateUserReserveIncentives', () => {
  const reserveMock = new ReserveMock()
    .addLiquidity(100)
    .addVariableDebt(200)
    .addStableDebt(300);
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
  const userETHReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: reserveIncentiveMock.reserveIncentive,
      userIncentives: userIncentiveMock.userIncentive,
      userReserveData: {
        ...userMock.userReserve,
        reserve: {
          ...userMock.reserve,
          totalLiquidity: totalLiquidity.toString(),
        },
      },
      currentTimestamp,
    };

  it('should calculate the correct aWETH incentives', () => {
    const result = calculateUserReserveIncentives(
      userETHReserveIncentiveRequest,
    );
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    expect(normalize(total, 18)).toBe('300000000000'); // 1 from deposit + 2 from variableDebt
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x0000000000000000000000000000000000000000',
    );
    if (aReward) {
      expect(normalize(aReward.accruedRewards, 18)).toBe('100000000000'); // 1 from deposit
    }
  });

  it('should calculate userUnclaimedRewards but zero accruedRewards if userReserves is empty', () => {
    const emptyUserReservesRequest: CalculateUserReserveIncentivesRequest = {
      ...userETHReserveIncentiveRequest,
      userReserveData: undefined,
    };
    const result = calculateUserReserveIncentives(emptyUserReservesRequest);
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x0000000000000000000000000000000000000000',
    );
    const vReward = result.find(
      reward =>
        reward.tokenAddress === '0x0000000000000000000000000000000000000000',
    );
    const sReward = result.find(
      reward =>
        reward.tokenAddress === '0x0000000000000000000000000000000000000000',
    );
    if (aReward) {
      expect(normalize(aReward.unclaimedRewards, 18)).toBe(
        '0.000000000000000001',
      );
    }

    if (vReward) {
      expect(normalize(vReward.unclaimedRewards, 18)).toBe(
        '0.000000000000000001',
      );
    }

    if (sReward) {
      expect(sReward.accruedRewards.toFixed()).toBe('0');
    }

    expect(normalize(total, 18)).toBe('0');
  });

  it('should return an empty array if there are no matching reserveIncentives', () => {
    const emptyReserveIncentivesRequest: CalculateUserReserveIncentivesRequest =
      {
        ...userETHReserveIncentiveRequest,
        reserveIncentives: {
          underlyingAsset: '0x0',
          aIncentiveData: {
            tokenAddress: '0x0',
            incentiveControllerAddress: '0x0',
            rewardsTokenInformation: [],
          },
          vIncentiveData: {
            tokenAddress: '0x0',
            incentiveControllerAddress: '0x0',
            rewardsTokenInformation: [],
          },
          sIncentiveData: {
            tokenAddress: '0x0',
            incentiveControllerAddress: '0x0',
            rewardsTokenInformation: [],
          },
        },
      };
    const result = calculateUserReserveIncentives(
      emptyReserveIncentivesRequest,
    );

    expect(result.length).toBe(0);
  });
});

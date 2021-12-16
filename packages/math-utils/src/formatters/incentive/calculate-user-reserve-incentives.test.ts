import BigNumber from 'bignumber.js';
import { normalize } from '../../bignumber';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesRequest,
} from './calculate-user-reserve-incentives';
import {
  aETHReserveIncentiveData,
  aETHUserIncentiveData,
  aETHReserve,
  aUSDCReserveIncentiveData,
  aUSDCUserIncentiveData,
  aUSDCReserve,
  aXSUSHIReserveIncentiveData,
  aXSUSHIUserIncentiveData,
  aXSUSHIReserve,
} from './incentive.mocks';

describe('calculateUserReserveIncentives', () => {
  const userETHReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aETHReserveIncentiveData,
      userIncentives: aETHUserIncentiveData,
      userReserveData: aETHReserve,
      currentTimestamp: 1631587561,
    };

  const userUSDCReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aUSDCReserveIncentiveData,
      userIncentives: aUSDCUserIncentiveData,
      userReserveData: aUSDCReserve,
      currentTimestamp: 1631587561,
    };

  const userXSUSHIReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aXSUSHIReserveIncentiveData,
      userIncentives: aXSUSHIUserIncentiveData,
      userReserveData: aXSUSHIReserve,
      currentTimestamp: 1631587561,
    };

  it('should calculate the correct aWETH incentives', () => {
    const result = calculateUserReserveIncentives(
      userETHReserveIncentiveRequest,
    );
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    expect(normalize(total, 18)).toBe('0.0024573771825653195');
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000a',
    );
    if (aReward) {
      expect(normalize(aReward.accruedRewards, 18)).toBe(
        '0.0024573771825653195',
      );
    }
  });

  it('should calculate the correct aUSDC incentives', () => {
    const result = calculateUserReserveIncentives(
      userUSDCReserveIncentiveRequest,
    );
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000a',
    );
    const vReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000v',
    );
    const sReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000s',
    );
    if (aReward) {
      expect(normalize(aReward.accruedRewards, 18)).toBe(
        '0.01782455862763241642',
      );
    }

    if (vReward) {
      expect(normalize(vReward.accruedRewards, 18)).toBe(
        '0.00103772579426512725',
      );
    }

    if (sReward) {
      expect(sReward.accruedRewards).toBe('0');
    }

    expect(normalize(total, 18)).toBe('0.01886228442189754366');
  });

  it('should calculate the correct xSushi incentives', () => {
    const result = calculateUserReserveIncentives(
      userXSUSHIReserveIncentiveRequest,
    );
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000a',
    );
    const vReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000v',
    );
    const sReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000s',
    );
    if (aReward) {
      expect(normalize(aReward.accruedRewards, 18)).toBe(
        '0.02391615196507303165',
      );
    }

    if (vReward) {
      expect(normalize(vReward.accruedRewards, 18)).toBe('0');
    }

    if (sReward) {
      expect(sReward.accruedRewards.toFixed()).toBe('0');
    }

    expect(normalize(total, 18)).toBe('0.02391615196507303165');
  });

  it('should calculate userUnclaimedRewards but zero accruedRewards if userReserves is empty', () => {
    const emptyUserReservesRequest: CalculateUserReserveIncentivesRequest = {
      ...userXSUSHIReserveIncentiveRequest,
      userReserveData: undefined,
    };
    const result = calculateUserReserveIncentives(emptyUserReservesRequest);
    let total = new BigNumber(0);
    result.forEach(reward => {
      total = total.plus(reward.accruedRewards);
    });
    const aReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000a',
    );
    const vReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000v',
    );
    const sReward = result.find(
      reward =>
        reward.tokenAddress === '0x000000000000000000000000000000000000000s',
    );
    if (aReward) {
      expect(normalize(aReward.unclaimedRewards, 18)).toBe(
        '0.04392181913764487',
      );
    }

    if (vReward) {
      expect(normalize(vReward.unclaimedRewards, 18)).toBe(
        '0.04392181913764487',
      );
    }

    if (sReward) {
      expect(sReward.accruedRewards.toFixed()).toBe('0.04392181913764487');
    }

    expect(normalize(total, 18)).toBe('0');
  });

  it('should return an empty array if there are no matching reserveIncentives', () => {
    const emptyReserveIncentivesRequest: CalculateUserReserveIncentivesRequest =
      {
        ...userXSUSHIReserveIncentiveRequest,
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

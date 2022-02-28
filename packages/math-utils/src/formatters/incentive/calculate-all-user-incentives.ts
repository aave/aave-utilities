import { BigNumber } from 'bignumber.js';
import {
  calculateUserReserveIncentives,
  UserReserveIncentive,
} from './calculate-user-reserve-incentives';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
  UserReserveCalculationData,
} from './types';

// Indexed by reward token address
export type UserIncentiveDict = Record<string, UserIncentiveData>;

export interface UserIncentiveData {
  incentiveControllerAddress: string;
  rewardTokenSymbol: string;
  rewardPriceFeed: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}

export interface CalculateAllUserIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[]; // token incentive data, from UiIncentiveDataProvider
  userIncentives: UserReservesIncentivesDataHumanized[]; // user incentive data, from UiIncentiveDataProvider
  userReserves: UserReserveCalculationData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export function calculateAllUserIncentives({
  reserveIncentives,
  userIncentives,
  userReserves,
  currentTimestamp,
}: CalculateAllUserIncentivesRequest): UserIncentiveDict {
  // calculate incentive per token
  const allRewards = userIncentives
    .map((userIncentive: UserReservesIncentivesDataHumanized) => {
      const reserve: ReservesIncentiveDataHumanized | undefined =
        reserveIncentives.find(
          (reserve: ReservesIncentiveDataHumanized) =>
            reserve.underlyingAsset === userIncentive.underlyingAsset,
        );
      const userReserve: UserReserveCalculationData | undefined =
        userReserves.find(
          (userReserve: UserReserveCalculationData) =>
            userReserve.reserve.underlyingAsset ===
            userIncentive.underlyingAsset,
        );
      if (reserve) {
        const reserveRewards: UserReserveIncentive[] =
          calculateUserReserveIncentives({
            reserveIncentives: reserve,
            userIncentives: userIncentive,
            userReserveData: userReserve,
            currentTimestamp,
          });
        return reserveRewards;
      }

      return [];
    })
    .flat();

  // From the array of all deposit and borrow incentives, create dictionary indexed by reward token address
  const incentiveDict: UserIncentiveDict = {};
  allRewards.forEach(reward => {
    if (!incentiveDict[reward.rewardTokenAddress]) {
      incentiveDict[reward.rewardTokenAddress] = {
        assets: [],
        rewardTokenSymbol: reward.rewardTokenSymbol,
        claimableRewards: reward.unclaimedRewards,
        incentiveControllerAddress: reward.incentiveController,
        rewardTokenDecimals: reward.rewardTokenDecimals,
        rewardPriceFeed: reward.rewardPriceFeed,
      };
    }

    if (reward.accruedRewards.gt(0)) {
      incentiveDict[reward.rewardTokenAddress].claimableRewards = incentiveDict[
        reward.rewardTokenAddress
      ].claimableRewards.plus(reward.accruedRewards);
      incentiveDict[reward.rewardTokenAddress].assets.push(reward.tokenAddress);
    }
  });

  return incentiveDict;
}

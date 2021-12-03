import { BigNumber } from 'bignumber.js';
import {
  calculateUserReserveIncentives,
  UserReserveIncentive,
} from './calculate-user-reserve-incentives';
import {
  ReservesIncentiveDataHumanized,
  UserReserveCalculationData,
  UserReservesIncentivesDataHumanized,
} from './types';

// Indexed by reward token address
export type UserIncentiveDict = Record<string, UserIncentiveData>;

interface UserIncentiveData {
  incentiveControllerAddress: string;
  rewardTokenSymbol: string;
  rewardPriceFeed: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}

export interface CalculateAllUserIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[]; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReservesIncentivesDataHumanized[]; // user incentive data, from UiIncentiveDataProvider
  userReserves: UserReserveCalculationData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export function calculateAllUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
}: CalculateAllUserIncentivesRequest): UserIncentiveDict {
  let allRewards: UserReserveIncentive[] = [];
  // calculate incentive per token
  userReserveIncentives.forEach(
    (userReserveIncentive: UserReservesIncentivesDataHumanized) => {
      const reserve: ReservesIncentiveDataHumanized | undefined =
        reserveIncentives.find(
          (reserve: ReservesIncentiveDataHumanized) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      const userReserve: UserReserveCalculationData | undefined =
        userReserves.find(
          (reserve: UserReserveCalculationData) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      if (reserve) {
        const reserveRewards: UserReserveIncentive[] =
          calculateUserReserveIncentives({
            reserveIncentives: reserve,
            userReserveIncentives: userReserveIncentive,
            userReserveData: userReserve,
            currentTimestamp,
          });
        allRewards = allRewards.concat(reserveRewards);
      }
    },
  );

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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ReserveIncentiveWithFeedsResponse,
  UserReserveIncentiveDataHumanizedResponse,
} from '@aave/contract-helpers';
import { BigNumber } from 'bignumber.js';
import { calculateUserReserveIncentives } from './calculate-user-reserve-incentives';

export interface UserReserveCalculationData {
  underlyingAsset: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  scaledATokenBalance: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
}

// Indexed by incentives controller address
export type UserIncentiveDict = Record<string, UserIncentiveData>;

interface UserIncentiveData {
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}

interface RewardCalculation {
  tokenAddress: string;
  incentiveController: string;
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  accruedRewards: BigNumber;
  unclaimedRewards: BigNumber;
}

export interface CalculateAllUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveWithFeedsResponse[]; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveDataHumanizedResponse[]; // user incentive data, from UiIncentiveDataProvider
  userReserves: UserReserveCalculationData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export function calculateAllUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
}: CalculateAllUserIncentivesRequest): UserIncentiveDict {
  // calculate incentive per token
  const rewards = userReserveIncentives
    .map((userReserveIncentive: UserReserveIncentiveDataHumanizedResponse) => {
      const reserve: ReserveIncentiveWithFeedsResponse | undefined =
        reserveIncentives.find(
          (reserve: ReserveIncentiveWithFeedsResponse) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      const userReserve: UserReserveCalculationData | undefined =
        userReserves.find(
          (reserve: UserReserveCalculationData) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      if (reserve && userReserve) {
        const rewards = calculateUserReserveIncentives({
          reserveIncentives: reserve,
          userReserveIncentives: userReserveIncentive,
          userReserveData: userReserve,
          currentTimestamp,
        });

        return [
          {
            tokenAddress:
              userReserveIncentive.aTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.aTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.aTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.aTokenIncentivesUserData.rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.aIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.aTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
          {
            tokenAddress:
              userReserveIncentive.vTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.vTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.vTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.vTokenIncentivesUserData.rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.vIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.vTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
          {
            tokenAddress:
              userReserveIncentive.sTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.sTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.sTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.sTokenIncentivesUserData.rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.sIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.sTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
        ];
      }

      return [];
    })
    .flat();

  // normalize incentives per controller
  return rewards.reduce<UserIncentiveDict>(
    (acc: UserIncentiveDict, reward: RewardCalculation) => {
      if (!acc[reward.incentiveController]) {
        acc[reward.incentiveController] = {
          assets: [],
          claimableRewards: reward.unclaimedRewards,
          rewardTokenAddress: reward.rewardTokenAddress,
          rewardTokenDecimals: reward.rewardTokenDecimals,
        };
      }

      if (reward.accruedRewards.gt(0)) {
        acc[reward.incentiveController].claimableRewards = acc[
          reward.incentiveController
        ].claimableRewards.plus(reward.accruedRewards);
        acc[reward.incentiveController].assets.push(reward.tokenAddress);
      }

      return acc;
    },
    {},
  );
}

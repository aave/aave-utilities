import { BigNumber } from 'bignumber.js';
import { calculateUserReserveIncentives } from './calculate-user-reserve-incentives';

export interface ReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: ReserveTokenIncentives;
  vIncentiveData: ReserveTokenIncentives;
  sIncentiveData: ReserveTokenIncentives;
}

export interface UserReserveIncentiveData {
  underlyingAsset: string;
  aTokenIncentivesUserData: UserTokenIncentives;
  vTokenIncentivesUserData: UserTokenIncentives;
  sTokenIncentivesUserData: UserTokenIncentives;
}

interface ReserveTokenIncentives {
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: number;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: number;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  precision: number;
}

interface UserTokenIncentives {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
}

export interface UserReserveData {
  underlyingAsset: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  scaledATokenBalance: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
}

export interface UserIncentiveDict {
  [incentiveControllerAddress: string]: UserIncentiveData;
}

interface UserIncentiveData {
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}

export interface CalculateTotalUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveData[]; // token incentive data
  userReserveIncentives: UserReserveIncentiveData[]; // user incentive data
  userReserves: UserReserveData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export function calculateTotalUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
}: CalculateTotalUserIncentivesRequest): UserIncentiveDict {
  // calculate incentive per token
  const rewards = userReserveIncentives
    .map(userReserveIncentive => {
      const reserve = reserveIncentives.find(
        reserve =>
          reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
      );
      const userReserve = userReserves.find(
        reserve =>
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
  return rewards.reduce((acc, reward) => {
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
  }, {} as UserIncentiveDict);
}

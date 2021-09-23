import BigNumber from 'bignumber.js';
import { calculateUserReserveIncentives } from './calculate-user-reserve-incentives';

export interface ReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: ReserveTokenIncentives;
  vIncentiveData: ReserveTokenIncentives;
  sIncentiveData: ReserveTokenIncentives;
}

export interface UserReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: UserTokenIncentives;
  vIncentiveData: UserTokenIncentives;
  sIncentiveData: UserTokenIncentives;
}

interface ReserveTokenIncentives {
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: string;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  precision: number;
}

interface UserTokenIncentives {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
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

export interface CalculateTotalUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveData[]; // token incentive data
  userReserveIncentives: UserReserveIncentiveData[]; // user incentive data
  userReserves: UserReserveData[]; // deposit and borrow data for user assets
  userUnclaimedRewards: string; // total unclaimed rewards up to users last protocol interaction
  currentTimestamp: number;
}

// Calculate total claimable incentives for a user
export function calculateTotalUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  userUnclaimedRewards,
  currentTimestamp,
}: CalculateTotalUserIncentivesRequest): string {
  let claimableRewards: BigNumber = new BigNumber(userUnclaimedRewards);

  // For each asset a user is earning incentives, compute rewards since last protocol interaction and add to total
  userReserveIncentives.forEach(userReserveIncentive => {
    const reserveIncentive = reserveIncentives.find(
      reserve =>
        reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
    );
    const userReserve = userReserves.find(
      userReserve =>
        userReserve.underlyingAsset === userReserveIncentive.underlyingAsset,
    );
    if (reserveIncentive && userReserve) {
      const rewards = calculateUserReserveIncentives({
        reserveIncentives: reserveIncentive,
        userReserveIncentives: userReserveIncentive,
        userReserveData: userReserve,
        currentTimestamp,
      });
      claimableRewards = claimableRewards
        .plus(rewards.aIncentives)
        .plus(rewards.vIncentives)
        .plus(rewards.sIncentives);
    }
  });

  return claimableRewards.toString();
}

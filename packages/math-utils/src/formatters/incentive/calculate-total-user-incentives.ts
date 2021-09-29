import { BigNumber } from 'bignumber.js';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesResponse,
} from './calculate-user-reserve-incentives';

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
  incentivesLastUpdateTimestamp: string;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: string;
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
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  stableDebtTokenAddress: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  scaledATokenBalance: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
}

interface UserIncentiveDict {
  [incentiveControllerAddress: string]: UserIncentiveData;
}

interface UserIncentiveData {
  rewardTokenAddress: string;
  claimableRewards: BigNumber;
  assets: string[];
}

export interface CalculateTotalUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveData[]; // token incentive data
  userReserveIncentives: UserReserveIncentiveData[]; // user incentive data
  userReserves: UserReserveData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export interface CalculateTotalUserIncentivesResponse {
  userIncentives: UserIncentiveDict;
}

// Add data for a deposit or debt incentive to overall userIncentives dictionary
function updateUserIncentive(
  userIncentives: UserIncentiveDict,
  tokenIncentivesUserData: UserTokenIncentives,
  accumulatedIncentives: BigNumber,
  tokenAddress: string, // Address of the aToken, variableDebt, or stableDebt token earning incentives
): UserIncentiveDict {
  if (tokenIncentivesUserData.incentiveControllerAddress in userIncentives) {
    let userIncentive =
      userIncentives[tokenIncentivesUserData.incentiveControllerAddress];
    userIncentive.claimableRewards = userIncentive.claimableRewards.plus(
      accumulatedIncentives,
    );
    userIncentive.assets.push(tokenAddress);
    userIncentives[
      tokenIncentivesUserData.incentiveControllerAddress
    ] = userIncentive;
  } else {
    userIncentives[tokenIncentivesUserData.incentiveControllerAddress] = {
      claimableRewards: new BigNumber(
        tokenIncentivesUserData.userUnclaimedRewards,
      ).plus(accumulatedIncentives),
      assets: [tokenAddress],
      rewardTokenAddress: tokenIncentivesUserData.rewardTokenAddress,
    };
  }

  return userIncentives;
}

// Add all deposit and debt incentives for a reserve asset to overall userIncentives dictionary
function updateUserIncentives(
  userIncentives: UserIncentiveDict,
  userReserveIncentive: UserReserveIncentiveData,
  rewards: CalculateUserReserveIncentivesResponse,
  userReserve: UserReserveData,
): UserIncentiveDict {
  userIncentives = updateUserIncentive(
    userIncentives,
    userReserveIncentive.aTokenIncentivesUserData,
    rewards.aIncentives,
    userReserve.aTokenAddress,
  );
  userIncentives = updateUserIncentive(
    userIncentives,
    userReserveIncentive.vTokenIncentivesUserData,
    rewards.vIncentives,
    userReserve.variableDebtTokenAddress,
  );
  userIncentives = updateUserIncentive(
    userIncentives,
    userReserveIncentive.sTokenIncentivesUserData,
    rewards.sIncentives,
    userReserve.stableDebtTokenAddress,
  );
  return userIncentives;
}

// Calculate total claimable incentives for a user
export function calculateTotalUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
}: CalculateTotalUserIncentivesRequest): CalculateTotalUserIncentivesResponse {
  let userIncentives: UserIncentiveDict = {};

  // Loop through each asset with user incentive data
  userReserveIncentives.forEach(
    (userReserveIncentive: UserReserveIncentiveData) => {
      // Find the corresponding incentive data for the reserve asset
      const reserveIncentive = reserveIncentives.find(
        reserve =>
          reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
      );
      // Find the corresponding user data for the reserve asset
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
        // Update userIncentives dictionary by grouping claimableRewards and assets by incentiveControllerAddress
        userIncentives = updateUserIncentives(
          userIncentives,
          userReserveIncentive,
          rewards,
          userReserve,
        );
      }
    },
  );
  return { userIncentives };
}

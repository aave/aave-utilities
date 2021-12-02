import BigNumber from 'bignumber.js';
import { rayDiv } from '../../ray.math';
import { calculateAccruedIncentives } from './calculate-accrued-incentives';
import {
  ReservesIncentiveDataHumanized,
  UserReserveCalculationData,
  UserReserveIncentiveDataHumanizedResponse,
} from './types';

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveDataHumanizedResponse; // user incentive data, from UiIncentiveDataProvider
  currentTimestamp: number;
  userReserveData: UserReserveCalculationData;
}

export interface CalculateUserReserveIncentivesResponse {
  aIncentives: BigNumber; // deposit incentives
  vIncentives: BigNumber; // variable debt incentives
  sIncentives: BigNumber; // stable debt incentives
}

// Calculate user deposit and borrow incentives for an individual reserve asset
export function calculateUserReserveIncentives({
  reserveIncentives,
  userReserveIncentives,
  currentTimestamp,
  userReserveData,
}: CalculateUserReserveIncentivesRequest): CalculateUserReserveIncentivesResponse {
  const totalDeposits = rayDiv(
    new BigNumber(userReserveData.totalLiquidity),
    new BigNumber(userReserveData.liquidityIndex),
  );
  const aIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledATokenBalance),
    reserveIndex: new BigNumber(
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.aTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision:
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0].precision,
    rewardTokenDecimals:
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0]
        .rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0]
        .incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: totalDeposits,
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentives.aIncentiveData.rewardsTokenInformation[0]
        .emissionEndTimestamp,
  };

  const vIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledVariableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.vTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision:
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0].precision,
    rewardTokenDecimals:
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0]
        .rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0]
        .incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalScaledVariableDebt),
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentives.vIncentiveData.rewardsTokenInformation[0]
        .emissionEndTimestamp,
  };

  const sIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.principalStableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.sTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision:
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0].precision,
    rewardTokenDecimals:
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0]
        .rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0]
        .incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalPrincipalStableDebt),
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentives.sIncentiveData.rewardsTokenInformation[0]
        .emissionEndTimestamp,
  };

  const aIncentives = calculateAccruedIncentives(aIncentivesRequest);
  const vIncentives = calculateAccruedIncentives(vIncentivesRequest);
  const sIncentives = calculateAccruedIncentives(sIncentivesRequest);

  return { aIncentives, vIncentives, sIncentives };
}

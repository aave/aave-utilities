import BigNumber from 'bignumber.js';
import { rayDiv } from '../../ray.math';
import { calculateAccruedIncentives } from './calculate-accrued-incentives';
import {
  ReserveIncentiveData,
  UserReserveData,
  UserReserveIncentiveData,
} from './calculate-total-user-incentives';

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveData; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveData; // user incentive data, from UiIncentiveDataProvider
  currentTimestamp: number;
  userReserveData: UserReserveData;
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
      reserveIncentives.aIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.aIncentiveData.tokenIncentivesUserIndex,
    ),
    precision: Number(reserveIncentives.aIncentiveData.precision),
    rewardTokenDecimals: reserveIncentives.aIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.aIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond: new BigNumber(
      reserveIncentives.aIncentiveData.emissionPerSecond,
    ),
    totalSupply: totalDeposits,
    currentTimestamp: currentTimestamp,
    emissionEndTimestamp: Number(
      reserveIncentives.aIncentiveData.emissionEndTimestamp,
    ),
  };

  const vIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledVariableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.vIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.vIncentiveData.tokenIncentivesUserIndex,
    ),
    precision: Number(reserveIncentives.vIncentiveData.precision),
    rewardTokenDecimals: reserveIncentives.vIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.vIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond: new BigNumber(
      reserveIncentives.vIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalScaledVariableDebt),
    currentTimestamp: currentTimestamp,
    emissionEndTimestamp: Number(
      reserveIncentives.vIncentiveData.emissionEndTimestamp,
    ),
  };

  const sIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.principalStableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.sIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.sIncentiveData.tokenIncentivesUserIndex,
    ),
    precision: Number(reserveIncentives.sIncentiveData.precision),
    rewardTokenDecimals: reserveIncentives.sIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.sIncentiveData.incentivesLastUpdateTimestamp,
    ),

    emissionPerSecond: new BigNumber(
      reserveIncentives.sIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalPrincipalStableDebt),
    currentTimestamp: currentTimestamp,
    emissionEndTimestamp: Number(
      reserveIncentives.sIncentiveData.emissionEndTimestamp,
    ),
  };

  const aIncentives = calculateAccruedIncentives(aIncentivesRequest);
  const vIncentives = calculateAccruedIncentives(vIncentivesRequest);
  const sIncentives = calculateAccruedIncentives(sIncentivesRequest);

  return { aIncentives, vIncentives, sIncentives };
}

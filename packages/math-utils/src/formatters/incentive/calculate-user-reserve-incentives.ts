import BigNumber from 'bignumber.js';

import { ReserveData } from '../reserve';
import { ComputedUserReserve } from '../user';
import { calculateSupplies } from '../user/calculate-supplies';
import { calculateAccruedIncentives } from './calculate-accrued-incentives';

interface ReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: ReserveTokenIncentives;
  vIncentiveData: ReserveTokenIncentives;
  sIncentiveData: ReserveTokenIncentives;
}

interface UserReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: UserTokenIncentives;
  vIncentiveData: UserTokenIncentives;
  sIncentiveData: UserTokenIncentives;
}

interface ReserveTokenIncentives {
  emissionPerSecond: BigNumber;
  incentivesLastUpdateTimestamp: BigNumber;
  tokenIncentivesIndex: BigNumber;
  emissionEndTimestamp: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
}

interface UserTokenIncentives {
  tokenIncentivesUserIndex: BigNumber;
  userUnclaimedRewards: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
}

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveData;
  userReserveIncentives: UserReserveIncentiveData;
  currentTimestamp: number;
  reserveData: ReserveData;
  userReserveData: ComputedUserReserve;
  rewardTokenDecimals: number;
  precision: number;
}

export function calculateUserReserveIncentives(
  request: CalculateUserReserveIncentivesRequest,
): BigNumber {
  const {
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  } = calculateSupplies({
    reserve: {
      totalScaledVariableDebt: request.reserveData.totalScaledVariableDebt,
      variableBorrowIndex: request.reserveData.variableBorrowIndex,
      variableBorrowRate: request.reserveData.variableBorrowRate,
      totalPrincipalStableDebt: request.reserveData.totalPrincipalStableDebt,
      averageStableRate: request.reserveData.averageStableRate,
      availableLiquidity: request.reserveData.availableLiquidity,
      stableDebtLastUpdateTimestamp:
        request.reserveData.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: request.reserveData.lastUpdateTimestamp,
    },
    currentTimestamp: request.currentTimestamp,
  });

  const aIncentivesRequest = {
    principalUserBalance: new BigNumber(
      request.userReserveData.underlyingBalance,
    ),
    reserveIndex: request.reserveIncentives.aIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.aIncentiveData.tokenIncentivesUserIndex,
    precision: request.precision,
    rewardTokenDecimals: request.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      request.reserveIncentives.aIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond:
      request.reserveIncentives.aIncentiveData.emissionPerSecond,
    totalSupply: totalLiquidity,
    currentTimestamp: request.currentTimestamp,
    emissionEndTimestamp: Number(
      request.reserveIncentives.aIncentiveData.emissionEndTimestamp,
    ),
  };

  const vIncentivesRequest = {
    principalUserBalance: new BigNumber(
      request.userReserveData.variableBorrows,
    ),
    reserveIndex: request.reserveIncentives.vIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.vIncentiveData.tokenIncentivesUserIndex,
    precision: request.precision,
    rewardTokenDecimals: request.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      request.reserveIncentives.vIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond:
      request.reserveIncentives.vIncentiveData.emissionPerSecond,
    totalSupply: totalVariableDebt,
    currentTimestamp: request.currentTimestamp,
    emissionEndTimestamp: Number(
      request.reserveIncentives.vIncentiveData.emissionEndTimestamp,
    ),
  };

  const sIncentivesRequest = {
    principalUserBalance: new BigNumber(request.userReserveData.stableBorrows),
    reserveIndex: request.reserveIncentives.sIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.sIncentiveData.tokenIncentivesUserIndex,
    precision: request.precision,
    rewardTokenDecimals: request.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      request.reserveIncentives.sIncentiveData.incentivesLastUpdateTimestamp,
    ),

    emissionPerSecond:
      request.reserveIncentives.sIncentiveData.emissionPerSecond,
    totalSupply: totalStableDebt,
    currentTimestamp: request.currentTimestamp,
    emissionEndTimestamp: Number(
      request.reserveIncentives.sIncentiveData.emissionEndTimestamp,
    ),
  };

  const aIncentives = calculateAccruedIncentives(aIncentivesRequest);
  const vIncentives = calculateAccruedIncentives(vIncentivesRequest);
  const sIncentives = calculateAccruedIncentives(sIncentivesRequest);

  return aIncentives.plus(vIncentives).plus(sIncentives);
}

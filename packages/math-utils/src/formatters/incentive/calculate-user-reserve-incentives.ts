import BigNumber from 'bignumber.js';
import { rayDiv } from '../../ray.math';

import { ReserveData } from '../reserve';
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
  rewardTokenDecimals: number;
}

interface UserTokenIncentives {
  tokenIncentivesUserIndex: BigNumber;
  userUnclaimedRewards: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
}

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveData;
  userReserveIncentives: UserReserveIncentiveData;
  currentTimestamp: number;
  reserveData: ReserveData;
  scaledATokenBalance: BigNumber;
  scaledVariableDebt: BigNumber;
  principalStableDebt: BigNumber;
  precision: number;
}

export interface CalculateUserReserveIncentivesResponse {
  aIncentives: BigNumber;
  vIncentives: BigNumber;
  sIncentives: BigNumber;
}

export function calculateUserReserveIncentives({
  reserveIncentives,
  userReserveIncentives,
  currentTimestamp,
  reserveData,
  scaledATokenBalance,
  scaledVariableDebt,
  principalStableDebt,
  precision,
}: CalculateUserReserveIncentivesRequest): CalculateUserReserveIncentivesResponse {
  const { totalLiquidity } = calculateSupplies({
    reserve: {
      totalScaledVariableDebt: reserveData.totalScaledVariableDebt,
      variableBorrowIndex: reserveData.variableBorrowIndex,
      variableBorrowRate: reserveData.variableBorrowRate,
      totalPrincipalStableDebt: reserveData.totalPrincipalStableDebt,
      averageStableRate: reserveData.averageStableRate,
      availableLiquidity: reserveData.availableLiquidity,
      stableDebtLastUpdateTimestamp: reserveData.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: reserveData.lastUpdateTimestamp,
    },
    currentTimestamp: currentTimestamp,
  });

  const aIncentivesRequest = {
    principalUserBalance: scaledATokenBalance,
    reserveIndex: reserveIncentives.aIncentiveData.tokenIncentivesIndex,
    userIndex: userReserveIncentives.aIncentiveData.tokenIncentivesUserIndex,
    precision: precision,
    rewardTokenDecimals: reserveIncentives.aIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.aIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond: reserveIncentives.aIncentiveData.emissionPerSecond,
    totalSupply: rayDiv(totalLiquidity, reserveData.liquidityIndex),
    currentTimestamp: currentTimestamp,
    emissionEndTimestamp: Number(
      reserveIncentives.aIncentiveData.emissionEndTimestamp,
    ),
  };

  const vIncentivesRequest = {
    principalUserBalance: scaledVariableDebt,
    reserveIndex: reserveIncentives.vIncentiveData.tokenIncentivesIndex,
    userIndex: userReserveIncentives.vIncentiveData.tokenIncentivesUserIndex,
    precision: precision,
    rewardTokenDecimals: reserveIncentives.vIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.vIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond: reserveIncentives.vIncentiveData.emissionPerSecond,
    totalSupply: new BigNumber(reserveData.totalScaledVariableDebt),
    currentTimestamp: currentTimestamp,
    emissionEndTimestamp: Number(
      reserveIncentives.vIncentiveData.emissionEndTimestamp,
    ),
  };

  const sIncentivesRequest = {
    principalUserBalance: principalStableDebt,
    reserveIndex: reserveIncentives.sIncentiveData.tokenIncentivesIndex,
    userIndex: userReserveIncentives.sIncentiveData.tokenIncentivesUserIndex,
    precision: precision,
    rewardTokenDecimals: reserveIncentives.sIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp: Number(
      reserveIncentives.sIncentiveData.incentivesLastUpdateTimestamp,
    ),

    emissionPerSecond: reserveIncentives.sIncentiveData.emissionPerSecond,
    totalSupply: new BigNumber(reserveData.totalPrincipalStableDebt),
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

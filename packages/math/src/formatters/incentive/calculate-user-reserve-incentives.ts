import BigNumber from 'bignumber.js';
import { valueToBigNumber } from '../../bignumber';
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
  tokenincentivesUserIndex: BigNumber;
  userUnclaimedRewards: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
}

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveData;
  userReserveIncentives: UserReserveIncentiveData;
  currentTimestamp: number;
}

export function calculateUserReserveIncentives(
  request: CalculateUserReserveIncentivesRequest,
): BigNumber {
  const aIncentivesRequest = {
    principalUserBalance: new BigNumber('0'), // Where to get this?
    reserveIndex: request.reserveIncentives.aIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.aIncentiveData.tokenincentivesUserIndex,
    precision: 18, // Where to get this?
    rewardTokenDecimals: 18, // Where do we get this?
    reserveIndexTimestamp: Number(
      request.reserveIncentives.aIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond:
      request.reserveIncentives.aIncentiveData.emissionPerSecond,
    totalSupply: valueToBigNumber('0'), // Where to get this?
    currentTimestamp: Number(request.currentTimestamp),
    emissionEndTimestamp: Number(
      request.reserveIncentives.aIncentiveData.emissionEndTimestamp,
    ),
  };

  const vIncentivesRequest = {
    principalUserBalance: new BigNumber('0'), // Where to get this?
    reserveIndex: request.reserveIncentives.vIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.vIncentiveData.tokenincentivesUserIndex,
    precision: 18, // Where to get this?
    rewardTokenDecimals: 18, // Where do we get this?
    reserveIndexTimestamp: Number(
      request.reserveIncentives.vIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond:
      request.reserveIncentives.vIncentiveData.emissionPerSecond,
    totalSupply: valueToBigNumber('0'), // Where to get this?
    currentTimestamp: Number(request.currentTimestamp),
    emissionEndTimestamp: Number(
      request.reserveIncentives.vIncentiveData.emissionEndTimestamp,
    ),
  };

  const sIncentivesRequest = {
    principalUserBalance: new BigNumber('0'), // Where to get this?
    reserveIndex: request.reserveIncentives.sIncentiveData.tokenIncentivesIndex,
    userIndex:
      request.userReserveIncentives.sIncentiveData.tokenincentivesUserIndex,
    precision: 18, // Where to get this?
    rewardTokenDecimals: 18, // Where do we get this?
    reserveIndexTimestamp: Number(
      request.reserveIncentives.sIncentiveData.incentivesLastUpdateTimestamp,
    ),
    emissionPerSecond:
      request.reserveIncentives.sIncentiveData.emissionPerSecond,
    totalSupply: valueToBigNumber('0'), // Where to get this?
    currentTimestamp: Number(request.currentTimestamp),
    emissionEndTimestamp: Number(
      request.reserveIncentives.sIncentiveData.emissionEndTimestamp,
    ),
  };

  const aIncentives = calculateAccruedIncentives(aIncentivesRequest);
  const vIncentives = calculateAccruedIncentives(vIncentivesRequest);
  const sIncentives = calculateAccruedIncentives(sIncentivesRequest);

  // How to combine these a/v/s incentives with userUnclaimedRewards to get totalRewards for a single reserve?
  return new BigNumber('0');
}

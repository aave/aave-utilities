import BigNumber from 'bignumber.js';
import { RawUserReserveData } from '../user';
import { calculateUserReserveIncentives } from './calculate-user-reserve-incentives';

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

export interface CalculateTotalUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveData[]; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveData[]; // user incentive data, from UiIncentiveDataProvider
  userReserves: RawUserReserveData[]; // deposit and borrow data for user assets, from UiPoolDataProvider
  userUnclaimedRewards: BigNumber; // total unclaimed rewards up to users last protocol interaction, from UiIncentiveDataProvider
  currentTimestamp: number;
  precision: number; // decimal precision for rewards calculation
}

// Calculate total claimable incentives for a user
export function calculateTotalUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  userUnclaimedRewards,
  currentTimestamp,
  precision,
}: CalculateTotalUserIncentivesRequest): BigNumber {
  let claimableRewards: BigNumber = userUnclaimedRewards;

  // For each asset a user is earning incentives, compute rewards since last protocol interaction and add to total
  userReserveIncentives.forEach(userReserveIncentive => {
    const reserveIncentive = reserveIncentives.find(
      reserve =>
        reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
    );
    const userReserve = userReserves.find(
      userReserve =>
        userReserve.reserve.id.substr(0, 42) ===
        userReserveIncentive.underlyingAsset,
    );
    if (reserveIncentive && userReserve) {
      const rewards = calculateUserReserveIncentives({
        reserveIncentives: reserveIncentive,
        userReserveIncentives: userReserveIncentive,
        reserveData: userReserve.reserve,
        scaledATokenBalance: new BigNumber(userReserve.scaledATokenBalance),
        scaledVariableDebt: new BigNumber(userReserve.scaledVariableDebt),
        principalStableDebt: new BigNumber(userReserve.principalStableDebt),
        currentTimestamp,
        precision,
      });
      claimableRewards = claimableRewards
        .plus(rewards.aIncentives)
        .plus(rewards.vIncentives)
        .plus(rewards.sIncentives);
    }
  });

  return claimableRewards;
}

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
  reserveIncentives: ReserveIncentiveData[];
  userReserveIncentives: UserReserveIncentiveData[];
  userReserves: RawUserReserveData[];
  currentTimestamp: number;
  precision: number;
}

export function calculateTotalUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
  precision,
}: CalculateTotalUserIncentivesRequest): BigNumber {
  let claimableRewards = new BigNumber('0');
  if (userReserveIncentives.length > 0) {
    claimableRewards =
      userReserveIncentives[0].aIncentiveData.userUnclaimedRewards;
  }

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

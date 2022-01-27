import BigNumber from 'bignumber.js';
import { normalize } from '../../bignumber';
import { rayDiv } from '../../ray.math';
import { calculateAccruedIncentives } from './calculate-accrued-incentives';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
  UserReserveCalculationData,
} from './types';

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized; // token incentive data, from UiIncentiveDataProvider
  userIncentives: UserReservesIncentivesDataHumanized; // user incentive data, from UiIncentiveDataProvider
  currentTimestamp: number;
  userReserveData?: UserReserveCalculationData; // optional to account for case that user no longer has the supply or borrow position but still has unclaimed rewards
}

export interface UserReserveIncentive {
  tokenAddress: string;
  incentiveController: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
  rewardTokenDecimals: number;
  accruedRewards: BigNumber;
  unclaimedRewards: BigNumber;
  rewardPriceFeed: string;
}

// Calculate user supply and borrow incentives for an individual reserve asset
export function calculateUserReserveIncentives({
  reserveIncentives,
  userIncentives,
  currentTimestamp,
  userReserveData,
}: CalculateUserReserveIncentivesRequest): UserReserveIncentive[] {
  const calculatedUserIncentives: UserReserveIncentive[] = [];
  // Compute incentive data for each reward linked to supply of this reserve
  userIncentives.aTokenIncentivesUserData.userRewardsInformation.forEach(
    userReserveIncentive => {
      const reserveIncentive =
        reserveIncentives.aIncentiveData.rewardsTokenInformation.find(
          reward =>
            reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress,
        );
      if (reserveIncentive) {
        // Calculating accrued rewards is only required if user has an active aToken balance
        const accruedRewards = userReserveData
          ? calculateAccruedIncentives({
              principalUserBalance: new BigNumber(
                userReserveData.scaledATokenBalance,
              ),
              reserveIndex: new BigNumber(
                reserveIncentive.tokenIncentivesIndex,
              ),
              userIndex: new BigNumber(
                userReserveIncentive.tokenIncentivesUserIndex,
              ),
              precision: reserveIncentive.precision,
              reserveIndexTimestamp:
                reserveIncentive.incentivesLastUpdateTimestamp,
              emissionPerSecond: new BigNumber(
                reserveIncentive.emissionPerSecond,
              ),
              totalSupply: rayDiv(
                new BigNumber(userReserveData.reserve.totalLiquidity).shiftedBy(
                  userReserveData.reserve.decimals,
                ),
                new BigNumber(userReserveData.reserve.liquidityIndex),
              ),
              currentTimestamp,
              emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
            })
          : new BigNumber('0');

        calculatedUserIncentives.push({
          tokenAddress: userIncentives.aTokenIncentivesUserData.tokenAddress,
          incentiveController:
            userIncentives.aTokenIncentivesUserData.incentiveControllerAddress,
          rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
          rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
          accruedRewards,
          unclaimedRewards: new BigNumber(
            userReserveIncentive.userUnclaimedRewards,
          ),
          rewardPriceFeed: normalize(
            userReserveIncentive.rewardPriceFeed,
            userReserveIncentive.priceFeedDecimals,
          ),
          rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
        });
      }
    },
  );
  // Compute incentive data for each reward linked to variable borrows of this reserve
  userIncentives.vTokenIncentivesUserData.userRewardsInformation.forEach(
    userReserveIncentive => {
      const reserveIncentive =
        reserveIncentives.vIncentiveData.rewardsTokenInformation.find(
          reward =>
            reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress,
        );
      if (reserveIncentive) {
        // Calculating accrued rewards is only required if user has an active variableDebt token balance
        const accruedRewards = userReserveData
          ? calculateAccruedIncentives({
              principalUserBalance: new BigNumber(
                userReserveData.scaledVariableDebt,
              ),
              reserveIndex: new BigNumber(
                reserveIncentive.tokenIncentivesIndex,
              ),
              userIndex: new BigNumber(
                userReserveIncentive.tokenIncentivesUserIndex,
              ),
              precision: reserveIncentive.precision,
              reserveIndexTimestamp:
                reserveIncentive.incentivesLastUpdateTimestamp,
              emissionPerSecond: new BigNumber(
                reserveIncentive.emissionPerSecond,
              ),
              totalSupply: new BigNumber(
                userReserveData.reserve.totalScaledVariableDebt,
              ).shiftedBy(userReserveData.reserve.decimals),
              currentTimestamp,
              emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
            })
          : new BigNumber('0');
        calculatedUserIncentives.push({
          tokenAddress: userIncentives.vTokenIncentivesUserData.tokenAddress,
          incentiveController:
            userIncentives.vTokenIncentivesUserData.incentiveControllerAddress,
          rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
          rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
          accruedRewards,
          unclaimedRewards: new BigNumber(
            userReserveIncentive.userUnclaimedRewards,
          ),
          rewardPriceFeed: normalize(
            userReserveIncentive.rewardPriceFeed,
            userReserveIncentive.priceFeedDecimals,
          ),
          rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
        });
      }
    },
  );
  // Compute incentive data for each reward linked to stable borrows of this reserve
  userIncentives.sTokenIncentivesUserData.userRewardsInformation.forEach(
    userReserveIncentive => {
      const reserveIncentive =
        reserveIncentives.sIncentiveData.rewardsTokenInformation.find(
          reward =>
            reward.rewardTokenAddress ===
            userReserveIncentive.rewardTokenAddress,
        );
      if (reserveIncentive) {
        // Calculating accrued rewards is only required if user has an active stableDebtToken balance
        const accruedRewards = userReserveData
          ? calculateAccruedIncentives({
              principalUserBalance: new BigNumber(
                userReserveData.principalStableDebt,
              ),
              reserveIndex: new BigNumber(
                reserveIncentive.tokenIncentivesIndex,
              ),
              userIndex: new BigNumber(
                userReserveIncentive.tokenIncentivesUserIndex,
              ),
              precision: reserveIncentive.precision,
              reserveIndexTimestamp:
                reserveIncentive.incentivesLastUpdateTimestamp,
              emissionPerSecond: new BigNumber(
                reserveIncentive.emissionPerSecond,
              ),
              totalSupply: new BigNumber(
                userReserveData.reserve.totalPrincipalStableDebt,
              ).shiftedBy(userReserveData.reserve.decimals),
              currentTimestamp,
              emissionEndTimestamp: reserveIncentive.emissionEndTimestamp,
            })
          : new BigNumber('0');
        calculatedUserIncentives.push({
          tokenAddress: userIncentives.sTokenIncentivesUserData.tokenAddress,
          incentiveController:
            userIncentives.sTokenIncentivesUserData.incentiveControllerAddress,
          rewardTokenAddress: userReserveIncentive.rewardTokenAddress,
          rewardTokenDecimals: userReserveIncentive.rewardTokenDecimals,
          accruedRewards,
          unclaimedRewards: new BigNumber(
            userReserveIncentive.userUnclaimedRewards,
          ),
          rewardPriceFeed: normalize(
            userReserveIncentive.rewardPriceFeed,
            userReserveIncentive.priceFeedDecimals,
          ),
          rewardTokenSymbol: userReserveIncentive.rewardTokenSymbol,
        });
      }
    },
  );

  return calculatedUserIncentives;
}

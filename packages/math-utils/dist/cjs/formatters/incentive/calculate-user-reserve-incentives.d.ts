import BigNumber from 'bignumber.js';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
  UserReserveCalculationData,
} from './types';
export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized;
  userIncentives: UserReservesIncentivesDataHumanized;
  currentTimestamp: number;
  userReserveData?: UserReserveCalculationData;
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
export declare function calculateUserReserveIncentives({
  reserveIncentives,
  userIncentives,
  currentTimestamp,
  userReserveData,
}: CalculateUserReserveIncentivesRequest): UserReserveIncentive[];
//# sourceMappingURL=calculate-user-reserve-incentives.d.ts.map

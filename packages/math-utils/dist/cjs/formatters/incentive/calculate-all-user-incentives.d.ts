import { BigNumber } from 'bignumber.js';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
  UserReserveCalculationData,
} from './types';
export declare type UserIncentiveDict = Record<string, UserIncentiveData>;
export interface UserIncentiveData {
  incentiveControllerAddress: string;
  rewardTokenSymbol: string;
  rewardPriceFeed: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}
export interface CalculateAllUserIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  userIncentives: UserReservesIncentivesDataHumanized[];
  userReserves: UserReserveCalculationData[];
  currentTimestamp: number;
}
export declare function calculateAllUserIncentives({
  reserveIncentives,
  userIncentives,
  userReserves,
  currentTimestamp,
}: CalculateAllUserIncentivesRequest): UserIncentiveDict;
//# sourceMappingURL=calculate-all-user-incentives.d.ts.map

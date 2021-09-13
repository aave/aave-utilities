import {
  BigNumber,
} from "ethers";

export type IncentiveData = {
  emissionPerSecond: BigNumber;
  incentivesLastUpdateTimestamp: BigNumber;
  tokenIncentivesIndex: BigNumber;
  emissionEndTimestamp: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: string;
  5: string;
};

export type IncentiveUserData = {
  tokenincentivesUserIndex: BigNumber;
  userUnclaimedRewards: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
  0: BigNumber;
  1: BigNumber;
  2: string;
  3: string;
};

export type ReserveIncentiveDataResponse = {
  underlyingAsset: string;
  aIncentiveData: IncentiveData;
  vIncentiveData: IncentiveData;
  sIncentiveData: IncentiveData;
  0: string;
  1: IncentiveData;
  2: IncentiveData;
  3: IncentiveData;
};

export type UserReserveIncentiveDataResponse = {
  underlyingAsset: string;
  aTokenIncentivesUserData: IncentiveUserData;
  vTokenIncentivesUserData: IncentiveUserData;
  sTokenIncentivesUserData: IncentiveUserData;
  0: string;
  1: IncentiveUserData;
  2: IncentiveUserData;
  3: IncentiveUserData;
};

export type FullReservesIncentiveDataResponse = {
  0: ReserveIncentiveDataResponse[];
  1: UserReserveIncentiveDataResponse[];
};
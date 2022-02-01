import { BigNumber } from 'ethers';

export interface IncentiveData {
  emissionPerSecond: BigNumber;
  incentivesLastUpdateTimestamp: BigNumber;
  tokenIncentivesIndex: BigNumber;
  emissionEndTimestamp: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  precision: number;
  0: BigNumber;
  1: BigNumber;
  2: BigNumber;
  3: BigNumber;
  4: string;
  5: string;
  6: string;
  7: number;
  8: number;
}

export interface IncentiveDataHumanized {
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: number;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: number;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  precision: number;
}

export interface IncentivesWithFeeds extends IncentiveDataHumanized {
  priceFeed: string;
  priceFeedTimestamp: number;
  priceFeedDecimals: number;
}

export interface IncentiveUserData {
  tokenincentivesUserIndex: BigNumber;
  userUnclaimedRewards: BigNumber;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  0: BigNumber;
  1: BigNumber;
  2: string;
  3: string;
  4: string;
  5: number;
}

export interface IncentiveUserDataHumanized {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
}

export interface ReserveIncentiveDataResponse {
  underlyingAsset: string;
  aIncentiveData: IncentiveData;
  vIncentiveData: IncentiveData;
  sIncentiveData: IncentiveData;
  0: string;
  1: IncentiveData;
  2: IncentiveData;
  3: IncentiveData;
}

export interface ReserveIncentiveDataHumanizedResponse {
  id: string;
  underlyingAsset: string;
  aIncentiveData: IncentiveDataHumanized;
  vIncentiveData: IncentiveDataHumanized;
  sIncentiveData: IncentiveDataHumanized;
}

export interface ReserveIncentiveWithFeedsResponse {
  underlyingAsset: string;
  aIncentiveData: IncentivesWithFeeds;
  vIncentiveData: IncentivesWithFeeds;
  sIncentiveData: IncentivesWithFeeds;
}

export interface UserReserveIncentiveDataResponse {
  underlyingAsset: string;
  aTokenIncentivesUserData: IncentiveUserData;
  vTokenIncentivesUserData: IncentiveUserData;
  sTokenIncentivesUserData: IncentiveUserData;
  0: string;
  1: IncentiveUserData;
  2: IncentiveUserData;
  3: IncentiveUserData;
}

export interface UserReserveIncentiveDataHumanizedResponse {
  id: string;
  underlyingAsset: string;
  aTokenIncentivesUserData: IncentiveUserDataHumanized;
  vTokenIncentivesUserData: IncentiveUserDataHumanized;
  sTokenIncentivesUserData: IncentiveUserDataHumanized;
}

export interface FullReservesIncentiveDataResponse {
  0: ReserveIncentiveDataResponse[];
  1: UserReserveIncentiveDataResponse[];
}

import { BigNumber } from 'ethers';

// SmartContract response types

export type RewardInfo = {
  rewardTokenSymbol: string;
  rewardTokenAddress: string;
  rewardOracleAddress: string;
  emissionPerSecond: BigNumber;
  incentivesLastUpdateTimestamp: BigNumber;
  tokenIncentivesIndex: BigNumber;
  emissionEndTimestamp: BigNumber;
  rewardPriceFeed: BigNumber;
  rewardTokenDecimals: number;
  precision: number;
  priceFeedDecimals: number;
};

export interface IncentiveData {
  tokenAddress: string;
  incentiveControllerAddress: string;
  rewardsTokenInformation: RewardInfo[];
}

export interface ReservesIncentiveData {
  underlyingAsset: string;
  aIncentiveData: IncentiveData;
  vIncentiveData: IncentiveData;
  sIncentiveData: IncentiveData;
}

export interface UserRewardInfo {
  rewardTokenSymbol: string;
  rewardOracleAddress: string;
  rewardTokenAddress: string;
  userUnclaimedRewards: BigNumber;
  tokenIncentivesUserIndex: BigNumber;
  rewardPriceFeed: BigNumber;
  priceFeedDecimals: number;
  rewardTokenDecimals: number;
}
export interface UserIncentiveData {
  tokenAddress: string;
  incentiveControllerAddress: string;
  userRewardsInformation: UserRewardInfo[];
}
export interface UserReservesIncentivesData {
  underlyingAsset: string;
  aTokenIncentivesUserData: UserIncentiveData;
  vTokenIncentivesUserData: UserIncentiveData;
  sTokenIncentivesUserData: UserIncentiveData;
}

export interface FullReservesIncentiveDataResponse {
  0: ReservesIncentiveData[];
  1: UserReservesIncentivesData[];
}

// Humanized response types

export interface RewardInfoHumanized {
  rewardTokenSymbol: string;
  rewardTokenAddress: string;
  rewardOracleAddress: string;
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: number;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: number;
  rewardPriceFeed: string;
  rewardTokenDecimals: number;
  precision: number;
  priceFeedDecimals: number;
}

export interface IncentiveDataHumanized {
  tokenAddress: string;
  incentiveControllerAddress: string;
  rewardsTokenInformation: RewardInfoHumanized[];
}

export interface ReservesIncentiveDataHumanized {
  underlyingAsset: string;
  aIncentiveData: IncentiveDataHumanized;
  vIncentiveData: IncentiveDataHumanized;
  sIncentiveData: IncentiveDataHumanized;
}

export interface UserRewardInfoHumanized {
  rewardTokenSymbol: string;
  rewardOracleAddress: string;
  rewardTokenAddress: string;
  userUnclaimedRewards: string;
  tokenIncentivesUserIndex: string;
  rewardPriceFeed: string;
  priceFeedDecimals: number;
  rewardTokenDecimals: number;
}

export interface UserIncentiveDataHumanized {
  tokenAddress: string;
  incentiveControllerAddress: string;
  userRewardsInformation: UserRewardInfoHumanized[];
}

export interface UserReservesIncentivesDataHumanized {
  underlyingAsset: string;
  aTokenIncentivesUserData: UserIncentiveDataHumanized;
  vTokenIncentivesUserData: UserIncentiveDataHumanized;
  sTokenIncentivesUserData: UserIncentiveDataHumanized;
}

// Method types

export type FullReservesIncentiveDataType = {
  user: string;
  lendingPoolAddressProvider: string;
};

export type UserReservesIncentivesDataType = {
  user: string;
  lendingPoolAddressProvider: string;
};

// export interface IncentiveDataHumanized {
//   emissionPerSecond: string;
//   incentivesLastUpdateTimestamp: number;
//   tokenIncentivesIndex: string;
//   emissionEndTimestamp: number;
//   tokenAddress: string;
//   rewardTokenAddress: string;
//   incentiveControllerAddress: string;
//   rewardTokenDecimals: number;
//   precision: number;
// }

// export interface IncentivesWithFeeds extends IncentiveDataHumanized {
//   priceFeed: string;
//   priceFeedTimestamp: number;
//   priceFeedDecimals: number;
// }

// export interface IncentiveUserDataHumanized {
//   tokenIncentivesUserIndex: string;
//   userUnclaimedRewards: string;
//   tokenAddress: string;
//   rewardTokenAddress: string;
//   incentiveControllerAddress: string;
//   rewardTokenDecimals: number;
// }

// export interface ReserveIncentiveDataHumanizedResponse {
//   underlyingAsset: string;
//   aIncentiveData: IncentiveDataHumanized;
//   vIncentiveData: IncentiveDataHumanized;
//   sIncentiveData: IncentiveDataHumanized;
// }

// export interface ReserveIncentiveWithFeedsResponse {
//   underlyingAsset: string;
//   aIncentiveData: IncentivesWithFeeds;
//   vIncentiveData: IncentivesWithFeeds;
//   sIncentiveData: IncentivesWithFeeds;
// }

// export interface UserReserveIncentiveDataHumanizedResponse {
//   underlyingAsset: string;
//   aTokenIncentivesUserData: IncentiveUserDataHumanized;
//   vTokenIncentivesUserData: IncentiveUserDataHumanized;
//   sTokenIncentivesUserData: IncentiveUserDataHumanized;
// }

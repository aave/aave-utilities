// From UiIncentiveDatProvider
export interface ReservesIncentiveDataHumanized {
  underlyingAsset: string;
  aIncentiveData: IncentiveDataHumanized;
  vIncentiveData: IncentiveDataHumanized;
  sIncentiveData: IncentiveDataHumanized;
}

export interface IncentiveDataHumanized {
  tokenAddress: string;
  incentiveControllerAddress: string;
  rewardsTokenInformation: RewardInfoHumanized[];
}

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

export interface UserReservesIncentivesDataHumanized {
  underlyingAsset: string;
  aTokenIncentivesUserData: UserIncentiveDataHumanized;
  vTokenIncentivesUserData: UserIncentiveDataHumanized;
  sTokenIncentivesUserData: UserIncentiveDataHumanized;
}

export interface UserIncentiveDataHumanized {
  tokenAddress: string;
  incentiveControllerAddress: string;
  userRewardsInformation: UserRewardInfoHumanized[];
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

export interface UserReserveCalculationData {
  underlyingAsset: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  scaledATokenBalance: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
}

export interface ReserveCalculationData {
  underlyingAsset: string;
  symbol: string;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  priceInMarketReferenceCurrency: string;
  marketReferenceCurrencyDecimals: number;
  decimals: number;
}

// OLD INCENTIVES TYPES BELOW, WILLBE REMOVED

// From UiIncentiveDatProvider
export interface ReserveIncentiveWithFeedsResponse {
  underlyingAsset: string;
  aIncentiveData: IncentivesWithFeeds;
  vIncentiveData: IncentivesWithFeeds;
  sIncentiveData: IncentivesWithFeeds;
}

export interface IncentivesWithFeeds extends IncentiveDataHumanizedOld {
  priceFeed: string;
  priceFeedTimestamp: number;
  priceFeedDecimals: number;
}

export interface IncentiveDataHumanizedOld {
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

// From UiIncentiveDataProvider
export interface UserReserveIncentiveDataHumanizedResponse {
  underlyingAsset: string;
  aTokenIncentivesUserData: IncentiveUserDataHumanizedOld;
  vTokenIncentivesUserData: IncentiveUserDataHumanizedOld;
  sTokenIncentivesUserData: IncentiveUserDataHumanizedOld;
}

export interface IncentiveUserDataHumanizedOld {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
}

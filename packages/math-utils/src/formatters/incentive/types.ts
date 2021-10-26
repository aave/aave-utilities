// From UiIncentiveDatProvider
export interface ReserveIncentiveWithFeedsResponse {
  underlyingAsset: string;
  aIncentiveData: IncentivesWithFeeds;
  vIncentiveData: IncentivesWithFeeds;
  sIncentiveData: IncentivesWithFeeds;
}

export interface IncentivesWithFeeds extends IncentiveDataHumanized {
  priceFeed: string;
  priceFeedTimestamp: number;
  priceFeedDecimals: number;
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

// From UiIncentiveDataProvider
export interface UserReserveIncentiveDataHumanizedResponse {
  underlyingAsset: string;
  aTokenIncentivesUserData: IncentiveUserDataHumanized;
  vTokenIncentivesUserData: IncentiveUserDataHumanized;
  sTokenIncentivesUserData: IncentiveUserDataHumanized;
}

export interface IncentiveUserDataHumanized {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
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

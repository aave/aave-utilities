// From UiIncentiveDatProvider
export interface ReservesIncentiveDataHumanized {
  underlyingAsset: string;
  aIncentiveData: IncentiveDataHumanized;
  vIncentiveData: IncentiveDataHumanized;
}

export interface UserReservesIncentivesDataHumanized {
  underlyingAsset: string;
  aTokenIncentivesUserData: UserIncentiveDataHumanized;
  vTokenIncentivesUserData: UserIncentiveDataHumanized;
}

export interface UserReserveCalculationData {
  scaledATokenBalance: string;
  scaledVariableDebt: string;
  reserve: {
    underlyingAsset: string;
    totalLiquidity: string;
    liquidityIndex: string;
    totalScaledVariableDebt: string;
    decimals: number;
  };
}

export interface ReserveCalculationData {
  underlyingAsset: string;
  symbol: string;
  totalLiquidity: string;
  totalVariableDebt: string;
  formattedPriceInMarketReferenceCurrency: string;
  decimals: number;
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

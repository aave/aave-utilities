import { IncentiveDataHumanized, UserIncentiveDataHumanized } from './types';

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

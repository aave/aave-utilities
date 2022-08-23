import { ReservesIncentiveDataHumanized } from './types';
export interface CalculateReserveIncentivesRequest {
  reserves: Array<{
    underlyingAsset: string;
    formattedPriceInMarketReferenceCurrency: string;
  }>;
  reserveIncentiveData: ReservesIncentiveDataHumanized;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string;
  marketReferenceCurrencyDecimals: number;
}
export interface ReserveIncentiveResponse {
  incentiveAPR: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
}
export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse[];
  vIncentivesData: ReserveIncentiveResponse[];
  sIncentivesData: ReserveIncentiveResponse[];
}
export declare function calculateRewardTokenPrice(
  reserves: Array<{
    underlyingAsset: string;
    formattedPriceInMarketReferenceCurrency: string;
  }>,
  address: string,
  priceFeed: string,
  priceFeedDecimals: number,
): string;
export declare function calculateReserveIncentives({
  reserves,
  reserveIncentiveData,
  totalLiquidity,
  totalVariableDebt,
  totalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse;
//# sourceMappingURL=calculate-reserve-incentives.d.ts.map

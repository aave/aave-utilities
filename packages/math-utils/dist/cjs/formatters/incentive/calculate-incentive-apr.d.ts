export interface CalculateIncentiveAPRRequest {
  emissionPerSecond: string;
  rewardTokenPriceInMarketReferenceCurrency: string;
  totalTokenSupply: string;
  priceInMarketReferenceCurrency: string;
  decimals: number;
  rewardTokenDecimals: number;
}
export declare function calculateIncentiveAPR({
  emissionPerSecond,
  rewardTokenPriceInMarketReferenceCurrency,
  priceInMarketReferenceCurrency,
  totalTokenSupply,
  decimals,
}: CalculateIncentiveAPRRequest): string;
//# sourceMappingURL=calculate-incentive-apr.d.ts.map

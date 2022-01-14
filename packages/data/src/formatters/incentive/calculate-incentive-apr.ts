import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { SECONDS_PER_YEAR, WEI_DECIMALS } from '../../constants';

export interface CalculateIncentiveAPRRequest {
  emissionPerSecond: string;
  rewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  totalTokenSupply: string;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  decimals: number;
  rewardTokenDecimals: number;
}

// Calculate the APR for an incentive emission
export function calculateIncentiveAPR({
  emissionPerSecond,
  rewardTokenPriceInMarketReferenceCurrency,
  priceInMarketReferenceCurrency,
  totalTokenSupply,
  decimals,
}: CalculateIncentiveAPRRequest): string {
  const emissionPerSecondNormalized = normalizeBN(
    emissionPerSecond,
    WEI_DECIMALS,
  ).multipliedBy(rewardTokenPriceInMarketReferenceCurrency);

  if (emissionPerSecondNormalized.eq(0)) {
    return '0';
  }

  const emissionPerYear =
    emissionPerSecondNormalized.multipliedBy(SECONDS_PER_YEAR);

  const totalSupplyNormalized = valueToBigNumber(
    normalize(totalTokenSupply, decimals),
  ).multipliedBy(priceInMarketReferenceCurrency);

  return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}

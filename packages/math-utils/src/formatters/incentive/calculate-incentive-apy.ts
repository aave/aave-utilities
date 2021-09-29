import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentiveAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  totalTokenSupply: string;
  tokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  decimals: number;
  rewardTokenDecimals: number;
}

// Calculate the APY for an incentive emission
export function calculateIncentiveAPY({
  emissionPerSecond,
  rewardTokenPriceInMarketReferenceCurrency,
  tokenPriceInMarketReferenceCurrency,
  totalTokenSupply,
  decimals,
  rewardTokenDecimals,
}: CalculateIncentiveAPYRequest): string {
  const emissionPerSecondNormalized = normalizeBN(
    emissionPerSecond,
    rewardTokenDecimals,
  ).multipliedBy(rewardTokenPriceInMarketReferenceCurrency);

  if (emissionPerSecondNormalized.eq(0)) {
    return '0';
  }

  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  );

  const totalSupplyNormalized = valueToBigNumber(
    normalize(totalTokenSupply, decimals),
  ).multipliedBy(tokenPriceInMarketReferenceCurrency);

  return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}

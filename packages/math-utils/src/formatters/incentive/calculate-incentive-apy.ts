import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentiveAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInMarketReferenceCurrency: string;
  totalTokenSupply: string;
  decimals: number;
  tokenPriceInMarketReferenceCurrency: string;
}

export function calculateIncentiveAPY({
  emissionPerSecond,
  rewardTokenPriceInMarketReferenceCurrency,
  tokenPriceInMarketReferenceCurrency,
  totalTokenSupply,
  decimals,
}: CalculateIncentiveAPYRequest): string {
  const emissionPerSecondNormalized = normalizeBN(
    emissionPerSecond,
    ETH_DECIMALS,
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

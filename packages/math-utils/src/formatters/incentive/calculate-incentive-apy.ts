import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentiveAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInEth: string;
  totalTokenSupply: string;
  decimals: number;
  tokenPriceInEth: string;
}

export function calculateIncentiveAPY({
  emissionPerSecond,
  rewardTokenPriceInEth,
  tokenPriceInEth,
  totalTokenSupply,
  decimals,
}: CalculateIncentiveAPYRequest): string {
  const emissionPerSecondNormalized = normalizeBN(
    emissionPerSecond,
    ETH_DECIMALS,
  ).multipliedBy(rewardTokenPriceInEth);

  if (emissionPerSecondNormalized.eq(0)) {
    return '0';
  }

  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  );

  const totalSupplyNormalized = valueToBigNumber(
    normalize(totalTokenSupply, decimals),
  ).multipliedBy(tokenPriceInEth);

  return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}

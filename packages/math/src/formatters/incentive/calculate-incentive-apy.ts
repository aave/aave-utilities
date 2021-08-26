import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentiveAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInEth: string;
  tokenTotalSupply: string;
  decimals: number;
  tokenPriceInEth: string;
}

export function calculateIncentiveAPY(
  request: CalculateIncentiveAPYRequest,
): string {
  const emissionPerSecondNormalized = normalizeBN(
    request.emissionPerSecond,
    ETH_DECIMALS,
  ).multipliedBy(request.rewardTokenPriceInEth);

  if (emissionPerSecondNormalized.eq(0)) {
    return '0';
  }

  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  );

  const totalSupplyNormalized = valueToBigNumber(
    normalize(request.tokenTotalSupply, request.decimals),
  ).multipliedBy(request.tokenPriceInEth);

  return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}

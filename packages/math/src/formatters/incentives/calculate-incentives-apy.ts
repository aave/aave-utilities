import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentivesAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInEth: string;
  total: string;
  decimals: number;
  tokenPriceInEth: string;
}

export function calculateIncentivesAPY(
  request: CalculateIncentivesAPYRequest,
): string {
  const emissionPerSecondNormalized = normalizeBN(
    request.emissionPerSecond,
    ETH_DECIMALS,
  ).multipliedBy(request.rewardTokenPriceInEth);

  if (emissionPerSecondNormalized.eq(0)) {
    return emissionPerSecondNormalized.toFixed();
  }

  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  );

  const totalSupplyNormalized = valueToBigNumber(
    normalize(request.total, request.decimals),
  ).multipliedBy(request.tokenPriceInEth);

  return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}

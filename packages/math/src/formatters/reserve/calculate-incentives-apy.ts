import BigNumber from 'bignumber.js';
import { normalize, normalizeBN, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, SECONDS_PER_YEAR } from '../../constants';

export interface CalculateIncentivesAPYRequest {
  emissionPerSecond: string;
  rewardTokenPriceInEth: string;
  tokenTotalSupply: BigNumber;
  decimals: number;
  tokenPriceInEth: string;
}

export function calculateIncentivesAPY(
  request: CalculateIncentivesAPYRequest,
): BigNumber {
  const emissionPerSecondNormalized = normalizeBN(
    request.emissionPerSecond,
    ETH_DECIMALS,
  ).multipliedBy(request.rewardTokenPriceInEth);

  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(
    SECONDS_PER_YEAR,
  );

  const totalSupplyNormalized = valueToBigNumber(
    normalize(request.tokenTotalSupply, request.decimals),
  ).multipliedBy(request.tokenPriceInEth);

  return emissionPerYear.dividedBy(totalSupplyNormalized);
}

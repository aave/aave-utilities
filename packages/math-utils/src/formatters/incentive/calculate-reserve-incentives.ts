import { BigNumber } from 'bignumber.js';
import { rayDiv } from '../../ray.math';
import { calculateIncentiveAPY } from './calculate-incentive-apy';

interface ReserveIncentiveEmission {
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: string;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  precision: number;
}

interface ReserveIncentiveData {
  underlyingAsset: string;
  aIncentiveData: ReserveIncentiveEmission;
  vIncentiveData: ReserveIncentiveEmission;
  sIncentiveData: ReserveIncentiveEmission;
}

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReserveIncentiveData;
  rewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  decimals: number;
  tokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
}

export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesAPY: string;
  vIncentivesAPY: string;
  sIncentivesAPY: string;
}

// Calculate deposit, variableBorrow, and stableBorrow incentives APY for a reserve asset
export function calculateReserveIncentives({
  reserveIncentiveData,
  rewardTokenPriceInMarketReferenceCurrency,
  totalLiquidity,
  liquidityIndex,
  totalScaledVariableDebt,
  totalPrincipalStableDebt,
  tokenPriceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.aIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency,
    tokenPriceInMarketReferenceCurrency,
    totalTokenSupply: rayDiv(
      new BigNumber(totalLiquidity),
      new BigNumber(liquidityIndex),
    ).toString(),
    decimals: reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  const vIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.vIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency,
    tokenPriceInMarketReferenceCurrency,
    totalTokenSupply: totalScaledVariableDebt,
    decimals: reserveIncentiveData.vIncentiveData.rewardTokenDecimals,
  });

  const sIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.sIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency,
    tokenPriceInMarketReferenceCurrency,
    totalTokenSupply: totalPrincipalStableDebt,
    decimals: reserveIncentiveData.sIncentiveData.rewardTokenDecimals,
  });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    aIncentivesAPY,
    vIncentivesAPY,
    sIncentivesAPY,
  };
}

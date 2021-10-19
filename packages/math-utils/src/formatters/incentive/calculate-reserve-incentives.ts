// For some reason eslint doesn't resolve type of reserveIncentiveData
import { ReserveIncentiveWithFeedsResponse } from '@aave/contract-helpers';
import { BigNumber } from 'bignumber.js';
import { rayDiv } from '../../ray.math';
import { calculateIncentiveAPY } from './calculate-incentive-apy';

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReserveIncentiveWithFeedsResponse;
  aRewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  vRewardTokenPriceInMarketReferenceCurrency: string;
  sRewardTokenPriceInMarketReferenceCurrency: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
}

interface ReserveIncentiveResponse {
  incentiveAPY: string;
  rewardTokenAddress: string;
}
export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse;
  vIncentivesData: ReserveIncentiveResponse;
  sIncentivesData: ReserveIncentiveResponse;
}

// Calculate deposit, variableBorrow, and stableBorrow incentives APY for a reserve asset
export function calculateReserveIncentives({
  reserveIncentiveData,
  aRewardTokenPriceInMarketReferenceCurrency,
  vRewardTokenPriceInMarketReferenceCurrency,
  sRewardTokenPriceInMarketReferenceCurrency,
  totalLiquidity,
  liquidityIndex,
  totalScaledVariableDebt,
  totalPrincipalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.aIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      aRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: rayDiv(
      new BigNumber(totalLiquidity),
      new BigNumber(liquidityIndex),
    ).toString(),
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  const vIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.vIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      vRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalScaledVariableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  const sIncentivesAPY = calculateIncentiveAPY({
    emissionPerSecond: reserveIncentiveData.sIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      sRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalPrincipalStableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    aIncentivesData: {
      incentiveAPY: aIncentivesAPY,
      rewardTokenAddress:
        reserveIncentiveData.aIncentiveData.rewardTokenAddress,
    },
    vIncentivesData: {
      incentiveAPY: vIncentivesAPY,
      rewardTokenAddress:
        reserveIncentiveData.vIncentiveData.rewardTokenAddress,
    },
    sIncentivesData: {
      incentiveAPY: sIncentivesAPY,
      rewardTokenAddress:
        reserveIncentiveData.sIncentiveData.rewardTokenAddress,
    },
  };
}

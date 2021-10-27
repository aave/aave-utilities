import { calculateIncentiveAPR } from './calculate-incentive-apr';
import { ReserveIncentiveWithFeedsResponse } from './types';

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReserveIncentiveWithFeedsResponse;
  aRewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  vRewardTokenPriceInMarketReferenceCurrency: string;
  sRewardTokenPriceInMarketReferenceCurrency: string;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
}

interface ReserveIncentiveResponse {
  incentiveAPR: string;
  rewardTokenAddress: string;
}
export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse;
  vIncentivesData: ReserveIncentiveResponse;
  sIncentivesData: ReserveIncentiveResponse;
}

// Calculate deposit, variableBorrow, and stableBorrow incentives APR for a reserve asset
export function calculateReserveIncentives({
  reserveIncentiveData,
  aRewardTokenPriceInMarketReferenceCurrency,
  vRewardTokenPriceInMarketReferenceCurrency,
  sRewardTokenPriceInMarketReferenceCurrency,
  totalLiquidity,
  totalVariableDebt,
  totalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.aIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      aRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalLiquidity,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  const vIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.vIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      vRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalVariableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  const sIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.sIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      sRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalStableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.aIncentiveData.rewardTokenDecimals,
  });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    aIncentivesData: {
      incentiveAPR: aIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.aIncentiveData.rewardTokenAddress,
    },
    vIncentivesData: {
      incentiveAPR: vIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.vIncentiveData.rewardTokenAddress,
    },
    sIncentivesData: {
      incentiveAPR: sIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.sIncentiveData.rewardTokenAddress,
    },
  };
}

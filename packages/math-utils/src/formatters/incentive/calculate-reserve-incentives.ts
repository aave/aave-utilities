import { calculateIncentiveAPR } from './calculate-incentive-apr';
import { ReservesIncentiveDataHumanized } from './types';

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReservesIncentiveDataHumanized;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
}

interface ReserveIncentiveResponse {
  incentiveAPR: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
}
export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse[];
  vIncentivesData: ReserveIncentiveResponse[];
  sIncentivesData: ReserveIncentiveResponse[];
}

// Calculate deposit, variableBorrow, and stableBorrow incentives APR for a reserve asset
export function calculateReserveIncentives({
  reserveIncentiveData,
  totalLiquidity,
  totalVariableDebt,
  totalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesData: ReserveIncentiveResponse[] =
    reserveIncentiveData.aIncentiveData.rewardsTokenInformation.map(reward => {
      const aIncentivesAPR = calculateIncentiveAPR({
        emissionPerSecond: reward.emissionPerSecond,
        rewardTokenPriceInMarketReferenceCurrency: reward.rewardPriceFeed,
        priceInMarketReferenceCurrency,
        totalTokenSupply: totalLiquidity,
        decimals,
        rewardTokenDecimals: reward.rewardTokenDecimals,
      });
      const aIncentiveData: ReserveIncentiveResponse = {
        incentiveAPR: aIncentivesAPR,
        rewardTokenAddress: reward.rewardTokenAddress,
        rewardTokenSymbol: reward.rewardTokenSymbol,
      };
      return aIncentiveData;
    });
  const vIncentivesData: ReserveIncentiveResponse[] =
    reserveIncentiveData.aIncentiveData.rewardsTokenInformation.map(reward => {
      const vIncentivesAPR = calculateIncentiveAPR({
        emissionPerSecond: reward.emissionPerSecond,
        rewardTokenPriceInMarketReferenceCurrency: reward.rewardPriceFeed,
        priceInMarketReferenceCurrency,
        totalTokenSupply: totalVariableDebt,
        decimals,
        rewardTokenDecimals: reward.rewardTokenDecimals,
      });
      const vIncentiveData: ReserveIncentiveResponse = {
        incentiveAPR: vIncentivesAPR,
        rewardTokenAddress: reward.rewardTokenAddress,
        rewardTokenSymbol: reward.rewardTokenSymbol,
      };
      return vIncentiveData;
    });
  const sIncentivesData: ReserveIncentiveResponse[] =
    reserveIncentiveData.aIncentiveData.rewardsTokenInformation.map(reward => {
      const sIncentivesAPR = calculateIncentiveAPR({
        emissionPerSecond: reward.emissionPerSecond,
        rewardTokenPriceInMarketReferenceCurrency: reward.rewardPriceFeed,
        priceInMarketReferenceCurrency,
        totalTokenSupply: totalStableDebt,
        decimals,
        rewardTokenDecimals: reward.rewardTokenDecimals,
      });
      const sIncentiveData: ReserveIncentiveResponse = {
        incentiveAPR: sIncentivesAPR,
        rewardTokenAddress: reward.rewardTokenAddress,
        rewardTokenSymbol: reward.rewardTokenSymbol,
      };
      return sIncentiveData;
    });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    aIncentivesData,
    vIncentivesData,
    sIncentivesData,
  };
}

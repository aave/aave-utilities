import { calculateIncentiveAPR } from './calculate-incentive-apr';
import {
  calculateRewardTokenPrice,
  ReserveIncentiveResponse,
} from './calculate-reserve-incentives';
import { ReservesIncentiveDataHumanized, RewardInfoHumanized } from './types';

export interface CalculateReserveIncentivesRequest {
  reserves: Array<{
    underlyingAsset: string;
    formattedPriceInMarketReferenceCurrency: string;
  }>;
  reserveIncentiveData: ReservesIncentiveDataHumanized;
  totalLiquidity: string;
  totalVariableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  marketReferenceCurrencyDecimals: number;
}

export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse[];
  vIncentivesData: ReserveIncentiveResponse[];
}

// Determine is reward emsission is active or distribution has ended
const rewardEmissionActive = (reward: RewardInfoHumanized) => {
  if (reward.emissionEndTimestamp > reward.incentivesLastUpdateTimestamp) {
    return true;
  }

  return false;
};

// Calculate supply, variableBorrow, and stableBorrow incentives APR for a reserve asset
export function calculateReserveIncentives({
  reserves,
  reserveIncentiveData,
  totalLiquidity,
  totalVariableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesData: ReserveIncentiveResponse[] =
    reserveIncentiveData.aIncentiveData.rewardsTokenInformation.map(reward => {
      const aIncentivesAPR = rewardEmissionActive(reward)
        ? calculateIncentiveAPR({
            emissionPerSecond: reward.emissionPerSecond,
            rewardTokenPriceInMarketReferenceCurrency:
              calculateRewardTokenPrice(
                reserves,
                reward.rewardTokenAddress,
                reward.rewardPriceFeed,
                reward.priceFeedDecimals,
              ),
            priceInMarketReferenceCurrency,
            totalTokenSupply: totalLiquidity,
            decimals,
            rewardTokenDecimals: reward.rewardTokenDecimals,
          })
        : '0';
      const aIncentiveData: ReserveIncentiveResponse = {
        incentiveAPR: aIncentivesAPR,
        rewardTokenAddress: reward.rewardTokenAddress,
        rewardTokenSymbol: reward.rewardTokenSymbol,
      };
      return aIncentiveData;
    });
  const vIncentivesData: ReserveIncentiveResponse[] =
    reserveIncentiveData.vIncentiveData.rewardsTokenInformation.map(reward => {
      const vIncentivesAPR = rewardEmissionActive(reward)
        ? calculateIncentiveAPR({
            emissionPerSecond: reward.emissionPerSecond,
            rewardTokenPriceInMarketReferenceCurrency:
              calculateRewardTokenPrice(
                reserves,
                reward.rewardTokenAddress,
                reward.rewardPriceFeed,
                reward.priceFeedDecimals,
              ),
            priceInMarketReferenceCurrency,
            totalTokenSupply: totalVariableDebt,
            decimals,
            rewardTokenDecimals: reward.rewardTokenDecimals,
          })
        : '0';
      const vIncentiveData: ReserveIncentiveResponse = {
        incentiveAPR: vIncentivesAPR,
        rewardTokenAddress: reward.rewardTokenAddress,
        rewardTokenSymbol: reward.rewardTokenSymbol,
      };
      return vIncentiveData;
    });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    aIncentivesData,
    vIncentivesData,
  };
}

import { normalize } from '../../bignumber';
import { calculateIncentiveAPR } from './calculate-incentive-apr';
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

export interface ReserveIncentiveResponse {
  incentiveAPR: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
}

export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  aIncentivesData: ReserveIncentiveResponse[];
  vIncentivesData: ReserveIncentiveResponse[];
}

export function calculateRewardTokenPrice(
  reserves: Array<{
    underlyingAsset: string;
    formattedPriceInMarketReferenceCurrency: string;
  }>,
  address: string,
  priceFeed: string,
  priceFeedDecimals: number,
): string {
  // For V3 incentives, all rewards will have attached price feed
  if (Number(priceFeed) > 0) {
    return normalize(priceFeed, priceFeedDecimals);
  }

  address = address.toLowerCase();
  // For stkAave incentives, use Aave price feed
  if (address.toLowerCase() === '0x4da27a545c0c5b758a6ba100e3a049001de870f5') {
    address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
  }

  // For V2 incentives, reward price feed comes from the reserves
  const rewardReserve = reserves.find(
    reserve => reserve.underlyingAsset.toLowerCase() === address,
  );
  if (rewardReserve) {
    return rewardReserve.formattedPriceInMarketReferenceCurrency;
  }

  return '0';
}

// Determine is reward emsission is active or distribution has ended
const rewardEmissionActive = (reward: RewardInfoHumanized) => {
  if (reward.emissionEndTimestamp > reward.incentivesLastUpdateTimestamp) {
    return true;
  }

  return false;
};

// Calculate supply and variableBorrow incentives APR for a reserve asset
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

import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from './calculate-reserve-incentives';
import {
  ReserveCalculationData,
  ReserveIncentiveWithFeedsResponse,
} from './types';

// Indexed by reserve underlyingAsset address
export type ReserveIncentiveDict = Record<string, ReserveIncentives>;

interface ReserveIncentives {
  aIncentives: ReserveIncentive;
  vIncentives: ReserveIncentive;
  sIncentives: ReserveIncentive;
}

interface ReserveIncentive {
  incentiveAPR: string;
  rewardTokenAddress: string;
}

export interface CalculateAllReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveWithFeedsResponse[];
  reserves: ReserveCalculationData[];
}

// Calculate incentive token price from reserves data or priceFeed from UiIncentiveDataProvider

function calculateRewardTokenPrice(
  reserves: ReserveCalculationData[],
  address: string,
  priceFeed: string,
): string {
  address = address.toLowerCase();
  // For stkAave incentives, use Aave price feed
  if (address.toLowerCase() === '0x4da27a545c0c5b758a6ba100e3a049001de870f5') {
    address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
  }

  const rewardReserve = reserves.find(
    reserve => reserve.underlyingAsset.toLowerCase() === address,
  );
  if (rewardReserve) {
    return rewardReserve.priceInMarketReferenceCurrency;
  }

  return priceFeed;
}

export function calculateAllReserveIncentives({
  reserveIncentives,
  reserves,
}: CalculateAllReserveIncentivesRequest): ReserveIncentiveDict {
  const reserveDict: ReserveIncentiveDict = {};
  // calculate incentive per reserve token
  reserveIncentives.forEach(reserveIncentive => {
    // Find the corresponding reserve data for each reserveIncentive
    const reserve: ReserveCalculationData | undefined = reserves.find(
      (reserve: ReserveCalculationData) =>
        reserve.underlyingAsset.toLowerCase() ===
        reserveIncentive.underlyingAsset.toLowerCase(),
    );
    if (reserve) {
      const calculatedReserveIncentives: CalculateReserveIncentivesResponse =
        calculateReserveIncentives({
          reserveIncentiveData: reserveIncentive,
          totalLiquidity: reserve.totalLiquidity,
          totalVariableDebt: reserve.totalVariableDebt,
          totalStableDebt: reserve.totalStableDebt,
          priceInMarketReferenceCurrency:
            reserve.priceInMarketReferenceCurrency,
          decimals: reserve.decimals,
          aRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            reserveIncentive.aIncentiveData.rewardTokenAddress.toLowerCase(),
            reserveIncentive.aIncentiveData.priceFeed,
          ),
          vRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            reserveIncentive.vIncentiveData.rewardTokenAddress.toLowerCase(),
            reserveIncentive.vIncentiveData.priceFeed,
          ),
          sRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            reserveIncentive.sIncentiveData.rewardTokenAddress.toLowerCase(),
            reserveIncentive.sIncentiveData.priceFeed,
          ),
        });
      reserveDict[calculatedReserveIncentives.underlyingAsset] = {
        aIncentives: calculatedReserveIncentives.aIncentivesData,
        vIncentives: calculatedReserveIncentives.vIncentivesData,
        sIncentives: calculatedReserveIncentives.sIncentivesData,
      };
    }
  });

  return reserveDict;
}

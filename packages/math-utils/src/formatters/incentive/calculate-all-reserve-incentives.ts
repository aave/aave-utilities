import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from './calculate-reserve-incentives';
import {
  ReserveCalculationData,
  ReservesIncentiveDataHumanized,
} from './types';

// Indexed by reserve underlyingAsset address
export type ReserveIncentiveDict = Record<string, ReserveIncentives>;

interface ReserveIncentives {
  aIncentives: ReserveIncentive[];
  vIncentives: ReserveIncentive[];
  sIncentives: ReserveIncentive[];
}

interface ReserveIncentive {
  incentiveAPR: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
}

export interface CalculateAllReserveIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  reserves: ReserveCalculationData[];
  marketReferenceCurrencyDecimals: number;
}

export function calculateAllReserveIncentives({
  reserveIncentives,
  reserves,
  marketReferenceCurrencyDecimals,
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
          reserves,
          reserveIncentiveData: reserveIncentive,
          totalLiquidity: reserve.totalLiquidity,
          totalVariableDebt: reserve.totalVariableDebt,
          totalStableDebt: reserve.totalStableDebt,
          priceInMarketReferenceCurrency:
            reserve.formattedPriceInMarketReferenceCurrency,
          decimals: reserve.decimals,
          marketReferenceCurrencyDecimals,
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

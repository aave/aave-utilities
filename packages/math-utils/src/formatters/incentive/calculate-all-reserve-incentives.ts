import { ReserveIncentiveWithFeedsResponse } from '@aave/contract-helpers';
import { incentiveToReserveAddressMap } from '../../constants';
import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from './calculate-reserve-incentives';

export interface ReserveCalculationData {
  underlyingAsset: string;
  symbol: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  priceInMarketReferenceCurrency: string;
  marketReferenceCurrencyDecimals: number;
  decimals: number;
}

// Indexed by reserve underlyingAsset address
export type ReserveIncentiveDict = Record<string, ReserveIncentives>;

interface ReserveIncentives {
  aIncentives: ReserveIncentive;
  vIncentives: ReserveIncentive;
  sIncentives: ReserveIncentive;
}

interface ReserveIncentive {
  incentiveAPY: string;
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
  if (incentiveToReserveAddressMap[address]) {
    address = incentiveToReserveAddressMap[address];
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
    // Account for underlyingReserveAddress of network base assets not matching wrapped incentives
    let reserveUnderlyingAddress =
      reserveIncentive.underlyingAsset.toLowerCase();
    console.log('incentive underlying');
    console.log(reserveUnderlyingAddress);
    if (incentiveToReserveAddressMap[reserveUnderlyingAddress]) {
      reserveUnderlyingAddress =
        incentiveToReserveAddressMap[reserveUnderlyingAddress];
    }

    console.log('new reserve');
    console.log(reserveUnderlyingAddress);
    // Find the corresponding reserve data for each reserveIncentive
    const reserve: ReserveCalculationData | undefined = reserves.find(
      (reserve: ReserveCalculationData) =>
        reserve.underlyingAsset.toLowerCase() === reserveUnderlyingAddress,
    );
    if (reserve) {
      const calculatedReserveIncentives: CalculateReserveIncentivesResponse =
        calculateReserveIncentives({
          reserveIncentiveData: reserveIncentive,
          totalLiquidity: reserve.totalLiquidity,
          liquidityIndex: reserve.liquidityIndex,
          totalScaledVariableDebt: reserve.totalScaledVariableDebt,
          totalPrincipalStableDebt: reserve.totalPrincipalStableDebt,
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
      calculatedReserveIncentives.underlyingAsset = reserveUnderlyingAddress;
      reserveDict[calculatedReserveIncentives.underlyingAsset] = {
        aIncentives: calculatedReserveIncentives.aIncentivesData,
        vIncentives: calculatedReserveIncentives.vIncentivesData,
        sIncentives: calculatedReserveIncentives.sIncentivesData,
      };
    }
  });

  return reserveDict;
}

import { ReserveIncentiveWithFeedsResponse } from '@aave/contract-helpers';
import BigNumber from 'bignumber.js';
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
// eslint-disable-next-line max-params
function calculateRewardTokenPrice(
  reserves: ReserveCalculationData[],
  address: string,
  priceFeed: string,
  priceFeedDecimals: number,
  marketReferenceCurrencyDecimals: number,
): string {
  address = address.toLowerCase();
  // For stkAave incentives, use Aave reserve data
  if (address === '0x4da27a545c0c5b758a6ba100e3a049001de870f5') {
    address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
  }

  // For WMATIC/WAVAX incentives, use MATIC/AVAX reserve data
  if (
    address === '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' ||
    address === '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
  ) {
    address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  }

  const rewardReserve = reserves.find(
    reserve => reserve.underlyingAsset.toLowerCase() === address,
  );
  if (rewardReserve) {
    return rewardReserve.priceInMarketReferenceCurrency;
  }

  // Convert priceFeed to have same number of decimals as marketReferenceCurrency
  return new BigNumber(priceFeed)
    .shiftedBy(marketReferenceCurrencyDecimals - priceFeedDecimals)
    .toString();
}

export function calculateAllReserveIncentives({
  reserveIncentives,
  reserves,
}: CalculateAllReserveIncentivesRequest): ReserveIncentiveDict {
  const reserveDict: ReserveIncentiveDict = {};
  // calculate incentive per reserve token
  reserves.forEach(reserve => {
    // Account for underlyingReserveAddress of network base assets not matching wrapped incentives
    let reserveUnderlyingAddress = reserve.underlyingAsset.toLowerCase();
    let isBaseAsset = false;
    if (
      reserveUnderlyingAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    ) {
      isBaseAsset = true;
      // Disable test coverage for else block: added tests for all conditions and can verify execution, jest doesn't detect coverage
      /* istanbul ignore else */
      if (reserve.symbol === 'MATIC') {
        reserveUnderlyingAddress = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
      } else if (reserve.symbol === 'ETH') {
        reserveUnderlyingAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
      } else if (reserve.symbol === 'AVAX') {
        reserveUnderlyingAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
      }
    }

    // Find the corresponding incentive data for each reserve
    const incentiveData: ReserveIncentiveWithFeedsResponse | undefined =
      reserveIncentives.find(
        (incentive: ReserveIncentiveWithFeedsResponse) =>
          incentive.underlyingAsset.toLowerCase() === reserveUnderlyingAddress,
      );
    if (incentiveData) {
      const calculatedReserveIncentives: CalculateReserveIncentivesResponse =
        calculateReserveIncentives({
          reserveIncentiveData: incentiveData,
          totalLiquidity: reserve.totalLiquidity,
          liquidityIndex: reserve.liquidityIndex,
          totalScaledVariableDebt: reserve.totalScaledVariableDebt,
          totalPrincipalStableDebt: reserve.totalPrincipalStableDebt,
          priceInMarketReferenceCurrency:
            reserve.priceInMarketReferenceCurrency,
          decimals: reserve.decimals,
          aRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            incentiveData.aIncentiveData.rewardTokenAddress.toLowerCase(),
            incentiveData.aIncentiveData.priceFeed,
            incentiveData.aIncentiveData.priceFeedDecimals,
            reserve.marketReferenceCurrencyDecimals,
          ),
          vRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            incentiveData.vIncentiveData.rewardTokenAddress.toLowerCase(),
            incentiveData.vIncentiveData.priceFeed,
            incentiveData.vIncentiveData.priceFeedDecimals,
            reserve.marketReferenceCurrencyDecimals,
          ),
          sRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            incentiveData.sIncentiveData.rewardTokenAddress.toLowerCase(),
            incentiveData.sIncentiveData.priceFeed,
            incentiveData.sIncentiveData.priceFeedDecimals,
            reserve.marketReferenceCurrencyDecimals,
          ),
        });
      calculatedReserveIncentives.underlyingAsset = isBaseAsset
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : calculatedReserveIncentives.underlyingAsset; // ETH, MATIC, and AVAX all use reserve address of '0xee...'
      reserveDict[calculatedReserveIncentives.underlyingAsset] = {
        aIncentives: calculatedReserveIncentives.aIncentivesData,
        vIncentives: calculatedReserveIncentives.vIncentivesData,
        sIncentives: calculatedReserveIncentives.sIncentivesData,
      };
    }
  });

  return reserveDict;
}

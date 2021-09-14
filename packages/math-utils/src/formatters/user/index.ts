import { BigNumber } from 'bignumber.js';
import { BigNumberValue, normalize } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { formatUserReserve } from './format-user-reserve';
import { generateRawUserSummary } from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

interface RawReserveData {
  decimals: number;
  reserveFactor: string;
  baseLTVasCollateral: string;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  lastUpdateTimestamp: number;
  price: {
    priceInEth: string;
  };
  id: string;
  symbol: string;
  usageAsCollateralEnabled: boolean;
}

export interface RawUserReserveData {
  reserve: RawReserveData;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  scaledVariableDebt: string;
  variableBorrowIndex: string;
  stableBorrowRate: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}

export interface ComputedUserReserve extends RawUserReserveData {
  underlyingBalance: string;
  underlyingBalanceETH: string;
  underlyingBalanceUSD: string;
  variableBorrows: string;
  variableBorrowsETH: string;
  variableBorrowsUSD: string;
  stableBorrows: string;
  stableBorrowsETH: string;
  stableBorrowsUSD: string;
  totalBorrows: string;
  totalBorrowsETH: string;
  totalBorrowsUSD: string;
  totalLiquidity: string;
  totalStableDebt: string;
  totalVariableDebt: string;
}

export interface FormatUserSummaryRequest {
  rawUserReserves: RawUserReserveData[];
  marketReferenceCurrencyUsdPrice: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
}

export interface FormatUserSummaryResponse {
  userReservesData: ComputedUserReserve[];
  totalLiquidityETH: string;
  totalLiquidityUSD: string;
  totalCollateralETH: string;
  totalCollateralUSD: string;
  totalBorrowsETH: string;
  totalBorrowsUSD: string;
  availableBorrowsETH: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
}

/* istanbul ignore next */
function sortBySymbol(reserves: ComputedUserReserve[]): ComputedUserReserve[] {
  reserves.sort((a, b) =>
    a.reserve.symbol > b.reserve.symbol
      ? 1
      : a.reserve.symbol < b.reserve.symbol
      ? -1
      : 0,
  );
  return reserves;
}

function normalizeUSD(value: BigNumber): string {
  return normalize(value, USD_DECIMALS);
}

export function formatUserSummary({
  currentTimestamp,
  marketReferenceCurrencyUsdPrice,
  marketReferenceCurrencyDecimals,
  rawUserReserves,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const computedUserReserves: UserReserveSummaryResponse[] = rawUserReserves.map(
    userReserve =>
      generateUserReserveSummary({
        userReserve,
        marketReferenceCurrencyUsdPrice,
        currentTimestamp,
      }),
  );

  const formattedUserReserves = computedUserReserves.map(computedUserReserve =>
    formatUserReserve({
      reserve: computedUserReserve,
    }),
  );

  const sortedUserReserves = sortBySymbol(formattedUserReserves);

  const userData = generateRawUserSummary({
    userReserves: computedUserReserves,
    marketReferenceCurrencyUsdPrice,
  });

  return {
    userReservesData: sortedUserReserves,
    totalLiquidityETH: normalize(
      userData.totalLiquidityETH,
      marketReferenceCurrencyDecimals,
    ),
    totalLiquidityUSD: normalizeUSD(userData.totalLiquidityUSD),
    totalCollateralETH: normalize(
      userData.totalCollateralETH,
      marketReferenceCurrencyDecimals,
    ),
    totalCollateralUSD: normalizeUSD(userData.totalCollateralUSD),
    totalBorrowsETH: normalize(
      userData.totalBorrowsETH,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: normalizeUSD(userData.totalBorrowsUSD),
    availableBorrowsETH: normalize(
      userData.availableBorrowsETH,
      marketReferenceCurrencyDecimals,
    ),
    currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      LTV_PRECISION,
    ),
    healthFactor: userData.healthFactor.toFixed(),
  };
}

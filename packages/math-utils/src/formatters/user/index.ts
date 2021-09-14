import { BigNumber } from 'bignumber.js';
import { BigNumberValue, normalize } from '../../bignumber';
import { ETH_DECIMALS, LTV_PRECISION, USD_DECIMALS } from '../../constants';
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
  usdPriceEth: BigNumberValue;
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

function normalizeETH(value: BigNumber): string {
  return normalize(value, ETH_DECIMALS);
}

function normalizeUSD(value: BigNumber): string {
  return normalize(value, USD_DECIMALS);
}

export function formatUserSummary({
  currentTimestamp,
  usdPriceEth,
  rawUserReserves,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const computedUserReserves: UserReserveSummaryResponse[] = rawUserReserves.map(
    userReserve =>
      generateUserReserveSummary({
        userReserve,
        usdPriceEth,
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
    usdPriceEth,
  });

  return {
    userReservesData: sortedUserReserves,
    totalLiquidityETH: normalizeETH(userData.totalLiquidityETH),
    totalLiquidityUSD: normalizeUSD(userData.totalLiquidityUSD),
    totalCollateralETH: normalizeETH(userData.totalCollateralETH),
    totalCollateralUSD: normalizeUSD(userData.totalCollateralUSD),
    totalBorrowsETH: normalizeETH(userData.totalBorrowsETH),
    totalBorrowsUSD: normalizeUSD(userData.totalBorrowsUSD),
    availableBorrowsETH: normalizeETH(userData.availableBorrowsETH),
    currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      LTV_PRECISION,
    ),
    healthFactor: userData.healthFactor.toFixed(),
  };
}

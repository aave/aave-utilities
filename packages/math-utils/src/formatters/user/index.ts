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
  priceInMarketReferenceCurrency: string;
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
  underlyingBalanceMarketReferenceCurrency: string;
  underlyingBalanceUSD: string;
  variableBorrows: string;
  variableBorrowsMarketReferenceCurrency: string;
  variableBorrowsUSD: string;
  stableBorrows: string;
  stableBorrowsMarketReferenceCurrency: string;
  stableBorrowsUSD: string;
  totalBorrows: string;
  totalBorrowsMarketReferenceCurrency: string;
  totalBorrowsUSD: string;
  totalLiquidity: string;
  totalStableDebt: string;
  totalVariableDebt: string;
}

export interface FormatUserSummaryRequest {
  rawUserReserves: RawUserReserveData[];
  usdPriceMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
}

export interface FormatUserSummaryResponse {
  userReservesData: ComputedUserReserve[];
  totalLiquidityMarketReferenceCurrency: string;
  totalLiquidityUSD: string;
  totalCollateralMarketReferenceCurrency: string;
  totalCollateralUSD: string;
  totalBorrowsMarketReferenceCurrency: string;
  totalBorrowsUSD: string;
  availableBorrowsMarketReferenceCurrency: string;
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
  usdPriceMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  rawUserReserves,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const computedUserReserves: UserReserveSummaryResponse[] =
    rawUserReserves.map(userReserve =>
      generateUserReserveSummary({
        userReserve,
        usdPriceMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        currentTimestamp,
      }),
    );

  const formattedUserReserves = computedUserReserves.map(computedUserReserve =>
    formatUserReserve({
      reserve: computedUserReserve,
      marketReferenceCurrencyDecimals,
    }),
  );

  const sortedUserReserves = sortBySymbol(formattedUserReserves);

  const userData = generateRawUserSummary({
    userReserves: computedUserReserves,
    usdPriceMarketReferenceCurrency,
  });

  return {
    userReservesData: sortedUserReserves,
    totalLiquidityMarketReferenceCurrency: normalize(
      userData.totalLiquidityMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalLiquidityUSD: normalizeUSD(userData.totalLiquidityUSD),
    totalCollateralMarketReferenceCurrency: normalize(
      userData.totalCollateralMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalCollateralUSD: normalizeUSD(userData.totalCollateralUSD),
    totalBorrowsMarketReferenceCurrency: normalize(
      userData.totalBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: normalizeUSD(userData.totalBorrowsUSD),
    availableBorrowsMarketReferenceCurrency: normalize(
      userData.availableBorrowsMarketReferenceCurrency,
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

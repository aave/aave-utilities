import { BigNumberValue, normalize } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { formatUserReserve } from './format-user-reserve';
import { generateRawUserSummary } from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

export interface RawReserveData {
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
  underlyingAsset: string;
  name: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  isolationModeTotalDebt: string;
  eModeCategoryId: number;
  eModeLtv: number;
  eModeLiquidationThreshold: number;
  eModeLiquidationBonus: number;
}

export interface RawUserReserveData {
  reserve: RawReserveData;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
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
  stableBorrowAPY: string;
  stableBorrowAPR: string;
}

export interface FormatUserSummaryRequest {
  rawUserReserves: RawUserReserveData[];
  marketRefPriceInUsd: BigNumberValue;
  marketRefCurrencyDecimals: number;
  currentTimestamp: number;
  userEmodeCategoryId: number;
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
  availableBorrowsUSD: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
  isInIsolationMode: boolean;
}

export function formatUserSummary({
  currentTimestamp,
  marketRefPriceInUsd,
  marketRefCurrencyDecimals,
  rawUserReserves,
  userEmodeCategoryId,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const humanizedMarketRefPriceInUsd = normalize(
    marketRefPriceInUsd,
    USD_DECIMALS,
  );
  const computedUserReserves: UserReserveSummaryResponse[] =
    rawUserReserves.map(userReserve =>
      generateUserReserveSummary({
        userReserve,
        marketRefPriceInUsd: humanizedMarketRefPriceInUsd,
        marketRefCurrencyDecimals,
        currentTimestamp,
      }),
    );

  const formattedUserReserves = computedUserReserves.map(computedUserReserve =>
    formatUserReserve({
      reserve: computedUserReserve,
      marketRefCurrencyDecimals,
    }),
  );

  const userData = generateRawUserSummary({
    userReserves: computedUserReserves,
    marketRefPriceInUsd: humanizedMarketRefPriceInUsd,
    marketRefCurrencyDecimals,
    userEmodeCategoryId,
  });

  const isInIsolationMode = Boolean(
    rawUserReserves.find(
      reserve =>
        reserve.reserve.debtCeiling !== '0' &&
        reserve.scaledATokenBalance !== '0',
    ),
  );

  return {
    userReservesData: formattedUserReserves,
    totalLiquidityMarketReferenceCurrency: normalize(
      userData.totalLiquidityMarketReferenceCurrency,
      marketRefCurrencyDecimals,
    ),
    totalLiquidityUSD: userData.totalLiquidityUSD.toString(),
    totalCollateralMarketReferenceCurrency: normalize(
      userData.totalCollateralMarketReferenceCurrency,
      marketRefCurrencyDecimals,
    ),
    totalCollateralUSD: userData.totalCollateralUSD.toString(),
    totalBorrowsMarketReferenceCurrency: normalize(
      userData.totalBorrowsMarketReferenceCurrency,
      marketRefCurrencyDecimals,
    ),
    totalBorrowsUSD: userData.totalBorrowsUSD.toString(),
    availableBorrowsMarketReferenceCurrency: normalize(
      userData.availableBorrowsMarketReferenceCurrency,
      marketRefCurrencyDecimals,
    ),
    availableBorrowsUSD: userData.availableBorrowsUSD.toString(),
    currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      LTV_PRECISION,
    ),
    healthFactor: userData.healthFactor.toFixed(),
    isInIsolationMode,
  };
}

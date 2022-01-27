import { BigNumberValue, normalize } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { calculateAllUserIncentives, UserIncentiveDict } from '../incentive';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
} from '../incentive/types';
import { FormatReserveUSDResponse } from '../reserve';
import { formatUserReserve } from './format-user-reserve';
import { generateRawUserSummary } from './generate-raw-user-summary';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

export interface UserReserveData {
  underlyingAsset: string;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}

export interface CombinedReserveData extends UserReserveData {
  reserve: FormatReserveUSDResponse;
}

export interface ComputedUserReserve extends CombinedReserveData {
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
  stableBorrowAPY: string;
  stableBorrowAPR: string;
}

export interface FormatUserSummaryRequest {
  userReserves: UserReserveData[];
  formattedReserves: FormatReserveUSDResponse[];
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
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
  netWorthUSD: string;
  availableBorrowsMarketReferenceCurrency: string;
  availableBorrowsUSD: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}

export interface FormatUserSummaryAndIncentivesRequest
  extends FormatUserSummaryRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  userIncentives: UserReservesIncentivesDataHumanized[];
}

export interface FormatUserSummaryAndIncentivesResponse
  extends FormatUserSummaryResponse {
  calculatedUserIncentives: UserIncentiveDict;
}

export function formatUserSummary({
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userReserves,
  formattedReserves,
  userEmodeCategoryId,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const normalizedMarketRefPriceInUsd = normalize(
    marketReferencePriceInUsd,
    USD_DECIMALS,
  );

  // Combine raw user and formatted reserve data
  const combinedReserves: CombinedReserveData[] = [];

  userReserves.forEach(userReserve => {
    const reserve = formattedReserves.find(
      r =>
        r.underlyingAsset.toLowerCase() ===
        userReserve.underlyingAsset.toLowerCase(),
    );
    if (reserve) {
      combinedReserves.push({
        ...userReserve,
        reserve,
      });
    }
  });

  const computedUserReserves: UserReserveSummaryResponse[] =
    combinedReserves.map(userReserve =>
      generateUserReserveSummary({
        userReserve,
        marketReferencePriceInUsdNormalized: normalizedMarketRefPriceInUsd,
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

  const userData = generateRawUserSummary({
    userReserves: computedUserReserves,
    marketReferencePriceInUsd: normalizedMarketRefPriceInUsd,
    marketReferenceCurrencyDecimals,
    userEmodeCategoryId,
  });

  return {
    userReservesData: formattedUserReserves,
    totalLiquidityMarketReferenceCurrency: normalize(
      userData.totalLiquidityMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalLiquidityUSD: userData.totalLiquidityUSD.toString(),
    totalCollateralMarketReferenceCurrency: normalize(
      userData.totalCollateralMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalCollateralUSD: userData.totalCollateralUSD.toString(),
    totalBorrowsMarketReferenceCurrency: normalize(
      userData.totalBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: userData.totalBorrowsUSD.toString(),
    netWorthUSD: userData.totalLiquidityUSD
      .minus(userData.totalBorrowsUSD)
      .toString(),
    availableBorrowsMarketReferenceCurrency: normalize(
      userData.availableBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    availableBorrowsUSD: userData.availableBorrowsUSD.toString(),
    currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      LTV_PRECISION,
    ),
    healthFactor: userData.healthFactor.toFixed(),
    isInIsolationMode: userData.isInIsolationMode,
    isolatedReserve: userData.isolatedReserve,
  };
}

export function formatUserSummaryAndIncentives({
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userReserves,
  formattedReserves,
  userEmodeCategoryId,
  reserveIncentives,
  userIncentives,
}: FormatUserSummaryAndIncentivesRequest): FormatUserSummaryAndIncentivesResponse {
  const formattedUserSummary = formatUserSummary({
    currentTimestamp,
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    userReserves,
    formattedReserves,
    userEmodeCategoryId,
  });

  const calculatedUserIncentives = calculateAllUserIncentives({
    reserveIncentives,
    userIncentives,
    userReserves: formattedUserSummary.userReservesData,
    currentTimestamp,
  });

  return {
    ...formattedUserSummary,
    calculatedUserIncentives,
  };
}

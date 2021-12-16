import { BigNumberValue, normalize } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { calculateAllUserIncentives, UserIncentiveDict } from '../incentive';
import {
  ReservesIncentiveDataHumanized,
  UserReserveCalculationData,
  UserReservesIncentivesDataHumanized,
} from '../incentive/types';
import { calculateSupplies } from './calculate-supplies';
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

export interface UserReserveData {
  reserve: RawReserveData;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}

export interface ComputedUserReserve extends UserReserveData {
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
  availableBorrowsMarketReferenceCurrency: string;
  availableBorrowsUSD: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
  isInIsolationMode: boolean;
  isolatedReserve?: RawReserveData;
}

export interface FormatUserSummaryAndIncentivesRequest {
  userReserves: UserReserveData[];
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
  userEmodeCategoryId: number;
  reserveIncentives: ReservesIncentiveDataHumanized[];
  userIncentives: UserReservesIncentivesDataHumanized[];
}

export interface FormatUserSummaryAndIncentivesResponse {
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
  isolatedReserve?: RawReserveData;
  calculatedUserIncentives: UserIncentiveDict;
}

export function formatUserSummary({
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userReserves,
  userEmodeCategoryId,
}: FormatUserSummaryRequest): FormatUserSummaryResponse {
  const humanizedMarketRefPriceInUsd = normalize(
    marketReferencePriceInUsd,
    USD_DECIMALS,
  );
  const computedUserReserves: UserReserveSummaryResponse[] = userReserves.map(
    userReserve =>
      generateUserReserveSummary({
        userReserve,
        marketReferencePriceInUsd: humanizedMarketRefPriceInUsd,
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
    marketReferencePriceInUsd: humanizedMarketRefPriceInUsd,
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
  userEmodeCategoryId,
  reserveIncentives,
  userIncentives,
}: FormatUserSummaryAndIncentivesRequest): FormatUserSummaryAndIncentivesResponse {
  const humanizedMarketRefPriceInUsd = normalize(
    marketReferencePriceInUsd,
    USD_DECIMALS,
  );
  const computedUserReserves: UserReserveSummaryResponse[] = userReserves.map(
    userReserve =>
      generateUserReserveSummary({
        userReserve,
        marketReferencePriceInUsd: humanizedMarketRefPriceInUsd,
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
    marketReferencePriceInUsd: humanizedMarketRefPriceInUsd,
    marketReferenceCurrencyDecimals,
    userEmodeCategoryId,
  });

  // In the future, refactor the userReserves input to optionally include this totalLiquidity field
  const calculatedUserReserves: UserReserveCalculationData[] = userReserves.map(
    userReserve => {
      const { totalLiquidity } = calculateSupplies({
        reserve: {
          totalScaledVariableDebt: userReserve.reserve.totalScaledVariableDebt,
          variableBorrowIndex: userReserve.reserve.variableBorrowIndex,
          variableBorrowRate: userReserve.reserve.variableBorrowRate,
          totalPrincipalStableDebt:
            userReserve.reserve.totalPrincipalStableDebt,
          averageStableRate: userReserve.reserve.averageStableRate,
          availableLiquidity: userReserve.reserve.availableLiquidity,
          stableDebtLastUpdateTimestamp:
            userReserve.reserve.stableDebtLastUpdateTimestamp,
          lastUpdateTimestamp: userReserve.reserve.lastUpdateTimestamp,
        },
        currentTimestamp,
      });
      return {
        ...userReserve,
        reserve: {
          ...userReserve.reserve,
          totalLiquidity: totalLiquidity.toString(),
        },
      };
    },
  );

  const calculatedUserIncentives = calculateAllUserIncentives({
    reserveIncentives,
    userIncentives,
    userReserves: calculatedUserReserves,
    currentTimestamp,
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
    calculatedUserIncentives,
  };
}

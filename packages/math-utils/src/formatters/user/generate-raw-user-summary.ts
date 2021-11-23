import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  calculateAvailableBorrowsMarketReferenceCurrency,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  marketRefPriceInUsd: BigNumberValue;
  marketRefCurrencyDecimals: number;
  userEmodeCategoryId: number;
}

export interface RawUserSummaryResponse {
  totalLiquidityUSD: BigNumber;
  totalCollateralUSD: BigNumber;
  totalBorrowsUSD: BigNumber;
  totalLiquidityMarketReferenceCurrency: BigNumber;
  totalCollateralMarketReferenceCurrency: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  availableBorrowsMarketReferenceCurrency: BigNumber;
  availableBorrowsUSD: BigNumber;
  currentLoanToValue: BigNumber;
  currentLiquidationThreshold: BigNumber;
  healthFactor: BigNumber;
}

export function generateRawUserSummary({
  userReserves,
  marketRefPriceInUsd,
  marketRefCurrencyDecimals,
  userEmodeCategoryId,
}: RawUserSummaryRequest): RawUserSummaryResponse {
  const {
    totalLiquidityMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    currentLtv,
    currentLiquidationThreshold,
  } = calculateUserReserveTotals({ userReserves, userEmodeCategoryId });

  const availableBorrowsMarketReferenceCurrency =
    calculateAvailableBorrowsMarketReferenceCurrency({
      collateralBalanceMarketReferenceCurrency:
        totalCollateralMarketReferenceCurrency,
      borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
      currentLtv,
    });

  return {
    totalLiquidityUSD: normalizedToUsd(
      totalLiquidityMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalCollateralUSD: normalizedToUsd(
      totalCollateralMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalBorrowsUSD: normalizedToUsd(
      totalBorrowsMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalLiquidityMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    availableBorrowsMarketReferenceCurrency,
    availableBorrowsUSD: normalizedToUsd(
      availableBorrowsMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalanceMarketReferenceCurrency:
        totalCollateralMarketReferenceCurrency,
      borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
      currentLiquidationThreshold,
    }),
  };
}

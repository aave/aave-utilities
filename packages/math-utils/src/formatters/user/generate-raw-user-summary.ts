import BigNumber from 'bignumber.js';
import { BigNumberValue, normalizeBN } from '../../bignumber';
import {
  calculateAvailableBorrowsMarketReferenceCurrency,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { FormatReserveUSDResponse } from '../reserve';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
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
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}

export function generateRawUserSummary({
  userReserves,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userEmodeCategoryId,
}: RawUserSummaryRequest): RawUserSummaryResponse {
  const {
    totalLiquidityMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    currentLtv,
    currentLiquidationThreshold,
    isInIsolationMode,
    isolatedReserve,
  } = calculateUserReserveTotals({ userReserves, userEmodeCategoryId });

  const _availableBorrowsMarketReferenceCurrency =
    calculateAvailableBorrowsMarketReferenceCurrency({
      collateralBalanceMarketReferenceCurrency:
        totalCollateralMarketReferenceCurrency,
      borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
      currentLtv,
    });

  const availableBorrowsMarketReferenceCurrency =
    isInIsolationMode && isolatedReserve
      ? BigNumber.min(
          BigNumber.max(
            0,
            normalizeBN(
              new BigNumber(isolatedReserve.debtCeiling).minus(
                isolatedReserve.isolationModeTotalDebt,
              ),
              isolatedReserve.debtCeilingDecimals -
                marketReferenceCurrencyDecimals,
            ),
          ),
          _availableBorrowsMarketReferenceCurrency,
        )
      : _availableBorrowsMarketReferenceCurrency;

  return {
    isInIsolationMode,
    isolatedReserve,
    totalLiquidityUSD: normalizedToUsd(
      totalLiquidityMarketReferenceCurrency,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    ),
    totalCollateralUSD: normalizedToUsd(
      totalCollateralMarketReferenceCurrency,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: normalizedToUsd(
      totalBorrowsMarketReferenceCurrency,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    ),
    totalLiquidityMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    availableBorrowsMarketReferenceCurrency,
    availableBorrowsUSD: normalizedToUsd(
      availableBorrowsMarketReferenceCurrency,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
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

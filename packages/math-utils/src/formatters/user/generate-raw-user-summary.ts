import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  calculateAvailableBorrowsMarketReferenceCurrency,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  marketRefPriceInUsd: BigNumberValue;
  marketRefCurrencyDecimals: number;
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

function convertToUsd(
  value: BigNumber,
  marketRefPriceInUsd: BigNumberValue,
  marketRefCurrencyDecimals: number,
): BigNumber {
  return value
    .multipliedBy(marketRefPriceInUsd)
    .shiftedBy(marketRefCurrencyDecimals * -1);
}

export function generateRawUserSummary({
  userReserves,
  marketRefPriceInUsd,
  marketRefCurrencyDecimals,
}: RawUserSummaryRequest): RawUserSummaryResponse {
  const {
    totalLiquidityMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    currentLtv,
    currentLiquidationThreshold,
  } = calculateUserReserveTotals({ userReserves });

  const availableBorrowsMarketReferenceCurrency =
    calculateAvailableBorrowsMarketReferenceCurrency({
      collateralBalanceMarketReferenceCurrency:
        totalCollateralMarketReferenceCurrency,
      borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
      currentLtv,
    });

  return {
    totalLiquidityUSD: convertToUsd(
      totalLiquidityMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalCollateralUSD: convertToUsd(
      totalCollateralMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalBorrowsUSD: convertToUsd(
      totalBorrowsMarketReferenceCurrency,
      marketRefPriceInUsd,
      marketRefCurrencyDecimals,
    ),
    totalLiquidityMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    availableBorrowsMarketReferenceCurrency,
    availableBorrowsUSD: convertToUsd(
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

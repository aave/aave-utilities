import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS } from '../../constants';
import {
  calculateAvailableBorrowsMarketReferenceCurrency,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  usdPriceMarketReferenceCurrency: BigNumberValue;
}

export interface RawUserSummaryResponse {
  totalLiquidityUSD: BigNumber;
  totalCollateralUSD: BigNumber;
  totalBorrowsUSD: BigNumber;
  totalLiquidityMarketReferenceCurrency: BigNumber;
  totalCollateralMarketReferenceCurrency: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  availableBorrowsMarketReferenceCurrency: BigNumber;
  currentLoanToValue: BigNumber;
  currentLiquidationThreshold: BigNumber;
  healthFactor: BigNumber;
}

function convertToUsd(
  value: BigNumber,
  usdPriceMarketReferenceCurrency: BigNumberValue,
): BigNumber {
  return value
    .shiftedBy(USD_DECIMALS)
    .dividedBy(usdPriceMarketReferenceCurrency);
}

export function generateRawUserSummary({
  userReserves,
  usdPriceMarketReferenceCurrency,
}: RawUserSummaryRequest): RawUserSummaryResponse {
  const {
    totalLiquidityMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    currentLtv,
    currentLiquidationThreshold,
  } = calculateUserReserveTotals({ userReserves: userReserves });

  return {
    totalLiquidityUSD: convertToUsd(
      totalLiquidityMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    ),
    totalCollateralUSD: convertToUsd(
      totalCollateralMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    ),
    totalBorrowsUSD: convertToUsd(
      totalBorrowsMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    ),
    totalLiquidityMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    availableBorrowsMarketReferenceCurrency: calculateAvailableBorrowsMarketReferenceCurrency(
      {
        collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
        currentLtv,
      },
    ),
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
      borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
      currentLiquidationThreshold,
    }),
  };
}

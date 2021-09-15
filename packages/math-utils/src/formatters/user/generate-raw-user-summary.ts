import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS } from '../../constants';
import {
  calculateAvailableBorrowsETH,
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
  availableBorrowsETH: BigNumber;
  currentLoanToValue: BigNumber;
  currentLiquidationThreshold: BigNumber;
  healthFactor: BigNumber;
}

function convertToUsd(
  value: BigNumber,
  usdPriceEth: BigNumberValue,
): BigNumber {
  return value.shiftedBy(USD_DECIMALS).dividedBy(usdPriceEth);
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
    availableBorrowsETH: calculateAvailableBorrowsETH({
      collateralBalanceETH: totalCollateralMarketReferenceCurrency,
      borrowBalanceETH: totalBorrowsMarketReferenceCurrency,
      currentLtv,
    }),
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalanceETH: totalCollateralMarketReferenceCurrency,
      borrowBalanceETH: totalBorrowsMarketReferenceCurrency,
      currentLiquidationThreshold,
    }),
  };
}

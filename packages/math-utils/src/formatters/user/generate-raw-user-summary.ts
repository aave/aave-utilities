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
  totalLiquidityETH: BigNumber;
  totalCollateralETH: BigNumber;
  totalBorrowsETH: BigNumber;
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
    totalLiquidityETH,
    totalBorrowsETH,
    totalCollateralETH,
    currentLtv,
    currentLiquidationThreshold,
  } = calculateUserReserveTotals({ userReserves: userReserves });

  return {
    totalLiquidityUSD: convertToUsd(
      totalLiquidityETH,
      usdPriceMarketReferenceCurrency,
    ),
    totalCollateralUSD: convertToUsd(
      totalCollateralETH,
      usdPriceMarketReferenceCurrency,
    ),
    totalBorrowsUSD: convertToUsd(
      totalBorrowsETH,
      usdPriceMarketReferenceCurrency,
    ),
    totalLiquidityETH,
    totalCollateralETH,
    totalBorrowsETH,
    availableBorrowsETH: calculateAvailableBorrowsETH({
      collateralBalanceETH: totalCollateralETH,
      borrowBalanceETH: totalBorrowsETH,
      currentLtv,
    }),
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalanceETH: totalCollateralETH,
      borrowBalanceETH: totalBorrowsETH,
      currentLiquidationThreshold,
    }),
  };
}

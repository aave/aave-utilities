import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { USD_DECIMALS } from '../../constants';
import {
  calculateAvailableBorrows,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  usdPriceEth: BigNumberValue;
  currentTimestamp: number;
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

export function generateRawUserSummary(
  request: RawUserSummaryRequest,
): RawUserSummaryResponse {
  const {
    totalLiquidityETH,
    totalBorrowsETH,
    totalCollateralETH,
    currentLtv,
    currentLiquidationThreshold,
  } = calculateUserReserveTotals({ userReserves: request.userReserves });

  return {
    totalLiquidityUSD: convertToUsd(totalLiquidityETH, request.usdPriceEth),
    totalCollateralUSD: convertToUsd(totalCollateralETH, request.usdPriceEth),
    totalBorrowsUSD: convertToUsd(totalBorrowsETH, request.usdPriceEth),
    totalLiquidityETH,
    totalCollateralETH,
    totalBorrowsETH,
    availableBorrowsETH: calculateAvailableBorrows({
      collateralBalance: totalCollateralETH,
      borrowBalance: totalBorrowsETH,
      currentLtv,
    }),
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalance: totalCollateralETH,
      borrowBalance: totalBorrowsETH,
      currentLiquidationThreshold,
    }),
  };
}

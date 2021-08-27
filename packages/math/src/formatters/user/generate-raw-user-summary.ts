import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  calculateAvailableBorrowsETH,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { USD_DECIMALS } from '../../constants';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';

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

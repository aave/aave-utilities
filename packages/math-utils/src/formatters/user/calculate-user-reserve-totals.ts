import BigNumber from 'bignumber.js';
import { valueToBigNumber, valueToZDBigNumber } from '../../bignumber';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

interface UserReserveTotalsRequest {
  userReserves: UserReserveSummaryResponse[];
}

interface UserReserveTotalsResponse {
  totalLiquidityETH: BigNumber;
  totalBorrowsETH: BigNumber;
  totalCollateralETH: BigNumber;
  currentLtv: BigNumber;
  currentLiquidationThreshold: BigNumber;
}

export function calculateUserReserveTotals(
  request: UserReserveTotalsRequest,
): UserReserveTotalsResponse {
  let totalLiquidityETH = valueToZDBigNumber('0');
  let totalCollateralETH = valueToZDBigNumber('0');
  let totalBorrowsETH = valueToZDBigNumber('0');
  let currentLtv = valueToBigNumber('0');
  let currentLiquidationThreshold = valueToBigNumber('0');

  request.userReserves.forEach(userReserveSummary => {
    totalLiquidityETH = totalLiquidityETH.plus(
      userReserveSummary.underlyingBalanceETH,
    );
    totalBorrowsETH = totalBorrowsETH
      .plus(userReserveSummary.variableBorrowsETH)
      .plus(userReserveSummary.stableBorrowsETH);

    if (
      userReserveSummary.userReserve.reserve.usageAsCollateralEnabled &&
      userReserveSummary.userReserve.usageAsCollateralEnabledOnUser
    ) {
      totalCollateralETH = totalCollateralETH.plus(
        userReserveSummary.underlyingBalanceETH,
      );
      currentLtv = currentLtv.plus(
        valueToBigNumber(userReserveSummary.underlyingBalanceETH).multipliedBy(
          userReserveSummary.userReserve.reserve.baseLTVasCollateral,
        ),
      );
      currentLiquidationThreshold = currentLiquidationThreshold.plus(
        valueToBigNumber(userReserveSummary.underlyingBalanceETH).multipliedBy(
          userReserveSummary.userReserve.reserve.reserveLiquidationThreshold,
        ),
      );
    }
  });

  if (currentLtv.gt(0)) {
    currentLtv = valueToZDBigNumber(currentLtv.div(totalCollateralETH));
  }

  if (currentLiquidationThreshold.gt(0)) {
    currentLiquidationThreshold = valueToZDBigNumber(
      currentLiquidationThreshold.div(totalCollateralETH),
    );
  }

  return {
    totalLiquidityETH,
    totalBorrowsETH,
    totalCollateralETH,
    currentLtv,
    currentLiquidationThreshold,
  };
}

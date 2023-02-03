import BigNumber from 'bignumber.js';
import { valueToBigNumber, valueToZDBigNumber } from '../../bignumber';
import { FormatReserveUSDResponse } from '../reserve';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

interface UserReserveTotalsRequest {
  userReserves: UserReserveSummaryResponse[];
  userEmodeCategoryId: number;
}

interface UserReserveTotalsResponse {
  totalLiquidityMarketReferenceCurrency: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  totalCollateralMarketReferenceCurrency: BigNumber;
  currentLtv: BigNumber;
  currentLiquidationThreshold: BigNumber;
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}

export function calculateUserReserveTotals({
  userReserves,
  userEmodeCategoryId,
}: UserReserveTotalsRequest): UserReserveTotalsResponse {
  let totalLiquidityMarketReferenceCurrency = valueToZDBigNumber('0');
  let totalCollateralMarketReferenceCurrency = valueToZDBigNumber('0');
  let totalBorrowsMarketReferenceCurrency = valueToZDBigNumber('0');
  let currentLtv = valueToBigNumber('0');
  let currentLiquidationThreshold = valueToBigNumber('0');
  let isInIsolationMode = false;
  let isolatedReserve: FormatReserveUSDResponse | undefined;

  userReserves.forEach(userReserveSummary => {
    totalLiquidityMarketReferenceCurrency =
      totalLiquidityMarketReferenceCurrency.plus(
        userReserveSummary.underlyingBalanceMarketReferenceCurrency,
      );
    totalBorrowsMarketReferenceCurrency = totalBorrowsMarketReferenceCurrency
      .plus(userReserveSummary.variableBorrowsMarketReferenceCurrency)
      .plus(userReserveSummary.stableBorrowsMarketReferenceCurrency);

    if (
      userReserveSummary.userReserve.reserve.reserveLiquidationThreshold !==
        '0' &&
      userReserveSummary.userReserve.usageAsCollateralEnabledOnUser
    ) {
      if (userReserveSummary.userReserve.reserve.debtCeiling !== '0') {
        isolatedReserve = userReserveSummary.userReserve.reserve;
        isInIsolationMode = true;
      }

      totalCollateralMarketReferenceCurrency =
        totalCollateralMarketReferenceCurrency.plus(
          userReserveSummary.underlyingBalanceMarketReferenceCurrency,
        );
      if (
        userEmodeCategoryId &&
        userEmodeCategoryId ===
          userReserveSummary.userReserve.reserve.eModeCategoryId
      ) {
        currentLtv = currentLtv.plus(
          valueToBigNumber(
            userReserveSummary.underlyingBalanceMarketReferenceCurrency,
          ).multipliedBy(userReserveSummary.userReserve.reserve.eModeLtv),
        );
        currentLiquidationThreshold = currentLiquidationThreshold.plus(
          valueToBigNumber(
            userReserveSummary.underlyingBalanceMarketReferenceCurrency,
          ).multipliedBy(
            userReserveSummary.userReserve.reserve.eModeLiquidationThreshold,
          ),
        );
      } else {
        currentLtv = currentLtv.plus(
          valueToBigNumber(
            userReserveSummary.underlyingBalanceMarketReferenceCurrency,
          ).multipliedBy(
            userReserveSummary.userReserve.reserve.baseLTVasCollateral,
          ),
        );
        currentLiquidationThreshold = currentLiquidationThreshold.plus(
          valueToBigNumber(
            userReserveSummary.underlyingBalanceMarketReferenceCurrency,
          ).multipliedBy(
            userReserveSummary.userReserve.reserve.reserveLiquidationThreshold,
          ),
        );
      }
    }
  });

  if (currentLtv.gt(0)) {
    currentLtv = valueToZDBigNumber(
      currentLtv.div(totalCollateralMarketReferenceCurrency),
    );
  }

  if (currentLiquidationThreshold.gt(0)) {
    currentLiquidationThreshold = valueToZDBigNumber(
      currentLiquidationThreshold.div(totalCollateralMarketReferenceCurrency),
    );
  }

  return {
    totalLiquidityMarketReferenceCurrency,
    totalBorrowsMarketReferenceCurrency,
    totalCollateralMarketReferenceCurrency,
    currentLtv,
    currentLiquidationThreshold,
    isInIsolationMode,
    isolatedReserve,
  };
}

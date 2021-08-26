import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber';
import {
  calculateAvailableBorrowsETH,
  calculateHealthFactorFromBalances,
} from '../../pool-math';
import { USD_DECIMALS } from '../../constants';
import { RawUserReserveData } from '.';
import {
  generateUserReserveSummary,
  UserReserveSummaryResponse,
} from './generate-user-reserve-summary';

export interface RawUserSummaryRequest {
  rawUserReserves: RawUserReserveData[];
  usdPriceEth: BigNumberValue;
  currentTimestamp: number;
}

export interface RawUserSummaryResponse {
  reservesData: UserReserveSummaryResponse[];
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
  let totalLiquidityETH = valueToZDBigNumber('0');
  let totalCollateralETH = valueToZDBigNumber('0');
  let totalBorrowsETH = valueToZDBigNumber('0');
  let currentLtv = valueToBigNumber('0');
  let currentLiquidationThreshold = valueToBigNumber('0');

  const userReservesData: UserReserveSummaryResponse[] = request.rawUserReserves
    .map(userReserve => {
      const poolReserve = userReserve.reserve;

      const computedUserReserve = generateUserReserveSummary({
        userReserve: userReserve,
        usdPriceEth: request.usdPriceEth,
        currentTimestamp: request.currentTimestamp,
      });

      totalLiquidityETH = totalLiquidityETH.plus(
        computedUserReserve.underlyingBalanceETH,
      );
      totalBorrowsETH = totalBorrowsETH
        .plus(computedUserReserve.variableBorrowsETH)
        .plus(computedUserReserve.stableBorrowsETH);

      if (
        poolReserve.usageAsCollateralEnabled &&
        userReserve.usageAsCollateralEnabledOnUser
      ) {
        totalCollateralETH = totalCollateralETH.plus(
          computedUserReserve.underlyingBalanceETH,
        );
        currentLtv = currentLtv.plus(
          computedUserReserve.underlyingBalanceETH.multipliedBy(
            poolReserve.baseLTVasCollateral,
          ),
        );
        currentLiquidationThreshold = currentLiquidationThreshold.plus(
          computedUserReserve.underlyingBalanceETH.multipliedBy(
            poolReserve.reserveLiquidationThreshold,
          ),
        );
      }

      return computedUserReserve;
    })
    .sort((a, b) =>
      a.userReserve.reserve.symbol > b.userReserve.reserve.symbol
        ? 1
        : a.userReserve.reserve.symbol < b.userReserve.reserve.symbol
        ? -1
        : 0,
    );

  if (currentLtv.gt(0)) {
    currentLtv = valueToZDBigNumber(currentLtv.div(totalCollateralETH));
  }

  if (currentLiquidationThreshold.gt(0)) {
    currentLiquidationThreshold = valueToZDBigNumber(
      currentLiquidationThreshold.div(totalCollateralETH),
    );
  }

  const totalCollateralUSD = convertToUsd(
    totalCollateralETH,
    request.usdPriceEth,
  );
  const totalLiquidityUSD = convertToUsd(
    totalLiquidityETH,
    request.usdPriceEth,
  );
  const totalBorrowsUSD = convertToUsd(totalBorrowsETH, request.usdPriceEth);

  const availableBorrowsETH = calculateAvailableBorrowsETH({
    collateralBalanceETH: totalCollateralETH,
    borrowBalanceETH: totalBorrowsETH,
    currentLtv,
  });

  return {
    totalLiquidityUSD,
    totalCollateralUSD,
    totalBorrowsUSD,
    totalLiquidityETH,
    totalCollateralETH,
    totalBorrowsETH,
    availableBorrowsETH,
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor: calculateHealthFactorFromBalances({
      collateralBalanceETH: totalCollateralETH,
      borrowBalanceETH: totalBorrowsETH,
      currentLiquidationThreshold,
    }),
    reservesData: userReservesData,
  };
}

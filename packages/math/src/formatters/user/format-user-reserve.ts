import { ComputedUserReserve } from '.';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
import { normalize, valueToBigNumber } from '../../bignumber';
import {
  LTV_PRECISION,
  USD_DECIMALS,
  RAY_DECIMALS,
  ETH_DECIMALS,
} from '../../constants';

export interface FormatUserReserveRequest {
  rawUserReserve: UserReserveSummaryResponse;
}

export interface FormatUserReserveResponse {
  reserves: ComputedUserReserve;
}

export function formatUserReserve(
  request: FormatUserReserveRequest,
): ComputedUserReserve {
  const rawUserReserve = request.rawUserReserve;
  const userReserve = rawUserReserve.userReserve;
  const reserve = userReserve.reserve;
  const reserveDecimals = reserve.decimals;

  return {
    ...userReserve,
    reserve: {
      ...reserve,
      reserveLiquidationBonus: normalize(
        valueToBigNumber(reserve.reserveLiquidationBonus).shiftedBy(
          LTV_PRECISION,
        ),
        4,
      ),
      liquidityRate: normalize(reserve.liquidityRate, RAY_DECIMALS),
    },
    scaledATokenBalance: normalize(
      userReserve.scaledATokenBalance,
      reserveDecimals,
    ),
    stableBorrowRate: normalize(userReserve.stableBorrowRate, RAY_DECIMALS),
    variableBorrowIndex: normalize(
      userReserve.variableBorrowIndex,
      RAY_DECIMALS,
    ),
    underlyingBalance: normalize(
      rawUserReserve.underlyingBalance,
      reserveDecimals,
    ),
    underlyingBalanceETH: normalize(
      rawUserReserve.underlyingBalanceETH,
      ETH_DECIMALS,
    ),
    underlyingBalanceUSD: normalize(
      rawUserReserve.underlyingBalanceUSD,
      USD_DECIMALS,
    ),
    stableBorrows: normalize(rawUserReserve.stableBorrows, reserveDecimals),
    stableBorrowsETH: normalize(rawUserReserve.stableBorrowsETH, ETH_DECIMALS),
    stableBorrowsUSD: normalize(rawUserReserve.stableBorrowsUSD, USD_DECIMALS),
    variableBorrows: normalize(rawUserReserve.variableBorrows, reserveDecimals),
    variableBorrowsETH: normalize(
      rawUserReserve.variableBorrowsETH,
      ETH_DECIMALS,
    ),
    variableBorrowsUSD: normalize(
      rawUserReserve.variableBorrowsUSD,
      USD_DECIMALS,
    ),
    totalBorrows: normalize(rawUserReserve.totalBorrows, reserveDecimals),
    totalBorrowsETH: normalize(rawUserReserve.totalBorrowsETH, ETH_DECIMALS),
    totalBorrowsUSD: normalize(rawUserReserve.totalBorrowsUSD, USD_DECIMALS),
    totalLiquidity: normalize(rawUserReserve.totalLiquidity, reserveDecimals),
    totalStableDebt: normalize(rawUserReserve.totalStableDebt, reserveDecimals),
    totalVariableDebt: normalize(
      rawUserReserve.totalVariableDebt,
      reserveDecimals,
    ),
  };
}

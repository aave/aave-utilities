import { ComputedUserReserve } from './index';
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import {
  LTV_PRECISION,
  USD_DECIMALS,
  RAY_DECIMALS,
  ETH_DECIMALS,
} from '../../constants';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';

export interface FormatUserReserveRequest {
  reserve: UserReserveSummaryResponse;
}

export interface FormatUserReserveResponse {
  reserve: ComputedUserReserve;
}

export function formatUserReserve(
  request: FormatUserReserveRequest,
): ComputedUserReserve {
  const rawUserReserve = request.reserve;
  const userReserve = rawUserReserve.userReserve;
  const reserve = userReserve.reserve;
  const reserveDecimals = reserve.decimals;

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, reserve.decimals);

  return {
    ...userReserve,
    reserve: {
      ...reserve,
      reserveLiquidationBonus: normalize(
        valueToBigNumber(reserve.reserveLiquidationBonus).shiftedBy(
          LTV_PRECISION,
        ),
        LTV_PRECISION,
      ),
      liquidityRate: normalize(reserve.liquidityRate, RAY_DECIMALS),
    },
    scaledATokenBalance: normalizeWithReserve(userReserve.scaledATokenBalance),
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
    stableBorrows: normalizeWithReserve(rawUserReserve.stableBorrows),
    stableBorrowsETH: normalize(rawUserReserve.stableBorrowsETH, ETH_DECIMALS),
    stableBorrowsUSD: normalize(rawUserReserve.stableBorrowsUSD, USD_DECIMALS),
    variableBorrows: normalizeWithReserve(rawUserReserve.variableBorrows),
    variableBorrowsETH: normalize(
      rawUserReserve.variableBorrowsETH,
      ETH_DECIMALS,
    ),
    variableBorrowsUSD: normalize(
      rawUserReserve.variableBorrowsUSD,
      USD_DECIMALS,
    ),
    totalBorrows: normalizeWithReserve(rawUserReserve.totalBorrows),
    totalBorrowsETH: normalize(rawUserReserve.totalBorrowsETH, ETH_DECIMALS),
    totalBorrowsUSD: normalize(rawUserReserve.totalBorrowsUSD, USD_DECIMALS),
    totalLiquidity: normalizeWithReserve(rawUserReserve.totalLiquidity),
    totalStableDebt: normalizeWithReserve(rawUserReserve.totalStableDebt),
    totalVariableDebt: normalizeWithReserve(rawUserReserve.totalVariableDebt),
  };
}

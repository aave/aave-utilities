import { ComputedUserReserve } from '.'
import { RawUserReserveResponse } from './generate-raw-user-reserve'
import { normalize, valueToBigNumber } from '../../bignumber'
import {
  LTV_PRECISION,
  USD_DECIMALS,
  RAY_DECIMALS,
  ETH_DECIMALS,
} from '../../constants'

export interface FormatUserReservesRequest {
  rawUserReserve: RawUserReserveResponse
}

export interface FormatUserReservesResponse {
  reserves: ComputedUserReserve
}

export function formatUserReserve(
  request: FormatUserReservesRequest,
): ComputedUserReserve {
  const rawUserReserve = request.rawUserReserve
  const userReserve = rawUserReserve.userReserve
  const reserve = userReserve.reserve
  const reserveDecimals = reserve.decimals

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
    depositRewards: rawUserReserve.depositRewards.toString(),
    depositRewardsUSD: rawUserReserve.depositRewardsUSD.toString(),
    depositRewardsETH: rawUserReserve.depositRewardsETH.toString(),
    variableDebtRewards: rawUserReserve.variableDebtRewards.toString(),
    variableDebtRewardsETH: rawUserReserve.variableDebtRewardsETH.toString(),
    variableDebtRewardsUSD: rawUserReserve.variableDebtRewardsUSD.toString(),
    stableDebtRewards: rawUserReserve.stableDebtRewards.toString(),
    stableDebtRewardsETH: rawUserReserve.stableDebtRewardsETH.toString(),
    stableDebtRewardsUSD: rawUserReserve.stableDebtRewardsUSD.toString(),
    totalRewards: rawUserReserve.totalRewards.toString(),
    totalRewardsETH: rawUserReserve.totalRewardsETH.toString(),
    totalRewardsUSD: rawUserReserve.totalRewardsUSD.toString(),
  }
}

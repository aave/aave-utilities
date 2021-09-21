import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS, RAY_DECIMALS } from '../../constants';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
import { ComputedUserReserve } from './index';

export interface FormatUserReserveRequest {
  reserve: UserReserveSummaryResponse;
  marketReferenceCurrencyDecimals: number;
}

export interface FormatUserReserveResponse {
  reserve: ComputedUserReserve;
}

export function formatUserReserve({
  reserve: _reserve,
  marketReferenceCurrencyDecimals,
}: FormatUserReserveRequest): ComputedUserReserve {
  const userReserve = _reserve.userReserve;
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
    underlyingBalance: normalize(_reserve.underlyingBalance, reserveDecimals),
    underlyingBalanceMarketReferenceCurrency: normalize(
      _reserve.underlyingBalanceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    underlyingBalanceUSD: normalize(
      _reserve.underlyingBalanceUSD,
      USD_DECIMALS,
    ),
    stableBorrows: normalizeWithReserve(_reserve.stableBorrows),
    stableBorrowsMarketReferenceCurrency: normalize(
      _reserve.stableBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    stableBorrowsUSD: normalize(_reserve.stableBorrowsUSD, USD_DECIMALS),
    variableBorrows: normalizeWithReserve(_reserve.variableBorrows),
    variableBorrowsMarketReferenceCurrency: normalize(
      _reserve.variableBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    variableBorrowsUSD: normalize(_reserve.variableBorrowsUSD, USD_DECIMALS),
    totalBorrows: normalizeWithReserve(_reserve.totalBorrows),
    totalBorrowsMarketReferenceCurrency: normalize(
      _reserve.totalBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: normalize(_reserve.totalBorrowsUSD, USD_DECIMALS),
    totalLiquidity: normalizeWithReserve(_reserve.totalLiquidity),
    totalStableDebt: normalizeWithReserve(_reserve.totalStableDebt),
    totalVariableDebt: normalizeWithReserve(_reserve.totalVariableDebt),
  };
}

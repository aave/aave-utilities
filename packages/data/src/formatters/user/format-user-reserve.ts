import {
  BigNumberValue,
  normalize,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber';
import { LTV_PRECISION, RAY_DECIMALS, SECONDS_PER_YEAR } from '../../constants';
import { RAY, rayPow } from '../../ray.math';
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
  const { userReserve } = _reserve;
  const { reserve } = userReserve;
  const reserveDecimals = reserve.decimals;

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, reserve.decimals);

  const exactStableBorrowRate = rayPow(
    valueToZDBigNumber(userReserve.stableBorrowRate)
      .dividedBy(SECONDS_PER_YEAR)
      .plus(RAY),
    SECONDS_PER_YEAR,
  ).minus(RAY);

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
    },
    scaledATokenBalance: normalizeWithReserve(userReserve.scaledATokenBalance),
    underlyingBalance: normalize(_reserve.underlyingBalance, reserveDecimals),
    underlyingBalanceMarketReferenceCurrency: normalize(
      _reserve.underlyingBalanceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    underlyingBalanceUSD: _reserve.underlyingBalanceUSD.toString(),
    stableBorrows: normalizeWithReserve(_reserve.stableBorrows),
    stableBorrowsMarketReferenceCurrency: normalize(
      _reserve.stableBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    stableBorrowsUSD: _reserve.stableBorrowsUSD.toString(),
    variableBorrows: normalizeWithReserve(_reserve.variableBorrows),
    variableBorrowsMarketReferenceCurrency: normalize(
      _reserve.variableBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    variableBorrowsUSD: _reserve.variableBorrowsUSD.toString(),
    totalBorrows: normalizeWithReserve(_reserve.totalBorrows),
    totalBorrowsMarketReferenceCurrency: normalize(
      _reserve.totalBorrowsMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    totalBorrowsUSD: _reserve.totalBorrowsUSD.toString(),
    stableBorrowAPR: normalize(userReserve.stableBorrowRate, RAY_DECIMALS),
    stableBorrowAPY: normalize(exactStableBorrowRate, RAY_DECIMALS),
  };
}

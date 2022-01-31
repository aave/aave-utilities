import { BigNumberValue, normalize, valueToZDBigNumber } from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR } from '../../constants';
import { RAY, rayPow } from '../../ray.math';
import { FormatReserveUSDResponse } from '../reserve';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
import { ComputedUserReserve } from './index';

export interface FormatUserReserveRequest<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  reserve: UserReserveSummaryResponse<T>;
  marketReferenceCurrencyDecimals: number;
}

export interface FormatUserReserveResponse<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  reserve: ComputedUserReserve<T>;
}

export function formatUserReserve<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  reserve: _reserve,
  marketReferenceCurrencyDecimals,
}: FormatUserReserveRequest<T>): ComputedUserReserve<T> {
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

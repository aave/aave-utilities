import { BigNumberValue, normalize } from '../../bignumber';
import { FormatReserveUSDResponse } from '../reserve';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
import { ComputedUserReserve } from '.';

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

  return {
    ...userReserve,
    underlyingBalance: normalize(_reserve.underlyingBalance, reserveDecimals),
    underlyingBalanceMarketReferenceCurrency: normalize(
      _reserve.underlyingBalanceMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    underlyingBalanceUSD: _reserve.underlyingBalanceUSD.toString(),
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
  };
}

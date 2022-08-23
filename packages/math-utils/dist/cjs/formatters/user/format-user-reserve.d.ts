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
export declare function formatUserReserve<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  reserve: _reserve,
  marketReferenceCurrencyDecimals,
}: FormatUserReserveRequest<T>): ComputedUserReserve<T>;
//# sourceMappingURL=format-user-reserve.d.ts.map

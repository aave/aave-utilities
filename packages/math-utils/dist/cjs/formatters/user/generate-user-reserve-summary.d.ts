import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { FormatReserveUSDResponse } from '../reserve';
import { CombinedReserveData } from './index';
export interface UserReserveSummaryRequest<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  userReserve: CombinedReserveData<T>;
  marketReferencePriceInUsdNormalized: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
}
export interface UserReserveSummaryResponse<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  userReserve: CombinedReserveData<T>;
  underlyingBalance: BigNumber;
  underlyingBalanceMarketReferenceCurrency: BigNumber;
  underlyingBalanceUSD: BigNumber;
  variableBorrows: BigNumber;
  variableBorrowsMarketReferenceCurrency: BigNumber;
  variableBorrowsUSD: BigNumber;
  stableBorrows: BigNumber;
  stableBorrowsMarketReferenceCurrency: BigNumber;
  stableBorrowsUSD: BigNumber;
  totalBorrows: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  totalBorrowsUSD: BigNumber;
}
export declare function generateUserReserveSummary<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  userReserve,
  marketReferencePriceInUsdNormalized,
  marketReferenceCurrencyDecimals,
  currentTimestamp,
}: UserReserveSummaryRequest<T>): UserReserveSummaryResponse<T>;
//# sourceMappingURL=generate-user-reserve-summary.d.ts.map

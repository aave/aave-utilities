import BigNumber from 'bignumber.js';
import { FormatReserveUSDResponse } from '../reserve';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
interface UserReserveTotalsRequest {
  userReserves: UserReserveSummaryResponse[];
  userEmodeCategoryId: number;
}
interface UserReserveTotalsResponse {
  totalLiquidityMarketReferenceCurrency: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  totalCollateralMarketReferenceCurrency: BigNumber;
  currentLtv: BigNumber;
  currentLiquidationThreshold: BigNumber;
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}
export declare function calculateUserReserveTotals({
  userReserves,
  userEmodeCategoryId,
}: UserReserveTotalsRequest): UserReserveTotalsResponse;
export {};
//# sourceMappingURL=calculate-user-reserve-totals.d.ts.map

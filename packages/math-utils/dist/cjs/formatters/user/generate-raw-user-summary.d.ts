import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { FormatReserveUSDResponse } from '../reserve';
import { UserReserveSummaryResponse } from './generate-user-reserve-summary';
export interface RawUserSummaryRequest {
  userReserves: UserReserveSummaryResponse[];
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  userEmodeCategoryId: number;
}
export interface RawUserSummaryResponse {
  totalLiquidityUSD: BigNumber;
  totalCollateralUSD: BigNumber;
  totalBorrowsUSD: BigNumber;
  totalLiquidityMarketReferenceCurrency: BigNumber;
  totalCollateralMarketReferenceCurrency: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  availableBorrowsMarketReferenceCurrency: BigNumber;
  availableBorrowsUSD: BigNumber;
  currentLoanToValue: BigNumber;
  currentLiquidationThreshold: BigNumber;
  healthFactor: BigNumber;
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}
export declare function generateRawUserSummary({
  userReserves,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userEmodeCategoryId,
}: RawUserSummaryRequest): RawUserSummaryResponse;
//# sourceMappingURL=generate-raw-user-summary.d.ts.map

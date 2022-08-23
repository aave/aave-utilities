import { BigNumberValue } from '../../bignumber';
import { UserIncentiveDict } from '../incentive';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
} from '../incentive/types';
import { FormatReserveUSDResponse } from '../reserve';
export interface UserReserveData {
  underlyingAsset: string;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}
export interface CombinedReserveData<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> extends UserReserveData {
  reserve: T;
}
export interface ComputedUserReserve<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> extends CombinedReserveData<T> {
  underlyingBalance: string;
  underlyingBalanceMarketReferenceCurrency: string;
  underlyingBalanceUSD: string;
  variableBorrows: string;
  variableBorrowsMarketReferenceCurrency: string;
  variableBorrowsUSD: string;
  stableBorrows: string;
  stableBorrowsMarketReferenceCurrency: string;
  stableBorrowsUSD: string;
  totalBorrows: string;
  totalBorrowsMarketReferenceCurrency: string;
  totalBorrowsUSD: string;
  stableBorrowAPY: string;
  stableBorrowAPR: string;
}
export interface FormatUserSummaryRequest<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  userReserves: UserReserveData[];
  formattedReserves: T[];
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
  userEmodeCategoryId: number;
}
export interface FormatUserSummaryResponse<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> {
  userReservesData: Array<ComputedUserReserve<T>>;
  totalLiquidityMarketReferenceCurrency: string;
  totalLiquidityUSD: string;
  totalCollateralMarketReferenceCurrency: string;
  totalCollateralUSD: string;
  totalBorrowsMarketReferenceCurrency: string;
  totalBorrowsUSD: string;
  netWorthUSD: string;
  availableBorrowsMarketReferenceCurrency: string;
  availableBorrowsUSD: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
  isInIsolationMode: boolean;
  isolatedReserve?: FormatReserveUSDResponse;
}
export interface FormatUserSummaryAndIncentivesRequest<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> extends FormatUserSummaryRequest<T> {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  userIncentives: UserReservesIncentivesDataHumanized[];
}
export interface FormatUserSummaryAndIncentivesResponse<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
> extends FormatUserSummaryResponse<T> {
  calculatedUserIncentives: UserIncentiveDict;
}
export declare function formatUserSummary<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userReserves,
  formattedReserves,
  userEmodeCategoryId,
}: FormatUserSummaryRequest<T>): FormatUserSummaryResponse<T>;
export declare function formatUserSummaryAndIncentives<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  userReserves,
  formattedReserves,
  userEmodeCategoryId,
  reserveIncentives,
  userIncentives,
}: FormatUserSummaryAndIncentivesRequest<T>): FormatUserSummaryAndIncentivesResponse<T>;
//# sourceMappingURL=index.d.ts.map

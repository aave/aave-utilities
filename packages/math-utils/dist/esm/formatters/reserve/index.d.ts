import { CalculateReserveIncentivesResponse } from '../incentive/calculate-reserve-incentives';
import { ReservesIncentiveDataHumanized } from '../incentive/types';
export interface FormatReserveResponse extends ReserveData {
  formattedBaseLTVasCollateral: string;
  formattedReserveLiquidationThreshold: string;
  formattedReserveLiquidationBonus: string;
  formattedEModeLtv: string;
  formattedEModeLiquidationBonus: string;
  formattedEModeLiquidationThreshold: string;
  formattedAvailableLiquidity: string;
  totalDebt: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  totalLiquidity: string;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  supplyAPY: string;
  variableBorrowAPY: string;
  stableBorrowAPY: string;
  unborrowedLiquidity: string;
  supplyAPR: string;
  variableBorrowAPR: string;
  stableBorrowAPR: string;
  isIsolated: boolean;
  isolationModeTotalDebtUSD: string;
  availableDebtCeilingUSD: string;
  debtCeilingUSD: string;
}
export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp: number;
}
export interface ReserveData {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  underlyingAsset: string;
  usageAsCollateralEnabled: boolean;
  reserveFactor: string;
  baseLTVasCollateral: string;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  lastUpdateTimestamp: number;
  eModeCategoryId: number;
  borrowCap: string;
  supplyCap: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  isolationModeTotalDebt: string;
  eModeLtv: number;
  eModeLiquidationThreshold: number;
  eModeLiquidationBonus: number;
  unbacked: string;
}
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
export declare function formatReserve({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): FormatReserveResponse;
export declare type ReserveDataWithPrice = ReserveData & {
  priceInMarketReferenceCurrency: string;
};
export interface FormatReserveUSDRequest {
  reserve: ReserveDataWithPrice;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}
export interface FormatReserveUSDResponse extends FormatReserveResponse {
  totalLiquidityUSD: string;
  availableLiquidityUSD: string;
  totalDebtUSD: string;
  totalVariableDebtUSD: string;
  totalStableDebtUSD: string;
  borrowCapUSD: string;
  supplyCapUSD: string;
  unbackedUSD: string;
  priceInMarketReferenceCurrency: string;
  formattedPriceInMarketReferenceCurrency: string;
  priceInUSD: string;
}
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export declare function formatReserveUSD({
  reserve,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReserveUSDRequest): FormatReserveUSDResponse;
export interface FormatReservesUSDRequest<T extends ReserveDataWithPrice> {
  reserves: T[];
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}
export declare function formatReserves<T extends ReserveDataWithPrice>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReservesUSDRequest<T>): (T & FormatReserveUSDResponse)[];
export interface FormatReservesAndIncentivesUSDRequest<
  T extends ReserveDataWithPrice,
> extends FormatReservesUSDRequest<
    T & {
      underlyingAsset: string;
    }
  > {
  reserveIncentives: ReservesIncentiveDataHumanized[];
}
export declare function formatReservesAndIncentives<
  T extends ReserveDataWithPrice,
>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  reserveIncentives,
}: FormatReservesAndIncentivesUSDRequest<T>): Array<
  FormatReserveUSDResponse & T & Partial<CalculateReserveIncentivesResponse>
>;
//# sourceMappingURL=index.d.ts.map

import BigNumber from 'bignumber.js';
import { BigNumberValue } from './bignumber';
interface CalculateCompoundedInterestRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}
export declare function calculateCompoundedInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: CalculateCompoundedInterestRequest): BigNumber;
interface CompoundedBalanceRequest {
  principalBalance: BigNumberValue;
  reserveIndex: BigNumberValue;
  reserveRate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export declare function getCompoundedBalance({
  principalBalance: _principalBalance,
  reserveIndex,
  reserveRate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CompoundedBalanceRequest): BigNumber;
interface LinearInterestRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}
export declare function calculateLinearInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: LinearInterestRequest): BigNumber;
interface ReserveNormalizedIncomeRequest {
  rate: BigNumberValue;
  index: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export declare function getReserveNormalizedIncome({
  rate,
  index,
  lastUpdateTimestamp,
  currentTimestamp,
}: ReserveNormalizedIncomeRequest): BigNumber;
interface LinearBalanceRequest {
  balance: BigNumberValue;
  index: BigNumberValue;
  rate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export declare function getLinearBalance({
  balance,
  index,
  rate,
  lastUpdateTimestamp,
  currentTimestamp,
}: LinearBalanceRequest): BigNumber;
interface CompoundedStableBalanceRequest {
  principalBalance: BigNumberValue;
  userStableRate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export declare function getCompoundedStableBalance({
  principalBalance: _principalBalance,
  userStableRate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CompoundedStableBalanceRequest): BigNumber;
interface HealthFactorFromBalanceRequest {
  collateralBalanceMarketReferenceCurrency: BigNumberValue;
  borrowBalanceMarketReferenceCurrency: BigNumberValue;
  currentLiquidationThreshold: BigNumberValue;
}
export declare function calculateHealthFactorFromBalances({
  borrowBalanceMarketReferenceCurrency,
  collateralBalanceMarketReferenceCurrency,
  currentLiquidationThreshold,
}: HealthFactorFromBalanceRequest): BigNumber;
interface HealthFactorFromBalanceBigUnitsRequest {
  collateralBalanceMarketReferenceCurrency: BigNumberValue;
  borrowBalanceMarketReferenceCurrency: BigNumberValue;
  currentLiquidationThreshold: BigNumberValue;
}
export declare function calculateHealthFactorFromBalancesBigUnits({
  collateralBalanceMarketReferenceCurrency,
  borrowBalanceMarketReferenceCurrency,
  currentLiquidationThreshold,
}: HealthFactorFromBalanceBigUnitsRequest): BigNumber;
interface AvailableBorrowsMarketReferenceCurrencyRequest {
  collateralBalanceMarketReferenceCurrency: BigNumberValue;
  borrowBalanceMarketReferenceCurrency: BigNumberValue;
  currentLtv: BigNumberValue;
}
export declare function calculateAvailableBorrowsMarketReferenceCurrency({
  collateralBalanceMarketReferenceCurrency,
  borrowBalanceMarketReferenceCurrency,
  currentLtv,
}: AvailableBorrowsMarketReferenceCurrencyRequest): BigNumber;
interface MarketReferenceCurrencyAndUsdBalanceRequest {
  balance: BigNumberValue;
  priceInMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  decimals: number;
  marketReferencePriceInUsdNormalized: BigNumberValue;
}
interface MarketReferenceAndUsdBalanceResponse {
  marketReferenceCurrencyBalance: BigNumber;
  usdBalance: BigNumber;
}
/**
 * @returns non humanized/normalized values for usd/marketReference
 */
export declare function getMarketReferenceCurrencyAndUsdBalance({
  balance,
  priceInMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  decimals,
  marketReferencePriceInUsdNormalized,
}: MarketReferenceCurrencyAndUsdBalanceRequest): MarketReferenceAndUsdBalanceResponse;
export {};
//# sourceMappingURL=pool-math.d.ts.map

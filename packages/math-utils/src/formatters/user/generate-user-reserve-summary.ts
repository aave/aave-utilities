import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  getLinearBalance,
  getMarketReferenceCurrencyAndUsdBalance,
  getCompoundedBalance,
} from '../../pool-math';
import { FormatReserveUSDResponse } from '../reserve';
import { CombinedReserveData } from '.';

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
  totalBorrows: BigNumber;
  totalBorrowsMarketReferenceCurrency: BigNumber;
  totalBorrowsUSD: BigNumber;
}

export function generateUserReserveSummary<
  T extends FormatReserveUSDResponse = FormatReserveUSDResponse,
>({
  userReserve,
  marketReferencePriceInUsdNormalized,
  marketReferenceCurrencyDecimals,
  currentTimestamp,
}: UserReserveSummaryRequest<T>): UserReserveSummaryResponse<T> {
  const poolReserve: FormatReserveUSDResponse = userReserve.reserve;
  const { priceInMarketReferenceCurrency, decimals } = poolReserve;
  const underlyingBalance = getLinearBalance({
    balance: userReserve.scaledATokenBalance,
    index: poolReserve.liquidityIndex,
    rate: poolReserve.liquidityRate,
    lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    currentTimestamp,
  });
  const {
    marketReferenceCurrencyBalance: underlyingBalanceMarketReferenceCurrency,
    usdBalance: underlyingBalanceUSD,
  } = getMarketReferenceCurrencyAndUsdBalance({
    balance: underlyingBalance,
    priceInMarketReferenceCurrency,
    marketReferenceCurrencyDecimals,
    decimals,
    marketReferencePriceInUsdNormalized,
  });

  const variableBorrows = getCompoundedBalance({
    principalBalance: userReserve.scaledVariableDebt,
    reserveIndex: poolReserve.variableBorrowIndex,
    reserveRate: poolReserve.variableBorrowRate,
    lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    currentTimestamp,
  });

  const {
    marketReferenceCurrencyBalance: variableBorrowsMarketReferenceCurrency,
    usdBalance: variableBorrowsUSD,
  } = getMarketReferenceCurrencyAndUsdBalance({
    balance: variableBorrows,
    priceInMarketReferenceCurrency,
    marketReferenceCurrencyDecimals,
    decimals,
    marketReferencePriceInUsdNormalized,
  });

  return {
    userReserve,
    underlyingBalance,
    underlyingBalanceMarketReferenceCurrency,
    underlyingBalanceUSD,
    variableBorrows,
    variableBorrowsMarketReferenceCurrency,
    variableBorrowsUSD,
    totalBorrows: variableBorrows,
    totalBorrowsMarketReferenceCurrency: variableBorrowsMarketReferenceCurrency,
    totalBorrowsUSD: variableBorrowsUSD,
  };
}

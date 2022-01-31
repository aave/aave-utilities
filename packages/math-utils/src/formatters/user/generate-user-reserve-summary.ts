import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  getLinearBalance,
  getMarketReferenceCurrencyAndUsdBalance,
  getCompoundedBalance,
  getCompoundedStableBalance,
} from '../../pool-math';
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

  const stableBorrows = getCompoundedStableBalance({
    principalBalance: userReserve.principalStableDebt,
    userStableRate: userReserve.stableBorrowRate,
    lastUpdateTimestamp: userReserve.stableBorrowLastUpdateTimestamp,
    currentTimestamp,
  });

  const {
    marketReferenceCurrencyBalance: stableBorrowsMarketReferenceCurrency,
    usdBalance: stableBorrowsUSD,
  } = getMarketReferenceCurrencyAndUsdBalance({
    balance: stableBorrows,
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
    stableBorrows,
    stableBorrowsMarketReferenceCurrency,
    stableBorrowsUSD,
    totalBorrows: variableBorrows.plus(stableBorrows),
    totalBorrowsMarketReferenceCurrency:
      variableBorrowsMarketReferenceCurrency.plus(
        stableBorrowsMarketReferenceCurrency,
      ),
    totalBorrowsUSD: variableBorrowsUSD.plus(stableBorrowsUSD),
  };
}

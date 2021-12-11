import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  getLinearBalance,
  getMarketReferenceCurrencyAndUsdBalance,
  getCompoundedBalance,
  getCompoundedStableBalance,
} from '../../pool-math';
import { RawUserReserveData, ReserveData } from './index';

export interface UserReserveSummaryRequest {
  userReserve: RawUserReserveData;
  marketReferencePriceInUsd: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
}

export interface UserReserveSummaryResponse {
  userReserve: RawUserReserveData;
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

export function generateUserReserveSummary({
  userReserve,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  currentTimestamp,
}: UserReserveSummaryRequest): UserReserveSummaryResponse {
  const poolReserve: ReserveData = userReserve.reserve;
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
    marketReferencePriceInUsd,
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
    marketReferencePriceInUsd,
  });

  const stableBorrows = getCompoundedStableBalance({
    principalBalance: userReserve.principalStableDebt,
    userStableRate: poolReserve.stableBorrowRate,
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
    marketReferencePriceInUsd,
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

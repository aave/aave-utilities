import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import {
  getLinearBalance,
  getMarketReferenceCurrencyAndUsdBalance,
  getCompoundedBalance,
  getCompoundedStableBalance,
} from '../../pool-math';
import { calculateSupplies } from './calculate-supplies';
import { RawUserReserveData } from './index';

export interface UserReserveSummaryRequest {
  userReserve: RawUserReserveData;
  marketRefPriceInUsd: BigNumberValue;
  marketRefCurrencyDecimals: number;
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
  totalLiquidity: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
}

export function generateUserReserveSummary({
  userReserve,
  marketRefPriceInUsd,
  marketRefCurrencyDecimals,
  currentTimestamp,
}: UserReserveSummaryRequest): UserReserveSummaryResponse {
  const poolReserve = userReserve.reserve;
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
    marketRefCurrencyDecimals,
    decimals,
    marketRefPriceInUsd,
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
    marketRefCurrencyDecimals,
    decimals,
    marketRefPriceInUsd,
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
    marketRefCurrencyDecimals,
    decimals,
    marketRefPriceInUsd,
  });

  const { totalLiquidity, totalStableDebt, totalVariableDebt } =
    calculateSupplies({
      reserve: {
        totalScaledVariableDebt: poolReserve.totalScaledVariableDebt,
        variableBorrowIndex: poolReserve.variableBorrowIndex,
        variableBorrowRate: poolReserve.variableBorrowRate,
        totalPrincipalStableDebt: poolReserve.totalPrincipalStableDebt,
        averageStableRate: poolReserve.averageStableRate,
        availableLiquidity: poolReserve.availableLiquidity,
        stableDebtLastUpdateTimestamp:
          poolReserve.stableDebtLastUpdateTimestamp,
        lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
      },
      currentTimestamp,
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
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  };
}

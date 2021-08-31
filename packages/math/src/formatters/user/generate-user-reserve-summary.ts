import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
import { RawUserReserveData } from './index';
import {
  getLinearBalance,
  getEthAndUsdBalance,
  getCompoundedBalance,
  getCompoundedStableBalance,
} from '../../pool-math';

import { calculateSupplies } from './calculate-supplies';

export interface UserReserveSummaryRequest {
  userReserve: RawUserReserveData;
  usdPriceEth: BigNumberValue;
  currentTimestamp: number;
}

export interface UserReserveSummaryResponse {
  userReserve: RawUserReserveData;
  underlyingBalance: BigNumber;
  underlyingBalanceETH: BigNumber;
  underlyingBalanceUSD: BigNumber;
  variableBorrows: BigNumber;
  variableBorrowsETH: BigNumber;
  variableBorrowsUSD: BigNumber;
  stableBorrows: BigNumber;
  stableBorrowsETH: BigNumber;
  stableBorrowsUSD: BigNumber;
  totalBorrows: BigNumber;
  totalBorrowsETH: BigNumber;
  totalBorrowsUSD: BigNumber;
  totalLiquidity: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
}

export function generateUserReserveSummary(
  request: UserReserveSummaryRequest,
): UserReserveSummaryResponse {
  const poolReserve = request.userReserve.reserve;
  const {
    price: { priceInEth },
    decimals,
  } = poolReserve;
  const underlyingBalance = getLinearBalance({
    balance: request.userReserve.scaledATokenBalance,
    index: poolReserve.liquidityIndex,
    rate: poolReserve.liquidityRate,
    lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    currentTimestamp: request.currentTimestamp,
  });
  const {
    ethBalance: underlyingBalanceETH,
    usdBalance: underlyingBalanceUSD,
  } = getEthAndUsdBalance({
    balance: underlyingBalance,
    priceInEth,
    decimals,
    usdPriceEth: request.usdPriceEth,
  });

  const variableBorrows = getCompoundedBalance({
    principalBalance: request.userReserve.scaledVariableDebt,
    reserveIndex: poolReserve.variableBorrowIndex,
    reserveRate: poolReserve.variableBorrowRate,
    lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    currentTimestamp: request.currentTimestamp,
  });

  const {
    ethBalance: variableBorrowsETH,
    usdBalance: variableBorrowsUSD,
  } = getEthAndUsdBalance({
    balance: variableBorrows,
    priceInEth,
    decimals,
    usdPriceEth: request.usdPriceEth,
  });

  const stableBorrows = getCompoundedStableBalance({
    principalBalance: request.userReserve.principalStableDebt,
    userStableRate: request.userReserve.stableBorrowRate,
    lastUpdateTimestamp: request.userReserve.stableBorrowLastUpdateTimestamp,
    currentTimestamp: request.currentTimestamp,
  });

  const {
    ethBalance: stableBorrowsETH,
    usdBalance: stableBorrowsUSD,
  } = getEthAndUsdBalance({
    balance: stableBorrows,
    priceInEth,
    decimals,
    usdPriceEth: request.usdPriceEth,
  });

  const {
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  } = calculateSupplies({
    reserve: {
      totalScaledVariableDebt: poolReserve.totalScaledVariableDebt,
      variableBorrowIndex: poolReserve.variableBorrowIndex,
      variableBorrowRate: poolReserve.variableBorrowRate,
      totalPrincipalStableDebt: poolReserve.totalPrincipalStableDebt,
      averageStableRate: poolReserve.averageStableRate,
      availableLiquidity: poolReserve.availableLiquidity,
      stableDebtLastUpdateTimestamp: poolReserve.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    },
    currentTimestamp: request.currentTimestamp,
  });

  return {
    userReserve: request.userReserve,
    underlyingBalance,
    underlyingBalanceETH,
    underlyingBalanceUSD,
    variableBorrows,
    variableBorrowsETH,
    variableBorrowsUSD,
    stableBorrows,
    stableBorrowsETH,
    stableBorrowsUSD,
    totalBorrows: variableBorrows.plus(stableBorrows),
    totalBorrowsETH: variableBorrowsETH.plus(stableBorrowsETH),
    totalBorrowsUSD: variableBorrowsUSD.plus(stableBorrowsUSD),
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  };
}

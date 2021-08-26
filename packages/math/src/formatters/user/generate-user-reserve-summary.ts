import BigNumber from 'bignumber.js';

import { BigNumberValue } from '../../bignumber';
import { RawUserReserveData } from '.';
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
  const underlyingBalance = getLinearBalance(
    request.userReserve.scaledATokenBalance,
    poolReserve.liquidityIndex,
    poolReserve.liquidityRate,
    poolReserve.lastUpdateTimestamp,
    request.currentTimestamp,
  );
  const [underlyingBalanceETH, underlyingBalanceUSD] = getEthAndUsdBalance(
    underlyingBalance,
    priceInEth,
    decimals,
    request.usdPriceEth,
  );

  const variableBorrows = getCompoundedBalance(
    request.userReserve.scaledVariableDebt,
    poolReserve.variableBorrowIndex,
    poolReserve.variableBorrowRate,
    poolReserve.lastUpdateTimestamp,
    request.currentTimestamp,
  );

  const [variableBorrowsETH, variableBorrowsUSD] = getEthAndUsdBalance(
    variableBorrows,
    priceInEth,
    decimals,
    request.usdPriceEth,
  );

  const stableBorrows = getCompoundedStableBalance(
    request.userReserve.principalStableDebt,
    request.userReserve.stableBorrowRate,
    request.userReserve.stableBorrowLastUpdateTimestamp,
    request.currentTimestamp,
  );

  const [stableBorrowsETH, stableBorrowsUSD] = getEthAndUsdBalance(
    stableBorrows,
    priceInEth,
    decimals,
    request.usdPriceEth,
  );
  const {
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  } = calculateSupplies(
    {
      totalScaledVariableDebt: poolReserve.totalScaledVariableDebt,
      variableBorrowIndex: poolReserve.variableBorrowIndex,
      variableBorrowRate: poolReserve.variableBorrowRate,
      totalPrincipalStableDebt: poolReserve.totalPrincipalStableDebt,
      averageStableRate: poolReserve.averageStableRate,
      availableLiquidity: poolReserve.availableLiquidity,
      stableDebtLastUpdateTimestamp: poolReserve.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    },
    request.currentTimestamp,
  );

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

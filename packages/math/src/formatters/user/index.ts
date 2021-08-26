import { BigNumberValue, normalize } from '../../bignumber';
import { ETH_DECIMALS, LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { generateRawUserSummary } from './generate-raw-user-summary';
import { formatUserReserve } from './format-user-reserve';

interface RawReserveData {
  decimals: number;
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
  price: {
    priceInEth: string;
  };
  id: string;
  symbol: string;
  usageAsCollateralEnabled: boolean;
}

export interface RawUserReserveData {
  reserve: RawReserveData;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  scaledVariableDebt: string;
  variableBorrowIndex: string;
  stableBorrowRate: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}

export interface ComputedUserReserve extends RawUserReserveData {
  underlyingBalance: string;
  underlyingBalanceETH: string;
  underlyingBalanceUSD: string;
  variableBorrows: string;
  variableBorrowsETH: string;
  variableBorrowsUSD: string;
  stableBorrows: string;
  stableBorrowsETH: string;
  stableBorrowsUSD: string;
  totalBorrows: string;
  totalBorrowsETH: string;
  totalBorrowsUSD: string;
  totalLiquidity: string;
  totalStableDebt: string;
  totalVariableDebt: string;
}

export interface FormatUserSummaryRequest {
  rawUserReserves: RawUserReserveData[];
  usdPriceEth: BigNumberValue;
  currentTimestamp: number;
}

export interface FormatUserSummaryResponse {
  userReservesData: ComputedUserReserve[];
  totalLiquidityETH: string;
  totalLiquidityUSD: string;
  totalCollateralETH: string;
  totalCollateralUSD: string;
  totalBorrowsETH: string;
  totalBorrowsUSD: string;
  availableBorrowsETH: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  healthFactor: string;
}

export function formatUserSummary(
  request: FormatUserSummaryRequest,
): FormatUserSummaryResponse {
  const userData = generateRawUserSummary({
    rawUserReserves: request.rawUserReserves,
    usdPriceEth: request.usdPriceEth,
    currentTimestamp: request.currentTimestamp,
  });

  const userReservesData = userData.reservesData.map(rawUserReserve => {
    const formattedReserve = formatUserReserve({ rawUserReserve });
    return formattedReserve;
  });

  return {
    userReservesData,
    totalLiquidityETH: normalize(userData.totalLiquidityETH, ETH_DECIMALS),
    totalLiquidityUSD: normalize(userData.totalLiquidityUSD, USD_DECIMALS),
    totalCollateralETH: normalize(userData.totalCollateralETH, ETH_DECIMALS),
    totalCollateralUSD: normalize(userData.totalCollateralUSD, USD_DECIMALS),
    totalBorrowsETH: normalize(userData.totalBorrowsETH, ETH_DECIMALS),
    totalBorrowsUSD: normalize(userData.totalBorrowsUSD, USD_DECIMALS),
    availableBorrowsETH: normalize(userData.availableBorrowsETH, ETH_DECIMALS),
    currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      LTV_PRECISION,
    ),
    healthFactor: userData.healthFactor.toString(),
  };
}

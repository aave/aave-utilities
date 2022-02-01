import { BigNumber } from 'ethers';

export interface ReservesData {
  0: Array<{
    underlyingAsset: string;
    name: string;
    symbol: string;
    decimals: BigNumber;
    baseLTVasCollateral: BigNumber;
    reserveLiquidationThreshold: BigNumber;
    reserveLiquidationBonus: BigNumber;
    reserveFactor: BigNumber;
    usageAsCollateralEnabled: boolean;
    borrowingEnabled: boolean;
    stableBorrowRateEnabled: boolean;
    isActive: boolean;
    isFrozen: boolean;
    liquidityIndex: BigNumber;
    variableBorrowIndex: BigNumber;
    liquidityRate: BigNumber;
    variableBorrowRate: BigNumber;
    stableBorrowRate: BigNumber;
    lastUpdateTimestamp: number;
    aTokenAddress: string;
    stableDebtTokenAddress: string;
    variableDebtTokenAddress: string;
    interestRateStrategyAddress: string;
    availableLiquidity: BigNumber;
    totalPrincipalStableDebt: BigNumber;
    averageStableRate: BigNumber;
    stableDebtLastUpdateTimestamp: BigNumber;
    totalScaledVariableDebt: BigNumber;
    priceInMarketReferenceCurrency: BigNumber;
    variableRateSlope1: BigNumber;
    variableRateSlope2: BigNumber;
    stableRateSlope1: BigNumber;
    stableRateSlope2: BigNumber;
    0: string;
    1: string;
    2: string;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
    6: BigNumber;
    7: BigNumber;
    8: boolean;
    9: boolean;
    10: boolean;
    11: boolean;
    12: boolean;
    13: BigNumber;
    14: BigNumber;
    15: BigNumber;
    16: BigNumber;
    17: BigNumber;
    18: number;
    19: string;
    20: string;
    21: string;
    22: string;
    23: BigNumber;
    24: BigNumber;
    25: BigNumber;
    26: BigNumber;
    27: BigNumber;
    28: BigNumber;
    29: BigNumber;
    30: BigNumber;
    31: BigNumber;
    32: BigNumber;
  }>;
  1: {
    marketReferenceCurrencyUnit: BigNumber;
    marketReferenceCurrencyPriceInUsd: BigNumber;
    networkBaseTokenPriceInUsd: BigNumber;
    networkBaseTokenPriceDecimals: number;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: number;
  };
}

export interface UserReserveData {
  underlyingAsset: string;
  scaledATokenBalance: BigNumber;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: BigNumber;
  scaledVariableDebt: BigNumber;
  principalStableDebt: BigNumber;
  stableBorrowLastUpdateTimestamp: BigNumber;
  0: string;
  1: BigNumber;
  2: boolean;
  3: BigNumber;
  4: BigNumber;
  5: BigNumber;
  6: BigNumber;
}

export interface PoolBaseCurrencyHumanized {
  marketReferenceCurrencyDecimals: number;
  marketReferenceCurrencyPriceInUsd: string;
  networkBaseTokenPriceInUsd: string;
  networkBaseTokenPriceDecimals: number;
}
export interface ReserveDataHumanized {
  id: string;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  reserveFactor: string;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: string;
  variableBorrowIndex: string;
  liquidityRate: string;
  variableBorrowRate: string;
  stableBorrowRate: string;
  lastUpdateTimestamp: number;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  availableLiquidity: string;
  totalPrincipalStableDebt: string;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  totalScaledVariableDebt: string;
  priceInMarketReferenceCurrency: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  stableRateSlope1: string;
  stableRateSlope2: string;
}

export interface ReservesDataHumanized {
  reservesData: ReserveDataHumanized[];
  baseCurrencyData: PoolBaseCurrencyHumanized;
}

export interface UserReserveDataHumanized {
  id: string;
  underlyingAsset: string;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: number;
}

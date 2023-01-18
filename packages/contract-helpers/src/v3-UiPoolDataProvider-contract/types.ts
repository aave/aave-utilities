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
    priceOracle: string;
    variableRateSlope1: BigNumber;
    variableRateSlope2: BigNumber;
    stableRateSlope1: BigNumber;
    stableRateSlope2: BigNumber;
    baseStableBorrowRate: BigNumber;
    baseVariableBorrowRate: BigNumber;
    optimalUsageRatio: BigNumber;
    isPaused: boolean;
    isSiloedBorrowing: boolean;
    accruedToTreasury: BigNumber;
    unbacked: BigNumber;
    isolationModeTotalDebt: BigNumber;
    debtCeiling: BigNumber;
    debtCeilingDecimals: BigNumber;
    eModeCategoryId: number;
    borrowCap: BigNumber;
    supplyCap: BigNumber;
    eModeLtv: number;
    eModeLiquidationThreshold: number;
    eModeLiquidationBonus: number;
    eModePriceSource: string;
    eModeLabel: string;
    borrowableInIsolation: boolean;
    flashLoanEnabled: boolean;
  }>;
  1: {
    marketReferenceCurrencyUnit: BigNumber;
    marketReferenceCurrencyPriceInUsd: BigNumber;
    networkBaseTokenPriceInUsd: BigNumber;
    networkBaseTokenPriceDecimals: number;
  };
}

export interface UserReserveData {
  0: Array<{
    underlyingAsset: string;
    scaledATokenBalance: BigNumber;
    usageAsCollateralEnabledOnUser: boolean;
    stableBorrowRate: BigNumber;
    scaledVariableDebt: BigNumber;
    principalStableDebt: BigNumber;
    stableBorrowLastUpdateTimestamp: BigNumber;
  }>;
  1: number;
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
  priceOracle: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  stableRateSlope1: string;
  stableRateSlope2: string;
  baseStableBorrowRate: string;
  baseVariableBorrowRate: string;
  optimalUsageRatio: string;
  // v3 only
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: string;
  unbacked: string;
  isolationModeTotalDebt: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  eModeCategoryId: number;
  borrowCap: string;
  supplyCap: string;
  eModeLtv: number;
  eModeLiquidationThreshold: number;
  eModeLiquidationBonus: number;
  eModePriceSource: string;
  eModeLabel: string;
  borrowableInIsolation: boolean;
  flashLoanEnabled: boolean;
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

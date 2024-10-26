import { BigNumber } from 'ethers';

export interface EModeCategoryHumanized {
  ltv: string;
  liquidationThreshold: string;
  liquidationBonus: string;
  collateralBitmap: string;
  label: string;
  borrowableBitmap: string;
}

export interface EModeCategory {
  ltv: number;
  liquidationThreshold: number;
  liquidationBonus: number;
  collateralBitmap: BigNumber;
  label: string;
  borrowableBitmap: BigNumber;
}

export interface EmodeDataHumanized {
  id: number;
  eMode: EModeCategoryHumanized;
}

export interface EModeData {
  id: number;
  eMode: EModeCategory;
}

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
    isActive: boolean;
    isFrozen: boolean;
    liquidityIndex: BigNumber;
    variableBorrowIndex: BigNumber;
    liquidityRate: BigNumber;
    variableBorrowRate: BigNumber;
    lastUpdateTimestamp: number;
    aTokenAddress: string;
    variableDebtTokenAddress: string;
    interestRateStrategyAddress: string;
    availableLiquidity: BigNumber;
    totalScaledVariableDebt: BigNumber;
    priceInMarketReferenceCurrency: BigNumber;
    priceOracle: string;
    variableRateSlope1: BigNumber;
    variableRateSlope2: BigNumber;
    baseVariableBorrowRate: BigNumber;
    optimalUsageRatio: BigNumber;
    isPaused: boolean;
    isSiloedBorrowing: boolean;
    accruedToTreasury: BigNumber;
    unbacked: BigNumber;
    isolationModeTotalDebt: BigNumber;
    flashLoanEnabled: boolean;
    debtCeiling: BigNumber;
    debtCeilingDecimals: BigNumber;
    borrowCap: BigNumber;
    supplyCap: BigNumber;
    borrowableInIsolation: boolean;
    virtualAccActive: boolean;
    virtualUnderlyingBalance: BigNumber;
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
    scaledVariableDebt: BigNumber;
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
  originalId: number;
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
  isActive: boolean;
  isFrozen: boolean;
  liquidityIndex: string;
  variableBorrowIndex: string;
  liquidityRate: string;
  variableBorrowRate: string;
  lastUpdateTimestamp: number;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  availableLiquidity: string;
  totalScaledVariableDebt: string;
  priceInMarketReferenceCurrency: string;
  priceOracle: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  baseVariableBorrowRate: string;
  optimalUsageRatio: string;
  // v3 only
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: string;
  unbacked: string;
  isolationModeTotalDebt: string;
  flashLoanEnabled: boolean;
  debtCeiling: string;
  debtCeilingDecimals: number;
  borrowCap: string;
  supplyCap: string;
  borrowableInIsolation: boolean;
  virtualAccActive: boolean;
  virtualUnderlyingBalance: string;
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
  scaledVariableDebt: string;
}

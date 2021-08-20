export interface ReserveData {
  decimals: number
  reserveFactor: string
  baseLTVasCollateral: string
  averageStableRate: string
  stableDebtLastUpdateTimestamp: number
  liquidityIndex: string
  reserveLiquidationThreshold: string
  reserveLiquidationBonus: string
  variableBorrowIndex: string
  variableBorrowRate: string
  availableLiquidity: string
  stableBorrowRate: string
  liquidityRate: string
  totalPrincipalStableDebt: string
  totalScaledVariableDebt: string
  lastUpdateTimestamp: number
  price: {
    priceInEth: string
  }
  aEmissionPerSecond: string
  vEmissionPerSecond: string
  sEmissionPerSecond: string
}

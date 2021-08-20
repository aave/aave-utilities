import { ReserveData } from './reserve-data'

export interface FormatReserveResponse extends ReserveData {
  utilizationRate: string
  totalStableDebt: string
  totalVariableDebt: string
  totalDebt: string
  totalLiquidity: string
  aIncentivesAPY: string
  vIncentivesAPY: string
  sIncentivesAPY: string
}

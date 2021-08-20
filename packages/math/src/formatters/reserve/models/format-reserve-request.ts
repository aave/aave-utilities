import { ReserveData } from './reserve-data'

export interface FormatReserveRequest {
  reserve: ReserveData
  currentTimestamp?: number
  rewardTokenPriceEth?: string
  emissionEndTimestamp?: number
}

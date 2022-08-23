import {
  ReserveCalculationData,
  ReservesIncentiveDataHumanized,
} from './types';
export declare type ReserveIncentiveDict = Record<string, ReserveIncentives>;
interface ReserveIncentives {
  aIncentives: ReserveIncentive[];
  vIncentives: ReserveIncentive[];
  sIncentives: ReserveIncentive[];
}
interface ReserveIncentive {
  incentiveAPR: string;
  rewardTokenAddress: string;
  rewardTokenSymbol: string;
}
export interface CalculateAllReserveIncentivesRequest {
  reserveIncentives: ReservesIncentiveDataHumanized[];
  reserves: ReserveCalculationData[];
  marketReferenceCurrencyDecimals: number;
}
export declare function calculateAllReserveIncentives({
  reserveIncentives,
  reserves,
  marketReferenceCurrencyDecimals,
}: CalculateAllReserveIncentivesRequest): ReserveIncentiveDict;
export {};
//# sourceMappingURL=calculate-all-reserve-incentives.d.ts.map

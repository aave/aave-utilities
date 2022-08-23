import BigNumber from 'bignumber.js';
export interface CalculateReserveDebtRequest {
  totalScaledVariableDebt: string;
  variableBorrowIndex: string;
  totalPrincipalStableDebt: string;
  availableLiquidity: string;
  variableBorrowRate: string;
  lastUpdateTimestamp: number;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
}
export interface CalculateReserveDebtResponse {
  totalVariableDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalDebt: BigNumber;
  totalLiquidity: BigNumber;
}
export declare function calculateReserveDebt(
  reserveDebt: CalculateReserveDebtRequest,
  currentTimestamp: number,
): CalculateReserveDebtResponse;
//# sourceMappingURL=calculate-reserve-debt.d.ts.map

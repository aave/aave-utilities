import BigNumber from 'bignumber.js';
import { BigNumberValue } from '../../bignumber';
export interface CalculateCompoundedInterestRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}
export declare function calculateCompoundedInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: CalculateCompoundedInterestRequest): BigNumber;
//# sourceMappingURL=calculate-compounded-interest.d.ts.map

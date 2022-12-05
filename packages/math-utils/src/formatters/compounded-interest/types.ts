import { BigNumberValue } from '../../bignumber';

export interface CalculateCompoundedRateRequest {
  rate: BigNumberValue;
  duration: BigNumberValue;
}

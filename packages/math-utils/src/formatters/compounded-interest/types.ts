import { BigNumberValue } from '../../bignumber';

export interface CalculateCompoundedInterestRateRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}

export interface CalculateCompoundedRateRequest {
  rate: BigNumberValue;
  duration: BigNumberValue;
}

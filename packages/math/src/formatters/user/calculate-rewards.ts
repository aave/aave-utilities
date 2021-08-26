import BigNumber from 'bignumber.js';

import { valueToBigNumber, normalizeBN } from '../../bignumber';

export interface CalculateRewardsRequest {
  principalUserBalance: BigNumber;
  reserveIndex: string;
  userIndex: string;
  precision: number;
  rewardTokenDecimals: number;
  reserveIndexTimestamp: number;
  emissionPerSecond: string;
  totalSupply: BigNumber;
  currentTimestamp: number;
}

export function calculateRewards(request: CalculateRewardsRequest): BigNumber {
  const timeDelta = request.currentTimestamp - request.reserveIndexTimestamp;

  const currentReserveIndex = valueToBigNumber(request.emissionPerSecond)
    .multipliedBy(timeDelta)
    .shiftedBy(request.precision)
    .dividedBy(request.totalSupply)
    .plus(request.reserveIndex);

  const reward = request.principalUserBalance
    .multipliedBy(currentReserveIndex.minus(request.userIndex))
    .shiftedBy(request.precision * -1);

  return normalizeBN(reward, request.rewardTokenDecimals);
}

import BigNumber from 'bignumber.js';

import { valueToZDBigNumber, normalize } from '../../bignumber';

export interface CalculateRewardRequest {
  principalUserBalance: string;
  reserveIndex: string;
  userIndex: string;
  precision: number;
  rewardTokenDecimals: number;
  reserveIndexTimestamp: number;
  emissionPerSecond: string;
  totalSupply: BigNumber;
  currentTimestamp: number;
  emissionEndTimestamp: number;
}

export function calculateReward(request: CalculateRewardRequest): string {
  const actualCurrentTimestamp =
    request.currentTimestamp > request.emissionEndTimestamp
      ? request.emissionEndTimestamp
      : request.currentTimestamp;

  const timeDelta = actualCurrentTimestamp - request.reserveIndexTimestamp;

  let currentReserveIndex;
  if (
    request.reserveIndexTimestamp === Number(request.currentTimestamp) ||
    request.reserveIndexTimestamp >= request.emissionEndTimestamp
  ) {
    currentReserveIndex = valueToZDBigNumber(request.reserveIndex);
  } else {
    currentReserveIndex = valueToZDBigNumber(request.emissionPerSecond)
      .multipliedBy(timeDelta)
      .shiftedBy(request.precision)
      .dividedBy(request.totalSupply)
      .plus(request.reserveIndex);
  }

  const reward = valueToZDBigNumber(request.principalUserBalance)
    .multipliedBy(currentReserveIndex.minus(request.userIndex))
    .shiftedBy(request.precision * -1);

  return normalize(reward, request.rewardTokenDecimals);
}

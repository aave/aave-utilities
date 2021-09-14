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

export function calculateReward({
  principalUserBalance,
  reserveIndex,
  userIndex,
  precision,
  rewardTokenDecimals,
  reserveIndexTimestamp,
  emissionPerSecond,
  totalSupply,
  currentTimestamp,
  emissionEndTimestamp,
}: CalculateRewardRequest): string {
  const actualCurrentTimestamp =
    currentTimestamp > emissionEndTimestamp
      ? emissionEndTimestamp
      : currentTimestamp;

  const timeDelta = actualCurrentTimestamp - reserveIndexTimestamp;

  let currentReserveIndex;
  if (
    reserveIndexTimestamp === Number(currentTimestamp) ||
    reserveIndexTimestamp >= emissionEndTimestamp
  ) {
    currentReserveIndex = valueToZDBigNumber(reserveIndex);
  } else {
    currentReserveIndex = valueToZDBigNumber(emissionPerSecond)
      .multipliedBy(timeDelta)
      .shiftedBy(precision)
      .dividedBy(totalSupply)
      .plus(reserveIndex);
  }

  const reward = valueToZDBigNumber(principalUserBalance)
    .multipliedBy(currentReserveIndex.minus(userIndex))
    .shiftedBy(precision * -1);

  return normalize(reward, rewardTokenDecimals);
}

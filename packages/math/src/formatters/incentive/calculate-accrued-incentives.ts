import BigNumber from 'bignumber.js';

import { valueToZDBigNumber, normalize } from '../../bignumber';

export interface CalculateAccruedIncentivesRequest {
  principalUserBalance: BigNumber;
  reserveIndex: BigNumber;
  userIndex: BigNumber;
  precision: number;
  rewardTokenDecimals: number;
  reserveIndexTimestamp: number;
  emissionPerSecond: BigNumber;
  totalSupply: BigNumber;
  currentTimestamp: number;
  emissionEndTimestamp: number;
}

// TO-DO: Convert this function to return BigNumber instead of string
export function calculateAccruedIncentives(
  request: CalculateAccruedIncentivesRequest,
): string {
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
    currentReserveIndex = request.reserveIndex;
  } else {
    currentReserveIndex = valueToZDBigNumber(request.emissionPerSecond)
      .multipliedBy(timeDelta)
      .shiftedBy(request.precision)
      .dividedBy(request.totalSupply)
      .plus(request.reserveIndex);
  }

  const incentives = valueToZDBigNumber(request.principalUserBalance)
    .multipliedBy(currentReserveIndex.minus(request.userIndex))
    .shiftedBy(request.precision * -1);

  return normalize(incentives, request.rewardTokenDecimals);
}

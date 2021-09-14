import BigNumber from 'bignumber.js';

import { valueToZDBigNumber } from '../../bignumber';

export interface CalculateAccruedIncentivesRequest {
  principalUserBalance: BigNumber;
  reserveIndex: BigNumber;
  userIndex: BigNumber;
  precision: number;
  reserveIndexTimestamp: number;
  emissionPerSecond: BigNumber;
  totalSupply: BigNumber;
  currentTimestamp: number;
  emissionEndTimestamp: number;
}

export function calculateAccruedIncentives(
  request: CalculateAccruedIncentivesRequest,
): BigNumber {
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

  return incentives;
}

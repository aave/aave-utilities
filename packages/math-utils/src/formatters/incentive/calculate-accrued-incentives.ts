import BigNumber from 'bignumber.js';

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

export function calculateAccruedIncentives({
  principalUserBalance,
  reserveIndex,
  userIndex,
  precision,
  reserveIndexTimestamp,
  emissionPerSecond,
  totalSupply,
  currentTimestamp,
  emissionEndTimestamp,
}: CalculateAccruedIncentivesRequest): BigNumber {
  if (totalSupply.isEqualTo(new BigNumber(0))) {
    return new BigNumber(0);
  }

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
    currentReserveIndex = reserveIndex;
  } else {
    currentReserveIndex = emissionPerSecond
      .multipliedBy(timeDelta)
      .shiftedBy(precision)
      .dividedBy(totalSupply)
      .plus(reserveIndex);
  }

  const reward = principalUserBalance
    .multipliedBy(currentReserveIndex.minus(userIndex))
    .shiftedBy(precision * -1);

  return reward;
}

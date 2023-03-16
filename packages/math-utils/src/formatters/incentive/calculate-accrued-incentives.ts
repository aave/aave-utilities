import BigNumber from 'bignumber.js';

export interface CalculateAccruedIncentivesRequest {
  principalUserBalance: BigNumber; // principal deposit or borrow amount
  reserveIndex: BigNumber; // tracks the interest earned by a reserve
  userIndex: BigNumber; // tracks the interest earned by a user from a particular reserve
  precision: number; // decimal precision of rewards calculation
  reserveIndexTimestamp: number; // timestamp of last protocol interaction
  emissionPerSecond: BigNumber;
  totalSupply: BigNumber; // total deposits or borrows of a reserve
  currentTimestamp: number;
  emissionEndTimestamp: number;
}

// Calculate incentives earned by user since reserveIndexTimestamp
// Incentives earned before reserveIndexTimestamp are tracked separately (userUnclaimedRewards from UiIncentiveDataProvider)
// This function is used for deposit, variableDebt, and stableDebt incentives
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
    reserveIndexTimestamp >= Number(currentTimestamp) ||
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

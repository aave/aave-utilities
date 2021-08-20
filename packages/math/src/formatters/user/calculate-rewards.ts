import BigNumber from 'bignumber.js'

import { valueToBigNumber, normalizeBN } from '../../bignumber'

export function calculateRewards(
  principalUserBalance: BigNumber,
  reserveIndex: string,
  userIndex: string,
  precision: number,
  rewardTokenDecimals: number,
  reserveIndexTimestamp: number,
  emissionPerSecond: string,
  totalSupply: BigNumber,
  currentTimestamp: number,
): BigNumber {
  const timeDelta = currentTimestamp - reserveIndexTimestamp

  const currentReserveIndex = valueToBigNumber(emissionPerSecond)
    .multipliedBy(timeDelta)
    .shiftedBy(precision)
    .dividedBy(totalSupply)
    .plus(reserveIndex)

  const reward = principalUserBalance
    .multipliedBy(currentReserveIndex.minus(userIndex))
    .shiftedBy(precision * -1)

  return normalizeBN(reward, rewardTokenDecimals)
}

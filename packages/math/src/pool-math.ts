import BigNumber from 'bignumber.js'

import {
  BigNumberValue,
  valueToBigNumber,
  valueToZDBigNumber,
} from './bignumber'
import * as RayMath from './ray.math'
import { SECONDS_PER_YEAR, LTV_PRECISION, USD_DECIMALS } from './constants'

export function calculateCompoundedInterest(
  rate: BigNumberValue,
  currentTimestamp: number,
  lastUpdateTimestamp: number,
): BigNumber {
  const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp)
  const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR)
  return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta)
}

export function getCompoundedBalance(
  _principalBalance: BigNumberValue,
  _reserveIndex: BigNumberValue,
  _reserveRate: BigNumberValue,
  _lastUpdateTimestamp: number,
  currentTimestamp: number,
): BigNumber {
  const principalBalance = valueToZDBigNumber(_principalBalance)
  if (principalBalance.eq('0')) {
    return principalBalance
  }

  const compoundedInterest = calculateCompoundedInterest(
    _reserveRate,
    currentTimestamp,
    _lastUpdateTimestamp,
  )
  const cumulatedInterest = RayMath.rayMul(compoundedInterest, _reserveIndex)
  const principalBalanceRay = RayMath.wadToRay(principalBalance)

  return RayMath.rayToWad(
    RayMath.rayMul(principalBalanceRay, cumulatedInterest),
  )
}

export const calculateLinearInterest = (
  rate: BigNumberValue,
  currentTimestamp: number,
  lastUpdateTimestamp: number,
) => {
  const timeDelta = RayMath.wadToRay(
    valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp),
  )
  const timeDeltaInSeconds = RayMath.rayDiv(
    timeDelta,
    RayMath.wadToRay(SECONDS_PER_YEAR),
  )
  return RayMath.rayMul(rate, timeDeltaInSeconds).plus(RayMath.RAY)
}

export function getReserveNormalizedIncome(
  rate: BigNumberValue,
  index: BigNumberValue,
  lastUpdateTimestamp: number,
  currentTimestamp: number,
): BigNumber {
  if (valueToZDBigNumber(rate).eq('0')) {
    return valueToZDBigNumber(index)
  }

  const cumulatedInterest = calculateLinearInterest(
    rate,
    currentTimestamp,
    lastUpdateTimestamp,
  )

  return RayMath.rayMul(cumulatedInterest, index)
}

export function getLinearBalance(
  balance: BigNumberValue,
  index: BigNumberValue,
  rate: BigNumberValue,
  lastUpdateTimestamp: number,
  currentTimestamp: number,
) {
  return RayMath.rayToWad(
    RayMath.rayMul(
      RayMath.wadToRay(balance),
      getReserveNormalizedIncome(
        rate,
        index,
        lastUpdateTimestamp,
        currentTimestamp,
      ),
    ),
  )
}

export function getCompoundedStableBalance(
  _principalBalance: BigNumberValue,
  _userStableRate: BigNumberValue,
  _lastUpdateTimestamp: number,
  currentTimestamp: number,
): BigNumber {
  const principalBalance = valueToZDBigNumber(_principalBalance)
  if (principalBalance.eq('0')) {
    return principalBalance
  }

  const cumulatedInterest = calculateCompoundedInterest(
    _userStableRate,
    currentTimestamp,
    _lastUpdateTimestamp,
  )
  const principalBalanceRay = RayMath.wadToRay(principalBalance)

  return RayMath.rayToWad(
    RayMath.rayMul(principalBalanceRay, cumulatedInterest),
  )
}

export function calculateHealthFactorFromBalances(
  collateralBalanceETH: BigNumberValue,
  borrowBalanceETH: BigNumberValue,
  currentLiquidationThreshold: BigNumberValue,
): BigNumber {
  if (valueToBigNumber(borrowBalanceETH).eq(0)) {
    return valueToBigNumber('-1') // Invalid number
  }

  return valueToBigNumber(collateralBalanceETH)
    .multipliedBy(currentLiquidationThreshold)
    .shiftedBy(LTV_PRECISION * -1)
    .div(borrowBalanceETH)
}

export function calculateHealthFactorFromBalancesBigUnits(
  collateralBalanceETH: BigNumberValue,
  borrowBalanceETH: BigNumberValue,
  currentLiquidationThreshold: BigNumberValue,
): BigNumber {
  return calculateHealthFactorFromBalances(
    collateralBalanceETH,
    borrowBalanceETH,
    new BigNumber(currentLiquidationThreshold)
      .shiftedBy(LTV_PRECISION)
      .decimalPlaces(0, BigNumber.ROUND_DOWN),
  )
}

export function calculateAvailableBorrowsETH(
  collateralBalanceETH: BigNumberValue,
  borrowBalanceETH: BigNumberValue,
  currentLtv: BigNumberValue,
): BigNumber {
  if (valueToZDBigNumber(currentLtv).eq(0)) {
    return valueToZDBigNumber('0')
  }

  const availableBorrowsETH = valueToZDBigNumber(collateralBalanceETH)
    .multipliedBy(currentLtv)
    .shiftedBy(LTV_PRECISION * -1)
    .minus(borrowBalanceETH)
  return availableBorrowsETH.gt('0')
    ? availableBorrowsETH
    : valueToZDBigNumber('0')
}

export function getEthAndUsdBalance(
  balance: BigNumberValue,
  priceInEth: BigNumberValue,
  decimals: number,
  usdPriceEth: BigNumberValue,
): [BigNumber, BigNumber] {
  const balanceInEth = valueToZDBigNumber(balance)
    .multipliedBy(priceInEth)
    .shiftedBy(decimals * -1)
  const balanceInUsd = balanceInEth
    .shiftedBy(USD_DECIMALS)
    .dividedBy(usdPriceEth)
  return [balanceInEth, balanceInUsd]
}

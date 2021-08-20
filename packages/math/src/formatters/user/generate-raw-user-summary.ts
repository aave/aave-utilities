import BigNumber from 'bignumber.js'

import {
  BigNumberValue,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber'
import {
  calculateAvailableBorrowsETH,
  calculateHealthFactorFromBalances,
} from '../../pool-math'
import { USD_DECIMALS } from '../../constants'
// Import { ReserveData } from '../reserve'
import { ReserveData, UserReserveData, RewardsInformation } from '.'
import {
  generateRawUserReserve,
  RawUserReserveResponse,
} from './generate-raw-user-reserve'

export interface RawUserSummaryRequest {
  poolReservesData: ReserveData[]
  rawUserReserves: UserReserveData[]
  userId: string
  usdPriceEth: BigNumberValue
  currentTimestamp: number
  rewardsInfo: RewardsInformation
}

export interface RawUserSummaryResponse {
  id: string
  totalLiquidityUSD: BigNumber
  totalCollateralUSD: BigNumber
  totalBorrowsUSD: BigNumber
  totalRewards: BigNumber
  totalRewardsETH: BigNumber
  totalRewardsUSD: BigNumber
  totalLiquidityETH: BigNumber
  totalCollateralETH: BigNumber
  totalBorrowsETH: BigNumber
  availableBorrowsETH: BigNumber
  currentLoanToValue: BigNumber
  currentLiquidationThreshold: BigNumber
  healthFactor: BigNumber
  reservesData: RawUserReserveResponse[]
}

export function generateRawUserSummary(
  request: RawUserSummaryRequest,
): RawUserSummaryResponse {
  let totalLiquidityETH = valueToZDBigNumber('0')
  let totalCollateralETH = valueToZDBigNumber('0')
  let totalBorrowsETH = valueToZDBigNumber('0')
  let currentLtv = valueToBigNumber('0')
  let currentLiquidationThreshold = valueToBigNumber('0')

  let totalRewards = valueToBigNumber('0')
  let totalRewardsETH = valueToBigNumber('0')
  let totalRewardsUSD = valueToBigNumber('0')

  const userReservesData: RawUserReserveResponse[] = request.rawUserReserves
    .map(userReserve => {
      const poolReserve = request.poolReservesData.find(
        reserve => reserve.id === userReserve.reserve.id,
      )
      if (!poolReserve) {
        throw new Error(
          'Reserve is not registered on platform, please contact support',
        )
      }

      const computedUserReserve = generateRawUserReserve({
        poolReserve: poolReserve,
        userReserve: userReserve,
        usdPriceEth: request.usdPriceEth,
        currentTimestamp: request.currentTimestamp,
        rewardsInfo: request.rewardsInfo,
      })

      totalRewards = totalRewards.plus(computedUserReserve.totalRewards)
      totalRewardsETH = totalRewardsETH.plus(
        computedUserReserve.totalRewardsETH,
      )
      totalRewardsUSD = totalRewardsUSD.plus(
        computedUserReserve.totalRewardsUSD,
      )

      totalLiquidityETH = totalLiquidityETH.plus(
        computedUserReserve.underlyingBalanceETH,
      )
      totalBorrowsETH = totalBorrowsETH
        .plus(computedUserReserve.variableBorrowsETH)
        .plus(computedUserReserve.stableBorrowsETH)

      if (
        poolReserve.usageAsCollateralEnabled &&
        userReserve.usageAsCollateralEnabledOnUser
      ) {
        totalCollateralETH = totalCollateralETH.plus(
          computedUserReserve.underlyingBalanceETH,
        )
        currentLtv = currentLtv.plus(
          valueToBigNumber(
            computedUserReserve.underlyingBalanceETH,
          ).multipliedBy(poolReserve.baseLTVasCollateral),
        )
        currentLiquidationThreshold = currentLiquidationThreshold.plus(
          valueToBigNumber(
            computedUserReserve.underlyingBalanceETH,
          ).multipliedBy(poolReserve.reserveLiquidationThreshold),
        )
      }

      return computedUserReserve
    })
    .sort((a, b) =>
      a.userReserve.reserve.symbol > b.userReserve.reserve.symbol
        ? 1
        : a.userReserve.reserve.symbol < b.userReserve.reserve.symbol
        ? -1
        : 0,
    )

  if (currentLtv.gt(0)) {
    currentLtv = currentLtv
      .div(totalCollateralETH)
      .decimalPlaces(0, BigNumber.ROUND_DOWN)
  }

  if (currentLiquidationThreshold.gt(0)) {
    currentLiquidationThreshold = currentLiquidationThreshold
      .div(totalCollateralETH)
      .decimalPlaces(0, BigNumber.ROUND_DOWN)
  }

  const healthFactor = calculateHealthFactorFromBalances(
    totalCollateralETH,
    totalBorrowsETH,
    currentLiquidationThreshold,
  )

  const totalCollateralUSD = totalCollateralETH
    .shiftedBy(USD_DECIMALS)
    .dividedBy(request.usdPriceEth)

  const totalLiquidityUSD = totalLiquidityETH
    .shiftedBy(USD_DECIMALS)
    .dividedBy(request.usdPriceEth)

  const totalBorrowsUSD = totalBorrowsETH
    .shiftedBy(USD_DECIMALS)
    .dividedBy(request.usdPriceEth)

  const availableBorrowsETH = calculateAvailableBorrowsETH(
    totalCollateralETH,
    totalBorrowsETH,
    currentLtv,
  )

  return {
    totalLiquidityUSD,
    totalCollateralUSD,
    totalBorrowsUSD,
    totalRewards,
    totalRewardsETH,
    totalRewardsUSD,
    id: request.userId,
    totalLiquidityETH,
    totalCollateralETH,
    totalBorrowsETH,
    availableBorrowsETH,
    currentLoanToValue: currentLtv,
    currentLiquidationThreshold,
    healthFactor,
    reservesData: userReservesData,
  }
}

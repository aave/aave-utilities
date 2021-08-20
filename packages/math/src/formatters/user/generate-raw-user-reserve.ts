import BigNumber from 'bignumber.js'

import { BigNumberValue, valueToZDBigNumber } from '../../bignumber'
// Import { ReserveData } from '../reserve'
import { UserReserveData, ReserveData, RewardsInformation } from '.'
import {
  getLinearBalance,
  getEthAndUsdBalance,
  getCompoundedBalance,
  getCompoundedStableBalance,
} from '../../pool-math'
import { calculateRewards } from './calculate-rewards'
import { calculateSupplies } from './calculate-supplies'

export interface RawUserReserveRequest {
  poolReserve: ReserveData
  userReserve: UserReserveData
  usdPriceEth: BigNumberValue
  currentTimestamp: number
  rewardsInfo: RewardsInformation
}

export interface RawUserReserveResponse {
  userReserve: UserReserveData
  underlyingBalance: BigNumber
  underlyingBalanceETH: BigNumber
  underlyingBalanceUSD: BigNumber
  variableBorrows: BigNumber
  variableBorrowsETH: BigNumber
  variableBorrowsUSD: BigNumber
  stableBorrows: BigNumber
  stableBorrowsETH: BigNumber
  stableBorrowsUSD: BigNumber
  totalBorrows: BigNumber
  totalBorrowsETH: BigNumber
  totalBorrowsUSD: BigNumber
  depositRewards: BigNumber
  depositRewardsETH: BigNumber
  depositRewardsUSD: BigNumber
  variableDebtRewards: BigNumber
  variableDebtRewardsETH: BigNumber
  variableDebtRewardsUSD: BigNumber
  stableDebtRewards: BigNumber
  stableDebtRewardsETH: BigNumber
  stableDebtRewardsUSD: BigNumber
  totalRewards: BigNumber
  totalRewardsETH: BigNumber
  totalRewardsUSD: BigNumber
}

export function generateRawUserReserve(
  request: RawUserReserveRequest,
): RawUserReserveResponse {
  const {
    price: { priceInEth },
    decimals,
  } = request.poolReserve
  const underlyingBalance = getLinearBalance(
    request.userReserve.scaledATokenBalance,
    request.poolReserve.liquidityIndex,
    request.poolReserve.liquidityRate,
    request.poolReserve.lastUpdateTimestamp,
    request.currentTimestamp,
  )
  const [underlyingBalanceETH, underlyingBalanceUSD] = getEthAndUsdBalance(
    underlyingBalance,
    priceInEth,
    decimals,
    request.usdPriceEth,
  )

  const variableBorrows = getCompoundedBalance(
    request.userReserve.scaledVariableDebt,
    request.poolReserve.variableBorrowIndex,
    request.poolReserve.variableBorrowRate,
    request.poolReserve.lastUpdateTimestamp,
    request.currentTimestamp,
  )

  const [variableBorrowsETH, variableBorrowsUSD] = getEthAndUsdBalance(
    variableBorrows,
    priceInEth,
    decimals,
    request.usdPriceEth,
  )

  const stableBorrows = getCompoundedStableBalance(
    request.userReserve.principalStableDebt,
    request.userReserve.stableBorrowRate,
    request.userReserve.stableBorrowLastUpdateTimestamp,
    request.currentTimestamp,
  )

  const [stableBorrowsETH, stableBorrowsUSD] = getEthAndUsdBalance(
    stableBorrows,
    priceInEth,
    decimals,
    request.usdPriceEth,
  )
  const {
    totalLiquidity,
    totalStableDebt,
    totalVariableDebt,
  } = calculateSupplies(
    {
      totalScaledVariableDebt: request.poolReserve.totalScaledVariableDebt,
      variableBorrowIndex: request.poolReserve.variableBorrowIndex,
      variableBorrowRate: request.poolReserve.variableBorrowRate,
      totalPrincipalStableDebt: request.poolReserve.totalPrincipalStableDebt,
      averageStableRate: request.poolReserve.averageStableRate,
      availableLiquidity: request.poolReserve.availableLiquidity,
      stableDebtLastUpdateTimestamp:
        request.poolReserve.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: request.poolReserve.lastUpdateTimestamp,
    },
    request.currentTimestamp,
  )

  const depositRewards = totalLiquidity.gt(0)
    ? calculateRewards(
        underlyingBalance,
        request.poolReserve.depositIncentivesIndex,
        request.userReserve.depositIncentivesUserIndex,
        request.rewardsInfo.incentivePrecision,
        request.rewardsInfo.rewardTokenDecimals,
        request.poolReserve.depositIncentivesLastUpdateTimestamp,
        request.poolReserve.depositIncentivesEmissionPerSecond,
        totalLiquidity,
        request.currentTimestamp,
      )
    : valueToZDBigNumber('0')

  const [depositRewardsETH, depositRewardsUSD] = getEthAndUsdBalance(
    depositRewards,
    request.rewardsInfo.rewardTokenPriceEth,
    request.rewardsInfo.rewardTokenDecimals,
    request.usdPriceEth,
  )

  const variableDebtRewards = totalVariableDebt.gt(0)
    ? calculateRewards(
        variableBorrows,
        request.poolReserve.variableDebtIncentivesIndex,
        request.userReserve.variableDebtIncentivesUserIndex,
        request.rewardsInfo.incentivePrecision,
        request.rewardsInfo.rewardTokenDecimals,
        request.poolReserve.variableDebtIncentivesLastUpdateTimestamp,
        request.poolReserve.variableDebtIncentivesEmissionPerSecond,
        totalVariableDebt,
        request.currentTimestamp,
      )
    : valueToZDBigNumber('0')

  const [variableDebtRewardsETH, variableDebtRewardsUSD] = getEthAndUsdBalance(
    variableDebtRewards,
    request.rewardsInfo.rewardTokenPriceEth,
    request.rewardsInfo.rewardTokenDecimals,
    request.usdPriceEth,
  )
  const stableDebtRewards = totalStableDebt.gt(0)
    ? calculateRewards(
        stableBorrows,
        request.poolReserve.stableDebtIncentivesIndex,
        request.userReserve.stableDebtIncentivesUserIndex,
        request.rewardsInfo.incentivePrecision,
        request.rewardsInfo.rewardTokenDecimals,
        request.poolReserve.stableDebtIncentivesLastUpdateTimestamp,
        request.poolReserve.stableDebtIncentivesEmissionPerSecond,
        totalStableDebt,
        request.currentTimestamp,
      )
    : valueToZDBigNumber('0')

  const [stableDebtRewardsETH, stableDebtRewardsUSD] = getEthAndUsdBalance(
    stableDebtRewards,
    request.rewardsInfo.rewardTokenPriceEth,
    request.rewardsInfo.rewardTokenDecimals,
    request.usdPriceEth,
  )

  return {
    userReserve: request.userReserve,
    underlyingBalance,
    underlyingBalanceETH,
    underlyingBalanceUSD,
    variableBorrows,
    variableBorrowsETH,
    variableBorrowsUSD,
    stableBorrows,
    stableBorrowsETH,
    stableBorrowsUSD,
    totalBorrows: variableBorrows.plus(stableBorrows),
    totalBorrowsETH: variableBorrowsETH.plus(stableBorrowsETH),
    totalBorrowsUSD: variableBorrowsUSD.plus(stableBorrowsUSD),
    depositRewards,
    depositRewardsETH,
    depositRewardsUSD,
    variableDebtRewards,
    variableDebtRewardsETH,
    variableDebtRewardsUSD,
    stableDebtRewards,
    stableDebtRewardsETH,
    stableDebtRewardsUSD,
    totalRewards: depositRewards
      .plus(variableDebtRewards)
      .plus(stableDebtRewards),
    totalRewardsETH: depositRewardsETH
      .plus(variableDebtRewardsETH)
      .plus(stableDebtRewardsETH),
    totalRewardsUSD: depositRewardsUSD
      .plus(variableDebtRewardsUSD)
      .plus(stableDebtRewardsUSD),
  }
}

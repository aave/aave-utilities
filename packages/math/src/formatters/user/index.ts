import { BigNumberValue, normalize } from '../../bignumber'
import { ETH_DECIMALS, USD_DECIMALS } from '../../constants'
// Import { ReserveData } from '../reserve'
import { generateRawUserSummary } from './generate-raw-user-summary'
import { formatUserReserve } from './format-user-reserve'

// Temporary, will replace with import from ../reserve when interface is updated
export interface ReserveData {
  decimals: number
  reserveFactor: string
  baseLTVasCollateral: string
  averageStableRate: string
  stableDebtLastUpdateTimestamp: number
  liquidityIndex: string
  reserveLiquidationThreshold: string
  reserveLiquidationBonus: string
  variableBorrowIndex: string
  variableBorrowRate: string
  availableLiquidity: string
  stableBorrowRate: string
  liquidityRate: string
  totalPrincipalStableDebt: string
  totalScaledVariableDebt: string
  lastUpdateTimestamp: number
  price: {
    priceInEth: string
  }
  depositIncentivesEmissionPerSecond: string
  variableDebtIncentivesEmissionPerSecond: string
  stableDebtIncentivesEmissionPerSecond: string
  id: string
  symbol: string
  name: string
  depositIncentivesIndex: string
  variableDebtIncentivesIndex: string
  stableDebtIncentivesIndex: string
  depositIncentivesLastUpdateTimestamp: number
  variableDebtIncentivesLastUpdateTimestamp: number
  stableDebtIncentivesLastUpdateTimestamp: number
  usageAsCollateralEnabled: boolean
}

export interface UserReserveData {
  id: string
  scaledATokenBalance: string
  usageAsCollateralEnabledOnUser: boolean
  scaledVariableDebt: string
  variableBorrowIndex: string
  stableBorrowRate: string
  principalStableDebt: string
  stableBorrowLastUpdateTimestamp: number
  reserve: ReserveData
  depositIncentivesUserIndex: string
  variableDebtIncentivesUserIndex: string
  stableDebtIncentivesUserIndex: string
}

export interface RewardsInformation {
  rewardTokenAddress: string
  rewardTokenDecimals: number
  incentivePrecision: number
  rewardTokenPriceEth: string
}

export interface ComputedUserReserve extends UserReserveData {
  underlyingBalance: string
  underlyingBalanceETH: string
  underlyingBalanceUSD: string
  variableBorrows: string
  variableBorrowsETH: string
  variableBorrowsUSD: string
  stableBorrows: string
  stableBorrowsETH: string
  stableBorrowsUSD: string
  totalBorrows: string
  totalBorrowsETH: string
  totalBorrowsUSD: string
  depositRewards: string
  depositRewardsETH: string
  depositRewardsUSD: string
  variableDebtRewards: string
  variableDebtRewardsETH: string
  variableDebtRewardsUSD: string
  stableDebtRewards: string
  stableDebtRewardsETH: string
  stableDebtRewardsUSD: string
  totalRewards: string
  totalRewardsETH: string
  totalRewardsUSD: string
}

export interface FormatUserSummaryDataRequest {
  poolReservesData: ReserveData[]
  rawUserReserves: UserReserveData[]
  userId: string
  usdPriceEth: BigNumberValue
  currentTimestamp: number
  rewardsInfo: RewardsInformation
}

export interface FormatUserSummaryDataResponse {
  id: string
  userReservesData: ComputedUserReserve[]
  totalLiquidityETH: string
  totalLiquidityUSD: string
  totalCollateralETH: string
  totalCollateralUSD: string
  totalBorrowsETH: string
  totalBorrowsUSD: string
  availableBorrowsETH: string
  currentLoanToValue: string
  currentLiquidationThreshold: string
  healthFactor: string
  totalRewards: string
  totalRewardsETH: string
  totalRewardsUSD: string
}

export function formatUserSummary(
  request: FormatUserSummaryDataRequest,
): FormatUserSummaryDataResponse {
  const userData = generateRawUserSummary({
    poolReservesData: request.poolReservesData,
    rawUserReserves: request.rawUserReserves,
    userId: request.userId,
    usdPriceEth: request.usdPriceEth,
    currentTimestamp: request.currentTimestamp,
    rewardsInfo: request.rewardsInfo,
  })

  const userReservesData = userData.reservesData.map(rawUserReserve => {
    const formattedReserve = formatUserReserve({ rawUserReserve })
    return formattedReserve
  })

  return {
    id: userData.id,
    userReservesData,
    totalLiquidityETH: normalize(userData.totalLiquidityETH, ETH_DECIMALS),
    totalLiquidityUSD: normalize(userData.totalLiquidityUSD, USD_DECIMALS),
    totalCollateralETH: normalize(userData.totalCollateralETH, ETH_DECIMALS),
    totalCollateralUSD: normalize(userData.totalCollateralUSD, USD_DECIMALS),
    totalBorrowsETH: normalize(userData.totalBorrowsETH, ETH_DECIMALS),
    totalBorrowsUSD: normalize(userData.totalBorrowsUSD, USD_DECIMALS),
    availableBorrowsETH: normalize(userData.availableBorrowsETH, ETH_DECIMALS),
    currentLoanToValue: normalize(userData.currentLoanToValue, 4),
    currentLiquidationThreshold: normalize(
      userData.currentLiquidationThreshold,
      4,
    ),
    healthFactor: userData.healthFactor.toString(),
    totalRewards: userData.totalRewards.toString(),
    totalRewardsETH: userData.totalRewardsETH.toString(),
    totalRewardsUSD: userData.totalRewardsUSD.toString(),
  }
}

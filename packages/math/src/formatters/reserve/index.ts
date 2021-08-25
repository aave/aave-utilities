import BigNumber from 'bignumber.js';
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import { ETH_DECIMALS, RAY_DECIMALS } from '../../constants';
import { LTV_PRECISION } from '../../index';
import { calculateReserveDebt } from './calculate-reserve-debt';
import { calculateReserveIncentiveAPYs } from './calculate-reserve-incentive-apys';

export interface FormatReserveResponse {
  reserveFactor: string;
  baseLTVasCollateral: string;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  price: {
    priceInEth: string;
  };
  utilizationRate: string;
  totalStableDebt: string;
  totalVariableDebt: string;
  totalDebt: string;
  totalLiquidity: string;
  depositIncentivesAPY: string;
  variableDebtIncentivesAPY: string;
  stableDebtIncentivesAPY: string;
}

export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp?: number;
  rewardTokenPriceEth?: string;
  emissionEndTimestamp?: number;
}

export interface ReserveData {
  decimals: number;
  reserveFactor: string;
  baseLTVasCollateral: string;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  lastUpdateTimestamp: number;
  price: {
    priceInEth: string;
  };
  depositIncentivesEmissionPerSecond: string;
  variableDebtIncentivesEmissionPerSecond: string;
  stableDebtIncentivesEmissionPerSecond: string;
}

export function formatReserve(
  request: FormatReserveRequest,
): FormatReserveResponse {
  const calculateReserveDebtResult = calculateReserveDebt(
    request.reserve,
    request.currentTimestamp,
  );

  const totalLiquidity = calculateTotalLiquidity(
    calculateReserveDebtResult.totalDebt,
    request.reserve.availableLiquidity,
  );

  const incentivesAPYs = calculateReserveIncentiveAPYs({
    emissionEndTimestamp: request.emissionEndTimestamp,
    currentTimestamp: request.currentTimestamp,
    depositIncentivesEmissionPerSecond:
      request.reserve.depositIncentivesEmissionPerSecond,
    stableDebtIncentivesEmissionPerSecond:
      request.reserve.stableDebtIncentivesEmissionPerSecond,
    variableDebtIncentivesEmissionPerSecond:
      request.reserve.variableDebtIncentivesEmissionPerSecond,
    totalLiquidity,
    rewardTokenPriceEth: request.rewardTokenPriceEth,
    priceInEth: request.reserve.price.priceInEth,
    totalVariableDebt: calculateReserveDebtResult.totalVariableDebt,
    totalStableDebt: calculateReserveDebtResult.totalStableDebt,
    decimals: request.reserve.decimals,
  });

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, request.reserve.decimals);

  return {
    totalVariableDebt: normalizeWithReserve(
      calculateReserveDebtResult.totalVariableDebt,
    ),
    totalStableDebt: normalizeWithReserve(
      calculateReserveDebtResult.totalStableDebt,
    ),
    totalLiquidity: normalizeWithReserve(totalLiquidity),
    availableLiquidity: normalizeWithReserve(
      request.reserve.availableLiquidity,
    ),
    utilizationRate: totalLiquidity.eq(0)
      ? '0'
      : // Have to make sure you do the math with the decimal else you will not
        // get the outcome you want.
        valueToBigNumber(
          normalizeWithReserve(calculateReserveDebtResult.totalDebt),
        )
          .dividedBy(normalizeWithReserve(totalLiquidity))
          .toString(),
    depositIncentivesAPY: incentivesAPYs.depositIncentives.toFixed(),
    variableDebtIncentivesAPY: incentivesAPYs.variableDebtIncentives.toFixed(),
    stableDebtIncentivesAPY: incentivesAPYs.stableDebtIncentives.toFixed(),
    totalDebt: normalizeWithReserve(calculateReserveDebtResult.totalDebt),
    price: {
      priceInEth: normalize(request.reserve.price.priceInEth, ETH_DECIMALS),
    },
    baseLTVasCollateral: normalize(
      request.reserve.baseLTVasCollateral,
      LTV_PRECISION,
    ),
    reserveFactor: normalize(request.reserve.reserveFactor, LTV_PRECISION),
    variableBorrowRate: normalize(
      request.reserve.variableBorrowRate,
      RAY_DECIMALS,
    ),
    stableBorrowRate: normalize(request.reserve.stableBorrowRate, RAY_DECIMALS),
    liquidityRate: normalize(request.reserve.liquidityRate, RAY_DECIMALS),
    liquidityIndex: normalize(request.reserve.liquidityIndex, RAY_DECIMALS),
    reserveLiquidationThreshold: normalize(
      request.reserve.reserveLiquidationThreshold,
      4,
    ),
    // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
    reserveLiquidationBonus: normalize(
      valueToBigNumber(request.reserve.reserveLiquidationBonus).minus(
        10 ** LTV_PRECISION,
      ),
      LTV_PRECISION,
    ),
    totalScaledVariableDebt: normalizeWithReserve(
      request.reserve.totalScaledVariableDebt,
    ),
    totalPrincipalStableDebt: normalizeWithReserve(
      request.reserve.totalPrincipalStableDebt,
    ),
    variableBorrowIndex: normalize(
      request.reserve.variableBorrowIndex,
      RAY_DECIMALS,
    ),
  };
}

function calculateTotalLiquidity(
  totalDebt: BigNumber,
  availableLiquidity: string,
): BigNumber {
  return totalDebt.plus(availableLiquidity);
}

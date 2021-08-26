import BigNumber from 'bignumber.js';
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import { RAY_DECIMALS } from '../../constants';
import { LTV_PRECISION } from '../../index';
import { calculateReserveDebt } from './calculate-reserve-debt';

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
  utilizationRate: string;
  totalStableDebt: string;
  totalVariableDebt: string;
  totalDebt: string;
  totalLiquidity: string;
}

export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp?: number;
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
      : valueToBigNumber(calculateReserveDebtResult.totalDebt)
          .dividedBy(totalLiquidity)
          .toFixed(),
    totalDebt: normalizeWithReserve(calculateReserveDebtResult.totalDebt),
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

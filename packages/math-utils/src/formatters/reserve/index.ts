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
  currentTimestamp: number;
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

export function formatReserve({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): FormatReserveResponse {
  const {
    totalDebt,
    totalStableDebt,
    totalVariableDebt,
  } = calculateReserveDebt(reserve, currentTimestamp);

  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);

  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, reserve.decimals);

  return {
    totalVariableDebt: normalizeWithReserve(totalVariableDebt),
    totalStableDebt: normalizeWithReserve(totalStableDebt),
    totalLiquidity: normalizeWithReserve(totalLiquidity),
    availableLiquidity: normalizeWithReserve(reserve.availableLiquidity),
    utilizationRate: totalLiquidity.eq(0)
      ? '0'
      : valueToBigNumber(totalDebt)
          .dividedBy(totalLiquidity)
          .toFixed(),
    totalDebt: normalizeWithReserve(totalDebt),
    baseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION),
    reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
    variableBorrowRate: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    stableBorrowRate: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
    liquidityRate: normalize(reserve.liquidityRate, RAY_DECIMALS),
    liquidityIndex: normalize(reserve.liquidityIndex, RAY_DECIMALS),
    reserveLiquidationThreshold: normalize(
      reserve.reserveLiquidationThreshold,
      4,
    ),
    // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
    reserveLiquidationBonus: normalize(
      valueToBigNumber(reserve.reserveLiquidationBonus).minus(
        10 ** LTV_PRECISION,
      ),
      LTV_PRECISION,
    ),
    totalScaledVariableDebt: normalizeWithReserve(
      reserve.totalScaledVariableDebt,
    ),
    totalPrincipalStableDebt: normalizeWithReserve(
      reserve.totalPrincipalStableDebt,
    ),
    variableBorrowIndex: normalize(reserve.variableBorrowIndex, RAY_DECIMALS),
  };
}

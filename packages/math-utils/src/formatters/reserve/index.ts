import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  normalize,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR } from '../../constants';
import { LTV_PRECISION, RAY, rayPow } from '../../index';
import { nativeToUSD } from '../usd/native-to-usd';
import { calculateReserveDebt } from './calculate-reserve-debt';

export interface FormatReserveResponse {
  reserveFactor: string;
  baseLTVasCollateral: string;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  availableLiquidity: string;
  supplyAPY: string;
  supplyAPR: string;
  variableBorrowAPY: string;
  variableBorrowAPR: string;
  stableBorrowAPY: string;
  stableBorrowAPR: string;
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

interface GetComputedReserveFieldsResponse {
  totalDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalLiquidity: BigNumber;
  utilizationRate: string;
  reserveLiquidationBonus: string;
  supplyAPY: BigNumber;
  variableBorrowAPY: BigNumber;
  stableBorrowAPY: BigNumber;
}

/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): GetComputedReserveFieldsResponse {
  const { totalDebt, totalStableDebt, totalVariableDebt } =
    calculateReserveDebt(reserve, currentTimestamp);
  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
  const utilizationRate = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt).dividedBy(totalLiquidity).toFixed();
  // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
  const reserveLiquidationBonus = normalize(
    valueToBigNumber(reserve.reserveLiquidationBonus).minus(
      10 ** LTV_PRECISION,
    ),
    LTV_PRECISION,
  );

  const supplyAPY = rayPow(
    valueToZDBigNumber(reserve.liquidityRate)
      .dividedBy(SECONDS_PER_YEAR)
      .plus(RAY),
    SECONDS_PER_YEAR,
  ).minus(RAY);

  const variableBorrowAPY = rayPow(
    valueToZDBigNumber(reserve.variableBorrowRate)
      .dividedBy(SECONDS_PER_YEAR)
      .plus(RAY),
    SECONDS_PER_YEAR,
  ).minus(RAY);

  const stableBorrowAPY = rayPow(
    valueToZDBigNumber(reserve.stableBorrowRate)
      .dividedBy(SECONDS_PER_YEAR)
      .plus(RAY),
    SECONDS_PER_YEAR,
  ).minus(RAY);

  return {
    totalDebt,
    totalStableDebt,
    totalVariableDebt,
    totalLiquidity,
    utilizationRate,
    reserveLiquidationBonus,
    supplyAPY,
    variableBorrowAPY,
    stableBorrowAPY,
  };
}

interface FormatEnhancedReserveRequest {
  reserve: ReserveData & GetComputedReserveFieldsResponse;
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({
  reserve,
}: FormatEnhancedReserveRequest): FormatReserveResponse {
  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, reserve.decimals);

  return {
    totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt),
    totalStableDebt: normalizeWithReserve(reserve.totalStableDebt),
    totalLiquidity: normalizeWithReserve(reserve.totalLiquidity),
    availableLiquidity: normalizeWithReserve(reserve.availableLiquidity),
    utilizationRate: reserve.utilizationRate,
    totalDebt: normalizeWithReserve(reserve.totalDebt),
    baseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION),
    reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
    supplyAPY: normalize(reserve.supplyAPY, RAY_DECIMALS),
    supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS),
    variableBorrowAPY: normalize(reserve.variableBorrowAPY, RAY_DECIMALS),
    variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    stableBorrowAPY: normalize(reserve.stableBorrowAPY, RAY_DECIMALS),
    stableBorrowAPR: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
    liquidityIndex: normalize(reserve.liquidityIndex, RAY_DECIMALS),
    reserveLiquidationThreshold: normalize(
      reserve.reserveLiquidationThreshold,
      4,
    ),
    reserveLiquidationBonus: reserve.reserveLiquidationBonus,
    totalScaledVariableDebt: normalizeWithReserve(
      reserve.totalScaledVariableDebt,
    ),
    totalPrincipalStableDebt: normalizeWithReserve(
      reserve.totalPrincipalStableDebt,
    ),
    variableBorrowIndex: normalize(reserve.variableBorrowIndex, RAY_DECIMALS),
  };
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
export function formatReserve({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): FormatReserveResponse {
  const computedFields = getComputedReserveFields({
    reserve,
    currentTimestamp,
  });
  return formatEnhancedReserve({ reserve: { ...reserve, ...computedFields } });
}

export type ReserveDataWithPrice = ReserveData & {
  priceInMarketReferenceCurrency: string;
};

export interface FormatReserveUSDRequest {
  reserve: ReserveDataWithPrice;
  currentTimestamp: number;
  marketRefPriceInUsd: string;
  marketRefCurrencyDecimals: number;
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export function formatReserveUSD({
  reserve,
  currentTimestamp,
  marketRefPriceInUsd,
  marketRefCurrencyDecimals,
}: FormatReserveUSDRequest) {
  const computedFields = getComputedReserveFields({
    reserve,
    currentTimestamp,
  });
  const formattedReserve = formatEnhancedReserve({
    reserve: { ...reserve, ...computedFields },
  });

  return {
    ...formattedReserve,
    totalLiquidityUSD: nativeToUSD({
      amount: computedFields.totalLiquidity,
      currencyDecimals: reserve.decimals,
      marketRefCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      marketRefPriceInUsd,
    }),
    totalDebtUSD: nativeToUSD({
      amount: computedFields.totalDebt,
      currencyDecimals: reserve.decimals,
      marketRefCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      marketRefPriceInUsd,
    }),
    totalVariableDebtUSD: nativeToUSD({
      amount: computedFields.totalVariableDebt,
      currencyDecimals: reserve.decimals,
      marketRefCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      marketRefPriceInUsd,
    }),
    totalStableDebtUSD: nativeToUSD({
      amount: computedFields.totalStableDebt,
      currencyDecimals: reserve.decimals,
      marketRefCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      marketRefPriceInUsd,
    }),
  };
}

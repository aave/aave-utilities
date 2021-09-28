import BigNumber from 'bignumber.js';
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import { RAY_DECIMALS } from '../../constants';
import { LTV_PRECISION } from '../../index';
import { nativeToUSD } from '../usd/native-to-usd';
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

interface GetComputedReserveFieldsResponse {
  totalDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalLiquidity: BigNumber;
  utilizationRate: string;
  reserveLiquidationBonus: string;
}

/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): GetComputedReserveFieldsResponse {
  const {
    totalDebt,
    totalStableDebt,
    totalVariableDebt,
  } = calculateReserveDebt(reserve, currentTimestamp);
  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
  const utilizationRate = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt)
        .dividedBy(totalLiquidity)
        .toFixed();
  // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
  const reserveLiquidationBonus = normalize(
    valueToBigNumber(reserve.reserveLiquidationBonus).minus(
      10 ** LTV_PRECISION,
    ),
    LTV_PRECISION,
  );

  return {
    totalDebt,
    totalStableDebt,
    totalVariableDebt,
    totalLiquidity,
    utilizationRate,
    reserveLiquidationBonus,
  };
}

interface FormatEnhancedReserveRequest {
  reserve: ReserveData & GetComputedReserveFieldsResponse;
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({ reserve }: FormatEnhancedReserveRequest) {
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
    variableBorrowRate: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    stableBorrowRate: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
    liquidityRate: normalize(reserve.liquidityRate, RAY_DECIMALS),
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
  usdPriceMarketReferenceCurrency: string;
  marketReferenceCurrencyDecimals: number;
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export function formatReserveUSD({
  reserve,
  currentTimestamp,
  usdPriceMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
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
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    }),
    totalDebtUSD: nativeToUSD({
      amount: computedFields.totalDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    }),
    totalVariableDebtUSD: nativeToUSD({
      amount: computedFields.totalVariableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    }),
    totalStableDebtUSD: nativeToUSD({
      amount: computedFields.totalStableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      usdPriceMarketReferenceCurrency,
    }),
  };
}

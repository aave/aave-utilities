import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  normalize,
  normalizeBN,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR, USD_DECIMALS } from '../../constants';
import { LTV_PRECISION, RAY, rayPow } from '../../index';
import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from '../incentive/calculate-reserve-incentives';
import { ReservesIncentiveDataHumanized } from '../incentive/types';
import { nativeToUSD } from '../usd/native-to-usd';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateReserveDebt } from './calculate-reserve-debt';

export interface FormatReserveResponse {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  underlyingAsset: string;
  liquidityIndex: string;
  liquidityRate: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  lastUpdateTimestamp: number;
  debtCeiling: string;
  usageAsCollateralEnabled: boolean;
  eModeCategoryId: number;
  isolationModeTotalDebt: string;
  debtCeilingDecimals: number;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  reserveFactor: string;
  baseLTVasCollateral: string;
  eModeLtv: string;
  reserveLiquidationThreshold: string;
  eModeLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  eModeLiquidationBonus: string;
  /** @description the liquidity that is available. In case of borrow capped reserves that might be less then unborrowedLiquidity. */
  availableLiquidity: string;
  /** @description the liquidity that is not borrowed out */
  unborrowedLiquidity: string;
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
  debtCeilingUSD: string;
  availableDebtCeilingUSD: string;
  isolationModeTotalDebtUSD: string;
  isIsolated: boolean;
}

export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp: number;
}

export interface ReserveData {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  underlyingAsset: string;
  usageAsCollateralEnabled: boolean;
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
  // v3
  eModeCategoryId: number;
  borrowCap: string;
  supplyCap: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  isolationModeTotalDebt: string;
  eModeLtv: number;
  eModeLiquidationThreshold: number;
  eModeLiquidationBonus: number;
}

interface GetComputedReserveFieldsResponse {
  totalDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalLiquidity: BigNumber;
  utilizationRate: string;
  reserveLiquidationBonus: string;
  eModeLtv: string;
  eModeLiquidationThreshold: string;
  eModeLiquidationBonus: string;
  supplyAPY: BigNumber;
  variableBorrowAPY: BigNumber;
  stableBorrowAPY: BigNumber;
  availableLiquidity: BigNumber;
  unborrowedLiquidity: string;
}

/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): GetComputedReserveFieldsResponse {
  const { totalDebt, totalStableDebt, totalVariableDebt, totalLiquidity } =
    calculateReserveDebt(reserve, currentTimestamp);
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
  const eModeLiquidationBonus = normalize(
    valueToBigNumber(reserve.eModeLiquidationBonus).minus(10 ** LTV_PRECISION),
    LTV_PRECISION,
  );

  /**
   * availableLiquidity returned by the helper is the amount of unborrowed tokens
   * the actual availableLiquidity might be lower due to borrowCap
   */
  const availableLiquidity =
    reserve.borrowCap === '0'
      ? new BigNumber(reserve.availableLiquidity)
      : BigNumber.min(
          reserve.availableLiquidity,
          new BigNumber(reserve.borrowCap).shiftedBy(reserve.decimals).minus(
            // plus 1 as the cap is exclusive
            totalDebt.plus(1),
          ),
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
    eModeLiquidationBonus,
    eModeLiquidationThreshold: reserve.eModeLiquidationThreshold.toString(),
    eModeLtv: reserve.eModeLtv.toString(),
    supplyAPY,
    variableBorrowAPY,
    stableBorrowAPY,
    availableLiquidity,
    unborrowedLiquidity: reserve.availableLiquidity,
  };
}

interface FormatEnhancedReserveRequest {
  reserve: Omit<
    ReserveData,
    | 'availableLiquidity'
    | 'eModeLtv'
    | 'eModeLiquidationThreshold'
    | 'eModeLiquidationBonus'
  > &
    GetComputedReserveFieldsResponse;
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({
  reserve,
}: FormatEnhancedReserveRequest): FormatReserveResponse {
  const normalizeWithReserve = (n: BigNumberValue) =>
    normalize(n, reserve.decimals);

  const isIsolated = reserve.debtCeiling !== '0';
  const availableDebtCeilingUSD = isIsolated
    ? normalize(
        valueToBigNumber(reserve.debtCeiling).minus(
          reserve.isolationModeTotalDebt,
        ),
        reserve.debtCeilingDecimals,
      )
    : '0';

  return {
    ...reserve,
    totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt),
    totalStableDebt: normalizeWithReserve(reserve.totalStableDebt),
    totalLiquidity: normalizeWithReserve(reserve.totalLiquidity),
    availableLiquidity: normalizeWithReserve(reserve.availableLiquidity),
    unborrowedLiquidity: normalizeWithReserve(reserve.unborrowedLiquidity),
    utilizationRate: reserve.utilizationRate,
    totalDebt: normalizeWithReserve(reserve.totalDebt),
    baseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION),
    eModeLtv: normalize(reserve.eModeLtv, LTV_PRECISION),
    reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
    supplyAPY: normalize(reserve.supplyAPY, RAY_DECIMALS),
    supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS),
    variableBorrowAPY: normalize(reserve.variableBorrowAPY, RAY_DECIMALS),
    variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    stableBorrowAPY: normalize(reserve.stableBorrowAPY, RAY_DECIMALS),
    stableBorrowAPR: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
    reserveLiquidationThreshold: normalize(
      reserve.reserveLiquidationThreshold,
      4,
    ),
    eModeLiquidationThreshold: normalize(reserve.eModeLiquidationThreshold, 4),
    reserveLiquidationBonus: reserve.reserveLiquidationBonus,
    eModeLiquidationBonus: reserve.eModeLiquidationBonus,
    totalScaledVariableDebt: normalizeWithReserve(
      reserve.totalScaledVariableDebt,
    ),
    totalPrincipalStableDebt: normalizeWithReserve(
      reserve.totalPrincipalStableDebt,
    ),
    debtCeilingUSD: isIsolated
      ? normalize(reserve.debtCeiling, reserve.debtCeilingDecimals)
      : '0',
    isolationModeTotalDebtUSD: isIsolated
      ? normalize(reserve.isolationModeTotalDebt, reserve.debtCeilingDecimals)
      : '0',
    availableDebtCeilingUSD,
    isIsolated,
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
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}

export interface FormatReserveUSDResponse extends FormatReserveResponse {
  totalLiquidityUSD: string;
  availableLiquidityUSD: string;
  totalDebtUSD: string;
  totalVariableDebtUSD: string;
  totalStableDebtUSD: string;
  borrowCapUSD: string;
  supplyCapUSD: string;
  priceInMarketReferenceCurrency: string;
  // priceInUSD: string;
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export function formatReserveUSD({
  reserve,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReserveUSDRequest): FormatReserveUSDResponse {
  const normalizedMarketReferencePriceInUsd = normalizeBN(
    marketReferencePriceInUsd,
    USD_DECIMALS,
  );

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
      normalizedMarketReferencePriceInUsd,
    }),
    availableLiquidityUSD: nativeToUSD({
      amount: computedFields.availableLiquidity,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      normalizedMarketReferencePriceInUsd,
    }),
    totalDebtUSD: nativeToUSD({
      amount: computedFields.totalDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      normalizedMarketReferencePriceInUsd,
    }),
    totalVariableDebtUSD: nativeToUSD({
      amount: computedFields.totalVariableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      normalizedMarketReferencePriceInUsd,
    }),
    totalStableDebtUSD: nativeToUSD({
      amount: computedFields.totalStableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      normalizedMarketReferencePriceInUsd,
    }),
    // isolationModeTotalDebtUSD: nativeToUSD({
    //   amount: computedFields.totalStableDebt,
    //   currencyDecimals: reserve.decimals,
    //   marketReferenceCurrencyDecimals,
    //   priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
    //   marketReferencePriceInUsd,
    // }),
    priceInMarketReferenceCurrency: normalize(
      reserve.priceInMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    // priceInUSD: nativeToUSD({
    //   amount: new BigNumber(1).shiftedBy(reserve.decimals),
    //   currencyDecimals: reserve.decimals,
    //   marketReferenceCurrencyDecimals,
    //   priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
    //   marketReferencePriceInUsd,
    // }),
    // v3
    // caps are already in absolutes
    borrowCapUSD: normalizedToUsd(
      new BigNumber(reserve.borrowCap),
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    ).toString(),
    supplyCapUSD: normalizedToUsd(
      new BigNumber(reserve.supplyCap),
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    ).toString(),
    // debtCeilingUSD: normalizedToUsd(
    //   new BigNumber(reserve.debtCeiling),
    //   marketReferencePriceInUsd,
    //   marketReferenceCurrencyDecimals,
    // ).toString(),
  };
}

export interface FormatReservesUSDRequest<T extends ReserveDataWithPrice> {
  reserves: T[];
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}

export function formatReserves<T extends ReserveDataWithPrice>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReservesUSDRequest<T>) {
  return reserves.map(reserve => {
    const formattedReserve = formatReserveUSD({
      reserve,
      currentTimestamp,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    });
    return { ...reserve, ...formattedReserve };
  });
}

export interface FormatReservesAndIncentivesUSDRequest<
  T extends ReserveDataWithPrice,
> extends FormatReservesUSDRequest<T & { underlyingAsset: string }> {
  reserveIncentives: ReservesIncentiveDataHumanized[];
}

export function formatReservesAndIncentives<T extends ReserveDataWithPrice>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  reserveIncentives,
}: FormatReservesAndIncentivesUSDRequest<T>): Array<
  FormatReserveUSDResponse & T & Partial<CalculateReserveIncentivesResponse>
> {
  const formattedReserves = formatReserves<T & { underlyingAsset: string }>({
    reserves,
    currentTimestamp,
    marketReferenceCurrencyDecimals,
    marketReferencePriceInUsd,
  });
  return formattedReserves.map(reserve => {
    const reserveIncentive = reserveIncentives.find(
      reserveIncentive =>
        reserveIncentive.underlyingAsset === reserve.underlyingAsset,
    );
    if (!reserveIncentive) return reserve;
    const incentive = calculateReserveIncentives({
      reserves,
      reserveIncentiveData: reserveIncentive,
      totalLiquidity: normalize(reserve.totalLiquidity, -reserve.decimals),
      totalVariableDebt: normalize(
        reserve.totalVariableDebt,
        -reserve.decimals,
      ),
      totalStableDebt: normalize(reserve.totalStableDebt, -reserve.decimals),
      priceInMarketReferenceCurrency: normalize(
        reserve.priceInMarketReferenceCurrency,
        -marketReferenceCurrencyDecimals,
      ),
      decimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
    });
    return { ...reserve, ...incentive };
  });
}

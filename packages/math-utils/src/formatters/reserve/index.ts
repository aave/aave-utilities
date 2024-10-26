import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  normalize,
  normalizeBN,
  valueToBigNumber,
} from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR, USD_DECIMALS } from '../../constants';
import { LTV_PRECISION } from '../../index';
import { calculateCompoundedRate } from '../compounded-interest/calculate-compounded-interest';
import {
  EModeData,
  FormattedReserveEMode,
  getAndFormatReserveEModes,
} from '../emode';
import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from '../incentive/calculate-reserve-incentives';
import { ReservesIncentiveDataHumanized } from '../incentive/types';
import { nativeToUSD } from '../usd/native-to-usd';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateReserveDebt } from './calculate-reserve-debt';

export interface FormatReserveResponse extends ReserveData {
  formattedBaseLTVasCollateral: string;
  formattedReserveLiquidationThreshold: string;
  formattedReserveLiquidationBonus: string;
  formattedAvailableLiquidity: string;
  totalDebt: string;
  totalVariableDebt: string;
  totalLiquidity: string;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  supplyAPY: string;
  variableBorrowAPY: string;
  unborrowedLiquidity: string;
  supplyAPR: string;
  variableBorrowAPR: string;
  isIsolated: boolean;
  isolationModeTotalDebtUSD: string;
  availableDebtCeilingUSD: string;
  debtCeilingUSD: string;
  eModes: FormattedReserveEMode[];
}

export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp: number;
  eModes?: EModeData[];
}

export interface ReserveData {
  originalId: number;
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  underlyingAsset: string;
  usageAsCollateralEnabled: boolean;
  reserveFactor: string;
  baseLTVasCollateral: string;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  liquidityRate: string;
  totalScaledVariableDebt: string;
  lastUpdateTimestamp: number;
  // v3
  borrowCap: string;
  supplyCap: string;
  debtCeiling: string;
  debtCeilingDecimals: number;
  isolationModeTotalDebt: string;
  unbacked: string;
  virtualAccActive: boolean;
  virtualUnderlyingBalance: string;
}

interface GetComputedReserveFieldsResponse {
  formattedReserveLiquidationBonus: string;
  formattedAvailableLiquidity: BigNumber;
  totalDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalLiquidity: BigNumber;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  supplyAPY: BigNumber;
  variableBorrowAPY: BigNumber;
  unborrowedLiquidity: string;
}

/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): GetComputedReserveFieldsResponse {
  const { totalDebt, totalVariableDebt, totalLiquidity } = calculateReserveDebt(
    reserve,
    currentTimestamp,
  );
  const borrowUsageRatio = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt).dividedBy(totalLiquidity).toFixed();
  const supplyUsageRatio = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt)
        .dividedBy(totalLiquidity.plus(reserve.unbacked))
        .toFixed();
  // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
  const reserveLiquidationBonus = normalize(
    valueToBigNumber(reserve.reserveLiquidationBonus).minus(
      10 ** LTV_PRECISION,
    ),
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

  const supplyAPY = calculateCompoundedRate({
    rate: reserve.liquidityRate,
    duration: SECONDS_PER_YEAR,
  });

  const variableBorrowAPY = calculateCompoundedRate({
    rate: reserve.variableBorrowRate,
    duration: SECONDS_PER_YEAR,
  });

  return {
    totalDebt,
    totalVariableDebt,
    totalLiquidity,
    borrowUsageRatio,
    supplyUsageRatio,
    formattedReserveLiquidationBonus: reserveLiquidationBonus,
    supplyAPY,
    variableBorrowAPY,
    formattedAvailableLiquidity: availableLiquidity,
    unborrowedLiquidity: reserve.availableLiquidity,
  };
}

interface FormatEnhancedReserveRequest {
  reserve: ReserveData & GetComputedReserveFieldsResponse;
  eModes?: EModeData[];
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({
  reserve,
  eModes,
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

  const formattedEModes = eModes
    ? getAndFormatReserveEModes(reserve.originalId, eModes)
    : [];

  return {
    ...reserve,
    totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt),
    totalLiquidity: normalizeWithReserve(reserve.totalLiquidity),
    formattedAvailableLiquidity: normalizeWithReserve(
      reserve.availableLiquidity,
    ),
    unborrowedLiquidity: normalizeWithReserve(reserve.unborrowedLiquidity),
    borrowUsageRatio: reserve.borrowUsageRatio,
    supplyUsageRatio: reserve.supplyUsageRatio,
    totalDebt: normalizeWithReserve(reserve.totalDebt),
    formattedBaseLTVasCollateral: normalize(
      reserve.baseLTVasCollateral,
      LTV_PRECISION,
    ),
    reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
    supplyAPY: normalize(reserve.supplyAPY, RAY_DECIMALS),
    supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS),
    variableBorrowAPY: normalize(reserve.variableBorrowAPY, RAY_DECIMALS),
    variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    formattedReserveLiquidationThreshold: normalize(
      reserve.reserveLiquidationThreshold,
      4,
    ),
    formattedReserveLiquidationBonus: normalize(
      valueToBigNumber(reserve.reserveLiquidationBonus).minus(
        10 ** LTV_PRECISION,
      ),
      4,
    ),
    totalScaledVariableDebt: normalizeWithReserve(
      reserve.totalScaledVariableDebt,
    ),
    debtCeilingUSD: isIsolated
      ? normalize(reserve.debtCeiling, reserve.debtCeilingDecimals)
      : '0',
    isolationModeTotalDebtUSD: isIsolated
      ? normalize(reserve.isolationModeTotalDebt, reserve.debtCeilingDecimals)
      : '0',
    availableDebtCeilingUSD,
    isIsolated,
    eModes: formattedEModes,
  };
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
export function formatReserve({
  reserve,
  currentTimestamp,
  eModes,
}: FormatReserveRequest): FormatReserveResponse {
  const computedFields = getComputedReserveFields({
    reserve,
    currentTimestamp,
  });
  return formatEnhancedReserve({
    reserve: { ...reserve, ...computedFields },
    eModes,
  });
}

export type ReserveDataWithPrice = ReserveData & {
  priceInMarketReferenceCurrency: string;
};

export interface FormatReserveUSDRequest {
  reserve: ReserveDataWithPrice;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
  eModes?: EModeData[];
}

export interface FormatReserveUSDResponse extends FormatReserveResponse {
  totalLiquidityUSD: string;
  availableLiquidityUSD: string;
  totalDebtUSD: string;
  totalVariableDebtUSD: string;
  borrowCapUSD: string;
  supplyCapUSD: string;
  unbackedUSD: string;
  priceInMarketReferenceCurrency: string;
  formattedPriceInMarketReferenceCurrency: string;
  priceInUSD: string;
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
  eModes,
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
    eModes,
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
      amount: computedFields.formattedAvailableLiquidity,
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
    formattedPriceInMarketReferenceCurrency: normalize(
      reserve.priceInMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ),
    priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
    priceInUSD: nativeToUSD({
      amount: new BigNumber(1).shiftedBy(reserve.decimals),
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      normalizedMarketReferencePriceInUsd,
    }),
    // v3
    // caps are already in absolutes
    borrowCapUSD: normalizedToUsd(
      new BigNumber(reserve.borrowCap),
      reserve.priceInMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ).toString(),
    supplyCapUSD: normalizedToUsd(
      new BigNumber(reserve.supplyCap),
      reserve.priceInMarketReferenceCurrency,
      marketReferenceCurrencyDecimals,
    ).toString(),
    unbackedUSD: normalizedToUsd(
      new BigNumber(reserve.unbacked),
      reserve.priceInMarketReferenceCurrency,
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
  eModes?: EModeData[];
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}

export function formatReserves<T extends ReserveDataWithPrice>({
  reserves,
  eModes,
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
      eModes,
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
  eModes,
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
    eModes,
  });

  return formattedReserves.map(reserve => {
    const reserveIncentive = reserveIncentives.find(
      reserveIncentive =>
        reserveIncentive.underlyingAsset === reserve.underlyingAsset,
    );
    if (!reserveIncentive) return reserve;
    const incentive = calculateReserveIncentives({
      reserves: formattedReserves,
      reserveIncentiveData: reserveIncentive,
      totalLiquidity: normalize(reserve.totalLiquidity, -reserve.decimals),
      totalVariableDebt: normalize(
        reserve.totalVariableDebt,
        -reserve.decimals,
      ),
      priceInMarketReferenceCurrency:
        reserve.formattedPriceInMarketReferenceCurrency,
      decimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
    });
    return { ...reserve, ...incentive };
  });
}

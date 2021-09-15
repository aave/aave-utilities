import BigNumber from 'bignumber.js';
import { BigNumberValue, normalize, valueToBigNumber } from '../../bignumber';
import { RAY_DECIMALS } from '../../constants';
import { LTV_PRECISION } from '../../index';
import { getMarketReferenceCurrencyAndUsdBalance } from '../../pool-math';
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
  totalStableDebtBn: BigNumber;
  totalVariableDebt: string;
  totalVariableDebtBn: BigNumber;
  totalDebt: string;
  totalDebtBn: BigNumber;
  totalLiquidity: string;
  totalLiquidityBn: BigNumber;
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
    totalVariableDebtBn: totalVariableDebt,
    totalStableDebt: normalizeWithReserve(totalStableDebt),
    totalStableDebtBn: totalStableDebt,
    totalLiquidity: normalizeWithReserve(totalLiquidity),
    totalLiquidityBn: totalLiquidity,
    availableLiquidity: normalizeWithReserve(reserve.availableLiquidity),
    utilizationRate: totalLiquidity.eq(0)
      ? '0'
      : valueToBigNumber(totalDebt)
          .dividedBy(totalLiquidity)
          .toFixed(),
    totalDebt: normalizeWithReserve(totalDebt),
    totalDebtBn: totalDebt,
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

export interface FormattedReserveDataWithPriceInformation
  extends FormatReserveResponse {
  decimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
}
export interface GetUSDValueForFormattedReserveRequest {
  reserve: FormattedReserveDataWithPriceInformation;
  usdPriceMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
}

/**
 * @returns USD values for totalDebt & totalLiquidity
 */
export function getUSDValueForFormattedReserve({
  reserve,
  usdPriceMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
}: GetUSDValueForFormattedReserveRequest) {
  const {
    marketReferenceCurrencyBalance: totalDebtMarketReferenceCurrency,
    usdBalance: totalDebtUSD,
  } = getMarketReferenceCurrencyAndUsdBalance({
    balance: reserve.totalDebtBn,
    decimals: reserve.decimals,
    priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
    usdPriceMarketReferenceCurrency,
    marketReferenceCurrencyDecimals,
  });
  const {
    marketReferenceCurrencyBalance: totalLiquidityMarketReferenceCurrency,
    usdBalance: totalLiquidityUSD,
  } = getMarketReferenceCurrencyAndUsdBalance({
    balance: reserve.totalLiquidityBn,
    decimals: reserve.decimals,
    priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
    usdPriceMarketReferenceCurrency,
    marketReferenceCurrencyDecimals,
  });

  return {
    totalDebtMarketReferenceCurrency,
    totalDebtUSD,
    totalLiquidityMarketReferenceCurrency,
    totalLiquidityUSD,
  };
}

export interface ReserveDataWithPriceInformation extends ReserveData {
  decimals: number;
  priceInMarketReferenceCurrency: BigNumberValue;
}
export interface FormatReserveWithUSDRequest {
  reserve: ReserveDataWithPriceInformation;
  usdPriceMarketReferenceCurrency: BigNumberValue;
  marketReferenceCurrencyDecimals: number;
  currentTimestamp: number;
}

export function formatReserveWithUSD({
  reserve,
  usdPriceMarketReferenceCurrency,
  marketReferenceCurrencyDecimals,
  currentTimestamp,
}: FormatReserveWithUSDRequest) {
  const formattedReserve = formatReserve({ reserve, currentTimestamp });
  const usdPrices = getUSDValueForFormattedReserve({
    reserve: {
      ...formattedReserve,
      priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
      decimals: reserve.decimals,
    },
    usdPriceMarketReferenceCurrency,
    marketReferenceCurrencyDecimals,
  });
  return { ...formattedReserve, ...usdPrices };
}

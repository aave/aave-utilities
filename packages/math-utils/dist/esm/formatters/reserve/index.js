import BigNumber from 'bignumber.js';
import { normalize, normalizeBN, valueToBigNumber, valueToZDBigNumber, } from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR, USD_DECIMALS } from '../../constants';
import { LTV_PRECISION, RAY, rayPow } from '../../index';
import { calculateReserveIncentives, } from '../incentive/calculate-reserve-incentives';
import { nativeToUSD } from '../usd/native-to-usd';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateReserveDebt } from './calculate-reserve-debt';
/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({ reserve, currentTimestamp, }) {
    const { totalDebt, totalStableDebt, totalVariableDebt, totalLiquidity } = calculateReserveDebt(reserve, currentTimestamp);
    const borrowUsageRatio = totalLiquidity.eq(0)
        ? '0'
        : valueToBigNumber(totalDebt).dividedBy(totalLiquidity).toFixed();
    const supplyUsageRatio = totalLiquidity.eq(0)
        ? '0'
        : valueToBigNumber(totalDebt)
            .dividedBy(totalLiquidity.plus(reserve.unbacked))
            .toFixed();
    // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
    const reserveLiquidationBonus = normalize(valueToBigNumber(reserve.reserveLiquidationBonus).minus(10 ** LTV_PRECISION), LTV_PRECISION);
    const eModeLiquidationBonus = normalize(valueToBigNumber(reserve.eModeLiquidationBonus).minus(10 ** LTV_PRECISION), LTV_PRECISION);
    /**
     * availableLiquidity returned by the helper is the amount of unborrowed tokens
     * the actual availableLiquidity might be lower due to borrowCap
     */
    const availableLiquidity = reserve.borrowCap === '0'
        ? new BigNumber(reserve.availableLiquidity)
        : BigNumber.min(reserve.availableLiquidity, new BigNumber(reserve.borrowCap).shiftedBy(reserve.decimals).minus(
        // plus 1 as the cap is exclusive
        totalDebt.plus(1)));
    const supplyAPY = rayPow(valueToZDBigNumber(reserve.liquidityRate)
        .dividedBy(SECONDS_PER_YEAR)
        .plus(RAY), SECONDS_PER_YEAR).minus(RAY);
    const variableBorrowAPY = rayPow(valueToZDBigNumber(reserve.variableBorrowRate)
        .dividedBy(SECONDS_PER_YEAR)
        .plus(RAY), SECONDS_PER_YEAR).minus(RAY);
    const stableBorrowAPY = rayPow(valueToZDBigNumber(reserve.stableBorrowRate)
        .dividedBy(SECONDS_PER_YEAR)
        .plus(RAY), SECONDS_PER_YEAR).minus(RAY);
    return {
        totalDebt,
        totalStableDebt,
        totalVariableDebt,
        totalLiquidity,
        borrowUsageRatio,
        supplyUsageRatio,
        formattedReserveLiquidationBonus: reserveLiquidationBonus,
        formattedEModeLiquidationBonus: eModeLiquidationBonus,
        formattedEModeLiquidationThreshold: reserve.eModeLiquidationThreshold.toString(),
        formattedEModeLtv: reserve.eModeLtv.toString(),
        supplyAPY,
        variableBorrowAPY,
        stableBorrowAPY,
        formattedAvailableLiquidity: availableLiquidity,
        unborrowedLiquidity: reserve.availableLiquidity,
    };
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({ reserve, }) {
    const normalizeWithReserve = (n) => normalize(n, reserve.decimals);
    const isIsolated = reserve.debtCeiling !== '0';
    const availableDebtCeilingUSD = isIsolated
        ? normalize(valueToBigNumber(reserve.debtCeiling).minus(reserve.isolationModeTotalDebt), reserve.debtCeilingDecimals)
        : '0';
    return Object.assign(Object.assign({}, reserve), { totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt), totalStableDebt: normalizeWithReserve(reserve.totalStableDebt), totalLiquidity: normalizeWithReserve(reserve.totalLiquidity), formattedAvailableLiquidity: normalizeWithReserve(reserve.availableLiquidity), unborrowedLiquidity: normalizeWithReserve(reserve.unborrowedLiquidity), borrowUsageRatio: reserve.borrowUsageRatio, supplyUsageRatio: reserve.supplyUsageRatio, totalDebt: normalizeWithReserve(reserve.totalDebt), formattedBaseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION), formattedEModeLtv: normalize(reserve.eModeLtv, LTV_PRECISION), reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION), supplyAPY: normalize(reserve.supplyAPY, RAY_DECIMALS), supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS), variableBorrowAPY: normalize(reserve.variableBorrowAPY, RAY_DECIMALS), variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS), stableBorrowAPY: normalize(reserve.stableBorrowAPY, RAY_DECIMALS), stableBorrowAPR: normalize(reserve.stableBorrowRate, RAY_DECIMALS), formattedReserveLiquidationThreshold: normalize(reserve.reserveLiquidationThreshold, 4), formattedEModeLiquidationThreshold: normalize(reserve.eModeLiquidationThreshold, 4), formattedReserveLiquidationBonus: normalize(valueToBigNumber(reserve.reserveLiquidationBonus).minus(10 ** LTV_PRECISION), 4), formattedEModeLiquidationBonus: normalize(valueToBigNumber(reserve.eModeLiquidationBonus).minus(10 ** LTV_PRECISION), 4), totalScaledVariableDebt: normalizeWithReserve(reserve.totalScaledVariableDebt), totalPrincipalStableDebt: normalizeWithReserve(reserve.totalPrincipalStableDebt), debtCeilingUSD: isIsolated
            ? normalize(reserve.debtCeiling, reserve.debtCeilingDecimals)
            : '0', isolationModeTotalDebtUSD: isIsolated
            ? normalize(reserve.isolationModeTotalDebt, reserve.debtCeilingDecimals)
            : '0', availableDebtCeilingUSD,
        isIsolated });
}
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
export function formatReserve({ reserve, currentTimestamp, }) {
    const computedFields = getComputedReserveFields({
        reserve,
        currentTimestamp,
    });
    return formatEnhancedReserve({ reserve: Object.assign(Object.assign({}, reserve), computedFields) });
}
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export function formatReserveUSD({ reserve, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, }) {
    const normalizedMarketReferencePriceInUsd = normalizeBN(marketReferencePriceInUsd, USD_DECIMALS);
    const computedFields = getComputedReserveFields({
        reserve,
        currentTimestamp,
    });
    const formattedReserve = formatEnhancedReserve({
        reserve: Object.assign(Object.assign({}, reserve), computedFields),
    });
    return Object.assign(Object.assign({}, formattedReserve), { totalLiquidityUSD: nativeToUSD({
            amount: computedFields.totalLiquidity,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), availableLiquidityUSD: nativeToUSD({
            amount: computedFields.formattedAvailableLiquidity,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalDebtUSD: nativeToUSD({
            amount: computedFields.totalDebt,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalVariableDebtUSD: nativeToUSD({
            amount: computedFields.totalVariableDebt,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalStableDebtUSD: nativeToUSD({
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
        formattedPriceInMarketReferenceCurrency: normalize(reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals), priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency, priceInUSD: nativeToUSD({
            amount: new BigNumber(1).shiftedBy(reserve.decimals),
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), 
        // v3
        // caps are already in absolutes
        borrowCapUSD: normalizedToUsd(new BigNumber(reserve.borrowCap), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString(), supplyCapUSD: normalizedToUsd(new BigNumber(reserve.supplyCap), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString(), unbackedUSD: normalizedToUsd(new BigNumber(reserve.unbacked), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString() });
}
export function formatReserves({ reserves, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, }) {
    return reserves.map(reserve => {
        const formattedReserve = formatReserveUSD({
            reserve,
            currentTimestamp,
            marketReferencePriceInUsd,
            marketReferenceCurrencyDecimals,
        });
        return Object.assign(Object.assign({}, reserve), formattedReserve);
    });
}
export function formatReservesAndIncentives({ reserves, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, reserveIncentives, }) {
    const formattedReserves = formatReserves({
        reserves,
        currentTimestamp,
        marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd,
    });
    return formattedReserves.map(reserve => {
        const reserveIncentive = reserveIncentives.find(reserveIncentive => reserveIncentive.underlyingAsset === reserve.underlyingAsset);
        if (!reserveIncentive)
            return reserve;
        const incentive = calculateReserveIncentives({
            reserves: formattedReserves,
            reserveIncentiveData: reserveIncentive,
            totalLiquidity: normalize(reserve.totalLiquidity, -reserve.decimals),
            totalVariableDebt: normalize(reserve.totalVariableDebt, -reserve.decimals),
            totalStableDebt: normalize(reserve.totalStableDebt, -reserve.decimals),
            priceInMarketReferenceCurrency: reserve.formattedPriceInMarketReferenceCurrency,
            decimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
        });
        return Object.assign(Object.assign({}, reserve), incentive);
    });
}
//# sourceMappingURL=index.js.map
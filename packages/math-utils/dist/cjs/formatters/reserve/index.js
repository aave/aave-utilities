"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatReservesAndIncentives = exports.formatReserves = exports.formatReserveUSD = exports.formatReserve = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const bignumber_1 = require("../../bignumber");
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const calculate_reserve_incentives_1 = require("../incentive/calculate-reserve-incentives");
const native_to_usd_1 = require("../usd/native-to-usd");
const normalized_to_usd_1 = require("../usd/normalized-to-usd");
const calculate_reserve_debt_1 = require("./calculate-reserve-debt");
/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({ reserve, currentTimestamp, }) {
    const { totalDebt, totalStableDebt, totalVariableDebt, totalLiquidity } = (0, calculate_reserve_debt_1.calculateReserveDebt)(reserve, currentTimestamp);
    const borrowUsageRatio = totalLiquidity.eq(0)
        ? '0'
        : (0, bignumber_1.valueToBigNumber)(totalDebt).dividedBy(totalLiquidity).toFixed();
    const supplyUsageRatio = totalLiquidity.eq(0)
        ? '0'
        : (0, bignumber_1.valueToBigNumber)(totalDebt)
            .dividedBy(totalLiquidity.plus(reserve.unbacked))
            .toFixed();
    // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
    const reserveLiquidationBonus = (0, bignumber_1.normalize)((0, bignumber_1.valueToBigNumber)(reserve.reserveLiquidationBonus).minus(10 ** index_1.LTV_PRECISION), index_1.LTV_PRECISION);
    const eModeLiquidationBonus = (0, bignumber_1.normalize)((0, bignumber_1.valueToBigNumber)(reserve.eModeLiquidationBonus).minus(10 ** index_1.LTV_PRECISION), index_1.LTV_PRECISION);
    /**
     * availableLiquidity returned by the helper is the amount of unborrowed tokens
     * the actual availableLiquidity might be lower due to borrowCap
     */
    const availableLiquidity = reserve.borrowCap === '0'
        ? new bignumber_js_1.default(reserve.availableLiquidity)
        : bignumber_js_1.default.min(reserve.availableLiquidity, new bignumber_js_1.default(reserve.borrowCap).shiftedBy(reserve.decimals).minus(
        // plus 1 as the cap is exclusive
        totalDebt.plus(1)));
    const supplyAPY = (0, index_1.rayPow)((0, bignumber_1.valueToZDBigNumber)(reserve.liquidityRate)
        .dividedBy(constants_1.SECONDS_PER_YEAR)
        .plus(index_1.RAY), constants_1.SECONDS_PER_YEAR).minus(index_1.RAY);
    const variableBorrowAPY = (0, index_1.rayPow)((0, bignumber_1.valueToZDBigNumber)(reserve.variableBorrowRate)
        .dividedBy(constants_1.SECONDS_PER_YEAR)
        .plus(index_1.RAY), constants_1.SECONDS_PER_YEAR).minus(index_1.RAY);
    const stableBorrowAPY = (0, index_1.rayPow)((0, bignumber_1.valueToZDBigNumber)(reserve.stableBorrowRate)
        .dividedBy(constants_1.SECONDS_PER_YEAR)
        .plus(index_1.RAY), constants_1.SECONDS_PER_YEAR).minus(index_1.RAY);
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
    const normalizeWithReserve = (n) => (0, bignumber_1.normalize)(n, reserve.decimals);
    const isIsolated = reserve.debtCeiling !== '0';
    const availableDebtCeilingUSD = isIsolated
        ? (0, bignumber_1.normalize)((0, bignumber_1.valueToBigNumber)(reserve.debtCeiling).minus(reserve.isolationModeTotalDebt), reserve.debtCeilingDecimals)
        : '0';
    return Object.assign(Object.assign({}, reserve), { totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt), totalStableDebt: normalizeWithReserve(reserve.totalStableDebt), totalLiquidity: normalizeWithReserve(reserve.totalLiquidity), formattedAvailableLiquidity: normalizeWithReserve(reserve.availableLiquidity), unborrowedLiquidity: normalizeWithReserve(reserve.unborrowedLiquidity), borrowUsageRatio: reserve.borrowUsageRatio, supplyUsageRatio: reserve.supplyUsageRatio, totalDebt: normalizeWithReserve(reserve.totalDebt), formattedBaseLTVasCollateral: (0, bignumber_1.normalize)(reserve.baseLTVasCollateral, index_1.LTV_PRECISION), formattedEModeLtv: (0, bignumber_1.normalize)(reserve.eModeLtv, index_1.LTV_PRECISION), reserveFactor: (0, bignumber_1.normalize)(reserve.reserveFactor, index_1.LTV_PRECISION), supplyAPY: (0, bignumber_1.normalize)(reserve.supplyAPY, constants_1.RAY_DECIMALS), supplyAPR: (0, bignumber_1.normalize)(reserve.liquidityRate, constants_1.RAY_DECIMALS), variableBorrowAPY: (0, bignumber_1.normalize)(reserve.variableBorrowAPY, constants_1.RAY_DECIMALS), variableBorrowAPR: (0, bignumber_1.normalize)(reserve.variableBorrowRate, constants_1.RAY_DECIMALS), stableBorrowAPY: (0, bignumber_1.normalize)(reserve.stableBorrowAPY, constants_1.RAY_DECIMALS), stableBorrowAPR: (0, bignumber_1.normalize)(reserve.stableBorrowRate, constants_1.RAY_DECIMALS), formattedReserveLiquidationThreshold: (0, bignumber_1.normalize)(reserve.reserveLiquidationThreshold, 4), formattedEModeLiquidationThreshold: (0, bignumber_1.normalize)(reserve.eModeLiquidationThreshold, 4), formattedReserveLiquidationBonus: (0, bignumber_1.normalize)((0, bignumber_1.valueToBigNumber)(reserve.reserveLiquidationBonus).minus(10 ** index_1.LTV_PRECISION), 4), formattedEModeLiquidationBonus: (0, bignumber_1.normalize)((0, bignumber_1.valueToBigNumber)(reserve.eModeLiquidationBonus).minus(10 ** index_1.LTV_PRECISION), 4), totalScaledVariableDebt: normalizeWithReserve(reserve.totalScaledVariableDebt), totalPrincipalStableDebt: normalizeWithReserve(reserve.totalPrincipalStableDebt), debtCeilingUSD: isIsolated
            ? (0, bignumber_1.normalize)(reserve.debtCeiling, reserve.debtCeilingDecimals)
            : '0', isolationModeTotalDebtUSD: isIsolated
            ? (0, bignumber_1.normalize)(reserve.isolationModeTotalDebt, reserve.debtCeilingDecimals)
            : '0', availableDebtCeilingUSD,
        isIsolated });
}
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
function formatReserve({ reserve, currentTimestamp, }) {
    const computedFields = getComputedReserveFields({
        reserve,
        currentTimestamp,
    });
    return formatEnhancedReserve({ reserve: Object.assign(Object.assign({}, reserve), computedFields) });
}
exports.formatReserve = formatReserve;
/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
function formatReserveUSD({ reserve, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, }) {
    const normalizedMarketReferencePriceInUsd = (0, bignumber_1.normalizeBN)(marketReferencePriceInUsd, constants_1.USD_DECIMALS);
    const computedFields = getComputedReserveFields({
        reserve,
        currentTimestamp,
    });
    const formattedReserve = formatEnhancedReserve({
        reserve: Object.assign(Object.assign({}, reserve), computedFields),
    });
    return Object.assign(Object.assign({}, formattedReserve), { totalLiquidityUSD: (0, native_to_usd_1.nativeToUSD)({
            amount: computedFields.totalLiquidity,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), availableLiquidityUSD: (0, native_to_usd_1.nativeToUSD)({
            amount: computedFields.formattedAvailableLiquidity,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalDebtUSD: (0, native_to_usd_1.nativeToUSD)({
            amount: computedFields.totalDebt,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalVariableDebtUSD: (0, native_to_usd_1.nativeToUSD)({
            amount: computedFields.totalVariableDebt,
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), totalStableDebtUSD: (0, native_to_usd_1.nativeToUSD)({
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
        formattedPriceInMarketReferenceCurrency: (0, bignumber_1.normalize)(reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals), priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency, priceInUSD: (0, native_to_usd_1.nativeToUSD)({
            amount: new bignumber_js_1.default(1).shiftedBy(reserve.decimals),
            currencyDecimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
            priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
            normalizedMarketReferencePriceInUsd,
        }), 
        // v3
        // caps are already in absolutes
        borrowCapUSD: (0, normalized_to_usd_1.normalizedToUsd)(new bignumber_js_1.default(reserve.borrowCap), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString(), supplyCapUSD: (0, normalized_to_usd_1.normalizedToUsd)(new bignumber_js_1.default(reserve.supplyCap), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString(), unbackedUSD: (0, normalized_to_usd_1.normalizedToUsd)(new bignumber_js_1.default(reserve.unbacked), reserve.priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals).toString() });
}
exports.formatReserveUSD = formatReserveUSD;
function formatReserves({ reserves, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, }) {
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
exports.formatReserves = formatReserves;
function formatReservesAndIncentives({ reserves, currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, reserveIncentives, }) {
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
        const incentive = (0, calculate_reserve_incentives_1.calculateReserveIncentives)({
            reserves: formattedReserves,
            reserveIncentiveData: reserveIncentive,
            totalLiquidity: (0, bignumber_1.normalize)(reserve.totalLiquidity, -reserve.decimals),
            totalVariableDebt: (0, bignumber_1.normalize)(reserve.totalVariableDebt, -reserve.decimals),
            totalStableDebt: (0, bignumber_1.normalize)(reserve.totalStableDebt, -reserve.decimals),
            priceInMarketReferenceCurrency: reserve.formattedPriceInMarketReferenceCurrency,
            decimals: reserve.decimals,
            marketReferenceCurrencyDecimals,
        });
        return Object.assign(Object.assign({}, reserve), incentive);
    });
}
exports.formatReservesAndIncentives = formatReservesAndIncentives;
//# sourceMappingURL=index.js.map
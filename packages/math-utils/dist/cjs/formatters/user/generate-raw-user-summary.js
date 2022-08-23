"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRawUserSummary = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const bignumber_1 = require("../../bignumber");
const pool_math_1 = require("../../pool-math");
const normalized_to_usd_1 = require("../usd/normalized-to-usd");
const calculate_user_reserve_totals_1 = require("./calculate-user-reserve-totals");
function generateRawUserSummary({ userReserves, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userEmodeCategoryId, }) {
    const { totalLiquidityMarketReferenceCurrency, totalBorrowsMarketReferenceCurrency, totalCollateralMarketReferenceCurrency, currentLtv, currentLiquidationThreshold, isInIsolationMode, isolatedReserve, } = (0, calculate_user_reserve_totals_1.calculateUserReserveTotals)({ userReserves, userEmodeCategoryId });
    const _availableBorrowsMarketReferenceCurrency = (0, pool_math_1.calculateAvailableBorrowsMarketReferenceCurrency)({
        collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
        currentLtv,
    });
    const availableBorrowsMarketReferenceCurrency = isInIsolationMode && isolatedReserve
        ? bignumber_js_1.default.min((0, bignumber_1.normalizeBN)(new bignumber_js_1.default(isolatedReserve.debtCeiling).minus(isolatedReserve.isolationModeTotalDebt), isolatedReserve.debtCeilingDecimals -
            marketReferenceCurrencyDecimals), _availableBorrowsMarketReferenceCurrency)
        : _availableBorrowsMarketReferenceCurrency;
    return {
        isInIsolationMode,
        isolatedReserve,
        totalLiquidityUSD: (0, normalized_to_usd_1.normalizedToUsd)(totalLiquidityMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalCollateralUSD: (0, normalized_to_usd_1.normalizedToUsd)(totalCollateralMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalBorrowsUSD: (0, normalized_to_usd_1.normalizedToUsd)(totalBorrowsMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalLiquidityMarketReferenceCurrency,
        totalCollateralMarketReferenceCurrency,
        totalBorrowsMarketReferenceCurrency,
        availableBorrowsMarketReferenceCurrency,
        availableBorrowsUSD: (0, normalized_to_usd_1.normalizedToUsd)(availableBorrowsMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        currentLoanToValue: currentLtv,
        currentLiquidationThreshold,
        healthFactor: (0, pool_math_1.calculateHealthFactorFromBalances)({
            collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
            borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
            currentLiquidationThreshold,
        }),
    };
}
exports.generateRawUserSummary = generateRawUserSummary;
//# sourceMappingURL=generate-raw-user-summary.js.map
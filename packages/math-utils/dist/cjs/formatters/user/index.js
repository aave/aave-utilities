"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserSummaryAndIncentives = exports.formatUserSummary = void 0;
const bignumber_1 = require("../../bignumber");
const constants_1 = require("../../constants");
const incentive_1 = require("../incentive");
const format_user_reserve_1 = require("./format-user-reserve");
const generate_raw_user_summary_1 = require("./generate-raw-user-summary");
const generate_user_reserve_summary_1 = require("./generate-user-reserve-summary");
function formatUserSummary({ currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userReserves, formattedReserves, userEmodeCategoryId, }) {
    const normalizedMarketRefPriceInUsd = (0, bignumber_1.normalize)(marketReferencePriceInUsd, constants_1.USD_DECIMALS);
    // Combine raw user and formatted reserve data
    const combinedReserves = [];
    userReserves.forEach(userReserve => {
        const reserve = formattedReserves.find(r => r.underlyingAsset.toLowerCase() ===
            userReserve.underlyingAsset.toLowerCase());
        if (reserve) {
            combinedReserves.push(Object.assign(Object.assign({}, userReserve), { reserve }));
        }
    });
    const computedUserReserves = combinedReserves.map(userReserve => (0, generate_user_reserve_summary_1.generateUserReserveSummary)({
        userReserve,
        marketReferencePriceInUsdNormalized: normalizedMarketRefPriceInUsd,
        marketReferenceCurrencyDecimals,
        currentTimestamp,
    }));
    const formattedUserReserves = computedUserReserves.map(computedUserReserve => (0, format_user_reserve_1.formatUserReserve)({
        reserve: computedUserReserve,
        marketReferenceCurrencyDecimals,
    }));
    const userData = (0, generate_raw_user_summary_1.generateRawUserSummary)({
        userReserves: computedUserReserves,
        marketReferencePriceInUsd: normalizedMarketRefPriceInUsd,
        marketReferenceCurrencyDecimals,
        userEmodeCategoryId,
    });
    return {
        userReservesData: formattedUserReserves,
        totalLiquidityMarketReferenceCurrency: (0, bignumber_1.normalize)(userData.totalLiquidityMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalLiquidityUSD: userData.totalLiquidityUSD.toString(),
        totalCollateralMarketReferenceCurrency: (0, bignumber_1.normalize)(userData.totalCollateralMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalCollateralUSD: userData.totalCollateralUSD.toString(),
        totalBorrowsMarketReferenceCurrency: (0, bignumber_1.normalize)(userData.totalBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalBorrowsUSD: userData.totalBorrowsUSD.toString(),
        netWorthUSD: userData.totalLiquidityUSD
            .minus(userData.totalBorrowsUSD)
            .toString(),
        availableBorrowsMarketReferenceCurrency: (0, bignumber_1.normalize)(userData.availableBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        availableBorrowsUSD: userData.availableBorrowsUSD.toString(),
        currentLoanToValue: (0, bignumber_1.normalize)(userData.currentLoanToValue, constants_1.LTV_PRECISION),
        currentLiquidationThreshold: (0, bignumber_1.normalize)(userData.currentLiquidationThreshold, constants_1.LTV_PRECISION),
        healthFactor: userData.healthFactor.toFixed(),
        isInIsolationMode: userData.isInIsolationMode,
        isolatedReserve: userData.isolatedReserve,
    };
}
exports.formatUserSummary = formatUserSummary;
function formatUserSummaryAndIncentives({ currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userReserves, formattedReserves, userEmodeCategoryId, reserveIncentives, userIncentives, }) {
    const formattedUserSummary = formatUserSummary({
        currentTimestamp,
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        userReserves,
        formattedReserves,
        userEmodeCategoryId,
    });
    const calculatedUserIncentives = (0, incentive_1.calculateAllUserIncentives)({
        reserveIncentives,
        userIncentives,
        userReserves: formattedUserSummary.userReservesData,
        currentTimestamp,
    });
    return Object.assign(Object.assign({}, formattedUserSummary), { calculatedUserIncentives });
}
exports.formatUserSummaryAndIncentives = formatUserSummaryAndIncentives;
//# sourceMappingURL=index.js.map
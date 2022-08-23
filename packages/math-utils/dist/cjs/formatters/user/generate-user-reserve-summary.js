"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserReserveSummary = void 0;
const pool_math_1 = require("../../pool-math");
function generateUserReserveSummary({ userReserve, marketReferencePriceInUsdNormalized, marketReferenceCurrencyDecimals, currentTimestamp, }) {
    const poolReserve = userReserve.reserve;
    const { priceInMarketReferenceCurrency, decimals } = poolReserve;
    const underlyingBalance = (0, pool_math_1.getLinearBalance)({
        balance: userReserve.scaledATokenBalance,
        index: poolReserve.liquidityIndex,
        rate: poolReserve.liquidityRate,
        lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: underlyingBalanceMarketReferenceCurrency, usdBalance: underlyingBalanceUSD, } = (0, pool_math_1.getMarketReferenceCurrencyAndUsdBalance)({
        balance: underlyingBalance,
        priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        decimals,
        marketReferencePriceInUsdNormalized,
    });
    const variableBorrows = (0, pool_math_1.getCompoundedBalance)({
        principalBalance: userReserve.scaledVariableDebt,
        reserveIndex: poolReserve.variableBorrowIndex,
        reserveRate: poolReserve.variableBorrowRate,
        lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: variableBorrowsMarketReferenceCurrency, usdBalance: variableBorrowsUSD, } = (0, pool_math_1.getMarketReferenceCurrencyAndUsdBalance)({
        balance: variableBorrows,
        priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        decimals,
        marketReferencePriceInUsdNormalized,
    });
    const stableBorrows = (0, pool_math_1.getCompoundedStableBalance)({
        principalBalance: userReserve.principalStableDebt,
        userStableRate: userReserve.stableBorrowRate,
        lastUpdateTimestamp: userReserve.stableBorrowLastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: stableBorrowsMarketReferenceCurrency, usdBalance: stableBorrowsUSD, } = (0, pool_math_1.getMarketReferenceCurrencyAndUsdBalance)({
        balance: stableBorrows,
        priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        decimals,
        marketReferencePriceInUsdNormalized,
    });
    return {
        userReserve,
        underlyingBalance,
        underlyingBalanceMarketReferenceCurrency,
        underlyingBalanceUSD,
        variableBorrows,
        variableBorrowsMarketReferenceCurrency,
        variableBorrowsUSD,
        stableBorrows,
        stableBorrowsMarketReferenceCurrency,
        stableBorrowsUSD,
        totalBorrows: variableBorrows.plus(stableBorrows),
        totalBorrowsMarketReferenceCurrency: variableBorrowsMarketReferenceCurrency.plus(stableBorrowsMarketReferenceCurrency),
        totalBorrowsUSD: variableBorrowsUSD.plus(stableBorrowsUSD),
    };
}
exports.generateUserReserveSummary = generateUserReserveSummary;
//# sourceMappingURL=generate-user-reserve-summary.js.map
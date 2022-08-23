import { getLinearBalance, getMarketReferenceCurrencyAndUsdBalance, getCompoundedBalance, getCompoundedStableBalance, } from '../../pool-math';
export function generateUserReserveSummary({ userReserve, marketReferencePriceInUsdNormalized, marketReferenceCurrencyDecimals, currentTimestamp, }) {
    const poolReserve = userReserve.reserve;
    const { priceInMarketReferenceCurrency, decimals } = poolReserve;
    const underlyingBalance = getLinearBalance({
        balance: userReserve.scaledATokenBalance,
        index: poolReserve.liquidityIndex,
        rate: poolReserve.liquidityRate,
        lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: underlyingBalanceMarketReferenceCurrency, usdBalance: underlyingBalanceUSD, } = getMarketReferenceCurrencyAndUsdBalance({
        balance: underlyingBalance,
        priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        decimals,
        marketReferencePriceInUsdNormalized,
    });
    const variableBorrows = getCompoundedBalance({
        principalBalance: userReserve.scaledVariableDebt,
        reserveIndex: poolReserve.variableBorrowIndex,
        reserveRate: poolReserve.variableBorrowRate,
        lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: variableBorrowsMarketReferenceCurrency, usdBalance: variableBorrowsUSD, } = getMarketReferenceCurrencyAndUsdBalance({
        balance: variableBorrows,
        priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals,
        decimals,
        marketReferencePriceInUsdNormalized,
    });
    const stableBorrows = getCompoundedStableBalance({
        principalBalance: userReserve.principalStableDebt,
        userStableRate: userReserve.stableBorrowRate,
        lastUpdateTimestamp: userReserve.stableBorrowLastUpdateTimestamp,
        currentTimestamp,
    });
    const { marketReferenceCurrencyBalance: stableBorrowsMarketReferenceCurrency, usdBalance: stableBorrowsUSD, } = getMarketReferenceCurrencyAndUsdBalance({
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
//# sourceMappingURL=generate-user-reserve-summary.js.map
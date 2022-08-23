import { normalize } from '../../bignumber';
import { LTV_PRECISION, USD_DECIMALS } from '../../constants';
import { calculateAllUserIncentives } from '../incentive';
import { formatUserReserve } from './format-user-reserve';
import { generateRawUserSummary } from './generate-raw-user-summary';
import { generateUserReserveSummary, } from './generate-user-reserve-summary';
export function formatUserSummary({ currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userReserves, formattedReserves, userEmodeCategoryId, }) {
    const normalizedMarketRefPriceInUsd = normalize(marketReferencePriceInUsd, USD_DECIMALS);
    // Combine raw user and formatted reserve data
    const combinedReserves = [];
    userReserves.forEach(userReserve => {
        const reserve = formattedReserves.find(r => r.underlyingAsset.toLowerCase() ===
            userReserve.underlyingAsset.toLowerCase());
        if (reserve) {
            combinedReserves.push(Object.assign(Object.assign({}, userReserve), { reserve }));
        }
    });
    const computedUserReserves = combinedReserves.map(userReserve => generateUserReserveSummary({
        userReserve,
        marketReferencePriceInUsdNormalized: normalizedMarketRefPriceInUsd,
        marketReferenceCurrencyDecimals,
        currentTimestamp,
    }));
    const formattedUserReserves = computedUserReserves.map(computedUserReserve => formatUserReserve({
        reserve: computedUserReserve,
        marketReferenceCurrencyDecimals,
    }));
    const userData = generateRawUserSummary({
        userReserves: computedUserReserves,
        marketReferencePriceInUsd: normalizedMarketRefPriceInUsd,
        marketReferenceCurrencyDecimals,
        userEmodeCategoryId,
    });
    return {
        userReservesData: formattedUserReserves,
        totalLiquidityMarketReferenceCurrency: normalize(userData.totalLiquidityMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalLiquidityUSD: userData.totalLiquidityUSD.toString(),
        totalCollateralMarketReferenceCurrency: normalize(userData.totalCollateralMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalCollateralUSD: userData.totalCollateralUSD.toString(),
        totalBorrowsMarketReferenceCurrency: normalize(userData.totalBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        totalBorrowsUSD: userData.totalBorrowsUSD.toString(),
        netWorthUSD: userData.totalLiquidityUSD
            .minus(userData.totalBorrowsUSD)
            .toString(),
        availableBorrowsMarketReferenceCurrency: normalize(userData.availableBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals),
        availableBorrowsUSD: userData.availableBorrowsUSD.toString(),
        currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
        currentLiquidationThreshold: normalize(userData.currentLiquidationThreshold, LTV_PRECISION),
        healthFactor: userData.healthFactor.toFixed(),
        isInIsolationMode: userData.isInIsolationMode,
        isolatedReserve: userData.isolatedReserve,
    };
}
export function formatUserSummaryAndIncentives({ currentTimestamp, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userReserves, formattedReserves, userEmodeCategoryId, reserveIncentives, userIncentives, }) {
    const formattedUserSummary = formatUserSummary({
        currentTimestamp,
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        userReserves,
        formattedReserves,
        userEmodeCategoryId,
    });
    const calculatedUserIncentives = calculateAllUserIncentives({
        reserveIncentives,
        userIncentives,
        userReserves: formattedUserSummary.userReservesData,
        currentTimestamp,
    });
    return Object.assign(Object.assign({}, formattedUserSummary), { calculatedUserIncentives });
}
//# sourceMappingURL=index.js.map
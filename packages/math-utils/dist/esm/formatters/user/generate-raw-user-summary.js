import BigNumber from 'bignumber.js';
import { normalizeBN } from '../../bignumber';
import { calculateAvailableBorrowsMarketReferenceCurrency, calculateHealthFactorFromBalances, } from '../../pool-math';
import { normalizedToUsd } from '../usd/normalized-to-usd';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
export function generateRawUserSummary({ userReserves, marketReferencePriceInUsd, marketReferenceCurrencyDecimals, userEmodeCategoryId, }) {
    const { totalLiquidityMarketReferenceCurrency, totalBorrowsMarketReferenceCurrency, totalCollateralMarketReferenceCurrency, currentLtv, currentLiquidationThreshold, isInIsolationMode, isolatedReserve, } = calculateUserReserveTotals({ userReserves, userEmodeCategoryId });
    const _availableBorrowsMarketReferenceCurrency = calculateAvailableBorrowsMarketReferenceCurrency({
        collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
        currentLtv,
    });
    const availableBorrowsMarketReferenceCurrency = isInIsolationMode && isolatedReserve
        ? BigNumber.min(normalizeBN(new BigNumber(isolatedReserve.debtCeiling).minus(isolatedReserve.isolationModeTotalDebt), isolatedReserve.debtCeilingDecimals -
            marketReferenceCurrencyDecimals), _availableBorrowsMarketReferenceCurrency)
        : _availableBorrowsMarketReferenceCurrency;
    return {
        isInIsolationMode,
        isolatedReserve,
        totalLiquidityUSD: normalizedToUsd(totalLiquidityMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalCollateralUSD: normalizedToUsd(totalCollateralMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalBorrowsUSD: normalizedToUsd(totalBorrowsMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        totalLiquidityMarketReferenceCurrency,
        totalCollateralMarketReferenceCurrency,
        totalBorrowsMarketReferenceCurrency,
        availableBorrowsMarketReferenceCurrency,
        availableBorrowsUSD: normalizedToUsd(availableBorrowsMarketReferenceCurrency, marketReferencePriceInUsd, marketReferenceCurrencyDecimals),
        currentLoanToValue: currentLtv,
        currentLiquidationThreshold,
        healthFactor: calculateHealthFactorFromBalances({
            collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
            borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
            currentLiquidationThreshold,
        }),
    };
}
//# sourceMappingURL=generate-raw-user-summary.js.map
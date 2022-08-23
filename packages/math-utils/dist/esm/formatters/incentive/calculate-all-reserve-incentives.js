import { calculateReserveIncentives, } from './calculate-reserve-incentives';
export function calculateAllReserveIncentives({ reserveIncentives, reserves, marketReferenceCurrencyDecimals, }) {
    const reserveDict = {};
    // calculate incentive per reserve token
    reserveIncentives.forEach(reserveIncentive => {
        // Find the corresponding reserve data for each reserveIncentive
        const reserve = reserves.find((reserve) => reserve.underlyingAsset.toLowerCase() ===
            reserveIncentive.underlyingAsset.toLowerCase());
        if (reserve) {
            const calculatedReserveIncentives = calculateReserveIncentives({
                reserves,
                reserveIncentiveData: reserveIncentive,
                totalLiquidity: reserve.totalLiquidity,
                totalVariableDebt: reserve.totalVariableDebt,
                totalStableDebt: reserve.totalStableDebt,
                priceInMarketReferenceCurrency: reserve.formattedPriceInMarketReferenceCurrency,
                decimals: reserve.decimals,
                marketReferenceCurrencyDecimals,
            });
            reserveDict[calculatedReserveIncentives.underlyingAsset] = {
                aIncentives: calculatedReserveIncentives.aIncentivesData,
                vIncentives: calculatedReserveIncentives.vIncentivesData,
                sIncentives: calculatedReserveIncentives.sIncentivesData,
            };
        }
    });
    return reserveDict;
}
//# sourceMappingURL=calculate-all-reserve-incentives.js.map
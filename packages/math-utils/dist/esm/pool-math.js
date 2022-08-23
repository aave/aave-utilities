import BigNumber from 'bignumber.js';
import { valueToBigNumber, valueToZDBigNumber, } from './bignumber';
import { SECONDS_PER_YEAR, LTV_PRECISION } from './constants';
import * as RayMath from './ray.math';
export function calculateCompoundedInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp);
    const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR);
    return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta);
}
export function getCompoundedBalance({ principalBalance: _principalBalance, reserveIndex, reserveRate, lastUpdateTimestamp, currentTimestamp, }) {
    const principalBalance = valueToZDBigNumber(_principalBalance);
    if (principalBalance.eq('0')) {
        return principalBalance;
    }
    const compoundedInterest = calculateCompoundedInterest({
        rate: reserveRate,
        currentTimestamp,
        lastUpdateTimestamp,
    });
    const cumulatedInterest = RayMath.rayMul(compoundedInterest, reserveIndex);
    const principalBalanceRay = RayMath.wadToRay(principalBalance);
    return RayMath.rayToWad(RayMath.rayMul(principalBalanceRay, cumulatedInterest));
}
export function calculateLinearInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = RayMath.wadToRay(valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp));
    const timeDeltaInSeconds = RayMath.rayDiv(timeDelta, RayMath.wadToRay(SECONDS_PER_YEAR));
    const a = RayMath.rayMul(rate, timeDeltaInSeconds).plus(RayMath.RAY);
    return a;
}
export function getReserveNormalizedIncome({ rate, index, lastUpdateTimestamp, currentTimestamp, }) {
    if (valueToZDBigNumber(rate).eq('0')) {
        return valueToZDBigNumber(index);
    }
    const cumulatedInterest = calculateLinearInterest({
        rate,
        currentTimestamp,
        lastUpdateTimestamp,
    });
    return RayMath.rayMul(cumulatedInterest, index);
}
export function getLinearBalance({ balance, index, rate, lastUpdateTimestamp, currentTimestamp, }) {
    return RayMath.rayToWad(RayMath.rayMul(RayMath.wadToRay(balance), getReserveNormalizedIncome({
        rate,
        index,
        lastUpdateTimestamp,
        currentTimestamp,
    })));
}
export function getCompoundedStableBalance({ principalBalance: _principalBalance, userStableRate, lastUpdateTimestamp, currentTimestamp, }) {
    const principalBalance = valueToZDBigNumber(_principalBalance);
    if (principalBalance.eq('0')) {
        return principalBalance;
    }
    const cumulatedInterest = calculateCompoundedInterest({
        rate: userStableRate,
        currentTimestamp,
        lastUpdateTimestamp,
    });
    const principalBalanceRay = RayMath.wadToRay(principalBalance);
    return RayMath.rayToWad(RayMath.rayMul(principalBalanceRay, cumulatedInterest));
}
export function calculateHealthFactorFromBalances({ borrowBalanceMarketReferenceCurrency, collateralBalanceMarketReferenceCurrency, currentLiquidationThreshold, }) {
    if (valueToBigNumber(borrowBalanceMarketReferenceCurrency).eq(0)) {
        return valueToBigNumber('-1'); // Invalid number
    }
    return valueToBigNumber(collateralBalanceMarketReferenceCurrency)
        .multipliedBy(currentLiquidationThreshold)
        .shiftedBy(LTV_PRECISION * -1)
        .div(borrowBalanceMarketReferenceCurrency);
}
export function calculateHealthFactorFromBalancesBigUnits({ collateralBalanceMarketReferenceCurrency, borrowBalanceMarketReferenceCurrency, currentLiquidationThreshold, }) {
    return calculateHealthFactorFromBalances({
        collateralBalanceMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency,
        currentLiquidationThreshold: valueToBigNumber(currentLiquidationThreshold)
            .shiftedBy(LTV_PRECISION)
            .decimalPlaces(0, BigNumber.ROUND_DOWN),
    });
}
export function calculateAvailableBorrowsMarketReferenceCurrency({ collateralBalanceMarketReferenceCurrency, borrowBalanceMarketReferenceCurrency, currentLtv, }) {
    if (valueToZDBigNumber(currentLtv).eq(0)) {
        return valueToZDBigNumber('0');
    }
    const availableBorrowsMarketReferenceCurrency = valueToZDBigNumber(collateralBalanceMarketReferenceCurrency)
        .multipliedBy(currentLtv)
        .shiftedBy(LTV_PRECISION * -1)
        .minus(borrowBalanceMarketReferenceCurrency);
    return availableBorrowsMarketReferenceCurrency.gt('0')
        ? availableBorrowsMarketReferenceCurrency
        : valueToZDBigNumber('0');
}
/**
 * @returns non humanized/normalized values for usd/marketReference
 */
export function getMarketReferenceCurrencyAndUsdBalance({ balance, priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals, decimals, marketReferencePriceInUsdNormalized, }) {
    const marketReferenceCurrencyBalance = valueToZDBigNumber(balance)
        .multipliedBy(priceInMarketReferenceCurrency)
        .shiftedBy(decimals * -1);
    const usdBalance = marketReferenceCurrencyBalance
        .multipliedBy(marketReferencePriceInUsdNormalized)
        .shiftedBy(marketReferenceCurrencyDecimals * -1);
    return { marketReferenceCurrencyBalance, usdBalance };
}
//# sourceMappingURL=pool-math.js.map
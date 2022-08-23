"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarketReferenceCurrencyAndUsdBalance = exports.calculateAvailableBorrowsMarketReferenceCurrency = exports.calculateHealthFactorFromBalancesBigUnits = exports.calculateHealthFactorFromBalances = exports.getCompoundedStableBalance = exports.getLinearBalance = exports.getReserveNormalizedIncome = exports.calculateLinearInterest = exports.getCompoundedBalance = exports.calculateCompoundedInterest = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const bignumber_1 = require("./bignumber");
const constants_1 = require("./constants");
const RayMath = (0, tslib_1.__importStar)(require("./ray.math"));
function calculateCompoundedInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = (0, bignumber_1.valueToZDBigNumber)(currentTimestamp - lastUpdateTimestamp);
    const ratePerSecond = (0, bignumber_1.valueToZDBigNumber)(rate).dividedBy(constants_1.SECONDS_PER_YEAR);
    return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta);
}
exports.calculateCompoundedInterest = calculateCompoundedInterest;
function getCompoundedBalance({ principalBalance: _principalBalance, reserveIndex, reserveRate, lastUpdateTimestamp, currentTimestamp, }) {
    const principalBalance = (0, bignumber_1.valueToZDBigNumber)(_principalBalance);
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
exports.getCompoundedBalance = getCompoundedBalance;
function calculateLinearInterest({ rate, currentTimestamp, lastUpdateTimestamp, }) {
    const timeDelta = RayMath.wadToRay((0, bignumber_1.valueToZDBigNumber)(currentTimestamp - lastUpdateTimestamp));
    const timeDeltaInSeconds = RayMath.rayDiv(timeDelta, RayMath.wadToRay(constants_1.SECONDS_PER_YEAR));
    const a = RayMath.rayMul(rate, timeDeltaInSeconds).plus(RayMath.RAY);
    return a;
}
exports.calculateLinearInterest = calculateLinearInterest;
function getReserveNormalizedIncome({ rate, index, lastUpdateTimestamp, currentTimestamp, }) {
    if ((0, bignumber_1.valueToZDBigNumber)(rate).eq('0')) {
        return (0, bignumber_1.valueToZDBigNumber)(index);
    }
    const cumulatedInterest = calculateLinearInterest({
        rate,
        currentTimestamp,
        lastUpdateTimestamp,
    });
    return RayMath.rayMul(cumulatedInterest, index);
}
exports.getReserveNormalizedIncome = getReserveNormalizedIncome;
function getLinearBalance({ balance, index, rate, lastUpdateTimestamp, currentTimestamp, }) {
    return RayMath.rayToWad(RayMath.rayMul(RayMath.wadToRay(balance), getReserveNormalizedIncome({
        rate,
        index,
        lastUpdateTimestamp,
        currentTimestamp,
    })));
}
exports.getLinearBalance = getLinearBalance;
function getCompoundedStableBalance({ principalBalance: _principalBalance, userStableRate, lastUpdateTimestamp, currentTimestamp, }) {
    const principalBalance = (0, bignumber_1.valueToZDBigNumber)(_principalBalance);
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
exports.getCompoundedStableBalance = getCompoundedStableBalance;
function calculateHealthFactorFromBalances({ borrowBalanceMarketReferenceCurrency, collateralBalanceMarketReferenceCurrency, currentLiquidationThreshold, }) {
    if ((0, bignumber_1.valueToBigNumber)(borrowBalanceMarketReferenceCurrency).eq(0)) {
        return (0, bignumber_1.valueToBigNumber)('-1'); // Invalid number
    }
    return (0, bignumber_1.valueToBigNumber)(collateralBalanceMarketReferenceCurrency)
        .multipliedBy(currentLiquidationThreshold)
        .shiftedBy(constants_1.LTV_PRECISION * -1)
        .div(borrowBalanceMarketReferenceCurrency);
}
exports.calculateHealthFactorFromBalances = calculateHealthFactorFromBalances;
function calculateHealthFactorFromBalancesBigUnits({ collateralBalanceMarketReferenceCurrency, borrowBalanceMarketReferenceCurrency, currentLiquidationThreshold, }) {
    return calculateHealthFactorFromBalances({
        collateralBalanceMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency,
        currentLiquidationThreshold: (0, bignumber_1.valueToBigNumber)(currentLiquidationThreshold)
            .shiftedBy(constants_1.LTV_PRECISION)
            .decimalPlaces(0, bignumber_js_1.default.ROUND_DOWN),
    });
}
exports.calculateHealthFactorFromBalancesBigUnits = calculateHealthFactorFromBalancesBigUnits;
function calculateAvailableBorrowsMarketReferenceCurrency({ collateralBalanceMarketReferenceCurrency, borrowBalanceMarketReferenceCurrency, currentLtv, }) {
    if ((0, bignumber_1.valueToZDBigNumber)(currentLtv).eq(0)) {
        return (0, bignumber_1.valueToZDBigNumber)('0');
    }
    const availableBorrowsMarketReferenceCurrency = (0, bignumber_1.valueToZDBigNumber)(collateralBalanceMarketReferenceCurrency)
        .multipliedBy(currentLtv)
        .shiftedBy(constants_1.LTV_PRECISION * -1)
        .minus(borrowBalanceMarketReferenceCurrency);
    return availableBorrowsMarketReferenceCurrency.gt('0')
        ? availableBorrowsMarketReferenceCurrency
        : (0, bignumber_1.valueToZDBigNumber)('0');
}
exports.calculateAvailableBorrowsMarketReferenceCurrency = calculateAvailableBorrowsMarketReferenceCurrency;
/**
 * @returns non humanized/normalized values for usd/marketReference
 */
function getMarketReferenceCurrencyAndUsdBalance({ balance, priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals, decimals, marketReferencePriceInUsdNormalized, }) {
    const marketReferenceCurrencyBalance = (0, bignumber_1.valueToZDBigNumber)(balance)
        .multipliedBy(priceInMarketReferenceCurrency)
        .shiftedBy(decimals * -1);
    const usdBalance = marketReferenceCurrencyBalance
        .multipliedBy(marketReferencePriceInUsdNormalized)
        .shiftedBy(marketReferenceCurrencyDecimals * -1);
    return { marketReferenceCurrencyBalance, usdBalance };
}
exports.getMarketReferenceCurrencyAndUsdBalance = getMarketReferenceCurrencyAndUsdBalance;
//# sourceMappingURL=pool-math.js.map
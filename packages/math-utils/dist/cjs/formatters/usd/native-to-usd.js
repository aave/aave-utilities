"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeToUSD = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const bignumber_1 = require("../../bignumber");
function nativeToUSD({ amount, currencyDecimals, priceInMarketReferenceCurrency, marketReferenceCurrencyDecimals, normalizedMarketReferencePriceInUsd, }) {
    return (0, bignumber_1.valueToBigNumber)(amount.toString())
        .multipliedBy(priceInMarketReferenceCurrency)
        .multipliedBy(normalizedMarketReferencePriceInUsd)
        .dividedBy(new bignumber_js_1.default(1).shiftedBy(currencyDecimals + marketReferenceCurrencyDecimals))
        .toString();
}
exports.nativeToUSD = nativeToUSD;
//# sourceMappingURL=native-to-usd.js.map
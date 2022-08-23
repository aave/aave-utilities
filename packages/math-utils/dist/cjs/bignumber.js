"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBN = exports.normalize = exports.valueToZDBigNumber = exports.valueToBigNumber = exports.BigNumberZeroDecimal = void 0;
const bignumber_js_1 = require("bignumber.js");
exports.BigNumberZeroDecimal = bignumber_js_1.BigNumber.clone({
    DECIMAL_PLACES: 0,
    ROUNDING_MODE: bignumber_js_1.BigNumber.ROUND_DOWN,
});
function valueToBigNumber(amount) {
    if (amount instanceof bignumber_js_1.BigNumber) {
        return amount;
    }
    return new bignumber_js_1.BigNumber(amount);
}
exports.valueToBigNumber = valueToBigNumber;
function valueToZDBigNumber(amount) {
    return new exports.BigNumberZeroDecimal(amount);
}
exports.valueToZDBigNumber = valueToZDBigNumber;
function normalize(n, decimals) {
    return normalizeBN(n, decimals).toString(10);
}
exports.normalize = normalize;
function normalizeBN(n, decimals) {
    return valueToBigNumber(n).shiftedBy(decimals * -1);
}
exports.normalizeBN = normalizeBN;
//# sourceMappingURL=bignumber.js.map
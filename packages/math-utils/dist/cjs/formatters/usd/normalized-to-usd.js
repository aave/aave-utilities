"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizedToUsd = void 0;
function normalizedToUsd(value, marketReferencePriceInUsd, marketReferenceCurrencyDecimals) {
    return value
        .multipliedBy(marketReferencePriceInUsd)
        .shiftedBy(marketReferenceCurrencyDecimals * -1);
}
exports.normalizedToUsd = normalizedToUsd;
//# sourceMappingURL=normalized-to-usd.js.map
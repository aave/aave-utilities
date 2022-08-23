export function normalizedToUsd(value, marketReferencePriceInUsd, marketReferenceCurrencyDecimals) {
    return value
        .multipliedBy(marketReferencePriceInUsd)
        .shiftedBy(marketReferenceCurrencyDecimals * -1);
}
//# sourceMappingURL=normalized-to-usd.js.map
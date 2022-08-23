import { BigNumber } from 'bignumber.js';
export const BigNumberZeroDecimal = BigNumber.clone({
    DECIMAL_PLACES: 0,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
});
export function valueToBigNumber(amount) {
    if (amount instanceof BigNumber) {
        return amount;
    }
    return new BigNumber(amount);
}
export function valueToZDBigNumber(amount) {
    return new BigNumberZeroDecimal(amount);
}
export function normalize(n, decimals) {
    return normalizeBN(n, decimals).toString(10);
}
export function normalizeBN(n, decimals) {
    return valueToBigNumber(n).shiftedBy(decimals * -1);
}
//# sourceMappingURL=bignumber.js.map
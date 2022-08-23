"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binomialApproximatedRayPow = exports.rayPow = exports.wadToRay = exports.rayToWad = exports.rayDiv = exports.rayMul = exports.WAD_RAY_RATIO = exports.HALF_RAY = exports.RAY = exports.HALF_WAD = exports.WAD = void 0;
const bignumber_1 = require("./bignumber");
exports.WAD = (0, bignumber_1.valueToZDBigNumber)(10).pow(18);
exports.HALF_WAD = exports.WAD.dividedBy(2);
exports.RAY = (0, bignumber_1.valueToZDBigNumber)(10).pow(27);
exports.HALF_RAY = exports.RAY.dividedBy(2);
exports.WAD_RAY_RATIO = (0, bignumber_1.valueToZDBigNumber)(10).pow(9);
function rayMul(a, b) {
    return exports.HALF_RAY.plus((0, bignumber_1.valueToZDBigNumber)(a).multipliedBy(b)).div(exports.RAY);
}
exports.rayMul = rayMul;
function rayDiv(a, b) {
    const halfB = (0, bignumber_1.valueToZDBigNumber)(b).div(2);
    return halfB.plus((0, bignumber_1.valueToZDBigNumber)(a).multipliedBy(exports.RAY)).div(b);
}
exports.rayDiv = rayDiv;
function rayToWad(a) {
    const halfRatio = (0, bignumber_1.valueToZDBigNumber)(exports.WAD_RAY_RATIO).div(2);
    return halfRatio.plus(a).div(exports.WAD_RAY_RATIO);
}
exports.rayToWad = rayToWad;
function wadToRay(a) {
    return (0, bignumber_1.valueToZDBigNumber)(a).multipliedBy(exports.WAD_RAY_RATIO).decimalPlaces(0);
}
exports.wadToRay = wadToRay;
function rayPow(a, p) {
    let x = (0, bignumber_1.valueToZDBigNumber)(a);
    let n = (0, bignumber_1.valueToZDBigNumber)(p);
    let z = n.modulo(2).eq(0) ? (0, bignumber_1.valueToZDBigNumber)(exports.RAY) : x;
    for (n = n.div(2); !n.eq(0); n = n.div(2)) {
        x = rayMul(x, x);
        if (!n.modulo(2).eq(0)) {
            z = rayMul(z, x);
        }
    }
    return z;
}
exports.rayPow = rayPow;
/**
 * RayPow is slow and gas intensive therefore in v2 we switched to binomial approximation on the contract level.
 * While the results ar not exact to the last decimal, they are close enough.
 */
function binomialApproximatedRayPow(a, p) {
    const base = (0, bignumber_1.valueToZDBigNumber)(a);
    const exp = (0, bignumber_1.valueToZDBigNumber)(p);
    if (exp.eq(0))
        return exports.RAY;
    const expMinusOne = exp.minus(1);
    const expMinusTwo = exp.gt(2) ? exp.minus(2) : 0;
    const basePowerTwo = rayMul(base, base);
    const basePowerThree = rayMul(basePowerTwo, base);
    const firstTerm = exp.multipliedBy(base);
    const secondTerm = exp
        .multipliedBy(expMinusOne)
        .multipliedBy(basePowerTwo)
        .div(2);
    const thirdTerm = exp
        .multipliedBy(expMinusOne)
        .multipliedBy(expMinusTwo)
        .multipliedBy(basePowerThree)
        .div(6);
    return exports.RAY.plus(firstTerm).plus(secondTerm).plus(thirdTerm);
}
exports.binomialApproximatedRayPow = binomialApproximatedRayPow;
//# sourceMappingURL=ray.math.js.map
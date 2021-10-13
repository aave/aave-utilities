import BigNumber from 'bignumber.js';
import { BigNumberValue, valueToZDBigNumber } from './bignumber';

export const WAD = valueToZDBigNumber(10).pow(18);
export const HALF_WAD = WAD.dividedBy(2);

export const RAY = valueToZDBigNumber(10).pow(27);
export const HALF_RAY = RAY.dividedBy(2);

export const WAD_RAY_RATIO = valueToZDBigNumber(10).pow(9);

export function rayMul(a: BigNumberValue, b: BigNumberValue): BigNumber {
  return HALF_RAY.plus(valueToZDBigNumber(a).multipliedBy(b)).div(RAY);
}

export function rayDiv(a: BigNumberValue, b: BigNumberValue): BigNumber {
  const halfB = valueToZDBigNumber(b).div(2);

  return halfB.plus(valueToZDBigNumber(a).multipliedBy(RAY)).div(b);
}

export function rayToWad(a: BigNumberValue): BigNumber {
  const halfRatio = valueToZDBigNumber(WAD_RAY_RATIO).div(2);

  return halfRatio.plus(a).div(WAD_RAY_RATIO);
}

export function wadToRay(a: BigNumberValue): BigNumber {
  return valueToZDBigNumber(a).multipliedBy(WAD_RAY_RATIO).decimalPlaces(0);
}

export function rayPow(a: BigNumberValue, p: BigNumberValue): BigNumber {
  let x = valueToZDBigNumber(a);
  let n = valueToZDBigNumber(p);
  let z = n.modulo(2).eq(0) ? valueToZDBigNumber(RAY) : x;

  for (n = n.div(2); !n.eq(0); n = n.div(2)) {
    x = rayMul(x, x);

    if (!n.modulo(2).eq(0)) {
      z = rayMul(z, x);
    }
  }

  return z;
}

/**
 * RayPow is slow and gas intensive therefore in v2 we switched to binomial approximation on the contract level.
 * While the results ar not exact to the last decimal, they are close enough.
 */
export function binomialApproximatedRayPow(
  a: BigNumberValue,
  p: BigNumberValue,
): BigNumber {
  const base = valueToZDBigNumber(a);
  const exp = valueToZDBigNumber(p);
  if (exp.eq(0)) return RAY;
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

  return RAY.plus(firstTerm).plus(secondTerm).plus(thirdTerm);
}

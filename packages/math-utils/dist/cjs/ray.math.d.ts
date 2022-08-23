import BigNumber from 'bignumber.js';
import { BigNumberValue } from './bignumber';
export declare const WAD: BigNumber;
export declare const HALF_WAD: BigNumber;
export declare const RAY: BigNumber;
export declare const HALF_RAY: BigNumber;
export declare const WAD_RAY_RATIO: BigNumber;
export declare function rayMul(a: BigNumberValue, b: BigNumberValue): BigNumber;
export declare function rayDiv(a: BigNumberValue, b: BigNumberValue): BigNumber;
export declare function rayToWad(a: BigNumberValue): BigNumber;
export declare function wadToRay(a: BigNumberValue): BigNumber;
export declare function rayPow(a: BigNumberValue, p: BigNumberValue): BigNumber;
/**
 * RayPow is slow and gas intensive therefore in v2 we switched to binomial approximation on the contract level.
 * While the results ar not exact to the last decimal, they are close enough.
 */
export declare function binomialApproximatedRayPow(
  a: BigNumberValue,
  p: BigNumberValue,
): BigNumber;
//# sourceMappingURL=ray.math.d.ts.map

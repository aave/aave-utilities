import { BigNumber } from 'bignumber.js';
export declare type BigNumberValue = string | number | BigNumber;
export declare const BigNumberZeroDecimal: typeof BigNumber;
export declare function valueToBigNumber(amount: BigNumberValue): BigNumber;
export declare function valueToZDBigNumber(amount: BigNumberValue): BigNumber;
export declare function normalize(n: BigNumberValue, decimals: number): string;
export declare function normalizeBN(
  n: BigNumberValue,
  decimals: number,
): BigNumber;
//# sourceMappingURL=bignumber.d.ts.map

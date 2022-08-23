import 'reflect-metadata';
export declare const isEthAddressMetadataKey: unique symbol;
export declare const isPermitDeadline32Bytes: unique symbol;
export declare const isEthAddressArrayMetadataKey: unique symbol;
export declare const isEthAddressOrENSMetadataKey: unique symbol;
export declare const isPositiveMetadataKey: unique symbol;
export declare const isPositiveOrMinusOneMetadataKey: unique symbol;
export declare const is0OrPositiveMetadataKey: unique symbol;
export declare const optionalMetadataKey: unique symbol;
export declare const isEthAddressArrayMetadataKeyNotEmpty: unique symbol;
export declare type paramsType = {
  index: number;
  field: string | undefined;
};
export declare function isDeadline32Bytes(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function isEthAddress(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function isEthAddressArray(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function isEthAddressOrENS(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function isPositiveAmount(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function is0OrPositiveAmount(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
export declare function isPositiveOrMinusOneAmount(
  field?: string,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
//# sourceMappingURL=paramValidators.d.ts.map

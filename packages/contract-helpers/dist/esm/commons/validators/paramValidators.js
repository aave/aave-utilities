/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';
export const isEthAddressMetadataKey = Symbol('ethAddress');
export const isPermitDeadline32Bytes = Symbol('deadline32Bytes');
export const isEthAddressArrayMetadataKey = Symbol('ethAddressArray');
export const isEthAddressOrENSMetadataKey = Symbol('ethOrENSAddress');
export const isPositiveMetadataKey = Symbol('isPositive');
export const isPositiveOrMinusOneMetadataKey = Symbol('isPositiveOrMinusOne');
export const is0OrPositiveMetadataKey = Symbol('is0OrPositiveMetadataKey');
export const optionalMetadataKey = Symbol('Optional');
export const isEthAddressArrayMetadataKeyNotEmpty = Symbol('isEthAddressArrayMetadataKeyNotEmpty');
export function isDeadline32Bytes(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(isPermitDeadline32Bytes, target, propertyKey) ||
            [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(isPermitDeadline32Bytes, existingPossibleAddresses, target, propertyKey);
    };
}
export function isEthAddress(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(isEthAddressMetadataKey, target, propertyKey) ||
            [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(isEthAddressMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
export function isEthAddressArray(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(isEthAddressArrayMetadataKey, target, propertyKey) || [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(isEthAddressArrayMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
// export function isNotEmptyEthAddressArray(field?: string) {
//   return function (
//     target: any,
//     propertyKey: string | symbol,
//     parameterIndex: number,
//   ): void {
//     const existingPossibleAddresses: paramsType[] =
//       Reflect.getOwnMetadata(
//         isEthAddressArrayMetadataKeyNotEmpty,
//         target,
//         propertyKey,
//       ) || [];
//     existingPossibleAddresses.push({
//       index: parameterIndex,
//       field,
//     });
//     Reflect.defineMetadata(
//       isEthAddressArrayMetadataKeyNotEmpty,
//       existingPossibleAddresses,
//       target,
//       propertyKey,
//     );
//   };
// }
export function isEthAddressOrENS(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(isEthAddressOrENSMetadataKey, target, propertyKey) || [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(isEthAddressOrENSMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
export function isPositiveAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(isPositiveMetadataKey, target, propertyKey) || [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(isPositiveMetadataKey, params, target, propertyKey);
    };
}
export function is0OrPositiveAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(is0OrPositiveMetadataKey, target, propertyKey) ||
            [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(is0OrPositiveMetadataKey, params, target, propertyKey);
    };
}
export function isPositiveOrMinusOneAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(isPositiveOrMinusOneMetadataKey, target, propertyKey) || [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(isPositiveOrMinusOneMetadataKey, params, target, propertyKey);
    };
}
// export function optional(
//   target: any,
//   propertyKey: string | symbol,
//   parameterIndex: number,
// ): void {
//   const existingOptionalParameters =
//     Reflect.getOwnMetadata(optionalMetadataKey, target, propertyKey) || [];
//   existingOptionalParameters.push(parameterIndex);
//   Reflect.defineMetadata(
//     optionalMetadataKey,
//     existingOptionalParameters,
//     target,
//     propertyKey,
//   );
// }
//# sourceMappingURL=paramValidators.js.map
"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPositiveOrMinusOneAmount = exports.is0OrPositiveAmount = exports.isPositiveAmount = exports.isEthAddressOrENS = exports.isEthAddressArray = exports.isEthAddress = exports.isDeadline32Bytes = exports.isEthAddressArrayMetadataKeyNotEmpty = exports.optionalMetadataKey = exports.is0OrPositiveMetadataKey = exports.isPositiveOrMinusOneMetadataKey = exports.isPositiveMetadataKey = exports.isEthAddressOrENSMetadataKey = exports.isEthAddressArrayMetadataKey = exports.isPermitDeadline32Bytes = exports.isEthAddressMetadataKey = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
require("reflect-metadata");
exports.isEthAddressMetadataKey = Symbol('ethAddress');
exports.isPermitDeadline32Bytes = Symbol('deadline32Bytes');
exports.isEthAddressArrayMetadataKey = Symbol('ethAddressArray');
exports.isEthAddressOrENSMetadataKey = Symbol('ethOrENSAddress');
exports.isPositiveMetadataKey = Symbol('isPositive');
exports.isPositiveOrMinusOneMetadataKey = Symbol('isPositiveOrMinusOne');
exports.is0OrPositiveMetadataKey = Symbol('is0OrPositiveMetadataKey');
exports.optionalMetadataKey = Symbol('Optional');
exports.isEthAddressArrayMetadataKeyNotEmpty = Symbol('isEthAddressArrayMetadataKeyNotEmpty');
function isDeadline32Bytes(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(exports.isPermitDeadline32Bytes, target, propertyKey) ||
            [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(exports.isPermitDeadline32Bytes, existingPossibleAddresses, target, propertyKey);
    };
}
exports.isDeadline32Bytes = isDeadline32Bytes;
function isEthAddress(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(exports.isEthAddressMetadataKey, target, propertyKey) ||
            [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(exports.isEthAddressMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
exports.isEthAddress = isEthAddress;
function isEthAddressArray(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(exports.isEthAddressArrayMetadataKey, target, propertyKey) || [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(exports.isEthAddressArrayMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
exports.isEthAddressArray = isEthAddressArray;
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
function isEthAddressOrENS(field) {
    return function (target, propertyKey, parameterIndex) {
        const existingPossibleAddresses = Reflect.getOwnMetadata(exports.isEthAddressOrENSMetadataKey, target, propertyKey) || [];
        existingPossibleAddresses.push({
            index: parameterIndex,
            field,
        });
        Reflect.defineMetadata(exports.isEthAddressOrENSMetadataKey, existingPossibleAddresses, target, propertyKey);
    };
}
exports.isEthAddressOrENS = isEthAddressOrENS;
function isPositiveAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(exports.isPositiveMetadataKey, target, propertyKey) || [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(exports.isPositiveMetadataKey, params, target, propertyKey);
    };
}
exports.isPositiveAmount = isPositiveAmount;
function is0OrPositiveAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(exports.is0OrPositiveMetadataKey, target, propertyKey) ||
            [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(exports.is0OrPositiveMetadataKey, params, target, propertyKey);
    };
}
exports.is0OrPositiveAmount = is0OrPositiveAmount;
function isPositiveOrMinusOneAmount(field) {
    return function (target, propertyKey, parameterIndex) {
        const params = Reflect.getOwnMetadata(exports.isPositiveOrMinusOneMetadataKey, target, propertyKey) || [];
        params.push({ index: parameterIndex, field });
        Reflect.defineMetadata(exports.isPositiveOrMinusOneMetadataKey, params, target, propertyKey);
    };
}
exports.isPositiveOrMinusOneAmount = isPositiveOrMinusOneAmount;
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
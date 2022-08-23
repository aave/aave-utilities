"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountGtThan0OrMinus1 = exports.amount0OrPositiveValidator = exports.amountGtThan0Validator = exports.isEthAddressOrEnsValidator = exports.isEthAddressArrayValidatorNotEmpty = exports.isEthAddressArrayValidator = exports.isEthAddressValidator = exports.isDeadline32BytesValidator = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
// import { canBeEnsAddress } from '../../commons/utils';
// import 'reflect-metadata';
const paramValidators_1 = require("./paramValidators");
// export function optionalValidator(
//   target: any,
//   propertyName: string,
//   methodArguments: any,
// ): boolean[] {
//   const optionalParameters = Reflect.getOwnMetadata(
//     optionalMetadataKey,
//     target,
//     propertyName,
//   );
//   const isParamOptional: boolean[] = [];
//   if (optionalParameters) {
//     optionalParameters.forEach((parameterIndex: number) => {
//       if (methodArguments[parameterIndex] === null) {
//         isParamOptional[parameterIndex] = true;
//       }
//     });
//   }
//   return isParamOptional;
// }
function isDeadline32BytesValidator(target, propertyName, methodArguments, isParamOptional) {
    const addressParameters = Reflect.getOwnMetadata(paramValidators_1.isPermitDeadline32Bytes, target, propertyName);
    if (addressParameters) {
        addressParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    Buffer.byteLength(methodArguments[0][storedParams.field], 'utf8') > 32) {
                    throw new Error(`Deadline: ${methodArguments[0][storedParams.field]} is bigger than 32 bytes`);
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (methodArguments[storedParams.index] &&
                    !isOptional &&
                    Buffer.byteLength(methodArguments[storedParams.index], 'utf8') > 32) {
                    throw new Error(`Deadline: ${methodArguments[storedParams.index]} is bigger than 32 bytes`);
                }
            }
        });
    }
}
exports.isDeadline32BytesValidator = isDeadline32BytesValidator;
function isEthAddressValidator(target, propertyName, methodArguments, isParamOptional) {
    const addressParameters = Reflect.getOwnMetadata(paramValidators_1.isEthAddressMetadataKey, target, propertyName);
    if (addressParameters) {
        addressParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    !ethers_1.utils.isAddress(methodArguments[0][storedParams.field])) {
                    throw new Error(`Address: ${methodArguments[0][storedParams.field]} is not a valid ethereum Address`);
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (methodArguments[storedParams.index] &&
                    !isOptional &&
                    !ethers_1.utils.isAddress(methodArguments[storedParams.index])) {
                    throw new Error(`Address: ${methodArguments[storedParams.index]} is not a valid ethereum Address`);
                }
            }
        });
    }
}
exports.isEthAddressValidator = isEthAddressValidator;
function isEthAddressArrayValidator(target, propertyName, methodArguments, isParamOptional) {
    const addressParameters = Reflect.getOwnMetadata(paramValidators_1.isEthAddressArrayMetadataKey, target, propertyName);
    if (addressParameters) {
        addressParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field]) {
                    if (methodArguments[0][storedParams.field].length > 0) {
                        const fieldArray = methodArguments[0][storedParams.field];
                        fieldArray.forEach((address) => {
                            if (!ethers_1.utils.isAddress(address)) {
                                throw new Error(`Address: ${address} is not a valid ethereum Address`);
                            }
                        });
                    }
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (methodArguments[storedParams.index] && !isOptional) {
                    if (methodArguments[storedParams.index].length > 0) {
                        const fieldArray = methodArguments[storedParams.index];
                        fieldArray.forEach((address) => {
                            if (!ethers_1.utils.isAddress(address)) {
                                throw new Error(`Address: ${address} is not a valid ethereum Address`);
                            }
                        });
                    }
                }
            }
        });
    }
}
exports.isEthAddressArrayValidator = isEthAddressArrayValidator;
function isEthAddressArrayValidatorNotEmpty(target, propertyName, methodArguments, isParamOptional) {
    const addressParameters = Reflect.getOwnMetadata(paramValidators_1.isEthAddressArrayMetadataKeyNotEmpty, target, propertyName);
    if (addressParameters) {
        addressParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field]) {
                    if (methodArguments[0][storedParams.field].length > 0) {
                        const fieldArray = methodArguments[0][storedParams.field];
                        fieldArray.forEach((address) => {
                            if (!ethers_1.utils.isAddress(address)) {
                                throw new Error(`Address: ${address} is not a valid ethereum Address`);
                            }
                        });
                    }
                    else {
                        throw new Error('Addresses Array should not be empty');
                    }
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (methodArguments[storedParams.index] && !isOptional) {
                    if (methodArguments[storedParams.index].length > 0) {
                        const fieldArray = methodArguments[storedParams.index];
                        fieldArray.forEach((address) => {
                            if (!ethers_1.utils.isAddress(address)) {
                                throw new Error(`Address: ${address} is not a valid ethereum Address`);
                            }
                        });
                    }
                    else {
                        throw new Error('Addresses Array should not be empty');
                    }
                }
            }
        });
    }
}
exports.isEthAddressArrayValidatorNotEmpty = isEthAddressArrayValidatorNotEmpty;
function isEthAddressOrEnsValidator(target, propertyName, methodArguments, isParamOptional) {
    const addressParameters = Reflect.getOwnMetadata(paramValidators_1.isEthAddressOrENSMetadataKey, target, propertyName);
    if (addressParameters) {
        addressParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    !ethers_1.utils.isAddress(methodArguments[0][storedParams.field])) {
                    if (!(0, utils_1.canBeEnsAddress)(methodArguments[0][storedParams.field])) {
                        throw new Error(`Address ${methodArguments[0][storedParams.field]} is not valid ENS format or a valid ethereum Address`);
                    }
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (methodArguments[storedParams.index] &&
                    !isOptional &&
                    !ethers_1.utils.isAddress(methodArguments[storedParams.index])) {
                    if (!(0, utils_1.canBeEnsAddress)(methodArguments[storedParams.index])) {
                        throw new Error(`Address ${methodArguments[storedParams.index]} is not valid ENS format or a valid ethereum Address`);
                    }
                }
            }
        });
    }
}
exports.isEthAddressOrEnsValidator = isEthAddressOrEnsValidator;
function amountGtThan0Validator(target, propertyName, methodArguments, isParamOptional) {
    const amountParameters = Reflect.getOwnMetadata(paramValidators_1.isPositiveMetadataKey, target, propertyName);
    if (amountParameters) {
        amountParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    !(Number(methodArguments[0][storedParams.field]) > 0)) {
                    throw new Error(`Amount: ${methodArguments[0][storedParams.field]} needs to be greater than 0`);
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (!isOptional && !(Number(methodArguments[storedParams.index]) > 0)) {
                    throw new Error(`Amount: ${methodArguments[storedParams.index]} needs to be greater than 0`);
                }
            }
        });
    }
}
exports.amountGtThan0Validator = amountGtThan0Validator;
function amount0OrPositiveValidator(target, propertyName, methodArguments, isParamOptional) {
    const amountParameters = Reflect.getOwnMetadata(paramValidators_1.is0OrPositiveMetadataKey, target, propertyName);
    if (amountParameters) {
        amountParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    !(Number(methodArguments[0][storedParams.field]) >= 0)) {
                    throw new Error(`Amount: ${methodArguments[0][storedParams.field]} needs to be greater or equal than 0`);
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (!isOptional &&
                    !(Number(methodArguments[storedParams.index]) >= 0)) {
                    throw new Error(`Amount: ${methodArguments[storedParams.index]} needs to be greater or equal than 0`);
                }
            }
        });
    }
}
exports.amount0OrPositiveValidator = amount0OrPositiveValidator;
function amountGtThan0OrMinus1(target, propertyName, methodArguments, isParamOptional) {
    const amountMinusOneParameters = Reflect.getOwnMetadata(paramValidators_1.isPositiveOrMinusOneMetadataKey, target, propertyName);
    if (amountMinusOneParameters) {
        amountMinusOneParameters.forEach(storedParams => {
            if (storedParams.field) {
                if (methodArguments[0][storedParams.field] &&
                    !(Number(methodArguments[0][storedParams.field]) > 0 ||
                        methodArguments[0][storedParams.field] === '-1')) {
                    throw new Error(`Amount: ${methodArguments[0][storedParams.field]} needs to be greater than 0 or -1`);
                }
            }
            else {
                const isOptional = isParamOptional === null || isParamOptional === void 0 ? void 0 : isParamOptional[storedParams.index];
                if (!isOptional &&
                    !(Number(methodArguments[storedParams.index]) > 0 ||
                        methodArguments[storedParams.index] === '-1')) {
                    throw new Error(`Amount: ${methodArguments[storedParams.index]} needs to be greater than 0 or -1`);
                }
            }
        });
    }
}
exports.amountGtThan0OrMinus1 = amountGtThan0OrMinus1;
//# sourceMappingURL=validations.js.map
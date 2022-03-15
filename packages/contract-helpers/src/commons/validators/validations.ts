/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils } from 'ethers';
import { canBeEnsAddress } from '../utils';
// import { canBeEnsAddress } from '../../commons/utils';
// import 'reflect-metadata';
import {
  is0OrPositiveMetadataKey,
  isEthAddressArrayMetadataKey,
  isEthAddressMetadataKey,
  isPositiveMetadataKey,
  isPositiveOrMinusOneMetadataKey,
  // optionalMetadataKey,
  paramsType,
  isEthAddressArrayMetadataKeyNotEmpty,
  isEthAddressOrENSMetadataKey,
  isPermitDeadline32Bytes,
} from './paramValidators';

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

export function isDeadline32BytesValidator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const addressParameters: paramsType[] = Reflect.getOwnMetadata(
    isPermitDeadline32Bytes,
    target,
    propertyName,
  );

  if (addressParameters) {
    addressParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          Buffer.byteLength(methodArguments[0][storedParams.field], 'utf8') > 32
        ) {
          throw new Error(
            `Deadline: ${
              methodArguments[0][storedParams.field]
            } is bigger than 32 bytes`,
          );
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (
          methodArguments[storedParams.index] &&
          !isOptional &&
          Buffer.byteLength(methodArguments[storedParams.index], 'utf8') > 32
        ) {
          throw new Error(
            `Deadline: ${
              methodArguments[storedParams.index]
            } is bigger than 32 bytes`,
          );
        }
      }
    });
  }
}

export function isEthAddressValidator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const addressParameters: paramsType[] = Reflect.getOwnMetadata(
    isEthAddressMetadataKey,
    target,
    propertyName,
  );

  if (addressParameters) {
    addressParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          !utils.isAddress(methodArguments[0][storedParams.field])
        ) {
          throw new Error(
            `Address: ${
              methodArguments[0][storedParams.field]
            } is not a valid ethereum Address`,
          );
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (
          methodArguments[storedParams.index] &&
          !isOptional &&
          !utils.isAddress(methodArguments[storedParams.index])
        ) {
          throw new Error(
            `Address: ${
              methodArguments[storedParams.index]
            } is not a valid ethereum Address`,
          );
        }
      }
    });
  }
}

export function isEthAddressArrayValidator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const addressParameters: paramsType[] = Reflect.getOwnMetadata(
    isEthAddressArrayMetadataKey,
    target,
    propertyName,
  );

  if (addressParameters) {
    addressParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (methodArguments[0][storedParams.field]) {
          if (methodArguments[0][storedParams.field].length > 0) {
            const fieldArray = methodArguments[0][storedParams.field];
            fieldArray.forEach((address: string) => {
              if (!utils.isAddress(address)) {
                throw new Error(
                  `Address: ${address} is not a valid ethereum Address`,
                );
              }
            });
          }
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (methodArguments[storedParams.index] && !isOptional) {
          if (methodArguments[storedParams.index].length > 0) {
            const fieldArray = methodArguments[storedParams.index];
            fieldArray.forEach((address: string) => {
              if (!utils.isAddress(address)) {
                throw new Error(
                  `Address: ${address} is not a valid ethereum Address`,
                );
              }
            });
          }
        }
      }
    });
  }
}

export function isEthAddressArrayValidatorNotEmpty(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const addressParameters: paramsType[] = Reflect.getOwnMetadata(
    isEthAddressArrayMetadataKeyNotEmpty,
    target,
    propertyName,
  );

  if (addressParameters) {
    addressParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (methodArguments[0][storedParams.field]) {
          if (methodArguments[0][storedParams.field].length > 0) {
            const fieldArray = methodArguments[0][storedParams.field];
            fieldArray.forEach((address: string) => {
              if (!utils.isAddress(address)) {
                throw new Error(
                  `Address: ${address} is not a valid ethereum Address`,
                );
              }
            });
          } else {
            throw new Error('Addresses Array should not be empty');
          }
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (methodArguments[storedParams.index] && !isOptional) {
          if (methodArguments[storedParams.index].length > 0) {
            const fieldArray = methodArguments[storedParams.index];
            fieldArray.forEach((address: string) => {
              if (!utils.isAddress(address)) {
                throw new Error(
                  `Address: ${address} is not a valid ethereum Address`,
                );
              }
            });
          } else {
            throw new Error('Addresses Array should not be empty');
          }
        }
      }
    });
  }
}

export function isEthAddressOrEnsValidator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const addressParameters: paramsType[] = Reflect.getOwnMetadata(
    isEthAddressOrENSMetadataKey,
    target,
    propertyName,
  );

  if (addressParameters) {
    addressParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          !utils.isAddress(methodArguments[0][storedParams.field])
        ) {
          if (!canBeEnsAddress(methodArguments[0][storedParams.field])) {
            throw new Error(
              `Address ${
                methodArguments[0][storedParams.field]
              } is not valid ENS format or a valid ethereum Address`,
            );
          }
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (
          methodArguments[storedParams.index] &&
          !isOptional &&
          !utils.isAddress(methodArguments[storedParams.index])
        ) {
          if (!canBeEnsAddress(methodArguments[storedParams.index])) {
            throw new Error(
              `Address ${
                methodArguments[storedParams.index]
              } is not valid ENS format or a valid ethereum Address`,
            );
          }
        }
      }
    });
  }
}

export function amountGtThan0Validator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const amountParameters: paramsType[] = Reflect.getOwnMetadata(
    isPositiveMetadataKey,
    target,
    propertyName,
  );

  if (amountParameters) {
    amountParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          !(Number(methodArguments[0][storedParams.field]) > 0)
        ) {
          throw new Error(
            `Amount: ${
              methodArguments[0][storedParams.field]
            } needs to be greater than 0`,
          );
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (!isOptional && !(Number(methodArguments[storedParams.index]) > 0)) {
          throw new Error(
            `Amount: ${
              methodArguments[storedParams.index]
            } needs to be greater than 0`,
          );
        }
      }
    });
  }
}

export function amount0OrPositiveValidator(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const amountParameters: paramsType[] = Reflect.getOwnMetadata(
    is0OrPositiveMetadataKey,
    target,
    propertyName,
  );

  if (amountParameters) {
    amountParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          !(Number(methodArguments[0][storedParams.field]) >= 0)
        ) {
          throw new Error(
            `Amount: ${
              methodArguments[0][storedParams.field]
            } needs to be greater or equal than 0`,
          );
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (
          !isOptional &&
          !(Number(methodArguments[storedParams.index]) >= 0)
        ) {
          throw new Error(
            `Amount: ${
              methodArguments[storedParams.index]
            } needs to be greater or equal than 0`,
          );
        }
      }
    });
  }
}

export function amountGtThan0OrMinus1(
  target: any,
  propertyName: string,
  methodArguments: any,
  isParamOptional?: boolean[],
): void {
  const amountMinusOneParameters: paramsType[] = Reflect.getOwnMetadata(
    isPositiveOrMinusOneMetadataKey,
    target,
    propertyName,
  );

  if (amountMinusOneParameters) {
    amountMinusOneParameters.forEach(storedParams => {
      if (storedParams.field) {
        if (
          methodArguments[0][storedParams.field] &&
          !(
            Number(methodArguments[0][storedParams.field]) > 0 ||
            methodArguments[0][storedParams.field] === '-1'
          )
        ) {
          throw new Error(
            `Amount: ${
              methodArguments[0][storedParams.field]
            } needs to be greater than 0 or -1`,
          );
        }
      } else {
        const isOptional = isParamOptional?.[storedParams.index];
        if (
          !isOptional &&
          !(
            Number(methodArguments[storedParams.index]) > 0 ||
            methodArguments[storedParams.index] === '-1'
          )
        ) {
          throw new Error(
            `Amount: ${
              methodArguments[storedParams.index]
            } needs to be greater than 0 or -1`,
          );
        }
      }
    });
  }
}

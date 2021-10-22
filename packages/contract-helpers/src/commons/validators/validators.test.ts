import {
  isEthAddressArrayMetadataKeyNotEmpty,
  isEthAddressMetadataKey,
} from './paramValidators';
import {
  isEthAddressArrayValidatorNotEmpty,
  isEthAddressValidator,
} from './validations';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Test {}

describe('validators', () => {
  const target = Test;
  const propertyName = 'claimRewards';
  const propertyKey = 'claimRewards';
  describe('isEthAddressValidator', () => {
    it('Expects to run with correct address', () => {
      const methodArguments = {
        '0': {
          to: '0x0000000000000000000000000000000000000001',
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];

      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressValidator(target, propertyName, methodArguments);
      }).not.toThrow();
    });

    it('Expects to run with no params', () => {
      const methodArguments = {
        '0': {
          to: '0x0000000000000000000000000000000000000001',
        },
      };

      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        undefined,
        target,
        propertyKey,
      );
      expect(() => {
        isEthAddressValidator(target, propertyName, methodArguments);
      }).not.toThrow();
    });
    it('Expects to run with no address if optional', () => {
      const methodArguments = {
        '0': {},
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];
      const isParamOptional = [true];
      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressValidator(
          target,
          propertyName,
          methodArguments,
          isParamOptional,
        );
      }).not.toThrow();
    });
    it('Expects to not run with incorrect address', () => {
      const methodArguments = {
        '0': {
          to: 'asdfasdf',
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];

      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressValidator(target, propertyName, methodArguments);
      }).toThrowError(
        `Address: ${methodArguments[0].to} is not a valid ethereum Address`,
      );
    });
    it('Expects to throw when no address and not optional', () => {
      const methodArguments = {
        '0': {},
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];
      const isParamOptional = [false];
      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressValidator(
          target,
          propertyName,
          methodArguments,
          isParamOptional,
        );
      }).toThrowError(
        new Error(`Address: [object Object] is not a valid ethereum Address`),
      );
    });
    it('Expects to throw when no address and not optional passed', () => {
      const methodArguments = {
        '0': {},
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];
      Reflect.defineMetadata(
        isEthAddressMetadataKey,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressValidator(target, propertyName, methodArguments);
      }).toThrowError(
        new Error(`Address: [object Object] is not a valid ethereum Address`),
      );
    });
  });
  describe('isEthAddressArrayValidatorNotEmpty', () => {
    it('Expects to run with correct address', () => {
      const methodArguments = {
        '0': {
          to: ['0x0000000000000000000000000000000000000001'],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];

      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).not.toThrow();
    });
    it('Expects to run with correct address but in other field', () => {
      const methodArguments = {
        '0': {
          from: ['0x0000000000000000000000000000000000000001'],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];

      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).not.toThrow();
    });
    it('Expects to run with no params', () => {
      const methodArguments = {
        '0': {
          to: ['0x0000000000000000000000000000000000000001'],
        },
      };

      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        undefined,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).not.toThrow();
    });
    it('Expects to run with no address if optional', () => {
      const methodArguments = {
        '0': {},
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];
      const isParamOptional = [true];
      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
          isParamOptional,
        );
      }).not.toThrow();
    });
    it('Expects to not run with incorrect address', () => {
      const methodArguments = {
        '0': {
          to: ['asdfasdf'],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];

      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).toThrowError(
        `Address: ${methodArguments[0].to[0]} is not a valid ethereum Address`,
      );
    });
    it('Expects to throw when no address and not optional', () => {
      const methodArguments = {
        '0': {
          to: ['asdf'],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];
      const isParamOptional = [false];
      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
          isParamOptional,
        );
      }).toThrowError(new Error(`Addresses Array is not optional`));
    });
    it('Expects to throw when no address and not optional passed', () => {
      const methodArguments = {
        '0': {
          to: ['asdf'],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: undefined,
        },
      ];

      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).toThrowError(new Error(`Addresses Array is not optional`));
    });
    it('Expects to throw when empty array', () => {
      const methodArguments = {
        '0': {
          to: [],
        },
      };
      const existingPossibleAddresses = [
        {
          index: 0,
          field: 'to',
        },
      ];
      Reflect.defineMetadata(
        isEthAddressArrayMetadataKeyNotEmpty,
        existingPossibleAddresses,
        target,
        propertyKey,
      );

      expect(() => {
        isEthAddressArrayValidatorNotEmpty(
          target,
          propertyName,
          methodArguments,
        );
      }).toThrowError(new Error(`Addresses Array should not be empty`));
    });
    // it('Expects to throw when empty array and not optional', () => {
    //   const methodArguments = {
    //     '0': {
    //       to: [],
    //     },
    //   };
    //   const existingPossibleAddresses = [
    //     {
    //       index: 0,
    //       field: undefined,
    //     },
    //   ];
    //   const isParamOptional = [false];
    //   Reflect.defineMetadata(
    //     isEthAddressArrayMetadataKeyNotEmpty,
    //     existingPossibleAddresses,
    //     target,
    //     propertyKey,
    //   );

    //   expect(() => {
    //     isEthAddressArrayValidatorNotEmpty(
    //       target,
    //       propertyName,
    //       methodArguments,
    //       isParamOptional,
    //     );
    //   }).toThrowError(new Error(`Addresses Array is not optional`));
    // });
  });
  describe('amountGtThan0Validator', () => {});
});

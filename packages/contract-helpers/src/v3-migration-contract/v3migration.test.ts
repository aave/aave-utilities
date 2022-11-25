import { BigNumber, providers } from 'ethers';
import { V3MigrationHelperService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('V3MigrationService', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  jest.spyOn(provider, 'getNetwork').mockImplementation(async () =>
    Promise.resolve({
      name: 'homestead',
      chainId: 1,
    }),
  );

  const MIGRATOR_ADDRESS = '0x0000000000000000000000000000000000000001';
  describe('Initialization', () => {
    it('Expects to be initialized with all params', () => {
      const instance = new V3MigrationHelperService(provider, MIGRATOR_ADDRESS);
      expect(instance instanceof V3MigrationHelperService).toEqual(true);
    });
  });
});

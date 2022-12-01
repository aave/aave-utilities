import { BigNumber, providers } from 'ethers';
import { Pool } from '../v3-pool-contract';
import { V3MigrationHelperService } from './index';

const getPool = (provider: providers.Provider) => {
  const POOL = '0x0000000000000000000000000000000000000001';
  const WETH_GATEWAY = '0x0000000000000000000000000000000000000002';
  const FLASH_LIQUIDATION_ADAPTER =
    '0x0000000000000000000000000000000000000003';
  const REPAY_WITH_COLLATERAL_ADAPTER =
    '0x0000000000000000000000000000000000000004';
  const SWAP_COLLATERAL_ADAPTER = '0x0000000000000000000000000000000000000005';
  const L2_ENCODER = '0x0000000000000000000000000000000000000020';
  const config = {
    POOL,
    FLASH_LIQUIDATION_ADAPTER,
    REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY,
    L2_ENCODER,
  };

  return new Pool(provider, config);
};

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
  const pool = getPool(provider);
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
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      expect(instance instanceof V3MigrationHelperService).toEqual(true);
    });
  });
});

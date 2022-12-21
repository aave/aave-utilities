import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  transactionType,
} from '../commons/types';
import { DEFAULT_NULL_VALUE_ON_TX } from '../commons/utils';
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

  const MIGRATOR_ADDRESS = '0x0000000000000000000000000000000000000001';
  const user = '0x0000000000000000000000000000000000000002';

  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  jest.spyOn(provider, 'getNetwork').mockImplementation(async () =>
    Promise.resolve({
      name: 'homestead',
      chainId: 1,
    }),
  );

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
  describe('migrateNoBorrow', () => {
    const assets = [
      {
        aToken: '0x0000000000000000000000000000000000000003',
        underlyingAsset: '0x0000000000000000000000000000000000000004',
        deadline: 123,
        amount: '123400000000',
      },
    ];
    it('Expects to work with correct params without approvals', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const migrateNoBorrowTxs = await instance.migrateNoBorrow({
        assets,
        user,
      });

      expect(isApprovedSpy).toHaveBeenCalled();

      expect(migrateNoBorrowTxs.length).toEqual(1);

      const txObj = migrateNoBorrowTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual([assets[0].underlyingAsset]);
      expect(decoded[2]).toEqual([]);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with correct params with approvals', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const approveSpy = jest
        .spyOn(instance.erc20Service, 'approve')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });

      const migrateNoBorrowTxs = await instance.migrateNoBorrow({
        assets,
        user,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();

      expect(migrateNoBorrowTxs.length).toEqual(2);
      const txObj = migrateNoBorrowTxs[1];

      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual([assets[0].underlyingAsset]);
      expect(decoded[2]).toEqual([]);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('700000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fails when user not address', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const user = 'asdf';
      await expect(async () =>
        instance.migrateNoBorrow({
          assets,
          user,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
  });
  describe('migrateWithBorrow', () => {
    const borrowedPositions = [
      {
        amount: '100000000000',
        address: '0x0000000000000000000000000000000000000004',
        interestRate: InterestRate.Variable,
      },
    ];
    const borrowedPositionsStable = [
      {
        amount: '100000000000',
        address: '0x0000000000000000000000000000000000000004',
        interestRate: InterestRate.Stable,
      },
    ];
    const suppliedPositions = [
      {
        aToken: '0x0000000000000000000000000000000000000003',
        underlyingAsset: '0x0000000000000000000000000000000000000004',
        deadline: 123,
        amount: '123400000000',
      },
    ];
    const signedPermits = [
      {
        deadline: 1234,
        aToken: '0x0000000000000000000000000000000000000003',
        value: '112300000',
        signedPermit:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      },
    ];

    const decimals = 18;

    it('Expects to work with correct params with permits', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.pool, 'migrateV3')
        .mockReturnValue(Promise.resolve({}));

      const migrateWithBorrowTxs = await instance.migrateWithBorrow({
        user,
        borrowedPositions,
        suppliedPositions,
        signedPermits,
      });

      expect(migrateWithBorrowTxs.length).toEqual(1);

      const txObj = migrateWithBorrowTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with correct params with permits with stable', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.pool, 'migrateV3')
        .mockReturnValue(Promise.resolve({}));

      const migrateWithBorrowTxs = await instance.migrateWithBorrow({
        user,
        borrowedPositions: borrowedPositionsStable,
        suppliedPositions,
        signedPermits,
      });

      expect(migrateWithBorrowTxs.length).toEqual(1);

      const txObj = migrateWithBorrowTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with correct params without permits and no approvals', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );
      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      jest
        .spyOn(instance.pool, 'migrateV3')
        .mockReturnValue(Promise.resolve({}));

      const migrateWithBorrowTxs = await instance.migrateWithBorrow({
        user,
        borrowedPositions,
        suppliedPositions,
        signedPermits: [],
      });

      expect(migrateWithBorrowTxs.length).toEqual(1);

      const txObj = migrateWithBorrowTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with correct params without permits and approvals', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );
      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      jest.spyOn(instance.erc20Service, 'approve').mockReturnValueOnce({
        txType: eEthereumTxType.ERC20_APPROVAL,
        tx: async () => ({}),
        gas: async () => ({
          gasLimit: '1',
          gasPrice: '1',
        }),
      });
      jest
        .spyOn(instance.pool, 'migrateV3')
        .mockReturnValue(Promise.resolve({}));

      const migrateWithBorrowTxs = await instance.migrateWithBorrow({
        user,
        borrowedPositions,
        suppliedPositions,
        signedPermits: [],
      });

      expect(migrateWithBorrowTxs.length).toEqual(2);

      const txObj = migrateWithBorrowTxs[1];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('700000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fails when user not address', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const user = 'asdf';
      await expect(async () =>
        instance.migrateWithBorrow({
          user,
          borrowedPositions,
          suppliedPositions,
          signedPermits,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
  });
  describe('migrateNoBorrowWithPermits', () => {
    const assets = ['0x0000000000000000000000000000000000000003'];
    const deadline = 2341;
    const signedPermits = [
      {
        deadline: 1234,
        aToken: '0x0000000000000000000000000000000000000003',
        value: '112300000',
        signedPermit:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      },
    ];
    it('Expects to work with correct params', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      const mNoBorrowsPermit = instance.migrateNoBorrowWithPermits({
        user,
        assets,
        deadline,
        signedPermits,
      });

      const txObj = mNoBorrowsPermit[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address',
          'address[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(user);
      expect(decoded[1]).toEqual(assets);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fails when user not address', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const user = 'asdf';
      await expect(async () =>
        instance.migrateNoBorrowWithPermits({
          user,
          assets,
          deadline,
          signedPermits,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
  });
});

import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  transactionType,
} from '../commons/types';
import { DEFAULT_NULL_VALUE_ON_TX } from '../commons/utils';
import { Pool } from '../v3-pool-contract';
import { IMigrationHelper } from './typechain/IMigrationHelper';
import { IMigrationHelper__factory } from './typechain/IMigrationHelper__factory';
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
  describe('migrate', () => {
    const supplyAssets = [
      {
        aToken: '0x0000000000000000000000000000000000000003',
        underlyingAsset: '0x0000000000000000000000000000000000000004',
        deadline: 123,
        amount: '123400000000',
      },
    ];
    const repayAssetsStable = [
      {
        debtToken: '0x0000000000000000000000000000000000000003',
        rateMode: InterestRate.Stable,
        underlyingAsset: '0x0000000000000000000000000000000000000004',
        deadline: 123,
        amount: '123400000000',
      },
    ];
    const repayAssetsVariable = [
      {
        debtToken: '0x0000000000000000000000000000000000000003',
        rateMode: InterestRate.Variable,
        underlyingAsset: '0x0000000000000000000000000000000000000004',
        deadline: 123,
        amount: '123400000000',
      },
    ];
    const signedSupplyPermits = [
      {
        deadline: 1234,
        aToken: '0x0000000000000000000000000000000000000003',
        value: '112300000',
        signedPermit:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      },
    ];
    const signedCreditDelegationPermits = [
      {
        deadline: 1234,
        debtToken: '0x0000000000000000000000000000000000000003',
        value: '112300000',
        signedPermit:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      },
    ];
    const creditDelegationApprovals = [
      {
        debtTokenAddress: '0x0000000000000000000000000000000000000003',
        amount: '13451',
      },
    ];
    it('Exepects to work with params no sig no approvals and variable', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));
      const isApprovedDelegationSpy = jest
        .spyOn(instance.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const migrateTxs = await instance.migrate({
        user,
        supplyAssets,
        repayAssets: repayAssetsVariable,
        signedSupplyPermits: [],
        signedCreditDelegationPermits: [],
        creditDelegationApprovals,
      });
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isApprovedDelegationSpy).toHaveBeenCalled();

      expect(migrateTxs.length).toEqual(1);

      const txObj = migrateTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address[]',
          '(address,uint256)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded.length).toEqual(4);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Exepects to work with params no sig no approvals and stable', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const isApprovedDelegationSpy = jest
        .spyOn(instance.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementationOnce(async () => Promise.resolve(true));

      const migrateTxs = await instance.migrate({
        user,
        supplyAssets,
        repayAssets: repayAssetsStable,
        signedSupplyPermits: [],
        signedCreditDelegationPermits: [],
        creditDelegationApprovals,
      });
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isApprovedDelegationSpy).toHaveBeenCalled();

      expect(migrateTxs.length).toEqual(1);

      const txObj = migrateTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address[]',
          '(address,uint256)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded.length).toEqual(4);
      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with params no sig and approvals', async () => {
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
      const isApprovedDelegationSpy = jest
        .spyOn(instance.baseDebtTokenService, 'isDelegationApproved')
        .mockImplementationOnce(async () => Promise.resolve(false));
      const approveDelegationSpy = jest
        .spyOn(instance.baseDebtTokenService, 'approveDelegation')
        .mockReturnValueOnce({
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: async () => ({}),
          gas: async () => ({
            gasLimit: '1',
            gasPrice: '1',
          }),
        });

      const migrateTxs = await instance.migrate({
        user,
        supplyAssets,
        repayAssets: repayAssetsStable,
        signedSupplyPermits: [],
        signedCreditDelegationPermits: [],
        creditDelegationApprovals,
      });

      expect(approveSpy).toHaveBeenCalled();
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isApprovedDelegationSpy).toHaveBeenCalled();
      expect(approveDelegationSpy).toHaveBeenCalled();

      expect(migrateTxs.length).toEqual(3);

      const txObj = migrateTxs[2];

      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address[]',
          '(address,uint256)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded.length).toEqual(4);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('700000');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to work with params and sig', async () => {
      const instance = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );
      const migrateTxs = await instance.migrate({
        user,
        supplyAssets,
        repayAssets: repayAssetsStable,
        signedSupplyPermits,
        signedCreditDelegationPermits,
        creditDelegationApprovals,
      });

      const txObj = migrateTxs[0];
      expect(txObj.txType).toEqual(eEthereumTxType.V3_MIGRATION_ACTION);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(MIGRATOR_ADDRESS);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      const decoded = utils.defaultAbiCoder.decode(
        [
          'address[]',
          '(address,uint256)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
          '(address,uint256,uint256,uint256,bytes32,bytes32)[]',
        ],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded.length).toEqual(4);

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when user not eth address', async () => {
      const spy = jest
        .spyOn(IMigrationHelper__factory, 'connect')
        .mockReturnValue({
          getMigrationSupply: async () =>
            Promise.resolve(['sdasd', BigNumber.from('1111')]),
        } as unknown as IMigrationHelper);

      const migrationHelper = new V3MigrationHelperService(
        provider,
        MIGRATOR_ADDRESS,
        pool,
      );

      await migrationHelper.getMigrationSupply({
        asset: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        amount: '1',
      });
      expect(spy).toBeCalled();
    });
  });
});

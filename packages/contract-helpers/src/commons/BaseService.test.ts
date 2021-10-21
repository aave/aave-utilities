import { Provider } from '@ethersproject/providers';
import { BigNumber, Contract, providers, Signer } from 'ethers';
import BaseService from './BaseService';
import { eEthereumTxType, ProtocolAction } from './types';
import { DEFAULT_NULL_VALUE_ON_TX } from './utils';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Test__factory {
  static connect(address: string, signerOrProvider: Signer | Provider) {
    return new Contract(address, [], signerOrProvider);
  }
}

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('BaseService', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  describe('Initialize', () => {
    it('Expects to initialize the class correctly', () => {
      expect(() => new BaseService(provider, Test__factory)).not.toThrow();
    });
  });
  describe('getContractInstance', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to initalize new instance', () => {
      const spy = jest.spyOn(Test__factory, 'connect');

      const baseService = new BaseService(provider, Test__factory);
      const address = '0x0000000000000000000000000000000000000001';
      const instance = baseService.getContractInstance(address);

      expect(instance instanceof Contract).toEqual(true);

      expect(spy).toHaveBeenCalled();
    });
    it('Expects to use an already initialized instance', () => {
      const spy = jest.spyOn(Test__factory, 'connect');

      const baseService = new BaseService(provider, Test__factory);
      const address = '0x0000000000000000000000000000000000000001';
      const instance = baseService.getContractInstance(address);
      const instance2 = baseService.getContractInstance(address);

      expect(instance instanceof Contract).toEqual(true);
      expect(instance2).toEqual(instance);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('generateTxCallback', () => {
    const baseService = new BaseService(provider, Test__factory);
    const from = '0x0000000000000000000000000000000000000001';
    const value = '1';
    const gasSurplus = 10;
    const action = ProtocolAction.deposit;
    const rawTxMethod = async () => ({});

    it('Expects a tx object with specified value', async () => {
      const txCallback = baseService.generateTxCallback({
        rawTxMethod,
        from,
        value,
        gasSurplus,
      });
      const tx = await txCallback();
      expect(tx.from).toEqual(from);
      expect(tx.value).toEqual(value);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
    });
    it('Expects a tx object with default value', async () => {
      const txCallback = baseService.generateTxCallback({
        rawTxMethod,
        from,
      });
      const tx = await txCallback();
      expect(tx.from).toEqual(from);
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));
    });
    it('Expects a tx object with recomended gas limit', async () => {
      const txCallback = baseService.generateTxCallback({
        rawTxMethod,
        from,
        action,
      });
      const tx = await txCallback();
      expect(tx.from).toEqual(from);
      expect(tx.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);
      expect(tx.gasLimit).toEqual(BigNumber.from(300000));
    });
  });
  describe('generateTxPriceEstimation', () => {
    const baseService = new BaseService(provider, Test__factory);
    const action = ProtocolAction.deposit;
    const txCallback = async () => ({
      gasLimit: BigNumber.from(1),
      gasPrice: BigNumber.from(2),
    });
    // const txs = [
    //   {
    //     txType: eEthereumTxType.DLP_ACTION,
    //     tx: txCallback,
    //     gas: async () => null,
    //   },
    // ];
    it('Expects to get gasPrice when pending approvals', async () => {
      const txs = [
        {
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: txCallback,
          gas: async () => null,
        },
        {
          txType: eEthereumTxType.DLP_ACTION,
          tx: txCallback,
          gas: async () => null,
        },
      ];
      const gasObj = baseService.generateTxPriceEstimation(
        txs,
        txCallback,
        action,
      );
      const gas = await gasObj();
      expect(gas?.gasLimit).toEqual('300000');
      expect(gas?.gasPrice).toEqual('1');
    });
    it('Expects to get gasPrice when no pending txs', async () => {
      const txs = [
        {
          txType: eEthereumTxType.DLP_ACTION,
          tx: txCallback,
          gas: async () => null,
        },
      ];
      const gasObj = baseService.generateTxPriceEstimation(
        txs,
        txCallback,
        action,
      );
      const gas = await gasObj();
      expect(gas?.gasLimit).toEqual('1');
      expect(gas?.gasPrice).toEqual('2');
    });
    it('Expects to get gasPrice when no pending txs and no gas price passed', async () => {
      const txCallback = async () => ({
        gasLimit: BigNumber.from(1),
      });
      const txs = [
        {
          txType: eEthereumTxType.DLP_ACTION,
          tx: txCallback,
          gas: async () => null,
        },
      ];
      const gasObj = baseService.generateTxPriceEstimation(
        txs,
        txCallback,
        action,
      );
      const gas = await gasObj();
      expect(gas?.gasLimit).toEqual('1');
      expect(gas?.gasPrice).toEqual('1');
    });
    it('Expects to get gasPrice when forcing', async () => {
      const txs = [
        {
          txType: eEthereumTxType.ERC20_APPROVAL,
          tx: txCallback,
          gas: async () => null,
        },
        {
          txType: eEthereumTxType.DLP_ACTION,
          tx: txCallback,
          gas: async () => null,
        },
      ];
      const gasObj = baseService.generateTxPriceEstimation(
        txs,
        txCallback,
        action,
      );
      const gas = await gasObj(true);
      expect(gas?.gasLimit).toEqual('1');
      expect(gas?.gasPrice).toEqual('2');
    });
    it('Expects null when no gas limit', async () => {
      const txCallback = async () => ({});
      const txs = [
        {
          txType: eEthereumTxType.DLP_ACTION,
          tx: txCallback,
          gas: async () => null,
        },
      ];
      const gasObj = baseService.generateTxPriceEstimation(
        txs,
        txCallback,
        action,
      );
      const gas = await gasObj();
      expect(gas).toEqual(null);
    });
  });
});

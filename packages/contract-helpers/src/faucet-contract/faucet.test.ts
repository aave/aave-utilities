import { BigNumber, providers, utils } from 'ethers';
import { eEthereumTxType, transactionType } from '../commons/types';
import {
  DEFAULT_NULL_VALUE_ON_TX,
  mintAmountsPerToken,
  valueToWei,
} from '../commons/utils';
import { FaucetService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('FaucetService', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const faucetAddress = '0x0000000000000000000000000000000000000001';

  describe('Initialization', () => {
    it('Expects to initialize with all params', () => {
      const instance = new FaucetService(provider, faucetAddress);
      expect(instance instanceof FaucetService).toEqual(true);
    });
    it('Expects to initialize without address', () => {
      const instance = new FaucetService(provider);
      expect(instance instanceof FaucetService).toEqual(true);
    });
  });
  describe('mint', () => {
    const userAddress = '0x0000000000000000000000000000000000000002';
    const reserve = '0x0000000000000000000000000000000000000003';
    const tokenSymbol = 'DAI';

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object if all params', async () => {
      const instance = new FaucetService(provider, faucetAddress);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj.length).toEqual(1);
      expect(faucetTxObj[0].txType).toEqual(eEthereumTxType.FAUCET_MINT);

      const txObj: transactionType = await faucetTxObj[0].tx();
      expect(txObj.to).toEqual(faucetAddress);
      expect(txObj.from).toEqual(userAddress);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(
        BigNumber.from(mintAmountsPerToken[tokenSymbol]),
      );

      // gas price
      const gasPrice = await faucetTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to get default mint amount if token doesn`t exist', async () => {
      const tokenSymbol = 'asdf';
      const instance = new FaucetService(provider, faucetAddress);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj.length).toEqual(1);
      expect(faucetTxObj[0].txType).toEqual(eEthereumTxType.FAUCET_MINT);

      const txObj: transactionType = await faucetTxObj[0].tx();
      expect(txObj.to).toEqual(faucetAddress);
      expect(txObj.from).toEqual(userAddress);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(BigNumber.from(valueToWei('1000', 18)));

      // gas price
      const gasPrice = await faucetTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail if faucet address not passed', () => {
      const instance = new FaucetService(provider);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj).toEqual([]);
    });
    it('Expects to fail if userAddress not eth address', () => {
      const userAddress = 'asdf';
      const instance = new FaucetService(provider, faucetAddress);
      expect(() =>
        instance.mint({ userAddress, reserve, tokenSymbol }),
      ).toThrowError(`Address: ${userAddress} is not a valid ethereum Address`);
    });
    it('Expects to fail if reserve not eth address', () => {
      const reserve = 'asdf';
      const instance = new FaucetService(provider, faucetAddress);
      expect(() =>
        instance.mint({ userAddress, reserve, tokenSymbol }),
      ).toThrowError(`Address: ${reserve} is not a valid ethereum Address`);
    });
  });
});

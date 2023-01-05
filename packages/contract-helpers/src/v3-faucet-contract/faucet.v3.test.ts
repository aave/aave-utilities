import { BigNumber, providers, utils } from 'ethers';
import { eEthereumTxType, transactionType } from '../commons/types';
import {
  DEFAULT_NULL_VALUE_ON_TX,
  mintAmountsPerToken,
  valueToWei,
} from '../commons/utils';
import { IERC20FaucetOwnable } from './typechain/IERC20FaucetOwnable';
import { IERC20FaucetOwnable__factory } from './typechain/IERC20FaucetOwnable__factory';
import { V3FaucetService } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('V3FaucetService', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const faucetAddress = '0x0000000000000000000000000000000000000001';

  describe('Initialization', () => {
    it('Expects to initialize with all params', () => {
      const instance = new V3FaucetService(provider, faucetAddress);
      expect(instance instanceof V3FaucetService).toEqual(true);
    });
    it('Expects to initialize without address', () => {
      const instance = new V3FaucetService(provider);
      expect(instance instanceof V3FaucetService).toEqual(true);
    });
  });
  describe('mint', () => {
    const userAddress = '0x0000000000000000000000000000000000000002';
    const reserve = '0x0000000000000000000000000000000000000003';
    const owner = '0x0000000000000000000000000000000000000004';
    const tokenSymbol = 'DAI';

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects the tx object if all  required params', async () => {
      const instance = new V3FaucetService(provider, faucetAddress);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj.length).toEqual(1);
      expect(faucetTxObj[0].txType).toEqual(eEthereumTxType.FAUCET_V2_MINT);

      const txObj: transactionType = await faucetTxObj[0].tx();
      expect(txObj.to).toEqual(faucetAddress);
      expect(txObj.from).toEqual(userAddress);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(userAddress);
      expect(decoded[2]).toEqual(
        BigNumber.from(mintAmountsPerToken[tokenSymbol]),
      );

      // gas price
      const gasPrice = await faucetTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects the tx object if all params and optional params', async () => {
      const instance = new V3FaucetService(provider, faucetAddress);
      const faucetTxObj = instance.mint({
        userAddress,
        reserve,
        tokenSymbol,
        owner,
      });

      expect(faucetTxObj.length).toEqual(1);
      expect(faucetTxObj[0].txType).toEqual(eEthereumTxType.FAUCET_V2_MINT);

      const txObj: transactionType = await faucetTxObj[0].tx();
      expect(txObj.to).toEqual(faucetAddress);
      expect(txObj.from).toEqual(owner);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(userAddress);
      expect(decoded[2]).toEqual(
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
      const instance = new V3FaucetService(provider, faucetAddress);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj.length).toEqual(1);
      expect(faucetTxObj[0].txType).toEqual(eEthereumTxType.FAUCET_V2_MINT);

      const txObj: transactionType = await faucetTxObj[0].tx();
      expect(txObj.to).toEqual(faucetAddress);
      expect(txObj.from).toEqual(userAddress);
      expect(txObj.gasLimit).toEqual(BigNumber.from(1));
      expect(txObj.value).toEqual(DEFAULT_NULL_VALUE_ON_TX);

      // parse data
      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'address', 'uint256'],
        utils.hexDataSlice(txObj.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(userAddress);
      expect(decoded[2]).toEqual(BigNumber.from(valueToWei('1000', 18)));

      // gas price
      const gasPrice = await faucetTxObj[0].gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail if faucet address not passed', () => {
      const instance = new V3FaucetService(provider);
      const faucetTxObj = instance.mint({ userAddress, reserve, tokenSymbol });

      expect(faucetTxObj).toEqual([]);
    });
    it('Expects to fail if userAddress not eth address', () => {
      const userAddress = 'asdf';
      const instance = new V3FaucetService(provider, faucetAddress);
      expect(() =>
        instance.mint({ userAddress, reserve, tokenSymbol }),
      ).toThrowError(`Address: ${userAddress} is not a valid ethereum Address`);
    });
    it('Expects to fail if reserve not eth address', () => {
      const reserve = 'asdf';
      const instance = new V3FaucetService(provider, faucetAddress);
      expect(() =>
        instance.mint({ userAddress, reserve, tokenSymbol }),
      ).toThrowError(`Address: ${reserve} is not a valid ethereum Address`);
    });
  });
  describe('isPermissioned', () => {
    it('Call to isPermissioned', async () => {
      const instance = new V3FaucetService(provider, faucetAddress);

      const spy = jest
        .spyOn(IERC20FaucetOwnable__factory, 'connect')
        .mockReturnValue({
          isPermissioned: async () => Promise.resolve(true),
        } as unknown as IERC20FaucetOwnable);

      const value = await instance.isPermissioned();

      expect(value).toEqual(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});

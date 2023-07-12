import { BigNumber } from 'ethers';
import { transactionType } from './types';
import {
  API_ETH_MOCK_ADDRESS,
  canBeEnsAddress,
  decimalsToCurrencyUnits,
  DEFAULT_NULL_VALUE_ON_TX,
  valueToWei,
  getTxValue,
  augustusToAmountOffsetFromCalldata,
  convertPopulatedTx,
} from './utils';

describe('Utils', () => {
  describe('getTxValue', () => {
    it('Expects to get amount', () => {
      const txValue = getTxValue('0x0123', '123');
      expect(txValue).toEqual(DEFAULT_NULL_VALUE_ON_TX);
    });
    it('Expects to get default', () => {
      const amount = '123';
      const txValue = getTxValue(API_ETH_MOCK_ADDRESS, amount);
      expect(txValue).toEqual(amount);
    });
  });

  describe('canBeEnsAddress', () => {
    it('Expects to be ens address', () => {
      const isEns = canBeEnsAddress('0x0asdf');
      expect(isEns).toEqual(false);
    });
    it('Expects not to be ens address', () => {
      const isEns = canBeEnsAddress('0x0asdf.eth');
      expect(isEns).toEqual(true);
    });
  });

  describe('decimalsToCurrencyUnits', () => {
    it('Expects the value to be in currency units', () => {
      const value = decimalsToCurrencyUnits('1000000', 6);
      expect(value).toEqual('1');
    });
    it('Expects the value to be in currency units to fixed', () => {
      const value = decimalsToCurrencyUnits('1000000123', 6);
      expect(value).toEqual('1000.000123');
    });
  });

  describe('valueToWei', () => {
    it('Expects the value to be in wei decimals', () => {
      const value = valueToWei('1', 6);
      expect(value).toEqual('1000000');
    });
    it('Expects the value to be in wei decimals and fixed 0', () => {
      const value = valueToWei('123.123541241123', 6);
      expect(value).toEqual('123123541');
    });
  });
  describe('augustusToAmountOffsetFromCalldata', () => {
    it('Expects 36', () => {
      const offset = augustusToAmountOffsetFromCalldata('0x935fb84b');
      expect(offset).toEqual(36);
    });
    it('Expects 100', () => {
      const offset = augustusToAmountOffsetFromCalldata('0xc03786b0');
      expect(offset).toEqual(100);
    });
    it('Expects 68', () => {
      const offset = augustusToAmountOffsetFromCalldata('0xb2f1e6db');
      expect(offset).toEqual(68);
    });
    it('Expects 164', () => {
      const offset = augustusToAmountOffsetFromCalldata('0xb66bcbac');
      expect(offset).toEqual(164);
    });
    it('Expects 68', () => {
      const offset = augustusToAmountOffsetFromCalldata('0x87a63926');
      expect(offset).toEqual(68);
    });
    it('Expects Error', () => {
      expect(() => augustusToAmountOffsetFromCalldata('asdf')).toThrowError(
        `Unrecognized function selector for Augustus`,
      );
    });
  });

  describe('convertPopulatedTxData', () => {
    it('Converts tx', () => {
      const tx: transactionType = { to: 'a', from: 'b', data: 'c', value: '1' };
      const convertedTx = convertPopulatedTx(tx);

      expect(convertedTx.to).toEqual('a');
      expect(convertedTx.from).toEqual('b');
      expect(convertedTx.data).toEqual('c');
      expect(convertedTx.value).toEqual(BigNumber.from('1'));
    });
    it('Converts tx with null tx value', () => {
      const tx: transactionType = { to: 'a', from: 'b', data: 'c' };
      const convertedTx = convertPopulatedTx(tx);

      expect(convertedTx.to).toEqual('a');
      expect(convertedTx.from).toEqual('b');
      expect(convertedTx.data).toEqual('c');
      expect(convertedTx.value).toEqual(BigNumber.from('0'));
    });
  });
});

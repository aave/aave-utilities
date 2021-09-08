import BigNumber from 'bignumber.js';
import { normalize, normalizeBN, valueToBigNumber } from './';

describe('BigNumber tests', () => {
  describe('valueToBigNumber', () => {
    it('should turn value to big number', () => {
      expect(valueToBigNumber('1923.232323')).toBeInstanceOf(BigNumber);
    });
  });

  describe('normalize', () => {
    it('should return 0.0000000000000001', () => {
      expect(normalize(100, 18)).toEqual('0.0000000000000001');
    });

    it('should return 0.001', () => {
      expect(normalize(1, 3)).toEqual('0.001');
    });

    it('should return 123.23243422', () => {
      expect(normalize('12323243422', 8)).toEqual('123.23243422');
    });

    it('should return 0.0004', () => {
      expect(normalize(new BigNumber('4'), 4)).toEqual('0.0004');
    });
  });

  describe('normalizeBN', () => {
    it('should return 0.0000000000000001', () => {
      const result = normalizeBN(100, 18);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toFixed()).toEqual('0.0000000000000001');
    });

    it('should return 0.001', () => {
      const result = normalizeBN(1, 3);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toFixed()).toEqual('0.001');
    });

    it('should return 123.23243422', () => {
      const result = normalizeBN('12323243422', 8);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toFixed()).toEqual('123.23243422');
    });

    it('should return 0.0004', () => {
      const result = normalizeBN(new BigNumber('4'), 4);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toFixed()).toEqual('0.0004');
    });
  });
});

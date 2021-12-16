import BigNumber from 'bignumber.js';
import { calculateReserveDebt } from './calculate-reserve-debt';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks';

describe('calculateReserveDebt', () => {
  describe('WMATIC', () => {
    it('should calculate reserve debt', () => {
      const result = calculateReserveDebt(
        formatReserveRequestWMATIC.reserve,
        formatReserveRequestWMATIC.currentTimestamp,
      );

      expect(result).toEqual({
        totalDebt: new BigNumber('30186360792775159242526245'),
        totalStableDebt: new BigNumber('0'),
        totalVariableDebt: new BigNumber('30186360792775159242526245'),
      });
    });
  });

  describe('DAI', () => {
    it('should calculate reserve debt', () => {
      const result = calculateReserveDebt(
        formatReserveRequestDAI.reserve,
        formatReserveRequestWMATIC.currentTimestamp,
      );

      expect(result).toEqual({
        totalDebt: new BigNumber('104546724902523987620455'),
        totalStableDebt: new BigNumber('500764298282678588'),
        totalVariableDebt: new BigNumber('104546224138225704941867'),
      });
    });
  });
});

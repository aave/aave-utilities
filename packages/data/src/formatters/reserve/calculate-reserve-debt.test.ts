import BigNumber from 'bignumber.js';
import { ReserveMock } from '../../mocks';
import { calculateReserveDebt } from './calculate-reserve-debt';

describe('calculateReserveDebt', () => {
  it('should calculate reserve debt when there is non', () => {
    const reserve = new ReserveMock();
    const result = calculateReserveDebt(
      reserve.reserve,
      reserve.reserve.lastUpdateTimestamp,
    );

    expect(result).toEqual({
      totalDebt: new BigNumber('0'),
      totalLiquidity: new BigNumber('0'),
      totalStableDebt: new BigNumber('0'),
      totalVariableDebt: new BigNumber('0'),
    });
  });

  it('should calculate reserve debt', () => {
    const reserve = new ReserveMock()
      .addLiquidity(100)
      .addVariableDebt(100)
      .addStableDebt(100);
    const result = calculateReserveDebt(
      reserve.reserve,
      reserve.reserve.lastUpdateTimestamp,
    );

    expect(result).toEqual({
      totalDebt: new BigNumber('200000000000000000000'),
      totalLiquidity: new BigNumber('300000000000000000000'),
      totalStableDebt: new BigNumber('100000000000000000000'),
      totalVariableDebt: new BigNumber('100000000000000000000'),
    });
  });
});

import BigNumber from 'bignumber.js';
import * as calculateReserveInstance from './calculate-reserve-debt';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks';
import { formatReserve, FormatReserveRequest, formatReserveUSD } from './index';

describe('formatReserve', () => {
  describe('WMATIC', () => {
    const request: FormatReserveRequest = formatReserveRequestWMATIC;

    it('should return the correct response', () => {
      const result = formatReserve(request);
      expect(result).toMatchSnapshot();
    });

    it('should increase over time', () => {
      const first = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      const second = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  describe('DAI', () => {
    const request: FormatReserveRequest = formatReserveRequestDAI;

    it('should return the correct response', () => {
      const result = formatReserve(request);
      expect(result).toMatchSnapshot();
    });

    it('should increase over time', () => {
      const first = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      const second = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  it('should return utilizationRate 0 when totalLiquidity == 0', () => {
    const request: FormatReserveRequest = formatReserveRequestWMATIC;
    request.reserve = {
      ...request.reserve,
      availableLiquidity: '0',
    };

    jest
      .spyOn(calculateReserveInstance, 'calculateReserveDebt')
      .mockImplementation(() => {
        return {
          totalDebt: new BigNumber('0'),
          totalVariableDebt: new BigNumber('0'),
          totalStableDebt: new BigNumber('0'),
        };
      });

    const result = formatReserve(request);
    expect(result.utilizationRate).toEqual('0');
  });

  it('should calculate usd values', () => {
    const reserve = formatReserveUSD({
      reserve: {
        ...formatReserveRequestDAI.reserve,
        priceInMarketReferenceCurrency: '323337881619534',
      },
      currentTimestamp: formatReserveRequestDAI.currentTimestamp,
      marketReferencePriceInUsd: '291464715827',
      marketReferenceCurrencyDecimals: 18,
    });

    expect(reserve).toMatchSnapshot();
  });
});

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
      expect(result).toEqual({
        availableLiquidity: '150629528.254290021063240208',
        baseLTVasCollateral: '0.5',
        liquidityIndex: '1.00920114827430421106',
        supplyAPY: '0.00575828130257027055',
        supplyAPR: '0.00574176577170011131',
        reserveFactor: '0.2',
        reserveLiquidationBonus: '0.1',
        reserveLiquidationThreshold: '0.65',
        stableBorrowAPY: '0.10266878586756504545',
        stableBorrowAPR: '0.09773341053008235974',
        totalDebt: '30186360.792775159242526245',
        totalLiquidity: '180815889.047065180305766453',
        totalPrincipalStableDebt: '0',
        totalScaledVariableDebt: '40102377.650818088556713088',
        totalStableDebt: '0',
        totalVariableDebt: '30186360.792775159242526245',
        utilizationRate: '0.16694528866828649738',
        variableBorrowIndex: '1.02739968325035004938',
        variableBorrowAPY: '0.03397788428671542517',
        variableBorrowAPR: '0.03341338737105765182',
      });
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
      expect(result).toEqual({
        availableLiquidity: '43133.641118657852003256',
        baseLTVasCollateral: '0.75',
        liquidityIndex: '1.00016444737961059057',
        supplyAPY: '0.02713790431950061223',
        supplyAPR: '0.02677620073531209306',
        reserveFactor: '0.1',
        reserveLiquidationBonus: '0.05',
        reserveLiquidationThreshold: '0.8',
        stableBorrowAPY: '0.11547951583122878182',
        stableBorrowAPR: '0.10928437169401419784',
        totalDebt: '104546.724902523987620455',
        totalLiquidity: '147680.366021181839623711',
        totalPrincipalStableDebt: '1',
        totalScaledVariableDebt: '145496.831599325217573288',
        totalStableDebt: '0.500764298282678588',
        totalVariableDebt: '104546.224138225704941867',
        utilizationRate: '0.7079256892383976026',
        variableBorrowIndex: '1.00023285443371120965',
        variableBorrowAPY: '0.03932217240517564451',
        variableBorrowAPR: '0.03856874338802839568',
      });
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
      marketRefPriceInUsd: '291464715827',
      marketRefCurrencyDecimals: 18,
    });

    expect(reserve.totalLiquidity).toBe('43133.641118657852003256');
    expect(reserve.totalLiquidityUSD).toBe('40649.82653321450505835335');
  });
});

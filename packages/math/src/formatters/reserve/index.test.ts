import BigNumber from 'bignumber.js';
import { FormatReserveRequest, formatReserves } from './index';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks';

describe('formatReserves', () => {
  afterEach(() => {
    // Clear spys each test can then test what it needs to without context of other tests
    jest.clearAllMocks();
  });

  describe('WMATIC', () => {
    let request: FormatReserveRequest;

    beforeEach(() => {
      // Clone it
      request = JSON.parse(JSON.stringify(formatReserveRequestWMATIC));
    });

    it('should return the correct response', () => {
      const result = formatReserves(request);
      expect(result).toEqual({
        availableLiquidity: '150629528254290021063240208',
        baseLTVasCollateral: '0.5',
        depositIncentivesAPY: '0.00000000000000000004',
        liquidityIndex: '1.00920114827430421106',
        liquidityRate: '0.00574176577170011131',
        price: { priceInEth: '0.00049803565744206' },
        reserveFactor: '0.2',
        reserveLiquidationBonus: '11000',
        reserveLiquidationThreshold: '0.65',
        stableBorrowRate: '0.09773341053008235974',
        stableDebtIncentivesAPY: '0',
        totalDebt: '0',
        totalLiquidity: '150629528254290021063240208',
        totalPrincipalStableDebt: '0',
        totalScaledVariableDebt: '40102377.650818088556713088',
        totalStableDebt: '30186360.792775159242526245',
        totalVariableDebt: '30186360.792775159242526245',
        utilizationRate: '0',
        variableBorrowIndex: '1.02739968325035004938',
        variableBorrowRate: '0.03341338737105765182',
        variableDebtIncentivesAPY: '0.00000000000000000002',
      });
    });

    it('should increase over time', () => {
      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1;
      const first = formatReserves(request);

      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1;
      const second = formatReserves(request);

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  describe('DAI', () => {
    let request: FormatReserveRequest;

    beforeEach(() => {
      // Clone it
      request = JSON.parse(JSON.stringify(formatReserveRequestDAI));
    });

    it('should return the correct response', () => {
      const result = formatReserves(request);
      expect(result).toEqual({
        availableLiquidity: '43133641118657852003256',
        baseLTVasCollateral: '0.75',
        depositIncentivesAPY: '0',
        liquidityIndex: '1.00016444737961059057',
        liquidityRate: '0.02677620073531209306',
        price: { priceInEth: '0.00163405' },
        reserveFactor: '0.1',
        reserveLiquidationBonus: '10500',
        reserveLiquidationThreshold: '0.8',
        stableBorrowRate: '0.10928437169401419784',
        stableDebtIncentivesAPY: '0',
        totalDebt: '1001528596565357176',
        totalLiquidity: '43134642647254417360432',
        totalPrincipalStableDebt: '1',
        totalScaledVariableDebt: '145496.831599325217573288',
        totalStableDebt: '104546.224138225704941867',
        totalVariableDebt: '104546.224138225704941867',
        utilizationRate: '0',
        variableBorrowIndex: '1.00023285443371120965',
        variableBorrowRate: '0.03856874338802839568',
        variableDebtIncentivesAPY: '0',
      });
    });

    it('should increase over time', () => {
      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1;
      const first = formatReserves(request);

      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1;
      const second = formatReserves(request);

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  it('should return utilizationRate 0 when totalLiquidity == 0', () => {
    const request: FormatReserveRequest = JSON.parse(
      JSON.stringify(formatReserveRequestWMATIC),
    );
    request.reserve.availableLiquidity = '0';

    const result = formatReserves(request);
    expect(result.utilizationRate).toEqual('0');
  });
});

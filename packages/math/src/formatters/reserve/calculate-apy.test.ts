import BigNumber from 'bignumber.js';
import { CalculateAPYRequest, calculateAPYs } from './calculate-apy';
import * as calculateIncentivesAPY from './calculate-incentives-apy';
import { formatReserveRequestWMATIC } from './reserve.mocks';

describe('calculateAPYs', () => {
  afterEach(() => {
    // Clear spys each test can then test what it needs to without context of other tests
    jest.clearAllMocks();
  });

  let request: CalculateAPYRequest;

  beforeEach(() => {
    const formatReserveRequest = JSON.parse(
      JSON.stringify(formatReserveRequestWMATIC),
    );
    // Reset back to good request
    request = {
      emissionEndTimestamp: formatReserveRequest.emissionEndTimestamp,
      currentTimestamp: formatReserveRequest.currentTimestamp,
      depositIncentivesEmissionPerSecond:
        formatReserveRequest.reserve.depositIncentivesEmissionPerSecond,
      stableDebtIncentivesEmissionPerSecond:
        formatReserveRequest.reserve.stableDebtIncentivesEmissionPerSecond,
      variableDebtIncentivesEmissionPerSecond:
        formatReserveRequest.reserve.variableDebtIncentivesEmissionPerSecond,
      totalLiquidity: new BigNumber('150629528254290021063240208'),
      rewardTokenPriceEth: formatReserveRequest.rewardTokenPriceEth,
      priceInEth: formatReserveRequest.reserve.price.priceInEth,
      totalVariableDebt: new BigNumber('29694984770103338741527703152408139'),
      totalStableDebt: new BigNumber(0),
    };
  });

  it('should call calculateIncentivesAPY 3 times if all incentives match the criteria', () => {
    request.totalStableDebt = new BigNumber('150629528254290021063240208');
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should call calculateIncentivesAPY 2 times if totalLiquidity is 0', () => {
    request.totalStableDebt = new BigNumber('150629528254290021063240208');
    request.totalLiquidity = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call calculateIncentivesAPY 2 times if totalVariableDebt is 0', () => {
    request.totalStableDebt = new BigNumber('150629528254290021063240208');
    request.totalVariableDebt = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call calculateIncentivesAPY 2 times if totalStableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call calculateIncentivesAPY 1 times if totalLiquidity and totalStableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call calculateIncentivesAPY 1 times if totalLiquidity and totalVariableDebt is 0', () => {
    request.totalStableDebt = new BigNumber('150629528254290021063240208');
    request.totalVariableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call calculateIncentivesAPY 1 times if totalStableDebt and totalVariableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    request.totalVariableDebt = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call calculateIncentivesAPY 0 times if totalStableDebt, totalLiquidity and totalVariableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    request.totalVariableDebt = new BigNumber(0);
    const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
    calculateAPYs(request);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe('stableDebtIncentives', () => {
    it('should call calculateIncentivesAPY with correct data', () => {
      request.totalStableDebt = new BigNumber('150629528254290021063240208');
      request.totalLiquidity = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.stableDebtIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalStableDebt,
      });
    });

    it('should call calculateIncentivesAPY with `rewardTokenPriceEth` 0 if no `rewardTokenPriceEth` defined', () => {
      request.totalStableDebt = new BigNumber('150629528254290021063240208');
      request.totalLiquidity = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.rewardTokenPriceEth = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.stableDebtIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: '0',
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalStableDebt,
      });
    });

    it('should not call calculateIncentivesAPY when emissionEndTimestamp is undefined', () => {
      request.totalStableDebt = new BigNumber('150629528254290021063240208');
      request.totalLiquidity = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should not call calculateIncentivesAPY if emissionEndTimestamp is not higher then current timestamp', () => {
      request.totalStableDebt = new BigNumber('150629528254290021063240208');
      request.totalLiquidity = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = Date.now();
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call calculateIncentivesAPY if emissionEndTimestamp is higher then current timestamp by over 1 second', () => {
      request.totalStableDebt = new BigNumber('150629528254290021063240208');
      request.totalLiquidity = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = Date.now() + 1000;
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('variableDebtIncentives', () => {
    it('should call calculateIncentivesAPY with correct data', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalLiquidity = new BigNumber(0);
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.variableDebtIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalVariableDebt,
      });
    });

    it('should call calculateIncentivesAPY with `rewardTokenPriceEth` 0 if no `rewardTokenPriceEth` defined', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalLiquidity = new BigNumber(0);
      request.rewardTokenPriceEth = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.variableDebtIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: '0',
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalVariableDebt,
      });
    });

    it('should not call calculateIncentivesAPY when emissionEndTimestamp is undefined', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalLiquidity = new BigNumber(0);
      request.emissionEndTimestamp = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should not call calculateIncentivesAPY if emissionEndTimestamp is not higher then current timestamp', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalLiquidity = new BigNumber(0);
      request.emissionEndTimestamp = Date.now();
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call calculateIncentivesAPY if emissionEndTimestamp is higher then current timestamp by over 1 second', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalLiquidity = new BigNumber(0);
      request.emissionEndTimestamp = Date.now() + 1000;
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('depositIncentives', () => {
    it('should call calculateIncentivesAPY with correct data', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.depositIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: request.rewardTokenPriceEth,
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalLiquidity,
      });
    });

    it('should call calculateIncentivesAPY with `rewardTokenPriceEth` 0 if no `rewardTokenPriceEth` defined', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.rewardTokenPriceEth = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        emissionPerSecond: request.depositIncentivesEmissionPerSecond,
        rewardTokenPriceInEth: '0',
        tokenPriceInEth: request.priceInEth,
        tokenTotalSupply: request.totalLiquidity,
      });
    });

    it('should not call calculateIncentivesAPY when emissionEndTimestamp is undefined', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = undefined;
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should not call calculateIncentivesAPY if emissionEndTimestamp is not higher then current timestamp', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = Date.now();
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call calculateIncentivesAPY if emissionEndTimestamp is higher then current timestamp by over 1 second', () => {
      request.totalStableDebt = new BigNumber(0);
      request.totalVariableDebt = new BigNumber(0);
      request.emissionEndTimestamp = Date.now() + 1000;
      request.currentTimestamp = Date.now();
      const spy = jest.spyOn(calculateIncentivesAPY, 'calculateIncentivesAPY');
      calculateAPYs(request);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

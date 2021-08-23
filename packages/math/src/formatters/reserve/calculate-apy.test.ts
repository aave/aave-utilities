import BigNumber from 'bignumber.js';
import { CalculateAPYRequest, calculateAPYs } from './calculate-apy';
import { formatReserveRequestDAI } from './reserve.mocks';

describe('calculateAPYs', () => {
  afterEach(() => {
    // Clear spys each test can then test what it needs to without context of other tests
    jest.clearAllMocks();
  });

  let request: CalculateAPYRequest;

  beforeEach(() => {
    const formatReserveRequest = JSON.parse(
      JSON.stringify(formatReserveRequestDAI),
    );
    // Reset back to good request
    request = {
      emissionEndTimestamp: Date.now(),
      currentTimestamp: formatReserveRequest.currentTimestamp,
      depositIncentivesEmissionPerSecond: '136893333333333000',
      variableDebtIncentivesEmissionPerSecond: '136893333333333000',
      stableDebtIncentivesEmissionPerSecond: '136893333333333000',
      totalLiquidity: new BigNumber('150629528254290021063240208'),
      rewardTokenPriceEth: formatReserveRequest.rewardTokenPriceEth,
      priceInEth: formatReserveRequest.reserve.price.priceInEth,
      totalVariableDebt: new BigNumber('150629528254290021063240208'),
      totalStableDebt: new BigNumber('150629528254290021063240208'),
    };
  });

  it('should return the correct response', () => {
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalLiquidity is 0', () => {
    request.totalLiquidity = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalVariableDebt is 0', () => {
    request.totalVariableDebt = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalStableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalLiquidity and totalStableDebt is 0', () => {
    request.totalStableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalLiquidity and totalVariableDebt is 0', () => {
    request.totalVariableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalVariableDebt and totalStableDebt is 0', () => {
    request.totalVariableDebt = new BigNumber(0);
    request.totalStableDebt = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalVariableDebt, totalLiquidity and totalStableDebt is 0', () => {
    request.totalVariableDebt = new BigNumber(0);
    request.totalLiquidity = new BigNumber(0);
    request.totalStableDebt = new BigNumber(0);
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if rewardTokenPriceEth is undefined', () => {
    request.rewardTokenPriceEth = undefined;
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response when emissionEndTimestamp is undefined', () => {
    request.emissionEndTimestamp = undefined;
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response when emissionEndTimestamp is not higher then current timestamp', () => {
    request.emissionEndTimestamp = Date.now();
    request.currentTimestamp = Date.now();
    const result = calculateAPYs(request);
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response emissionEndTimestamp is higher then current timestamp by over 1 second', () => {
    request.emissionEndTimestamp = Date.now() + 1000;
    request.currentTimestamp = Date.now();
    const result = calculateAPYs(request);

    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response emissionEndTimestamp is higher then Math.floor(Date.now() / 1000)', () => {
    request.emissionEndTimestamp = Date.now() + 1000;
    request.currentTimestamp = undefined;
    const result = calculateAPYs(request);

    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });
});

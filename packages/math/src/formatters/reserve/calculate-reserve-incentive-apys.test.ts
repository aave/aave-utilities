import BigNumber from 'bignumber.js';
import { calculateReserveIncentiveAPYs } from './calculate-reserve-incentive-apys';
import { formatReserveRequestDAI } from './reserve.mocks';

const now = 1629744090;

const request = {
  emissionEndTimestamp: now,
  currentTimestamp: formatReserveRequestDAI.currentTimestamp,
  depositIncentivesEmissionPerSecond: '136893333333333000',
  variableDebtIncentivesEmissionPerSecond: '136893333333333000',
  stableDebtIncentivesEmissionPerSecond: '136893333333333000',
  totalLiquidity: new BigNumber('150629528254290021063240208'),
  rewardTokenPriceEth: formatReserveRequestDAI.rewardTokenPriceEth,
  priceInEth: formatReserveRequestDAI.reserve.price.priceInEth,
  totalVariableDebt: new BigNumber('150629528254290021063240208'),
  totalStableDebt: new BigNumber('150629528254290021063240208'),
};

describe('calculateReserveIncentiveAPYs', () => {
  it('should return the correct response', () => {
    const result = calculateReserveIncentiveAPYs(request);
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
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalLiquidity: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalVariableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalVariableDebt: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalStableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalStableDebt: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalLiquidity and totalStableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalStableDebt: new BigNumber(0),
      totalLiquidity: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalLiquidity and totalVariableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalVariableDebt: new BigNumber(0),
      totalLiquidity: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
  });

  it('should return the correct response if totalVariableDebt and totalStableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalVariableDebt: new BigNumber(0),
      totalStableDebt: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual(
      '0.00000000000000000001',
    );
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if totalVariableDebt, totalLiquidity and totalStableDebt is 0', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      totalVariableDebt: new BigNumber(0),
      totalLiquidity: new BigNumber(0),
      totalStableDebt: new BigNumber(0),
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response if rewardTokenPriceEth is undefined', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      rewardTokenPriceEth: undefined,
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response when emissionEndTimestamp is undefined', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      emissionEndTimestamp: undefined,
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response when emissionEndTimestamp is not higher then current timestamp', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      emissionEndTimestamp: now,
      currentTimestamp: now,
    });
    expect(result.depositIncentives.toFixed()).toEqual('0');
    expect(result.variableDebtIncentives.toFixed()).toEqual('0');
    expect(result.stableDebtIncentives.toFixed()).toEqual('0');
  });

  it('should return the correct response emissionEndTimestamp is higher then current timestamp by over 1 second', () => {
    const result = calculateReserveIncentiveAPYs({
      ...request,
      emissionEndTimestamp: now + 1,
      currentTimestamp: now,
    });

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

  it('should return the correct response emissionEndTimestamp is higher then Math.floor(now / 1000)', () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => now);
    const result = calculateReserveIncentiveAPYs({
      ...request,
      emissionEndTimestamp: now + 1,
      currentTimestamp: undefined,
    });

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

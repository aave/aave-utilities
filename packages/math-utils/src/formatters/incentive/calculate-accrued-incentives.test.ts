import BigNumber from 'bignumber.js';
import { normalize, valueToZDBigNumber } from '../../bignumber';
import { calculateSupplies, SuppliesRequest } from '../user/calculate-supplies';
import {
  calculateAccruedIncentives,
  CalculateAccruedIncentivesRequest,
} from './calculate-accrued-incentives';

describe('calculateAccruedIncentives', () => {
  const reserveSuppliesInput: SuppliesRequest = {
    reserve: {
      totalScaledVariableDebt: '4790920796601146',
      variableBorrowIndex: '1070766170735867540788710974',
      variableBorrowRate: '56235456575090775514594900',
      totalPrincipalStableDebt: '47382324949680',
      averageStableRate: '106672256721053059345703064',
      availableLiquidity: '558016083020512',
      stableDebtLastUpdateTimestamp: 1629942075,
      lastUpdateTimestamp: 1629942075,
    },
    currentTimestamp: 1629942075,
  };
  const { totalLiquidity, totalVariableDebt, totalStableDebt } =
    calculateSupplies(reserveSuppliesInput);

  const depositRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber('2441092440'),
    reserveIndex: valueToZDBigNumber('14677148010356546110472348'),
    userIndex: valueToZDBigNumber('8399742855606485876888576'),
    precision: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: valueToZDBigNumber('4629629629629629'),
    totalSupply: totalLiquidity,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  const variableDebtRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber('52314205'),
    reserveIndex: valueToZDBigNumber('19667478596034441389278095'),
    userIndex: valueToZDBigNumber('0'),
    precision: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: valueToZDBigNumber('4629629629629629'),
    totalSupply: totalVariableDebt,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  const stableDebtRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber('0'),
    reserveIndex: valueToZDBigNumber('0'),
    userIndex: valueToZDBigNumber('0'),
    precision: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: valueToZDBigNumber('0'),
    totalSupply: totalStableDebt,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  it('should calculate the correct deposit rewards', () => {
    const result = calculateAccruedIncentives(depositRewardsRequest);
    expect(normalize(result, 18)).toBe('0.01532402971873275309');
  });
  it('should calculate the correct variable debt rewards', () => {
    const result = calculateAccruedIncentives(variableDebtRewardsRequest);
    expect(normalize(result, 18)).toBe('0.0010288957777515011');
  });
  it('should calculate the correct stable debt rewards', () => {
    const result = calculateAccruedIncentives(stableDebtRewardsRequest);
    expect(normalize(result, 18)).toBe('0');
  });
  it('should default to reserveIndex if rewards emission is 0', () => {
    const result = calculateAccruedIncentives({
      ...stableDebtRewardsRequest,
      emissionEndTimestamp: 1,
    });
    expect(normalize(result, 18)).toBe(
      normalize(stableDebtRewardsRequest.reserveIndex, 18),
    );
  });
});

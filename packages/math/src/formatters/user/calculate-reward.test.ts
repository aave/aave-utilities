import { valueToBigNumber } from '../../bignumber';
import { calculateReward, CalculateRewardRequest } from './calculate-reward';
import { calculateSupplies, SuppliesRequest } from './calculate-supplies';

describe('calculateReward', () => {
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
  const { totalLiquidity } = calculateSupplies(reserveSuppliesInput);

  const depositRewardsRequest: CalculateRewardRequest = {
    principalUserBalance: valueToBigNumber('2441.09244'),
    reserveIndex: '14677148010356546110472348',
    userIndex: '8399742855606485876888576',
    precision: 18,
    rewardTokenDecimals: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: '4629629629629629',
    totalSupply: totalLiquidity,
    currentTimestamp: 1629942229,
  };

  it('should calculate the correct deposit rewards', () => {
    const result = calculateReward(depositRewardsRequest);
    expect(result.toFixed()).toBe('0.015324027748186104');
  });
});

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
  const {
    totalLiquidity,
    totalVariableDebt,
    totalStableDebt,
  } = calculateSupplies(reserveSuppliesInput);

  const depositRewardsRequest: CalculateRewardRequest = {
    principalUserBalance: '2441092440',
    reserveIndex: '14677148010356546110472348',
    userIndex: '8399742855606485876888576',
    precision: 18,
    rewardTokenDecimals: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: '4629629629629629',
    totalSupply: totalLiquidity,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  const variableDebtRewardsRequest: CalculateRewardRequest = {
    principalUserBalance: '52314205',
    reserveIndex: '19667478596034441389278095',
    userIndex: '0',
    precision: 18,
    rewardTokenDecimals: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: '4629629629629629',
    totalSupply: totalVariableDebt,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  const stableDebtRewardsRequest: CalculateRewardRequest = {
    principalUserBalance: '0',
    reserveIndex: '0',
    userIndex: '0',
    precision: 18,
    rewardTokenDecimals: 18,
    reserveIndexTimestamp: 1629942075,
    emissionPerSecond: '0',
    totalSupply: totalStableDebt,
    currentTimestamp: 1629942229,
    emissionEndTimestamp: 1637573428,
  };

  it('should calculate the correct deposit rewards', () => {
    const result = calculateReward(depositRewardsRequest);
    expect(result).toBe('0.01532402971873275309');
  });
  it('should calculate the correct variable debt rewards', () => {
    const result = calculateReward(variableDebtRewardsRequest);
    expect(result).toBe('0.0010288957777515011');
  });
  it('should calculate the correct stable debt rewards', () => {
    const result = calculateReward(stableDebtRewardsRequest);
    expect(result).toBe('0');
  });
  it('should default to reserveIndex if rewards emission', () => {
    const result = calculateReward({
      ...stableDebtRewardsRequest,
      emissionEndTimestamp: 1,
    });
    expect(result).toBe(stableDebtRewardsRequest.reserveIndex);
  });
});

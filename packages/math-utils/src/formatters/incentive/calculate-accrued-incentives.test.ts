import BigNumber from 'bignumber.js';
import { normalize } from '../../bignumber';
import {
  ReserveIncentiveMock,
  ReserveMock,
  UserIncentiveMock,
  UserReserveMock,
} from '../../mocks';

import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import {
  calculateAccruedIncentives,
  CalculateAccruedIncentivesRequest,
} from './calculate-accrued-incentives';

describe('calculateAccruedIncentives', () => {
  const reserveMock = new ReserveMock()
    .addLiquidity(100)
    .addVariableDebt(200)
    .addStableDebt(300);
  const userMock = new UserReserveMock()
    .supply(100)
    .variableBorrow(200)
    .stableBorrow(300);
  const reserveIncentiveMock = new ReserveIncentiveMock();
  const userIncentiveMock = new UserIncentiveMock();
  const currentTimestamp = 1;

  const { totalLiquidity, totalVariableDebt, totalStableDebt } =
    calculateReserveDebt(reserveMock.reserve, currentTimestamp);

  const depositRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber(
      userMock.userReserve.scaledATokenBalance,
    ),
    reserveIndex: new BigNumber(
      reserveIncentiveMock.reserveIncentive.aIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userIncentiveMock.userIncentive.aTokenIncentivesUserData.userRewardsInformation[0].tokenIncentivesUserIndex,
    ),
    precision: 18,
    reserveIndexTimestamp:
      reserveIncentiveMock.reserveIncentive.aIncentiveData
        .rewardsTokenInformation[0].incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentiveMock.reserveIncentive.aIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: totalLiquidity,
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentiveMock.reserveIncentive.aIncentiveData
        .rewardsTokenInformation[0].emissionEndTimestamp,
  };

  const variableDebtRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber(
      userMock.userReserve.scaledVariableDebt,
    ),
    reserveIndex: new BigNumber(
      reserveIncentiveMock.reserveIncentive.vIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userIncentiveMock.userIncentive.vTokenIncentivesUserData.userRewardsInformation[0].tokenIncentivesUserIndex,
    ),
    precision: 18,
    reserveIndexTimestamp:
      reserveIncentiveMock.reserveIncentive.vIncentiveData
        .rewardsTokenInformation[0].incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentiveMock.reserveIncentive.vIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: totalVariableDebt,
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentiveMock.reserveIncentive.vIncentiveData
        .rewardsTokenInformation[0].emissionEndTimestamp,
  };

  const stableDebtRewardsRequest: CalculateAccruedIncentivesRequest = {
    principalUserBalance: new BigNumber(
      userMock.userReserve.principalStableDebt,
    ),
    reserveIndex: new BigNumber(
      reserveIncentiveMock.reserveIncentive.sIncentiveData.rewardsTokenInformation[0].tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userIncentiveMock.userIncentive.sTokenIncentivesUserData.userRewardsInformation[0].tokenIncentivesUserIndex,
    ),
    precision: 18,
    reserveIndexTimestamp:
      reserveIncentiveMock.reserveIncentive.sIncentiveData
        .rewardsTokenInformation[0].incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentiveMock.reserveIncentive.sIncentiveData.rewardsTokenInformation[0].emissionPerSecond,
    ),
    totalSupply: totalStableDebt,
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentiveMock.reserveIncentive.sIncentiveData
        .rewardsTokenInformation[0].emissionEndTimestamp,
  };

  it('should calculate the correct deposit rewards', () => {
    const result = calculateAccruedIncentives(depositRewardsRequest);
    expect(normalize(result, 18)).toBe('100000000000');
  });
  it('should calculate the correct deposit rewards when running ahead', () => {
    const result = calculateAccruedIncentives(depositRewardsRequest);
    expect(normalize(result, 18)).toBe('100000000000');
  });
  it('should calculate the correct variable debt rewards', () => {
    const result = calculateAccruedIncentives(variableDebtRewardsRequest);
    expect(normalize(result, 18)).toBe('200000000000');
  });
  it('should calculate the correct stable debt rewards', () => {
    const result = calculateAccruedIncentives(stableDebtRewardsRequest);
    expect(normalize(result, 18)).toBe('0');
  });
  it('should default to reserveIndex if rewards emission is 0', () => {
    const result = calculateAccruedIncentives({
      ...stableDebtRewardsRequest,
    });
    expect(normalize(result, 18)).toBe(
      normalize(stableDebtRewardsRequest.reserveIndex, 18),
    );
  });

  it('should calculate zero rewards if totalSupply is 0', () => {
    const zeroSupplyRequest: CalculateAccruedIncentivesRequest = {
      ...stableDebtRewardsRequest,
      totalSupply: new BigNumber('0'),
    };
    const result = calculateAccruedIncentives(zeroSupplyRequest);
    expect(normalize(result, 18)).toBe('0');
  });

  it('should use emissionPerSecond and compute zero rewards', () => {
    const zeroSupplyRequest: CalculateAccruedIncentivesRequest = {
      ...stableDebtRewardsRequest,
      reserveIndexTimestamp: -1,
      currentTimestamp: 100,
    };
    const result = calculateAccruedIncentives(zeroSupplyRequest);
    expect(normalize(result, 18)).toBe('0');
  });
});

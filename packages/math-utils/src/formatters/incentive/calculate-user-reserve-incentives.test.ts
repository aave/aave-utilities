import { normalize } from '../../bignumber';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesRequest,
} from './calculate-user-reserve-incentives';
import {
  aETHReserveIncentiveData,
  aETHUserIncentiveData,
  aETHReserveData,
  aETHScaledATokenBalance,
  aETHScaledVariableDebt,
  aETHPrincipalStableDebt,
  aUSDCReserveIncentiveData,
  aUSDCUserIncentiveData,
  aUSDCReserveData,
  aUSDCScaledATokenBalance,
  aUSDCScaledVariableDebt,
  aUSDCPrincipalStableDebt,
  aXSUSHIReserveIncentiveData,
  aXSUSHIUserIncentiveData,
  aXSUSHIReserveData,
  aXSUSHIScaledATokenBalance,
  aXSUSHIScaledVariableDebt,
  aXSUSHIPrincipalStableDebt,
} from './incentive.mocks';

describe('calculateUserReserveIncentives', () => {
  const userETHReserveIncentiveRequest: CalculateUserReserveIncentivesRequest = {
    reserveIncentives: aETHReserveIncentiveData,
    userReserveIncentives: aETHUserIncentiveData,
    reserveData: aETHReserveData,
    scaledATokenBalance: aETHScaledATokenBalance,
    scaledVariableDebt: aETHScaledVariableDebt,
    principalStableDebt: aETHPrincipalStableDebt,
    currentTimestamp: 1631587561,
    precision: 18,
  };

  const userUSDCReserveIncentiveRequest: CalculateUserReserveIncentivesRequest = {
    reserveIncentives: aUSDCReserveIncentiveData,
    userReserveIncentives: aUSDCUserIncentiveData,
    reserveData: aUSDCReserveData,
    scaledATokenBalance: aUSDCScaledATokenBalance,
    scaledVariableDebt: aUSDCScaledVariableDebt,
    principalStableDebt: aUSDCPrincipalStableDebt,
    currentTimestamp: 1631587561,
    precision: 18,
  };

  const userXSUSHIReserveIncentiveRequest: CalculateUserReserveIncentivesRequest = {
    reserveIncentives: aXSUSHIReserveIncentiveData,
    userReserveIncentives: aXSUSHIUserIncentiveData,
    reserveData: aXSUSHIReserveData,
    scaledATokenBalance: aXSUSHIScaledATokenBalance,
    scaledVariableDebt: aXSUSHIScaledVariableDebt,
    principalStableDebt: aXSUSHIPrincipalStableDebt,
    currentTimestamp: 1631587561,
    precision: 18,
  };

  it('should calculate the correct aWETH incentives', () => {
    const result = calculateUserReserveIncentives(
      userETHReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.0024573774222823641');
    expect(normalize(result.vIncentives, 18)).toBe('0');
    expect(normalize(result.sIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.0024573774222823641');
  });

  it('should calculate the correct aUSDC incentives', () => {
    const result = calculateUserReserveIncentives(
      userUSDCReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.01782456619264825433');
    expect(normalize(result.vIncentives, 18)).toBe('0.00103772579426512737');
    expect(result.sIncentives.toFixed()).toBe('0');
    expect(normalize(total, 18)).toBe('0.0188622919869133817');
  });

  it('should calculate the correct xSushi incentives', () => {
    const result = calculateUserReserveIncentives(
      userXSUSHIReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.02391587035338956794');
    expect(normalize(result.vIncentives, 18)).toBe('0');
    expect(normalize(result.sIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.02391587035338956794');
  });
});

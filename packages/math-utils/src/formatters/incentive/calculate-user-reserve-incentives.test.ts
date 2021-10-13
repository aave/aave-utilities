import { normalize } from '../../bignumber';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesRequest,
} from './calculate-user-reserve-incentives';
import {
  aETHReserveIncentiveData,
  aETHUserIncentiveData,
  aETHReserve,
  aUSDCReserveIncentiveData,
  aUSDCUserIncentiveData,
  aUSDCReserve,
  aXSUSHIReserveIncentiveData,
  aXSUSHIUserIncentiveData,
  aXSUSHIReserve,
} from './incentive.mocks';

describe('calculateUserReserveIncentives', () => {
  const userETHReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aETHReserveIncentiveData,
      userReserveIncentives: aETHUserIncentiveData,
      userReserveData: aETHReserve,
      currentTimestamp: 1631587561,
    };

  const userUSDCReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aUSDCReserveIncentiveData,
      userReserveIncentives: aUSDCUserIncentiveData,
      userReserveData: aUSDCReserve,
      currentTimestamp: 1631587561,
    };

  const userXSUSHIReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aXSUSHIReserveIncentiveData,
      userReserveIncentives: aXSUSHIUserIncentiveData,
      userReserveData: aXSUSHIReserve,
      currentTimestamp: 1631587561,
    };

  it('should calculate the correct aWETH incentives', () => {
    const result = calculateUserReserveIncentives(
      userETHReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.0024573771825653195');
    expect(normalize(result.vIncentives, 18)).toBe('0');
    expect(normalize(result.sIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.0024573771825653195');
  });

  it('should calculate the correct aUSDC incentives', () => {
    const result = calculateUserReserveIncentives(
      userUSDCReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.01782455862763241642');
    expect(normalize(result.vIncentives, 18)).toBe('0.00103772579426512725');
    expect(result.sIncentives.toFixed()).toBe('0');
    expect(normalize(total, 18)).toBe('0.01886228442189754366');
  });

  it('should calculate the correct xSushi incentives', () => {
    const result = calculateUserReserveIncentives(
      userXSUSHIReserveIncentiveRequest,
    );
    const total = result.aIncentives
      .plus(result.vIncentives)
      .plus(result.sIncentives);
    expect(normalize(result.aIncentives, 18)).toBe('0.02391615196507303165');
    expect(normalize(result.vIncentives, 18)).toBe('0');
    expect(normalize(result.sIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.02391615196507303165');
  });
});

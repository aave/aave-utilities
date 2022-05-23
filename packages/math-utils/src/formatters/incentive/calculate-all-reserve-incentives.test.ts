import { ReserveIncentiveMock, UserReserveMock } from '../../mocks';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import { calculateAllReserveIncentives } from './calculate-all-reserve-incentives';

describe('calculateAllReserveIncentives', () => {
  const reserveIncentiveMock = new ReserveIncentiveMock();
  const userReserveMock = new UserReserveMock()
    .supply(100)
    .variableBorrow(100)
    .stableBorrow(100);

  const { totalLiquidity, totalVariableDebt, totalStableDebt } =
    calculateReserveDebt(userReserveMock.reserve, 1);

  const reserve = {
    ...userReserveMock.reserve,
    totalLiquidity: totalLiquidity.toString(),
    totalVariableDebt: totalVariableDebt.toString(),
    totalStableDebt: totalStableDebt.toString(),
  };
  it('calculates correct incentives data for each reserve asset', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives: [reserveIncentiveMock.reserveIncentive],
      reserves: [reserve],
      marketReferenceCurrencyDecimals: 8,
    });
    expect(
      result['0x0000000000000000000000000000000000000000'].aIncentives[0]
        .incentiveAPR,
    ).toBe('105120');
    expect(
      result['0x0000000000000000000000000000000000000000'].vIncentives[0]
        .incentiveAPR,
    ).toBe('315360');
    expect(
      result['0x0000000000000000000000000000000000000000'].sIncentives[0]
        .incentiveAPR,
    ).toBe('0');
  });

  it('calculate incentives for reserve with distribution ended', () => {
    const rewardDistributionEnd = reserveIncentiveMock.reserveIncentive;
    rewardDistributionEnd.aIncentiveData.rewardsTokenInformation[0].emissionEndTimestamp = 1;
    rewardDistributionEnd.vIncentiveData.rewardsTokenInformation[0].emissionEndTimestamp = 1;
    rewardDistributionEnd.sIncentiveData.rewardsTokenInformation[0].emissionEndTimestamp = 1;
    const result = calculateAllReserveIncentives({
      reserveIncentives: [reserveIncentiveMock.reserveIncentive],
      reserves: [reserve],
      marketReferenceCurrencyDecimals: 8,
    });
    expect(
      result['0x0000000000000000000000000000000000000000'].aIncentives[0]
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x0000000000000000000000000000000000000000'].vIncentives[0]
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x0000000000000000000000000000000000000000'].sIncentives[0]
        .incentiveAPR,
    ).toBe('0');
  });

  it('not add reserveIncentivesDict entry if no reserve is found', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives: [reserveIncentiveMock.reserveIncentive],
      reserves: [],
      marketReferenceCurrencyDecimals: 8,
    });
    expect(result['0x0000000000000000000000000000000000000000']).toBe(
      undefined,
    );
  });
});

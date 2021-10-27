import { calculateAllReserveIncentives } from './calculate-all-reserve-incentives';
import {
  reserveIncentives,
  allIncentivesReservesWithRewardReserve,
  allIncentivesReserves,
} from './incentive.mocks';

describe('calculateAllReserveIncentives', () => {
  it('calculates correct incentives data for each reserve asset', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReservesWithRewardReserve,
    });
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].aIncentives
        .incentiveAPR,
    ).toBe('0.00244612257400076464');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].vIncentives
        .incentiveAPR,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].sIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].aIncentives
        .incentiveAPR,
    ).toBe('0.04137490906677563954');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vIncentives
        .incentiveAPR,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].aIncentives
        .incentiveAPR,
    ).toBe('0.00957231039837386774');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sIncentives
        .incentiveAPR,
    ).toBe('0');
  });

  it('calculates correct incentives with priceFeed from incentives data', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReserves,
    });
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].aIncentives
        .incentiveAPR,
    ).toBe('0.00244612257400076464');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].vIncentives
        .incentiveAPR,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].sIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].aIncentives
        .incentiveAPR,
    ).toBe('0.04137490906677563954');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vIncentives
        .incentiveAPR,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].aIncentives
        .incentiveAPR,
    ).toBe('0.00957231039837386774');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sIncentives
        .incentiveAPR,
    ).toBe('0');
  });

  it('not add reserveIncentivesDict entry if no reserve is found', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: [],
    });
    expect(result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2']).toBe(
      undefined,
    );
  });
});

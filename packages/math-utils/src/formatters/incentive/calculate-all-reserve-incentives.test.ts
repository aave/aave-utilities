import { calculateAllReserveIncentives } from './calculate-all-reserve-incentives';
import {
  reserveIncentives,
  allIncentivesReservesWithRewardReserve,
  maticReserveIncentives,
  avaxReserveIncentives,
  allIncentivesReserves,
  aMATICReserveIncentiveData,
  aAVAXReserveIncentiveData,
} from './incentive.mocks';

describe('calculateAllReserveIncentives', () => {
  it('calculates correct incentives data for each reserve asset', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReservesWithRewardReserve,
    });
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].aIncentives
        .incentiveAPY,
    ).toBe('0.00246430102947281231');
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].vIncentives
        .incentiveAPY,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].sIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].aIncentives
        .incentiveAPY,
    ).toBe('0.0420759866182279689');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vIncentives
        .incentiveAPY,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].aIncentives
        .incentiveAPY,
    ).toBe('0.00957358991380907344');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sIncentives
        .incentiveAPY,
    ).toBe('0');
  });

  it('calculates correct incentives with priceFeed from incentives data', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReserves,
    });
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].aIncentives
        .incentiveAPY,
    ).toBe('0.00246430102947281231');
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].vIncentives
        .incentiveAPY,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].sIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].aIncentives
        .incentiveAPY,
    ).toBe('0.0420759866182279689');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vIncentives
        .incentiveAPY,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].aIncentives
        .incentiveAPY,
    ).toBe('0.00957358991380907344');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vIncentives
        .incentiveAPY,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sIncentives
        .incentiveAPY,
    ).toBe('0');
  });

  it('calculates correct underlyingAsset and rewardTokenAddress for base assets', () => {
    const maticResult = calculateAllReserveIncentives({
      reserveIncentives: aMATICReserveIncentiveData,
      reserves: maticReserveIncentives,
    });
    const avaxResult = calculateAllReserveIncentives({
      reserveIncentives: aAVAXReserveIncentiveData,
      reserves: avaxReserveIncentives,
    });
    expect(
      maticResult['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].aIncentives
        .rewardTokenAddress,
    ).toBe('0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270');
    expect(
      avaxResult['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].aIncentives
        .rewardTokenAddress,
    ).toBe('0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7');
  });
});

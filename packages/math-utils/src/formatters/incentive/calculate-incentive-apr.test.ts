import { rayDiv } from '../../ray.math';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from '../reserve/reserve.mocks';
import { calculateIncentiveAPR } from './calculate-incentive-apr';

describe('calculateIncentiveAPR', () => {
  describe('inhouse test values', () => {
    it('calculates incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '198333333333333000',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: '1000000003465380422',
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('1214271.25215758975164163271');
    });

    it('calculates incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '22037037037037000',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: '145530711359639107416907',
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0.92708286261063121887');
    });

    it('calculates incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '0',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: '43135641118664782764100',
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '136893333333333000',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: '150629528254290021063240208',
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0.00556406489198376119');
    });
  });

  describe('WMATIC reserve data (was actual data which was on reserve)', () => {
    const calculateReserveDebtResult = calculateReserveDebt(
      formatReserveRequestWMATIC.reserve,
      formatReserveRequestWMATIC.currentTimestamp,
    );

    const totalLiquidity = calculateReserveDebtResult.totalDebt.plus(
      formatReserveRequestWMATIC.reserve.availableLiquidity,
    );

    it('calculates deposit incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '198333333333333000',
        rewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        totalTokenSupply: rayDiv(
          totalLiquidity,
          formatReserveRequestWMATIC.reserve.liquidityIndex,
        ).toString(),
        priceInMarketReferenceCurrency: '498035657442060',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0.03490948667901282833');
    });

    it('calculates variable debt incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '22037037037037000',
        rewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        totalTokenSupply:
          calculateReserveDebtResult.totalVariableDebt.toFixed(),
        priceInMarketReferenceCurrency: '498035657442060',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0.02302231808500517936');
    });

    it('calculates stable debt incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '0',
        rewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        totalTokenSupply: calculateReserveDebtResult.totalStableDebt.toFixed(),
        priceInMarketReferenceCurrency: '498035657442060',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0');
    });
  });

  describe('DAI reserve', () => {
    const calculateReserveDebtResult = calculateReserveDebt(
      formatReserveRequestDAI.reserve,
      formatReserveRequestDAI.currentTimestamp,
    );

    const totalLiquidity = calculateReserveDebtResult.totalDebt.plus(
      formatReserveRequestDAI.reserve.availableLiquidity,
    );

    it('calculates deposit incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '0',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: totalLiquidity.toFixed(),
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates variable debt incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '0',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply:
          calculateReserveDebtResult.totalVariableDebt.toFixed(),
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates stable debt incentives APR', () => {
      const result = calculateIncentiveAPR({
        emissionPerSecond: '0',
        rewardTokenPriceInMarketReferenceCurrency: '317233277449070',
        totalTokenSupply: calculateReserveDebtResult.totalStableDebt.toFixed(),
        priceInMarketReferenceCurrency: '1634050000000000',
        decimals: 18,
        rewardTokenDecimals: 18,
      });

      expect(result).toEqual('0');
    });
  });
});

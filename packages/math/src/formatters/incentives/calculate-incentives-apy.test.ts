import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from '../reserve/reserve.mocks';
import { calculateIncentivesAPY } from './calculate-incentives-apy';

describe('calculateIncentivesAPY', () => {
  describe('inhouse test values', () => {
    it('calculates incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '198333333333333000',
        rewardTokenPriceInEth: '317233277449070',
        total: '1000000003465380422',
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('1214271.25215758975164163271');
    });

    it('calculates incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '22037037037037000',
        rewardTokenPriceInEth: '317233277449070',
        total: '145530711359639107416907',
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('0.92708286261063121887');
    });

    it('calculates incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '0',
        rewardTokenPriceInEth: '317233277449070',
        total: '43135641118664782764100',
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '136893333333333000',
        rewardTokenPriceInEth: '317233277449070',
        total: '150629528254290021063240208',
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
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

    it('calculates deposit incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '198333333333333000',
        rewardTokenPriceInEth: '498035657442060',
        total: totalLiquidity.toFixed(),
        tokenPriceInEth: '498035657442060',
        decimals: 18,
      });

      expect(result).toEqual('0.03459120784662872218');
    });

    it('calculates variable debt incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '22037037037037000',
        rewardTokenPriceInEth: '498035657442060',
        total: calculateReserveDebtResult.totalVariableDebt.toFixed(),
        tokenPriceInEth: '498035657442060',
        decimals: 18,
      });

      expect(result).toEqual('0.02302231808500517936');
    });

    it('calculates stable debt incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '0',
        rewardTokenPriceInEth: '498035657442060',
        total: calculateReserveDebtResult.totalStableDebt.toFixed(),
        tokenPriceInEth: '498035657442060',
        decimals: 18,
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

    it('calculates deposit incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '0',
        rewardTokenPriceInEth: '317233277449070',
        total: totalLiquidity.toFixed(),
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates variable debt incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '0',
        rewardTokenPriceInEth: '317233277449070',
        total: calculateReserveDebtResult.totalVariableDebt.toFixed(),
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('0');
    });

    it('calculates stable debt incentives APY', () => {
      const result = calculateIncentivesAPY({
        emissionPerSecond: '0',
        rewardTokenPriceInEth: '317233277449070',
        total: calculateReserveDebtResult.totalStableDebt.toFixed(),
        tokenPriceInEth: '1634050000000000',
        decimals: 18,
      });

      expect(result).toEqual('0');
    });
  });
});

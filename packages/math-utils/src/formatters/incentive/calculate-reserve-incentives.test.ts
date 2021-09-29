import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import { formatReserveRequestWMATIC } from '../reserve/reserve.mocks';
import { calculateReserveIncentives } from './calculate-reserve-incentives';

describe('calculateReserveIncentives', () => {
  describe('WMATIC reserve data (was actual data which was on reserve)', () => {
    const calculateReserveDebtResult = calculateReserveDebt(
      formatReserveRequestWMATIC.reserve,
      formatReserveRequestWMATIC.currentTimestamp,
    );

    const totalLiquidity = calculateReserveDebtResult.totalDebt.plus(
      formatReserveRequestWMATIC.reserve.availableLiquidity,
    );

    it('calculates correct reserve incentives data', () => {
      const reserveIncentiveData = {
        underlyingAsset: '0x0000000000000000000000000000000000000000',
        aIncentiveData: {
          emissionPerSecond: '198333333333333000',
          incentivesLastUpdateTimestamp: '0',
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: '0',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000001',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
        },
        vIncentiveData: {
          emissionPerSecond: '22037037037037000',
          incentivesLastUpdateTimestamp: '0',
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: '0',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000002',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
        },
        sIncentiveData: {
          emissionPerSecond: '0',
          incentivesLastUpdateTimestamp: '0',
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: '0',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
        },
      };

      const result = calculateReserveIncentives({
        reserveIncentiveData,
        aRewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        vRewardTokenPriceInMarketReferenceCurrency: '500000000000000',
        sRewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        totalLiquidity: totalLiquidity.toString(),
        liquidityIndex: formatReserveRequestWMATIC.reserve.liquidityIndex.toString(),
        totalScaledVariableDebt: calculateReserveDebtResult.totalVariableDebt.toString(),
        totalPrincipalStableDebt: calculateReserveDebtResult.totalStableDebt.toString(),
        decimals: 18,
        tokenPriceInMarketReferenceCurrency: '498035657442060',
      });

      expect(result.aIncentivesData.incentiveAPY).toBe(
        '0.03490948667901282833',
      );
      expect(result.vIncentivesData.incentiveAPY).toBe(
        '0.02311312226442694815',
      );
      expect(result.sIncentivesData.incentiveAPY).toBe('0');
      expect(result.aIncentivesData.rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000001',
      );
      expect(result.vIncentivesData.rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000002',
      );
    });
  });
});

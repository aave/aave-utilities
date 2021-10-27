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
          incentivesLastUpdateTimestamp: 0,
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: 0,
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000001',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        vIncentiveData: {
          emissionPerSecond: '22037037037037000',
          incentivesLastUpdateTimestamp: 0,
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: 0,
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000002',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        sIncentiveData: {
          emissionPerSecond: '0',
          incentivesLastUpdateTimestamp: 0,
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: 0,
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
      };

      const result = calculateReserveIncentives({
        reserveIncentiveData,
        aRewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        vRewardTokenPriceInMarketReferenceCurrency: '500000000000000',
        sRewardTokenPriceInMarketReferenceCurrency: '498035657442060',
        totalLiquidity: totalLiquidity.toString(),
        totalVariableDebt:
          calculateReserveDebtResult.totalVariableDebt.toString(),
        totalStableDebt: calculateReserveDebtResult.totalStableDebt.toString(),
        decimals: 18,
        priceInMarketReferenceCurrency: '498035657442060',
      });

      expect(result.aIncentivesData.incentiveAPR).toBe(
        '0.03459120784662872218',
      );
      expect(result.vIncentivesData.incentiveAPR).toBe(
        '0.02311312226442694815',
      );
      expect(result.sIncentivesData.incentiveAPR).toBe('0');
      expect(result.aIncentivesData.rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000001',
      );
      expect(result.vIncentivesData.rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000002',
      );
    });
  });
  describe('USDC reserve data from client', () => {
    it('calculates correct reserve incentives data', () => {
      const reserveIncentiveUSDC = {
        underlyingAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        aIncentiveData: {
          emissionPerSecond: '4629629629629629',
          incentivesLastUpdateTimestamp: 1632883598,
          tokenIncentivesIndex: '17165951328937142571968723',
          emissionEndTimestamp: 1637573428,
          tokenAddress: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        vIncentiveData: {
          emissionPerSecond: '4629629629629629',
          incentivesLastUpdateTimestamp: 1632883598,
          tokenIncentivesIndex: '22512367540317665709789244',
          emissionEndTimestamp: 1637573428,
          tokenAddress: '0x619beb58998eD2278e08620f97007e1116D5D25b',
          rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        sIncentiveData: {
          emissionPerSecond: '0',
          incentivesLastUpdateTimestamp: 0,
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: 0,
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 0,
          precision: 0,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
      };

      const result = calculateReserveIncentives({
        reserveIncentiveData: reserveIncentiveUSDC,
        aRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        sRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        vRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        totalLiquidity: '4689276757732258',
        totalVariableDebt: '3891257648076622',
        totalStableDebt: '41801112749722',
        priceInMarketReferenceCurrency: '347780307856538',
        decimals: 6,
      });

      expect(result.aIncentivesData.incentiveAPR).toBe(
        '0.00843060621664143574',
      );
      expect(result.vIncentivesData.incentiveAPR).toBe(
        '0.01015955492045879679',
      );
      expect(result.sIncentivesData.incentiveAPR).toBe('0');
    });
  });
  describe('DAI reserve data from client', () => {
    it('calculates correct reserve incentives data', () => {
      const reserveIncentiveDAI = {
        underlyingAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        aIncentiveData: {
          emissionPerSecond: '2314814814814814',
          incentivesLastUpdateTimestamp: 1632885146,
          tokenIncentivesIndex: '19549435160115',
          emissionEndTimestamp: 1637573428,
          tokenAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
          rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        vIncentiveData: {
          emissionPerSecond: '2314814814814814',
          incentivesLastUpdateTimestamp: 1632876638,
          tokenIncentivesIndex: '26895229234375',
          emissionEndTimestamp: 1637573428,
          tokenAddress: '0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d',
          rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
        sIncentiveData: {
          emissionPerSecond: '0',
          incentivesLastUpdateTimestamp: 0,
          tokenIncentivesIndex: '0',
          emissionEndTimestamp: 0,
          tokenAddress: '0x0000000000000000000000000000000000000000',
          rewardTokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardTokenDecimals: 0,
          precision: 0,
          priceFeed: '',
          priceFeedDecimals: 18,
          priceFeedTimestamp: 1,
        },
      };
      const result = calculateReserveIncentives({
        reserveIncentiveData: reserveIncentiveDAI,
        aRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        vRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        sRewardTokenPriceInMarketReferenceCurrency: '94170917437245430',
        totalLiquidity: '1937317748307449835437672174',
        totalVariableDebt: '1440029626743923505023111127',
        totalStableDebt: '9751179387008545009745124',
        priceInMarketReferenceCurrency: '350862937422119',
        decimals: 18,
      });

      expect(result.aIncentivesData.incentiveAPR).toBe(
        '0.01011349605576554151',
      );
      expect(result.vIncentivesData.incentiveAPR).toBe(
        '0.01360600854482013582',
      );
      expect(result.sIncentivesData.incentiveAPR).toBe('0');
    });
  });
});

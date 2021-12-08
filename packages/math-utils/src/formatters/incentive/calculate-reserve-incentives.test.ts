import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import { formatReserveRequestWMATIC } from '../reserve/reserve.mocks';
import { calculateReserveIncentives } from './calculate-reserve-incentives';
import { allIncentivesReservesWithRewardReserve } from './incentive.mocks';
import { ReservesIncentiveDataHumanized } from './types';

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
      const reserveIncentiveData: ReservesIncentiveDataHumanized = {
        underlyingAsset: '0x0000000000000000000000000000000000000000',
        aIncentiveData: {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '198333333333333000',
              incentivesLastUpdateTimestamp: 0,
              tokenIncentivesIndex: '0',
              emissionEndTimestamp: 0,
              rewardTokenAddress: '0x0000000000000000000000000000000000000001',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '498035657442060',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        vIncentiveData: {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '22037037037037000',
              incentivesLastUpdateTimestamp: 0,
              tokenIncentivesIndex: '0',
              emissionEndTimestamp: 0,
              rewardTokenAddress: '0x0000000000000000000000000000000000000002',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '500000000000000',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        sIncentiveData: {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '0',
              incentivesLastUpdateTimestamp: 0,
              tokenIncentivesIndex: '0',
              emissionEndTimestamp: 0,
              rewardTokenAddress: '0x0000000000000000000000000000000000000000',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '498035657442060',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
      };

      const result = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData,
        totalLiquidity: totalLiquidity.toString(),
        totalVariableDebt:
          calculateReserveDebtResult.totalVariableDebt.toString(),
        totalStableDebt: calculateReserveDebtResult.totalStableDebt.toString(),
        decimals: 18,
        priceInMarketReferenceCurrency: '498035657442060',
        marketReferenceCurrencyDecimals: 8,
      });
      expect(result.aIncentivesData[0].incentiveAPR).toBe(
        '0.03459120784662872218',
      );
      expect(result.vIncentivesData[0].incentiveAPR).toBe(
        '0.02311312226442694815',
      );
      expect(result.sIncentivesData[0].incentiveAPR).toBe('0');
      expect(result.aIncentivesData[0].rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000001',
      );
      expect(result.vIncentivesData[0].rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000002',
      );
    });
  });
  describe('USDC reserve data from client', () => {
    it('calculates correct reserve incentives data', () => {
      const reserveIncentiveUSDC: ReservesIncentiveDataHumanized = {
        underlyingAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        aIncentiveData: {
          tokenAddress: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '4629629629629629',
              incentivesLastUpdateTimestamp: 1632883598,
              tokenIncentivesIndex: '17165951328937142571968723',
              emissionEndTimestamp: 1637573428,
              rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '94170917437245430',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        vIncentiveData: {
          tokenAddress: '0x619beb58998eD2278e08620f97007e1116D5D25b',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '4629629629629629',
              incentivesLastUpdateTimestamp: 1632883598,
              tokenIncentivesIndex: '22512367540317665709789244',
              emissionEndTimestamp: 1637573428,
              rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '94170917437245430',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        sIncentiveData: {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '0',
              incentivesLastUpdateTimestamp: 0,
              tokenIncentivesIndex: '0',
              emissionEndTimestamp: 0,
              rewardTokenAddress: '0x0000000000000000000000000000000000000000',
              rewardTokenDecimals: 0,
              precision: 0,
              rewardPriceFeed: '94170917437245430',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
      };

      const result = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData: reserveIncentiveUSDC,
        totalLiquidity: '4689276757732258',
        totalVariableDebt: '3891257648076622',
        totalStableDebt: '41801112749722',
        priceInMarketReferenceCurrency: '347780307856538',
        decimals: 6,
        marketReferenceCurrencyDecimals: 8,
      });

      expect(result.aIncentivesData[0].incentiveAPR).toBe(
        '0.00843060621664143574',
      );
      expect(result.vIncentivesData[0].incentiveAPR).toBe(
        '0.01015955492045879679',
      );
      expect(result.sIncentivesData[0].incentiveAPR).toBe('0');
    });
  });
  describe('DAI reserve data from client', () => {
    it('calculates correct reserve incentives data', () => {
      const reserveIncentiveDAI: ReservesIncentiveDataHumanized = {
        underlyingAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        aIncentiveData: {
          tokenAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '2314814814814814',
              incentivesLastUpdateTimestamp: 1632885146,
              tokenIncentivesIndex: '19549435160115',
              emissionEndTimestamp: 1637573428,
              rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '78530386771994300',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        vIncentiveData: {
          tokenAddress: '0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d',
          incentiveControllerAddress:
            '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '2314814814814814',
              incentivesLastUpdateTimestamp: 1632876638,
              tokenIncentivesIndex: '26895229234375',
              emissionEndTimestamp: 1637573428,
              rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
              rewardTokenDecimals: 18,
              precision: 18,
              rewardPriceFeed: '94170917437245430',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
        sIncentiveData: {
          tokenAddress: '0x0000000000000000000000000000000000000000',
          incentiveControllerAddress:
            '0x0000000000000000000000000000000000000000',
          rewardsTokenInformation: [
            {
              emissionPerSecond: '0',
              incentivesLastUpdateTimestamp: 0,
              tokenIncentivesIndex: '0',
              emissionEndTimestamp: 0,
              rewardTokenAddress: '0x0000000000000000000000000000000000000000',
              rewardTokenDecimals: 0,
              precision: 0,
              rewardPriceFeed: '94170917437245430',
              priceFeedDecimals: 8,
              rewardOracleAddress: '0x0',
              rewardTokenSymbol: 'StkAave',
            },
          ],
        },
      };
      const result = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData: reserveIncentiveDAI,
        totalLiquidity: '1937317748307449835437672174',
        totalVariableDebt: '1440029626743923505023111127',
        totalStableDebt: '9751179387008545009745124',
        priceInMarketReferenceCurrency: '350862937422119',
        decimals: 18,
        marketReferenceCurrencyDecimals: 8,
      });

      const resultWithoutPrice = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData: {
          ...reserveIncentiveDAI,
          aIncentiveData: {
            tokenAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardsTokenInformation: [
              {
                emissionPerSecond: '2314814814814814',
                incentivesLastUpdateTimestamp: 1632885146,
                tokenIncentivesIndex: '19549435160115',
                emissionEndTimestamp: 1637573428,
                rewardTokenAddress:
                  '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
                rewardTokenDecimals: 18,
                precision: 18,
                rewardPriceFeed: '0',
                priceFeedDecimals: 18,
                rewardOracleAddress: '0x0',
                rewardTokenSymbol: 'StkAave',
              },
            ],
          },
        },
        totalLiquidity: '1937317748307449835437672174',
        totalVariableDebt: '1440029626743923505023111127',
        totalStableDebt: '9751179387008545009745124',
        priceInMarketReferenceCurrency: '350862937422119',
        decimals: 18,
        marketReferenceCurrencyDecimals: 8,
      });

      const resultWithFeedDecimalChange = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData: {
          ...reserveIncentiveDAI,
          aIncentiveData: {
            tokenAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardsTokenInformation: [
              {
                emissionPerSecond: '2314814814814814',
                incentivesLastUpdateTimestamp: 1632885146,
                tokenIncentivesIndex: '19549435160115',
                emissionEndTimestamp: 1637573428,
                rewardTokenAddress:
                  '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
                rewardTokenDecimals: 18,
                precision: 18,
                rewardPriceFeed: '785303867719943000000000000',
                priceFeedDecimals: 18,
                rewardOracleAddress: '0x0',
                rewardTokenSymbol: 'StkAave',
              },
            ],
          },
        },
        totalLiquidity: '1937317748307449835437672174',
        totalVariableDebt: '1440029626743923505023111127',
        totalStableDebt: '9751179387008545009745124',
        priceInMarketReferenceCurrency: '350862937422119',
        decimals: 18,
        marketReferenceCurrencyDecimals: 8,
      });

      const resultWithZeroPrice = calculateReserveIncentives({
        reserves: allIncentivesReservesWithRewardReserve,
        reserveIncentiveData: {
          ...reserveIncentiveDAI,
          aIncentiveData: {
            tokenAddress: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardsTokenInformation: [
              {
                emissionPerSecond: '2314814814814814',
                incentivesLastUpdateTimestamp: 1632885146,
                tokenIncentivesIndex: '19549435160115',
                emissionEndTimestamp: 1637573428,
                rewardTokenAddress: '0x0',
                rewardTokenDecimals: 18,
                precision: 18,
                rewardPriceFeed: '0',
                priceFeedDecimals: 18,
                rewardOracleAddress: '0x0',
                rewardTokenSymbol: 'StkAave',
              },
            ],
          },
        },
        totalLiquidity: '1937317748307449835437672174',
        totalVariableDebt: '1440029626743923505023111127',
        totalStableDebt: '9751179387008545009745124',
        priceInMarketReferenceCurrency: '350862937422119',
        decimals: 18,
        marketReferenceCurrencyDecimals: 8,
      });

      expect(result.aIncentivesData[0].incentiveAPR).toBe(
        '0.00843377954139148126',
      );
      expect(resultWithoutPrice.aIncentivesData[0].incentiveAPR).toBe(
        '0.00843377954139148126',
      );
      expect(resultWithFeedDecimalChange.aIncentivesData[0].incentiveAPR).toBe(
        '0.00843377954139148126',
      );
      expect(resultWithZeroPrice.aIncentivesData[0].incentiveAPR).toBe('0');
      expect(result.vIncentivesData[0].incentiveAPR).toBe(
        '0.01360600854482013582',
      );
      expect(result.sIncentivesData[0].incentiveAPR).toBe('0');
    });
  });
});

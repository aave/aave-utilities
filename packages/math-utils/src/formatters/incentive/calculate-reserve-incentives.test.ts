import {
  ReserveIncentiveMock,
  ReserveMock,
  UserReserveMock,
} from '../../mocks';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import { calculateReserveIncentives } from './calculate-reserve-incentives';

describe('calculateReserveIncentives', () => {
  const userReserveMock = new UserReserveMock()
    .supply(100)
    .variableBorrow(50)
    .stableBorrow(50);
  const reserveMock = new ReserveMock()
    .addLiquidity(100)
    .addVariableDebt(50)
    .addStableDebt(50);
  const reserveIncentiveMock = new ReserveIncentiveMock();
  describe('WMATIC reserve data (was actual data which was on reserve)', () => {
    const calculateReserveDebtResult = calculateReserveDebt(
      reserveMock.reserve,
      1,
    );

    const totalLiquidity = calculateReserveDebtResult.totalDebt.plus(
      reserveMock.reserve.availableLiquidity,
    );

    const reserve = {
      ...userReserveMock.reserve,
      totalLiquidity: totalLiquidity.toString(),
    };

    it('calculates correct reserve incentives data', () => {
      const result = calculateReserveIncentives({
        reserves: [reserve],
        reserveIncentiveData: {
          ...reserveIncentiveMock.reserveIncentive,
          sIncentiveData: {
            ...reserveIncentiveMock.reserveIncentive.sIncentiveData,
            rewardsTokenInformation: [
              {
                ...reserveIncentiveMock.reserveIncentive.sIncentiveData
                  .rewardsTokenInformation[0],
                rewardTokenAddress:
                  '0x4da27a545c0c5b758a6ba100e3a049001de870f5', // To check stkAave -> mapping for v2 price feed
              },
            ],
          },
        },
        totalLiquidity: totalLiquidity.toString(),
        totalVariableDebt:
          calculateReserveDebtResult.totalVariableDebt.toString(),
        totalStableDebt: calculateReserveDebtResult.totalStableDebt.toString(),
        decimals: 18,
        priceInMarketReferenceCurrency:
          userReserveMock.reserve.priceInMarketReferenceCurrency,
        marketReferenceCurrencyDecimals: 8,
      });
      expect(result.aIncentivesData[0].incentiveAPR).toBe(
        '0.00000000000015768',
      );
      expect(result.vIncentivesData[0].incentiveAPR).toBe(
        '0.00000000000063072',
      );
      expect(result.sIncentivesData[0].incentiveAPR).toBe('0');
      expect(result.aIncentivesData[0].rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000000',
      );
      expect(result.vIncentivesData[0].rewardTokenAddress).toBe(
        '0x0000000000000000000000000000000000000000',
      );
    });
  });
});

import { ReserveIncentiveMock, UserReserveMock } from '../../mocks';
import { calculateReserveDebt } from '../reserve/calculate-reserve-debt';
import { calculateIncentiveAPR } from './calculate-incentive-apr';

describe('calculateIncentiveAPR', () => {
  const userReserveMock = new UserReserveMock()
    .supply(100)
    .variableBorrow(50)
    .stableBorrow(50);
  const reserveIncentiveMock = new ReserveIncentiveMock();
  it('calculates incentives APR', () => {
    const { totalLiquidity } = calculateReserveDebt(userReserveMock.reserve, 1);
    const result = calculateIncentiveAPR({
      emissionPerSecond:
        reserveIncentiveMock.reserveIncentive.aIncentiveData
          .rewardsTokenInformation[0].emissionPerSecond,
      rewardTokenPriceInMarketReferenceCurrency:
        reserveIncentiveMock.reserveIncentive.aIncentiveData
          .rewardsTokenInformation[0].rewardPriceFeed,
      totalTokenSupply: totalLiquidity.toString(),
      priceInMarketReferenceCurrency:
        userReserveMock.reserve.priceInMarketReferenceCurrency,
      decimals: userReserveMock.reserve.decimals,
      rewardTokenDecimals:
        reserveIncentiveMock.reserveIncentive.aIncentiveData
          .rewardsTokenInformation[0].rewardTokenDecimals,
    });

    expect(result).toEqual('0.000015768');
  });
});

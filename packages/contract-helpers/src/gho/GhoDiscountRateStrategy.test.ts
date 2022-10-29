import { BigNumber, BigNumberish, providers } from 'ethers';
import { GhoDiscountRateService } from './GhoDiscountRateStrategy.service';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

const config = { DISCOUNT_RATE_STRATEGY_ADDRESS: '' };

describe('GhoDiscountRateService', () => {
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  describe('Create new GhoDiscountRateService', () => {
    it('Expects to be initialized correctly', () => {
      const instance = new GhoDiscountRateService(correctProvider, config);
      expect(instance).toBeInstanceOf(GhoDiscountRateService);
    });
  });

  describe('calculateDiscountRate', () => {
    it.skip("calculates the discount rate based off a user's GHO debt token balance and their staked AAVE balance", async () => {
      const contract = new GhoDiscountRateService(correctProvider, config);
      const ghoBalance: BigNumberish = 1 ** 18;
      const stakedAaveBalance: BigNumberish = 100 ** 18;
      const result = await contract.calculateDiscountRate(
        ghoBalance,
        stakedAaveBalance,
      );
      const expected = 1 ** 18;
      expect(result).toEqual(expected);
    });
  });
});

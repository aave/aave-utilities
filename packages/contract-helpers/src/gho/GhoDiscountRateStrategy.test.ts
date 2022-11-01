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

const config = {
  // Deployed on the Goerli network
  DISCOUNT_RATE_STRATEGY_ADDRESS: '0x91A534290666B817D986Ef70089f8Cc5bc241C34',
};

describe('GhoDiscountRateService', () => {
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();
  // Goerli
  // const network = providers.getNetwork(5);
  // const correctProvider: providers.Provider = new providers.JsonRpcProvider(
  //   'https://goerli.optimism.io',
  //   network.chainId,
  // );

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
    const contract = new GhoDiscountRateService(correctProvider, config);
    // const user = '0x0000000000000000000000000000000000000001';

    it("calculates the interest discount rate based off a user's GHO debt token balance and staked AAVE balance", async () => {
      const ghoDebtTokenBalance: BigNumberish = 100;
      const stakedAaveBalance: BigNumberish = 5;
      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );
      const expected = 0.2;
      expect(result).toEqual(expected);
    });
  });
});

import { BigNumber, BigNumberish, providers } from 'ethers';
import { valueToWei } from '../commons/utils';
import { GhoDiscountRateStrategyService } from './GhoDiscountRateStrategyService';

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

// Helper for contract call arguments
const convertToBN = (n: string) => valueToWei(n, 18);

describe('GhoDiscountRateStrategyService', () => {
  // Goerli
  const network = providers.getNetwork(5);
  const correctProvider: providers.Provider =
    new providers.StaticJsonRpcProvider(
      'https://eth-goerli.alchemyapi.io/v2/demo',
      network.chainId,
    );

  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  describe('Create new GhoDiscountRateStrategyService', () => {
    it('Expects to be initialized correctly', () => {
      const instance = new GhoDiscountRateStrategyService(
        correctProvider,
        config,
      );
      expect(instance).toBeInstanceOf(GhoDiscountRateStrategyService);
    });
  });

  describe('calculateDiscountRate', () => {
    const contract = new GhoDiscountRateStrategyService(
      correctProvider,
      config,
    );

    it('should return zero discount if discount token balance does not meet minimum requirements to gain a discount', async () => {
      // Use case - borrowing 100 GHO owning 0 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('100');
      const stakedAaveBalance: BigNumberish = convertToBN('0');
      const expected = BigNumber.from('0'); // 0%

      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      expect(result).toEqual(expected);
    });

    it('should return zero discount if GHO variable debt token balance does not meet minimum requirements to gain a discount', async () => {
      // Use case - borrowing 0 GHO owning 1 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('0');
      const stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('0'); // 0%

      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      expect(result).toEqual(expected);
    });

    // Discounted balance = discount token * 100
    it('should return the maximum discount rate of 20% if the calculated total discounted balance is greater or equal to the debt token balance', async () => {
      // Use case #1 - borrowing 100 GHO owning 1 stkAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('100');
      let stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('2000'); // 20.00% discount

      let result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      expect(result).toEqual(expected);

      // Use case #2 - borrowing 100 GHO owning 5 stkAAVE
      stakedAaveBalance = convertToBN('5');

      result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      expect(result).toEqual(expected);
    });

    it('should return a sub-maximum discount if user borrows more GHO than can be discounted based off of the discount token balance', async () => {
      // Use case - borrowing 150 GHO owning 1 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('150');
      const stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('1333'); // 13.33% discount

      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      expect(result).toEqual(expected);
    });
  });
});

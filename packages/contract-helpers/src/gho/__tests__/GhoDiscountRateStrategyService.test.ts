import { constants, BigNumber, BigNumberish, providers } from 'ethers';
import { valueToWei } from '../../commons/utils';
import { GhoDiscountRateStrategyService } from '../GhoDiscountRateStrategyService';
import { GhoDiscountRateStrategy } from '../typechain/GhoDiscountRateStrategy';
import { GhoDiscountRateStrategy__factory } from '../typechain/GhoDiscountRateStrategy__factory';
import { GhoVariableDebtToken } from '../typechain/GhoVariableDebtToken';
import { GhoVariableDebtToken__factory } from '../typechain/GhoVariableDebtToken__factory';

jest.mock('../../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

// Helper for contract call arguments
const convertToBN = (n: string) => valueToWei(n, 18);

describe('GhoDiscountRateStrategyService', () => {
  const GHO_VARIABLE_DEBT_TOKEN_ADDRESS = constants.AddressZero;
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();

  // Mocking
  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  // Mock the response of GhoVariableDebtToken.getDiscountRateStrategy()
  jest.spyOn(GhoVariableDebtToken__factory, 'connect').mockReturnValue({
    getDiscountRateStrategy: async () => Promise.resolve(constants.AddressZero),
  } as unknown as GhoVariableDebtToken);

  afterEach(() => jest.clearAllMocks());

  describe('Create new GhoDiscountRateStrategyService', () => {
    it('Expects to be initialized correctly', () => {
      // Create instance
      const instance = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Assert it
      expect(instance).toBeInstanceOf(GhoDiscountRateStrategyService);
    });
  });

  describe('getGhoDiscountedPerDiscountToken', () => {
    it('should return the amount of GHO eligible to be discounted per one discount token', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockGhoDiscountedPerDiscountToken = convertToBN('100');

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          GHO_DISCOUNTED_PER_DISCOUNT_TOKEN: async () =>
            Promise.resolve(mockGhoDiscountedPerDiscountToken),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.getGhoDiscountedPerDiscountToken();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockGhoDiscountedPerDiscountToken);
    });
  });

  describe('getGhoDiscountRate', () => {
    it('should return the current maximum discount rate against borrowing GHO, expressed in bps', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockDiscountRate = convertToBN('2000'); // 20.00%

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          DISCOUNT_RATE: async () => Promise.resolve(mockDiscountRate),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.getGhoDiscountRate();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockDiscountRate);
    });
  });

  describe('getGhoMinDiscountTokenBalance', () => {
    it('should return the minimum amount of discount tokens needed to be eligible for a discount', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockMinDiscountTokenBalance = convertToBN('100');

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          MIN_DISCOUNT_TOKEN_BALANCE: async () =>
            Promise.resolve(mockMinDiscountTokenBalance),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.getGhoMinDiscountTokenBalance();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockMinDiscountTokenBalance);
    });
  });

  describe('getGhoMinDebtTokenBalance', () => {
    it('should return the minimum amount of debt tokens needed to be eligible for a discount', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockMinDebtTokenBalance = convertToBN('100');

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          MIN_DEBT_TOKEN_BALANCE: async () =>
            Promise.resolve(mockMinDebtTokenBalance),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.getGhoMinDebtTokenBalance();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockMinDebtTokenBalance);
    });
  });

  describe('calculateDiscountRate', () => {
    it('should return zero discount if discount token balance does not meet minimum requirements to gain a discount', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Use case - borrowing 100 GHO owning 0 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('100');
      const stakedAaveBalance: BigNumberish = convertToBN('0');
      const expected = BigNumber.from('0'); // 0%

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          calculateDiscountRate: async () => Promise.resolve(expected),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should return zero discount if GHO variable debt token balance does not meet minimum requirements to gain a discount', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Use case - borrowing 0 GHO owning 1 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('0');
      const stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('0'); // 0%

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          calculateDiscountRate: async () => Promise.resolve(expected),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });

    // Discounted balance = discount token * 100
    it('should return the maximum discount rate of 20% if the calculated total discounted balance is greater or equal to the debt token balance', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Use case #1 - borrowing 100 GHO owning 1 stkAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('100');
      let stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('2000'); // 20.00% discount

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          calculateDiscountRate: async () => Promise.resolve(expected),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      let result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(expected);

      // Use case #2 - borrowing 100 GHO owning 5 stkAAVE
      stakedAaveBalance = convertToBN('5');

      // Call it
      result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should return a sub-maximum discount if user borrows more GHO than can be discounted based off of the discount token balance', async () => {
      // Create instance
      const contract = new GhoDiscountRateStrategyService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Use case - borrowing 150 GHO owning 1 skAAVE
      const ghoDebtTokenBalance: BigNumberish = convertToBN('150');
      const stakedAaveBalance: BigNumberish = convertToBN('1');
      const expected = BigNumber.from('1333'); // 13.33% discount

      // Mock it
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          calculateDiscountRate: async () => Promise.resolve(expected),
        } as unknown as GhoDiscountRateStrategy);

      // Call it
      const result = await contract.calculateDiscountRate(
        ghoDebtTokenBalance,
        stakedAaveBalance,
      );

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });
  describe('ghoDiscountRateStrategy update on ghoVariableDebtToken contract', () => {
    it('should return discount based on the active strategy on the ghoVariableDebtToken', async () => {
      // Create different mocked return values for the two discount rate strategies when given the same input

      // Constants
      const ghoDiscountRateStrategyOne =
        '0x0000000000000000000000000000000000000001';
      const ghoDiscountRateStrategyTwo =
        '0x0000000000000000000000000000000000000002';
      const ghoDebtTokenBalance: BigNumberish = convertToBN('150');
      const stakedAaveBalance: BigNumberish = convertToBN('1');
      const expectedOne = BigNumber.from('1333'); // 13.33% discount
      const expectedTwo = BigNumber.from('2000'); // 20% discount

      // Mock services
      const ghoDiscountRateStrategyServiceOne = {
        calculateDiscountRate: jest.fn(),
      };
      ghoDiscountRateStrategyServiceOne.calculateDiscountRate.mockReturnValue(
        Promise.resolve(expectedOne),
      );
      const ghoDiscountRateStrategyServiceTwo = {
        calculateDiscountRate: jest.fn(),
      };
      ghoDiscountRateStrategyServiceTwo.calculateDiscountRate.mockReturnValue(
        Promise.resolve(expectedTwo),
      );

      // Create a spy which will conditionally return the service based on the rate strategy address
      const spy = jest
        .spyOn(GhoDiscountRateStrategy__factory, 'connect')
        .mockReturnValue({
          calculateDiscountRate: async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const rateStrategyAddress =
              await mockVariableDebtTokenService.getDiscountRateStrategy();
            if (rateStrategyAddress === ghoDiscountRateStrategyOne) {
              return Promise.resolve(
                ghoDiscountRateStrategyServiceOne.calculateDiscountRate(),
              );
            }

            return Promise.resolve(
              ghoDiscountRateStrategyServiceTwo.calculateDiscountRate(),
            );
          },
        } as unknown as GhoDiscountRateStrategy);

      // Mock a variable debt service to return the first discount rate strategy
      const mockVariableDebtTokenService = {
        getDiscountRateStrategy: jest.fn(),
      };

      jest
        .mocked(mockVariableDebtTokenService)
        .getDiscountRateStrategy.mockResolvedValue(
          Promise.resolve(ghoDiscountRateStrategyOne),
        );

      // Create a discount service which will be spied and trigger calls to ghoVariableDebtToken.getDiscountRateStrategy() -> ghoDiscountRateService.calculateDiscountRate()
      const ghoDiscountRateStrategyServiceThree =
        new GhoDiscountRateStrategyService(
          correctProvider,
          GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
        );

      // Call calculateDiscountRate with the first rate strategy
      const resultOne =
        await ghoDiscountRateStrategyServiceThree.calculateDiscountRate(
          ghoDebtTokenBalance,
          stakedAaveBalance,
        );

      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(resultOne).toEqual(expectedOne);

      // Simulates a ghoDiscountRateStrategy update
      jest
        .mocked(mockVariableDebtTokenService)
        .getDiscountRateStrategy.mockResolvedValue(
          Promise.resolve(ghoDiscountRateStrategyTwo),
        );

      // Call calculateDiscountRate with the updated rate strategy
      const resultTwo =
        await ghoDiscountRateStrategyServiceThree.calculateDiscountRate(
          ghoDebtTokenBalance,
          stakedAaveBalance,
        );

      expect(resultTwo).toEqual(expectedTwo);
    });
  });
});

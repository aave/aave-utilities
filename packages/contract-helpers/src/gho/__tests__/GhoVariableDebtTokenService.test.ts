import { constants, BigNumber, providers } from 'ethers';
import { valueToWei } from '../../commons/utils';
import { GhoVariableDebtTokenService } from '../GhoVariableDebtTokenService';
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

describe('GhoVariableDebtTokenService', () => {
  const GHO_VARIABLE_DEBT_TOKEN_ADDRESS = constants.AddressZero;
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();

  // Mocking
  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  afterEach(() => jest.clearAllMocks());

  describe('Create new GhoVariableDebtTokenService', () => {
    it('Expects to be initialized correctly', () => {
      // Create Instance
      const instance = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Assert it
      expect(instance).toBeInstanceOf(GhoVariableDebtTokenService);
    });
  });

  describe('getDiscountToken', () => {
    it('should return the address of the current discount token', async () => {
      // Create Instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockDiscountTokenAddress = constants.AddressZero;

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getDiscountToken: async () =>
            Promise.resolve(mockDiscountTokenAddress),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getDiscountToken();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockDiscountTokenAddress);
    });
  });

  describe('getDiscountLockPeriod', () => {
    it('should return the current discount percent lock period', async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockDiscountLockPeriod = convertToBN('123456789');

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getDiscountLockPeriod: async () =>
            Promise.resolve(mockDiscountLockPeriod),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getDiscountLockPeriod();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockDiscountLockPeriod);
    });
  });

  describe('getUserDiscountPercent', () => {
    it("should return the user's current discount percentage for their borrowed GHO", async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockUserAddress = constants.AddressZero;
      const mockUserDiscountPercent = convertToBN('2000'); // 20.00%

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getDiscountPercent: async () =>
            Promise.resolve(mockUserDiscountPercent),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getUserDiscountPercent(mockUserAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockUserDiscountPercent);
    });
  });

  describe('getUserRebalanceTimestamp', () => {
    it("should return the timestamp when a user's discount percent can be rebalanced", async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockUserAddress = constants.AddressZero;
      const mockUserRebalanceTimestamp = convertToBN('123456789');

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getUserRebalanceTimestamp: async () =>
            Promise.resolve(mockUserRebalanceTimestamp),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getUserRebalanceTimestamp(mockUserAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockUserRebalanceTimestamp);
    });
  });

  describe('getDiscountRateStrategy', () => {
    it('should return the current discount rate strategy address', async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockDiscountRateStrategy = constants.AddressZero;

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getDiscountRateStrategy: async () =>
            Promise.resolve(mockDiscountRateStrategy),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getDiscountRateStrategy();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockDiscountRateStrategy);
    });
  });

  describe('scaledBalanceOf', () => {
    it('should return the scaled balance of a user', async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockUserAddress = constants.AddressZero;
      const mockScaledBalance = convertToBN('123456789');

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          scaledBalanceOf: async () => Promise.resolve(mockScaledBalance),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.scaledBalanceof(mockUserAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockScaledBalance);
    });
  });

  describe('getPreviousIndex', () => {
    it('should return the previous borrow index of a user', async () => {
      // Create instance
      const contract = new GhoVariableDebtTokenService(
        correctProvider,
        GHO_VARIABLE_DEBT_TOKEN_ADDRESS,
      );

      // Setup
      const mockUserAddress = constants.AddressZero;
      const mockPreviousIndex = convertToBN('123456789');

      // Mock it
      const spy = jest
        .spyOn(GhoVariableDebtToken__factory, 'connect')
        .mockReturnValue({
          getPreviousIndex: async () => Promise.resolve(mockPreviousIndex),
        } as unknown as GhoVariableDebtToken);

      // Call it
      const result = await contract.getPreviousIndex(mockUserAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockPreviousIndex);
    });
  });
});

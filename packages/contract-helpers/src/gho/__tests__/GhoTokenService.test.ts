import { constants, BigNumber, providers } from 'ethers';
import { valueToWei } from '../../commons/utils';
import { GhoTokenService } from '../GhoTokenService';
import { GhoToken } from '../typechain/GhoToken';
import { GhoToken__factory } from '../typechain/GhoToken__factory';
import { IGhoToken } from '../typechain/IGhoToken';

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

describe('GhoTokenService', () => {
  const GHO_TOKEN_ADDRESS = constants.AddressZero;
  const correctProvider: providers.Provider = new providers.JsonRpcProvider();

  // Mocking
  jest
    .spyOn(correctProvider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));

  afterEach(() => jest.clearAllMocks());

  describe('Create new GhoTokenService', () => {
    it('Expects to be initialized correctly', () => {
      // Create Instance
      const instance = new GhoTokenService(correctProvider, GHO_TOKEN_ADDRESS);

      // Assert it
      expect(instance).toBeInstanceOf(GhoTokenService);
    });
  });

  describe('totalSupply', () => {
    it('should return the total supply of GHO tokens', async () => {
      // Create Instance
      const contract = new GhoTokenService(correctProvider, GHO_TOKEN_ADDRESS);

      // Setup
      const mockTotalSupply = convertToBN('10000000'); // 10M

      // Mock it
      const spy = jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
        totalSupply: async () => Promise.resolve(mockTotalSupply),
      } as unknown as GhoToken);

      // Call it
      const result = await contract.totalSupply();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockTotalSupply);
    });
  });

  describe('getFacilitatorsList', () => {
    it('should return the list of facilitators as an array of addresses', async () => {
      // Create instance
      const contract = new GhoTokenService(correctProvider, GHO_TOKEN_ADDRESS);

      // Setup
      const faciliatorAddress1: string = constants.AddressZero;
      const faciliatorAddress2: string = constants.AddressZero;
      const mockFacilitatorsList: string[] = [
        faciliatorAddress1,
        faciliatorAddress2,
      ];

      // Mock it
      const spy = jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
        getFacilitatorsList: async () => Promise.resolve(mockFacilitatorsList),
      } as unknown as GhoToken);

      // Call it
      const result = await contract.getFacilitatorsList();

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockFacilitatorsList);
    });
  });

  describe('getFacilitator', () => {
    it('should return the facilitator instance for the provided facilitator address', async () => {
      // Create instance
      const contract = new GhoTokenService(correctProvider, GHO_TOKEN_ADDRESS);

      // Setup
      const faciliatorAddress: string = constants.AddressZero;
      const mockBucket: IGhoToken.BucketStruct = {
        maxCapacity: convertToBN('1000'),
        level: convertToBN('500'),
      };
      const mockFacilitator: IGhoToken.FacilitatorStruct = {
        bucket: mockBucket,
        label: 'Aave Facilitator',
      };

      // Mock it
      const spy = jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
        getFacilitator: async () => Promise.resolve(mockFacilitator),
      } as unknown as GhoToken);

      // Call it
      const result = await contract.getFacilitator(faciliatorAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockFacilitator);
    });
  });

  describe('getFacilitatorBucket', () => {
    it('should return the bucket instance for the provided facilitator address', async () => {
      // Create instance
      const contract = new GhoTokenService(correctProvider, GHO_TOKEN_ADDRESS);

      // Setup
      const faciliatorAddress: string = constants.AddressZero;
      const mockBucket: IGhoToken.BucketStruct = {
        maxCapacity: convertToBN('1000'),
        level: convertToBN('500'),
      };

      // Mock it
      const spy = jest.spyOn(GhoToken__factory, 'connect').mockReturnValue({
        getFacilitatorBucket: async () => Promise.resolve(mockBucket),
      } as unknown as GhoToken);

      // Call it
      const result = await contract.getFacilitatorBucket(faciliatorAddress);

      // Assert it
      expect(spy).toHaveBeenCalled();
      expect(spy).toBeCalledTimes(1);
      expect(result).toEqual(mockBucket);
    });
  });
});

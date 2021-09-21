import { providers } from 'ethers';
import { UiIncentiveDataProvider } from './index';

describe('UiIncentiveDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiIncentiveDataProvider({
      incentiveDataProviderAddress: mockValidEthereumAddress,
      lendingPoolAddressProvider: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    // @ts-ignore
    instance._contract = {
      getFullReservesIncentiveData: jest.fn(),
      getReservesIncentivesData: jest.fn(),
      getUserReservesIncentivesData: jest.fn(),
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider({
            incentiveDataProviderAddress: mockInvalidEthereumAddress,
            lendingPoolAddressProvider: mockValidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });

    it('should throw an error if the lendingPoolAddress is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider({
            incentiveDataProviderAddress: mockValidEthereumAddress,
            lendingPoolAddressProvider: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('Lending pool address is not valid');
    });
  });

  describe('getAllIncentives', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getAllIncentives(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getAllIncentives(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getReservesIncentives - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getReservesIncentives();
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getUserReserves', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentives(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getUserReservesIncentives(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});

import { providers } from 'ethers';
import { UiIncentiveDataProvider } from './index';

describe('UiIncentiveDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiIncentiveDataProvider(
      mockValidEthereumAddress,
      mockValidEthereumAddress,
      new providers.JsonRpcProvider(),
    );

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
          new UiIncentiveDataProvider(
            mockInvalidEthereumAddress,
            mockValidEthereumAddress,
            new providers.JsonRpcProvider(),
          ),
      ).toThrowError('contract address is not valid');
    });

    it('should throw an error if the lendingPoolAddress is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider(
            mockValidEthereumAddress,
            mockInvalidEthereumAddress,
            new providers.JsonRpcProvider(),
          ),
      ).toThrowError('Lending pool address is not valid');
    });
  });

  describe('getFullReserves', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReserves(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getFullReserves(mockValidEthereumAddress);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getReserves - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getReserves();
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getUserReserves', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReserves(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getUserReserves(mockValidEthereumAddress);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});
import { providers } from 'ethers';
import { UiPoolDataProvider } from './index';

describe('UiPoolDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiPoolDataProvider({
      uiPoolDataProviderAddress: mockValidEthereumAddress,
      lendingPoolAddressProvider: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    // @ts-ignore
    instance._contract = {
      getReservesList: jest.fn(),
      getSimpleReservesData: jest.fn(),
      getUserReservesData: jest.fn(),
      getReservesData: jest.fn(),
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new UiPoolDataProvider({
            uiPoolDataProviderAddress: mockInvalidEthereumAddress,
            lendingPoolAddressProvider: mockValidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });

    it('should throw an error if the lendingPoolAddress is not valid', () => {
      expect(
        () =>
          new UiPoolDataProvider({
            uiPoolDataProviderAddress: mockValidEthereumAddress,
            lendingPoolAddressProvider: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('Lending pool address is not valid');
    });
  });

  describe('getReservesList - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getReservesList();
      } catch (_) {
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
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getUserReservesData', () => {
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
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getAllReserves', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getAllReserves(mockInvalidEthereumAddress),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getAllReserves(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});

import { providers } from 'ethers';
import { getReservesIncentivesDataMock } from './_mocks';
import { UiIncentiveDataProvider } from './index';

describe('UiIncentiveDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiIncentiveDataProvider({
      incentiveDataProviderAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    const mockGetReservesIncentivesData = jest.fn();

    // TODO: more reasonable mock so we can do more reasonable tests
    mockGetReservesIncentivesData.mockResolvedValue(
      getReservesIncentivesDataMock,
    );

    // @ts-ignore
    instance._contract = {
      getFullReservesIncentiveData: jest.fn(),
      getReservesIncentivesData: mockGetReservesIncentivesData,
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
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });

    // it('should throw an error if the lendingPoolAddress is not valid', () => {
    //   expect(
    //     () =>
    //       new UiIncentiveDataProvider({
    //         incentiveDataProviderAddress: mockValidEthereumAddress,
    //         provider: new providers.JsonRpcProvider(),
    //       }),
    //   ).toThrowError('Lending pool address is not valid');
    // });
  });

  describe('getFullReservesIncentiveData', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });

    it('should not throw if user and lending pool address provider is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        );
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getReservesIncentivesData - to get 100% in coverage :( pointless test', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesData(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getReservesIncentivesData(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getReservesIncentivesDataHumanized', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();

      let errored = false;
      try {
        await instance.getReservesIncentivesDataHumanized(
          mockValidEthereumAddress,
        );
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });

  describe('getUserReserves', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        );
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});

import { providers } from 'ethers';
import { reservesMock, userReservesMock } from './_mocks';
import { UiPoolDataProvider } from './index';

describe('UiPoolDataProvider', () => {
  const mockValidEthereumAddress = '0x88757f2f99175387ab4c6a4b3067c77a695b0349';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiPoolDataProvider({
      uiPoolDataProviderAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    const mockGetReservesData = jest.fn();
    const mockGetUserReservesData = jest.fn();

    // TODO: more reasonable mock so we can do more reasonable tests
    mockGetReservesData.mockResolvedValue(reservesMock);
    mockGetUserReservesData.mockResolvedValue(userReservesMock);

    // @ts-ignore
    instance._contract = {
      getReservesList: jest.fn(),
      getReservesData: mockGetReservesData,
      getUserReservesData: mockGetUserReservesData,
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new UiPoolDataProvider({
            uiPoolDataProviderAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should work if all info is correct', () => {
      const instance = new UiPoolDataProvider({
        uiPoolDataProviderAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });

      expect(instance instanceof UiPoolDataProvider).toEqual(true);
    });
  });

  describe('getReservesList - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      let errored = false;
      try {
        await instance.getReservesList(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesList(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address is not valid');
    });
  });

  describe('getReservesData', () => {
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesData(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      const result = await instance.getReservesData(mockValidEthereumAddress);
      expect(result).toEqual(reservesMock);
    });
  });

  describe('getUserReservesData', () => {
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      const result = await instance.getUserReservesData(
        mockValidEthereumAddress,
        mockValidEthereumAddress,
      );

      expect(result).toEqual(userReservesMock);
    });
  });

  describe('getReservesHumanized', () => {
    it('should throw if lendingPoolAddressProvider is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      const result = await instance.getReservesHumanized(
        mockValidEthereumAddress,
      );
      expect(result).toEqual(reservesMock);
    });
  });
  describe('getUserReservesHumanized', () => {
    it('should throw if lendingPoolAddressProvider is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesHumanized(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesHumanized(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });
    it('should be ok', async () => {
      const instance = createValidInstance();
      const result = await instance.getUserReservesHumanized(
        mockValidEthereumAddress,
        mockValidEthereumAddress,
      );

      expect(result).toEqual([
        {
          principalStableDebt: '0',
          scaledATokenBalance: '0',
          scaledVariableDebt: '0',
          stableBorrowLastUpdateTimestamp: 0,
          stableBorrowRate: '0',
          underlyingAsset: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
          usageAsCollateralEnabledOnUser: false,
        },
      ]);
    });
  });
});

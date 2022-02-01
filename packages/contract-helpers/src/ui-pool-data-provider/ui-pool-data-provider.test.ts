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
      chainId: 137,
    });

    const mockGetReservesData = jest.fn();
    const mockGetUserReservesData = jest.fn();

    mockGetReservesData.mockResolvedValue(reservesMock);
    mockGetUserReservesData.mockResolvedValue(userReservesMock);

    // @ts-expect-error readonly
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
            chainId: 137,
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should work if all info is correct', () => {
      const instance = new UiPoolDataProvider({
        uiPoolDataProviderAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
        chainId: 137,
      });

      expect(instance instanceof UiPoolDataProvider).toEqual(true);
    });
  });

  describe('getReservesList - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesList(mockValidEthereumAddress),
      ).resolves.not.toThrow();
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
      await expect(
        instance.getReservesData(mockValidEthereumAddress),
      ).resolves.not.toThrow();
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
      await expect(
        instance.getUserReservesData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
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
      expect(result).toEqual({
        reservesData: [
          {
            id: '137-0x3e0437898a5667a4769b1ca5a34aab1ae7e81377-0x88757f2f99175387ab4c6a4b3067c77a695b0349',
            underlyingAsset: '0x3e0437898a5667a4769b1ca5a34aab1ae7e81377',
            name: '',
            symbol: 'AMPL',
            decimals: 0,
            baseLTVasCollateral: '0',
            reserveLiquidationThreshold: '0',
            reserveLiquidationBonus: '0',
            reserveFactor: '0',
            usageAsCollateralEnabled: false,
            borrowingEnabled: true,
            stableBorrowRateEnabled: false,
            isActive: true,
            isFrozen: false,
            liquidityIndex: '0',
            variableBorrowIndex: '0',
            liquidityRate: '0',
            variableBorrowRate: '0',
            stableBorrowRate: '0',
            lastUpdateTimestamp: 1631772892,
            aTokenAddress: '0xb8a16bbab34FA7A5C09Ec7679EAfb8fEC06897bc',
            stableDebtTokenAddress:
              '0x9157d57DC97A7AFFC7b0a78E78fe25e1401B1dCc',
            variableDebtTokenAddress:
              '0xb7b7AF565495670713C92B8848fC8A650a968F81',
            interestRateStrategyAddress:
              '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
            availableLiquidity: '0',
            totalPrincipalStableDebt: '0',
            averageStableRate: '0',
            stableDebtLastUpdateTimestamp: 0,
            totalScaledVariableDebt: '0',
            priceInMarketReferenceCurrency: '0',
            variableRateSlope1: '0',
            variableRateSlope2: '0',
            stableRateSlope1: '0',
            stableRateSlope2: '0',
          },
          {
            id: '137-0xa478c2975ab1ea89e8196811f51a7b7ade33eb11-0x88757f2f99175387ab4c6a4b3067c77a695b0349',
            underlyingAsset: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
            name: '',
            symbol: 'UNIDAIWETH',
            decimals: 0,
            baseLTVasCollateral: '0',
            reserveLiquidationThreshold: '0',
            reserveLiquidationBonus: '0',
            reserveFactor: '0',
            usageAsCollateralEnabled: false,
            borrowingEnabled: true,
            stableBorrowRateEnabled: false,
            isActive: true,
            isFrozen: false,
            liquidityIndex: '0',
            variableBorrowIndex: '0',
            liquidityRate: '0',
            variableBorrowRate: '0',
            stableBorrowRate: '0',
            lastUpdateTimestamp: 1631772892,
            aTokenAddress: '0xb8a16bbab34FA7A5C09Ec7679EAfb8fEC06897bc',
            stableDebtTokenAddress:
              '0x9157d57DC97A7AFFC7b0a78E78fe25e1401B1dCc',
            variableDebtTokenAddress:
              '0xb7b7AF565495670713C92B8848fC8A650a968F81',
            interestRateStrategyAddress:
              '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
            availableLiquidity: '0',
            totalPrincipalStableDebt: '0',
            averageStableRate: '0',
            stableDebtLastUpdateTimestamp: 0,
            totalScaledVariableDebt: '0',
            priceInMarketReferenceCurrency: '0',
            variableRateSlope1: '0',
            variableRateSlope2: '0',
            stableRateSlope1: '0',
            stableRateSlope2: '0',
          },
        ],
        baseCurrencyData: {
          marketReferenceCurrencyDecimals: 0,
          marketReferenceCurrencyPriceInUsd: '0',
          networkBaseTokenPriceInUsd: '0',
          networkBaseTokenPriceDecimals: 0,
        },
      });
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
          id: '137-0x88757f2f99175387ab4c6a4b3067c77a695b0349-0xb597cd8d3217ea6477232f9217fa70837ff667af-0x88757f2f99175387ab4c6a4b3067c77a695b0349',
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

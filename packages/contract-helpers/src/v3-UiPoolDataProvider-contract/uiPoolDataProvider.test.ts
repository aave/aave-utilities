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
        instance.getReservesList({
          lendingPoolAddressProvider: mockValidEthereumAddress,
        }),
      ).resolves.not.toThrow();
    });
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesList({
          lendingPoolAddressProvider: mockInvalidEthereumAddress,
        }),
      ).rejects.toThrow('Lending pool address is not valid');
    });
  });

  describe('getReservesData', () => {
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesData({
          lendingPoolAddressProvider: mockInvalidEthereumAddress,
        }),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesData({
          lendingPoolAddressProvider: mockValidEthereumAddress,
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('getUserReservesData', () => {
    it('should throw when lendingPoolAddressProvider is not valid address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesData({
          lendingPoolAddressProvider: mockInvalidEthereumAddress,
          user: mockValidEthereumAddress,
        }),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesData({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          user: mockInvalidEthereumAddress,
        }),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesData({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          user: mockValidEthereumAddress,
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('getReservesHumanized', () => {
    it('should throw if lendingPoolAddressProvider is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesHumanized({
          lendingPoolAddressProvider: mockInvalidEthereumAddress,
        }),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      const result = await instance.getReservesHumanized({
        lendingPoolAddressProvider: mockValidEthereumAddress,
      });
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
            isPaused: false,
            isSiloedBorrowing: false,
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
            priceOracle: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
            variableRateSlope1: '0',
            variableRateSlope2: '0',
            stableRateSlope1: '0',
            stableRateSlope2: '0',
            baseStableBorrowRate: '0',
            baseVariableBorrowRate: '0',
            optimalUsageRatio: '0',
            // new
            debtCeiling: '0',
            eModeCategoryId: 1,
            borrowCap: '0',
            supplyCap: '0',
            eModeLtv: 1,
            eModeLiquidationThreshold: 1,
            eModeLiquidationBonus: 1,
            eModePriceSource: '0x3E0437898a5667a4769B1Ca5A34aAB1ae7E81377',
            eModeLabel: 'test label',
            accruedToTreasury: '0',
            unbacked: '0',
            isolationModeTotalDebt: '0',
            debtCeilingDecimals: 0,
            borrowableInIsolation: false,
            flashLoanEnabled: false,
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
            isPaused: false,
            isSiloedBorrowing: false,
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
            priceOracle: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
            variableRateSlope1: '0',
            variableRateSlope2: '0',
            stableRateSlope1: '0',
            stableRateSlope2: '0',
            baseStableBorrowRate: '0',
            baseVariableBorrowRate: '0',
            optimalUsageRatio: '0',
            // new
            debtCeiling: '0',
            eModeCategoryId: 1,
            borrowCap: '0',
            supplyCap: '0',
            eModeLtv: 1,
            eModeLiquidationThreshold: 1,
            eModeLiquidationBonus: 1,
            eModePriceSource: '0x3E0437898a5667a4769B1Ca5A34aAB1ae7E81377',
            eModeLabel: 'test label',
            accruedToTreasury: '0',
            unbacked: '0',
            isolationModeTotalDebt: '0',
            debtCeilingDecimals: 0,
            borrowableInIsolation: false,
            flashLoanEnabled: false,
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
        instance.getUserReservesHumanized({
          lendingPoolAddressProvider: mockInvalidEthereumAddress,
          user: mockValidEthereumAddress,
        }),
      ).rejects.toThrow('Lending pool address is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesHumanized({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          user: mockInvalidEthereumAddress,
        }),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });
    it('should be ok', async () => {
      const instance = createValidInstance();
      const result = await instance.getUserReservesHumanized({
        lendingPoolAddressProvider: mockValidEthereumAddress,
        user: mockValidEthereumAddress,
      });

      expect(result).toEqual({
        userReserves: [
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
        ],
        userEmodeCategoryId: 1,
      });
    });
  });
});

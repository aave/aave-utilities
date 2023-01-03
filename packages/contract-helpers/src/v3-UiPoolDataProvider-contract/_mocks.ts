import { BigNumber } from 'ethers';
import { ReservesData, UserReserveData } from './types';

export const reservesMock: ReservesData = {
  0: [
    {
      underlyingAsset: '0x3E0437898a5667a4769B1Ca5A34aAB1ae7E81377',
      name: '',
      symbol: 'AMPL',
      decimals: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseLTVasCollateral: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveLiquidationThreshold: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveLiquidationBonus: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveFactor: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      usageAsCollateralEnabled: false,
      borrowingEnabled: true,
      stableBorrowRateEnabled: false,
      isActive: true,
      isFrozen: false,
      isPaused: false,
      isSiloedBorrowing: false,
      liquidityIndex: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableBorrowIndex: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      liquidityRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      lastUpdateTimestamp: 1631772892,
      aTokenAddress: '0xb8a16bbab34FA7A5C09Ec7679EAfb8fEC06897bc',
      stableDebtTokenAddress: '0x9157d57DC97A7AFFC7b0a78E78fe25e1401B1dCc',
      variableDebtTokenAddress: '0xb7b7AF565495670713C92B8848fC8A650a968F81',
      interestRateStrategyAddress: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
      availableLiquidity: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      totalPrincipalStableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      averageStableRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableDebtLastUpdateTimestamp: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      totalScaledVariableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      priceInMarketReferenceCurrency: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      priceOracle: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
      variableRateSlope1: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableRateSlope2: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableRateSlope1: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableRateSlope2: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseStableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseVariableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      optimalUsageRatio: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      // new
      debtCeiling: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      eModeCategoryId: 1,
      borrowCap: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      supplyCap: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      eModeLtv: 1,
      eModeLiquidationThreshold: 1,
      eModeLiquidationBonus: 1,
      eModePriceSource: '0x3E0437898a5667a4769B1Ca5A34aAB1ae7E81377',
      eModeLabel: 'test label',
      borrowableInIsolation: false,
      flashLoanEnabled: false,
      accruedToTreasury: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      unbacked: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      isolationModeTotalDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      debtCeilingDecimals: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
    },
    {
      underlyingAsset: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
      name: '',
      symbol: 'UNI-V2',
      decimals: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseLTVasCollateral: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveLiquidationThreshold: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveLiquidationBonus: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      reserveFactor: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      usageAsCollateralEnabled: false,
      borrowingEnabled: true,
      stableBorrowRateEnabled: false,
      isActive: true,
      isFrozen: false,
      isPaused: false,
      isSiloedBorrowing: false,
      liquidityIndex: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableBorrowIndex: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      liquidityRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      lastUpdateTimestamp: 1631772892,
      aTokenAddress: '0xb8a16bbab34FA7A5C09Ec7679EAfb8fEC06897bc',
      stableDebtTokenAddress: '0x9157d57DC97A7AFFC7b0a78E78fe25e1401B1dCc',
      variableDebtTokenAddress: '0xb7b7AF565495670713C92B8848fC8A650a968F81',
      interestRateStrategyAddress: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
      availableLiquidity: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      totalPrincipalStableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      averageStableRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableDebtLastUpdateTimestamp: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      totalScaledVariableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      priceInMarketReferenceCurrency: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      priceOracle: '0x796ec26fc7df8D81BCB5BABF74ccdE0E2B122164',
      variableRateSlope1: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      variableRateSlope2: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableRateSlope1: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableRateSlope2: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseStableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      baseVariableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      optimalUsageRatio: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      // new
      debtCeiling: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      eModeCategoryId: 1,
      borrowCap: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      supplyCap: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      eModeLtv: 1,
      eModeLiquidationThreshold: 1,
      eModeLiquidationBonus: 1,
      eModePriceSource: '0x3E0437898a5667a4769B1Ca5A34aAB1ae7E81377',
      eModeLabel: 'test label',
      borrowableInIsolation: false,
      flashLoanEnabled: false,
      accruedToTreasury: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      unbacked: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      isolationModeTotalDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      debtCeilingDecimals: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
    },
  ],
  1: {
    marketReferenceCurrencyUnit: BigNumber.from({
      _hex: '0x0',
      _isBigNumber: true,
    }),
    marketReferenceCurrencyPriceInUsd: BigNumber.from({
      _hex: '0x0',
      _isBigNumber: true,
    }),

    networkBaseTokenPriceInUsd: BigNumber.from({
      _hex: '0x0',
      _isBigNumber: true,
    }),
    networkBaseTokenPriceDecimals: 0,
  },
};

export const userReservesMock: UserReserveData = {
  0: [
    {
      underlyingAsset: '0xB597cd8D3217ea6477232F9217fa70837ff667Af',
      scaledATokenBalance: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      usageAsCollateralEnabledOnUser: false,
      stableBorrowRate: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      scaledVariableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      principalStableDebt: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
      stableBorrowLastUpdateTimestamp: BigNumber.from({
        _hex: '0x0',
        _isBigNumber: true,
      }),
    },
  ],
  1: 1,
};

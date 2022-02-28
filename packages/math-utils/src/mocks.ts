import BigNumber from 'bignumber.js';
import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
} from './formatters/incentive';
import { FormatReserveUSDResponse, ReserveData } from './formatters/reserve';
import { UserReserveData } from './formatters/user';
import { RAY } from './ray.math';

export class ReserveMock {
  public reserve: ReserveData;

  private readonly config: { decimals: number };

  constructor(config: { decimals: number } = { decimals: 18 }) {
    this.config = config;
    this.reserve = {
      id: '0x0',
      symbol: 'TEST',
      name: 'TEST',
      decimals: config.decimals,
      underlyingAsset: '0x0',
      usageAsCollateralEnabled: true,
      eModeCategoryId: 1,
      reserveFactor: '0',
      baseLTVasCollateral: '5000', // 50%
      averageStableRate: '0',
      stableDebtLastUpdateTimestamp: 1,
      liquidityIndex: RAY.toString(),
      reserveLiquidationThreshold: '6000', // 60%
      reserveLiquidationBonus: '0',
      variableBorrowIndex: RAY.toString(),
      variableBorrowRate: RAY.multipliedBy(3).toString(),
      availableLiquidity: '0',
      stableBorrowRate: RAY.multipliedBy(2).toString(),
      liquidityRate: RAY.multipliedBy(1).toString(),
      totalPrincipalStableDebt: '0',
      totalScaledVariableDebt: '0',
      lastUpdateTimestamp: 1,
      borrowCap: '0',
      supplyCap: '0',
      debtCeiling: '0',
      debtCeilingDecimals: 2,
      isolationModeTotalDebt: '',
      eModeLtv: 6000, // 60%
      eModeLiquidationThreshold: 7000, // 70%
      eModeLiquidationBonus: 0,
    };
  }

  addLiquidity(decimal: number | string) {
    this.reserve.availableLiquidity = new BigNumber(decimal)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.availableLiquidity)
      .toString();
    return this;
  }

  addVariableDebt(decimal: number | string) {
    this.reserve.totalScaledVariableDebt = new BigNumber(decimal)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.totalScaledVariableDebt)
      .toString();
    return this;
  }

  addStableDebt(decimal: number | string) {
    this.reserve.totalPrincipalStableDebt = new BigNumber(decimal)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.totalPrincipalStableDebt)
      .toString();
    return this;
  }
}

export class UserReserveMock {
  public userReserve: UserReserveData;
  public reserve: FormatReserveUSDResponse;
  private readonly config: { decimals: number };

  constructor(config: { decimals: number } = { decimals: 18 }) {
    this.config = config;
    this.userReserve = {
      underlyingAsset: '0x0000000000000000000000000000000000000000',
      scaledATokenBalance: '0',
      usageAsCollateralEnabledOnUser: true,
      stableBorrowRate: RAY.multipliedBy(2).toString(),
      scaledVariableDebt: '0',
      principalStableDebt: '0',
      stableBorrowLastUpdateTimestamp: 1,
    };
    const reserveMock = new ReserveMock({ decimals: config.decimals });
    this.reserve = {
      ...reserveMock.reserve,
      underlyingAsset: '0x0000000000000000000000000000000000000000',
      id: '0x0',
      symbol: 'TEST',
      name: 'TEST',
      decimals: config.decimals,
      usageAsCollateralEnabled: true,
      eModeCategoryId: 1,
      formattedBaseLTVasCollateral: '0.5',
      liquidityIndex: RAY.toString(),
      formattedReserveLiquidationThreshold: '0.6',
      formattedReserveLiquidationBonus: '0',
      variableBorrowIndex: RAY.toString(),
      variableBorrowRate: RAY.multipliedBy(3).toString(),
      formattedAvailableLiquidity: '0',
      liquidityRate: RAY.multipliedBy(1).toString(),
      totalPrincipalStableDebt: '0',
      totalScaledVariableDebt: '0',
      lastUpdateTimestamp: 1,
      debtCeiling: '0',
      debtCeilingDecimals: 2,
      isolationModeTotalDebt: '',
      formattedEModeLtv: '0.6',
      formattedEModeLiquidationThreshold: '0.7',
      formattedEModeLiquidationBonus: '0',
      priceInUSD: '10',
      totalLiquidityUSD: '0',
      availableLiquidityUSD: '0',
      totalDebtUSD: '0',
      totalVariableDebtUSD: '0',
      totalStableDebtUSD: '0',
      borrowCapUSD: '0',
      supplyCapUSD: '0',
      priceInMarketReferenceCurrency: (10 ** 19).toString(),
      formattedPriceInMarketReferenceCurrency: '10',
      unborrowedLiquidity: '0',
      supplyAPY: '0',
      supplyAPR: '0',
      variableBorrowAPY: '0',
      variableBorrowAPR: '0',
      stableBorrowAPY: '0',
      stableBorrowAPR: '0',
      utilizationRate: '0',
      totalStableDebt: '0',
      totalVariableDebt: '0',
      totalDebt: '0',
      totalLiquidity: '0',
      debtCeilingUSD: '0',
      availableDebtCeilingUSD: '0',
      isolationModeTotalDebtUSD: '0',
      isIsolated: true,
    };
  }

  supply(amount: number | string) {
    this.userReserve.scaledATokenBalance = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.scaledATokenBalance)
      .toString();
    this.reserve.availableLiquidity = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.availableLiquidity)
      .toString();
    return this;
  }

  variableBorrow(amount: number | string) {
    this.userReserve.scaledVariableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.scaledVariableDebt)
      .toString();
    this.reserve.totalScaledVariableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.totalScaledVariableDebt)
      .toString();
    return this;
  }

  stableBorrow(amount: number | string) {
    this.userReserve.principalStableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.principalStableDebt)
      .toString();
    this.reserve.totalPrincipalStableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.totalPrincipalStableDebt)
      .toString();
    return this;
  }
}

export class ReserveIncentiveMock {
  public reserveIncentive: ReservesIncentiveDataHumanized;

  constructor() {
    this.reserveIncentive = {
      underlyingAsset: '0x0000000000000000000000000000000000000000',
      aIncentiveData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        rewardsTokenInformation: [
          {
            rewardTokenSymbol: 'Test',
            emissionPerSecond: (10 ** 18).toString(), // 1
            incentivesLastUpdateTimestamp: 1,
            tokenIncentivesIndex: RAY.toString(),
            emissionEndTimestamp: 1,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            precision: 18,
            rewardPriceFeed: (10 ** 9).toString(), // 10
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
      vIncentiveData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        rewardsTokenInformation: [
          {
            rewardTokenSymbol: 'Test',
            emissionPerSecond: (10 ** 18).toString(), // 1
            incentivesLastUpdateTimestamp: 1,
            tokenIncentivesIndex: RAY.toString(),
            emissionEndTimestamp: 1,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            precision: 18,
            rewardPriceFeed: (10 ** 9).toString(), // 10
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
      sIncentiveData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        rewardsTokenInformation: [
          {
            rewardTokenSymbol: 'Test',
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 1,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 1,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            precision: 18,
            rewardPriceFeed: '0',
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
    };
  }
}

export class UserIncentiveMock {
  public userIncentive: UserReservesIncentivesDataHumanized;

  constructor() {
    this.userIncentive = {
      underlyingAsset: '0x0000000000000000000000000000000000000000',
      aTokenIncentivesUserData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        userRewardsInformation: [
          {
            tokenIncentivesUserIndex: '0',
            userUnclaimedRewards: '1',
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            rewardPriceFeed: (10 ** 19).toString(), // 10
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0',
            rewardTokenSymbol: 'Test',
          },
        ],
      },
      vTokenIncentivesUserData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        userRewardsInformation: [
          {
            tokenIncentivesUserIndex: '0',
            userUnclaimedRewards: '1',
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            rewardPriceFeed: (10 ** 19).toString(), // 10
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0',
            rewardTokenSymbol: 'Test',
          },
        ],
      },
      sTokenIncentivesUserData: {
        tokenAddress: '0x0000000000000000000000000000000000000000',
        incentiveControllerAddress:
          '0x0000000000000000000000000000000000000000',
        userRewardsInformation: [
          {
            tokenIncentivesUserIndex: '0',
            userUnclaimedRewards: '1',
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            rewardPriceFeed: (10 ** 19).toString(), // 10
            priceFeedDecimals: 8,
            rewardOracleAddress: '0x0',
            rewardTokenSymbol: 'Test',
          },
        ],
      },
    };
  }
}

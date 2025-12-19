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
      originalId: 1,
      id: '0x0',
      symbol: 'TEST',
      name: 'TEST',
      decimals: config.decimals,
      underlyingAsset: '0x0',
      usageAsCollateralEnabled: true,
      reserveFactor: '0',
      baseLTVasCollateral: '5000', // 50%
      liquidityIndex: RAY.toString(),
      reserveLiquidationThreshold: '6000', // 60%
      reserveLiquidationBonus: '0',
      variableBorrowIndex: RAY.toString(),
      variableBorrowRate: RAY.multipliedBy(3).toString(),
      availableLiquidity: '0',
      liquidityRate: RAY.multipliedBy(1).toString(),
      totalScaledVariableDebt: '0',
      lastUpdateTimestamp: 1,
      borrowCap: '0',
      supplyCap: '0',
      debtCeiling: '0',
      debtCeilingDecimals: 2,
      isolationModeTotalDebt: '',
      virtualUnderlyingBalance: '0',
      deficit: '0',
    };
  }

  addLiquidity(amount: number | string) {
    this.reserve.availableLiquidity = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.availableLiquidity)
      .toString();
    return this;
  }

  addVariableDebt(amount: number | string) {
    this.reserve.totalScaledVariableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.reserve.totalScaledVariableDebt)
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
      scaledVariableDebt: '0',
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
      formattedBaseLTVasCollateral: '0.5',
      liquidityIndex: RAY.toString(),
      formattedReserveLiquidationThreshold: '0.6',
      formattedReserveLiquidationBonus: '0',
      variableBorrowIndex: RAY.toString(),
      variableBorrowRate: RAY.multipliedBy(3).toString(),
      formattedAvailableLiquidity: '0',
      liquidityRate: RAY.multipliedBy(1).toString(),
      totalScaledVariableDebt: '0',
      lastUpdateTimestamp: 1,
      debtCeiling: '0',
      debtCeilingDecimals: 2,
      isolationModeTotalDebt: '',
      priceInUSD: '10',
      totalLiquidityUSD: '0',
      availableLiquidityUSD: '0',
      totalDebtUSD: '0',
      totalVariableDebtUSD: '0',
      borrowCapUSD: '0',
      supplyCapUSD: '0',
      priceInMarketReferenceCurrency: (10 ** 19).toString(),
      formattedPriceInMarketReferenceCurrency: '10',
      unborrowedLiquidity: '0',
      supplyAPY: '0',
      supplyAPR: '0',
      variableBorrowAPY: '0',
      variableBorrowAPR: '0',
      borrowUsageRatio: '0',
      supplyUsageRatio: '0',
      totalVariableDebt: '0',
      totalDebt: '0',
      totalLiquidity: '0',
      debtCeilingUSD: '0',
      availableDebtCeilingUSD: '0',
      isolationModeTotalDebtUSD: '0',
      isIsolated: true,
      eModes: [
        {
          id: 1,
          collateralEnabled: true,
          borrowingEnabled: true,
          ltvzeroEnabled: false,
          eMode: {
            ltv: '6000',
            liquidationThreshold: '7000',
            liquidationBonus: '0',
            formattedLtv: '0.6',
            formattedLiquidationThreshold: '0.7',
            formattedLiquidationBonus: '0',
            label: 'test emode',
            collateralBitmap: '1',
            borrowableBitmap: '1',
            ltvzeroBitmap: '0',
          },
        },
      ],
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
            emissionEndTimestamp: 2,
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
            emissionEndTimestamp: 2,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 18,
            precision: 18,
            rewardPriceFeed: (10 ** 9).toString(), // 10
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
    };
  }
}

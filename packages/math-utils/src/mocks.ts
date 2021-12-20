import BigNumber from 'bignumber.js';
import { ReserveData } from './formatters/reserve';
import { UserReserveData } from './formatters/user';
import { RAY } from './ray.math';

export class ReserveMock {
  public reserve: ReserveData;

  private readonly config: { decimals: number };

  constructor(config: { decimals: number } = { decimals: 18 }) {
    this.config = config;
    this.reserve = {
      decimals: config.decimals,
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
  private readonly config: { decimals: number };

  constructor(config: { decimals: number } = { decimals: 18 }) {
    this.config = config;
    const reserveMock = new ReserveMock({ decimals: config.decimals });
    this.userReserve = {
      scaledATokenBalance: '0',
      usageAsCollateralEnabledOnUser: true,
      stableBorrowRate: RAY.multipliedBy(2).toString(),
      scaledVariableDebt: '0',
      principalStableDebt: '0',
      stableBorrowLastUpdateTimestamp: 1,
      reserve: {
        ...reserveMock.reserve,
        priceInMarketReferenceCurrency: (10 ** 19).toString(), // 10
        id: '0',
        symbol: '0',
        usageAsCollateralEnabled: true,
        underlyingAsset: '0',
        name: '',
        eModeCategoryId: 1,
      },
    };
  }

  supply(amount: number | string) {
    this.userReserve.scaledATokenBalance = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.scaledATokenBalance)
      .toString();
    return this;
  }

  variableBorrow(amount: number | string) {
    this.userReserve.scaledVariableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.scaledVariableDebt)
      .toString();
    return this;
  }

  stableBorrow(amount: number | string) {
    this.userReserve.principalStableDebt = new BigNumber(amount)
      .shiftedBy(this.config.decimals)
      .plus(this.userReserve.principalStableDebt)
      .toString();
    return this;
  }
}

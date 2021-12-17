import BigNumber from 'bignumber.js';
import { ReserveData } from './formatters/reserve';
import { RAY } from './ray.math';

export class ReserveMock {
  public reserve: ReserveData;

  private readonly config: { decimals: number };

  constructor(config: { decimals: number } = { decimals: 18 }) {
    this.config = config;
    this.reserve = {
      decimals: config.decimals,
      reserveFactor: '0',
      baseLTVasCollateral: '0',
      averageStableRate: '0',
      stableDebtLastUpdateTimestamp: 0,
      liquidityIndex: RAY.toString(),
      reserveLiquidationThreshold: '0',
      reserveLiquidationBonus: '0',
      variableBorrowIndex: RAY.toString(),
      variableBorrowRate: RAY.multipliedBy(3).toString(),
      availableLiquidity: '0',
      stableBorrowRate: '0',
      liquidityRate: '0',
      totalPrincipalStableDebt: '0',
      totalScaledVariableDebt: '0',
      lastUpdateTimestamp: 0,
      borrowCap: '0',
      supplyCap: '0',
      debtCeiling: '0',
      debtCeilingDecimals: 2,
      isolationModeTotalDebt: '',
      eModeLtv: 0,
      eModeLiquidationThreshold: 0,
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

import {
  ReservesIncentiveDataHumanized,
  UserReservesIncentivesDataHumanized,
} from './formatters/incentive';
import { FormatReserveUSDResponse, ReserveData } from './formatters/reserve';
import { UserReserveData } from './formatters/user';
export declare class ReserveMock {
  reserve: ReserveData;
  private readonly config;
  constructor(config?: { decimals: number });
  addLiquidity(amount: number | string): this;
  addVariableDebt(amount: number | string): this;
  addStableDebt(amount: number | string): this;
  addUnbacked(amount: number | string): this;
}
export declare class UserReserveMock {
  userReserve: UserReserveData;
  reserve: FormatReserveUSDResponse;
  private readonly config;
  constructor(config?: { decimals: number });
  supply(amount: number | string): this;
  variableBorrow(amount: number | string): this;
  stableBorrow(amount: number | string): this;
}
export declare class ReserveIncentiveMock {
  reserveIncentive: ReservesIncentiveDataHumanized;
  constructor();
}
export declare class UserIncentiveMock {
  userIncentive: UserReservesIncentivesDataHumanized;
  constructor();
}
//# sourceMappingURL=mocks.d.ts.map

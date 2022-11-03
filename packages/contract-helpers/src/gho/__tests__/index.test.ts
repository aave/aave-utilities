import {
  GhoDiscountRateStrategyService,
  GhoTokenService,
  GhoVariableDebtTokenService,
} from '../index';

describe('gho contract helpers', () => {
  it('exports out the GhoDiscountRateStrategyService', () => {
    expect(GhoDiscountRateStrategyService).toBeTruthy();
  });

  it('exports out the GhoTokenService', () => {
    expect(GhoTokenService).toBeTruthy();
  });

  it('exports out the GhoVariableDebtTokenService', () => {
    expect(GhoVariableDebtTokenService).toBeTruthy();
  });
});

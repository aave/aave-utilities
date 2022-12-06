import {
  GhoDiscountRateStrategyService,
  GhoTokenService,
  GhoVariableDebtTokenService,
  GhoService,
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

  it('exports out the GhoService', () => {
    expect(GhoService).toBeTruthy();
  });
});

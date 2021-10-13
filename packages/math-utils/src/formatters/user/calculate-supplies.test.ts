import { calculateSupplies, SuppliesRequest } from './calculate-supplies';

describe('calculateSupplies', () => {
  const reserveSuppliesInput: SuppliesRequest = {
    reserve: {
      totalScaledVariableDebt: '4790920796601146',
      variableBorrowIndex: '1070766170735867540788710974',
      variableBorrowRate: '56235456575090775514594900',
      totalPrincipalStableDebt: '47382324949680',
      averageStableRate: '106672256721053059345703064',
      availableLiquidity: '558016083020512',
      stableDebtLastUpdateTimestamp: 1629942075,
      lastUpdateTimestamp: 1629942075,
    },
    currentTimestamp: 1629942075,
  };

  it('should calculate the correct supplies', () => {
    const { totalLiquidity, totalStableDebt, totalVariableDebt } =
      calculateSupplies(reserveSuppliesInput);
    expect(totalLiquidity.toFixed()).toBe('5735354323645633');
    expect(totalStableDebt.toFixed()).toBe('47382324949680');
    expect(totalVariableDebt.toFixed()).toBe('5129955915675441');
  });
});

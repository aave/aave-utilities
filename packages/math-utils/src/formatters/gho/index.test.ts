import { GhoMock } from '../../mocks';
import { formatGhoData } from './index';

describe('formatGhoData', () => {
  const ghoMock = new GhoMock();
  it('properly format gho data', () => {
    const result = formatGhoData({ ghoData: ghoMock.ghoData });

    expect(result.baseVariableBorrowRate).toEqual('1'); // 10%
    expect(result.variableBorrowAPY).toEqual('1.718281785360970821260772864'); // 17.18%
    expect(result.ghoDiscountedPerToken).toEqual('100');
    expect(result.ghoDiscountRate).toEqual('0.2');
    expect(result.ghoDiscountLockPeriod).toEqual('1000');
    expect(result.facilitatorBucketLevel).toEqual('10');
    expect(result.facilitatorBucketMaxCapacity).toEqual('100');
    expect(result.facilitatorRemainingCapacity).toEqual('90');
    expect(result.facilitatorMintedPercent).toEqual('0.1');
    expect(result.ghoMinDebtTokenBalanceForDiscount).toEqual('1');
    expect(result.ghoMinDiscountTokenBalanceForDiscount).toEqual('1');
    expect(result.userGhoDiscountRate).toEqual('0.1');
    expect(result.discountableAmount).toEqual('10000');
    expect(result.borrowAPYWithMaxDiscount).toEqual('1.3746254282887769'); // 17.18% - 20% discount = 13.75%
    expect(result.userDiscountTokenBalance).toEqual('100');
  });
});

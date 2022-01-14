import { calculateCompoundedInterest } from './calculate-compounded-interest';

describe('calculateCompoundedInterest', () => {
  it('calculates compound interest', () => {
    const result = calculateCompoundedInterest({
      rate: '109284236984257451326752610',
      currentTimestamp: 1606992401,
      lastUpdateTimestamp: 1606992400,
    });

    expect(result.toFixed()).toEqual('1000000003465380421875236280');
  });

  it('calculates compound interest', () => {
    const result = calculateCompoundedInterest({
      rate: '38568743388028395681971229',
      currentTimestamp: 1606992401,
      lastUpdateTimestamp: 1606992400,
    });

    expect(result.toFixed()).toEqual('1000000001223006829909576220');
  });

  it('calculates compound interest', () => {
    const result = calculateCompoundedInterest({
      rate: '109284236984257451326752610',
      currentTimestamp: 1606992401,
      lastUpdateTimestamp: 1606992400,
    });

    expect(result.toFixed()).toEqual('1000000003465380421875236280');
  });
});

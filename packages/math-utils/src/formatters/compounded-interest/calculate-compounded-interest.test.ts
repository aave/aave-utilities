import {
  calculateCompoundedInterest,
  calculateCompoundedRate,
} from './calculate-compounded-interest';

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

describe('calculateCompoundedRate', () => {
  it('calculates compounded rate bignumber - 1 year', () => {
    const result = calculateCompoundedRate({
      rate: '109284236984257451326752610',
      duration: 31536000,
    });

    expect(result.toFixed()).toEqual('115479365565265190368974686');
  });

  it('calculates compound rate - 2 years', () => {
    const result = calculateCompoundedRate({
      rate: '38568743388028395681971229',
      duration: 31536000 * 2,
    });

    expect(result.toFixed()).toEqual('80190578053013645960831190');
  });

  it('calculates compound interest - 6 months', () => {
    const result = calculateCompoundedRate({
      rate: '109284236984257451326752610',
      duration: 31536000 / 2,
    });

    expect(result.toFixed()).toEqual('56162565879545453589985212');
  });
});

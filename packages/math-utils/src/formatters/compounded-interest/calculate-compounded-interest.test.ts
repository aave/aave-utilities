import { calculateCompoundedRate } from './calculate-compounded-interest';

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

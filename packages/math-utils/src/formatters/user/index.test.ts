import BigNumber from 'bignumber.js';
import { formatUserSummaryRequest } from './user.mocks';
import { formatUserSummary, FormatUserSummaryRequest } from './index';

describe('formatUserSummary', () => {
  const request: FormatUserSummaryRequest = formatUserSummaryRequest;

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityMarketReferenceCurrency).toEqual(
      '5.46179153914066308692',
    );
    expect(result.totalLiquidityUSD).toEqual('17646.03703431');
    expect(result.totalCollateralMarketReferenceCurrency).toEqual(
      '5.46179153914066308692',
    );
    expect(result.totalCollateralUSD).toEqual('17646.03703431');
    expect(result.totalBorrowsMarketReferenceCurrency).toEqual(
      '1.79327924784091481685',
    );
    expect(result.totalBorrowsUSD).toEqual('5793.75316569');
    expect(result.availableBorrowsMarketReferenceCurrency).toEqual(
      '0.04372093494452852425',
    );
    expect(result.currentLoanToValue).toEqual('0.33633656092895661176');
    expect(result.currentLiquidationThreshold).toEqual(
      '0.51233208646356896415',
    );
    expect(result.healthFactor).toEqual('1.56041010257942924677');
  });

  it('should increase debt over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1629942229,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 1629942230,
    });

    expect(
      new BigNumber(second.totalBorrowsMarketReferenceCurrency).gt(
        first.totalBorrowsMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });

  it('should increase collateral over time', () => {
    const first = formatUserSummary({
      ...request,
      currentTimestamp: 1629942229,
    });

    const second = formatUserSummary({
      ...request,
      currentTimestamp: 1629942230,
    });

    expect(
      new BigNumber(second.totalCollateralMarketReferenceCurrency).gt(
        first.totalCollateralMarketReferenceCurrency,
      ),
    ).toEqual(true);
  });
});

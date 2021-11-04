import BigNumber from 'bignumber.js';
import {
  formatUserSummaryRequestEthMarket,
  formatUserSummaryRequestUsdMarket,
} from './user.mocks';
import { formatUserSummary, FormatUserSummaryRequest } from './index';

describe('formatUserSummaryETHMarket', () => {
  const request: FormatUserSummaryRequest = formatUserSummaryRequestEthMarket;

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityMarketReferenceCurrency).toEqual(
      '11.819951652201573862',
    );
    expect(result.totalLiquidityUSD).toEqual(
      '540141344670600.1991837857882414',
    );
    expect(result.totalCollateralMarketReferenceCurrency).toEqual(
      '11.819951652201573862',
    );
    expect(result.totalCollateralUSD).toEqual(
      '540141344670600.1991837857882414',
    );
    expect(result.totalBorrowsMarketReferenceCurrency).toEqual(
      '1.788570685417553847',
    );
    expect(result.totalBorrowsUSD).toEqual('81733073322674.1410670756312459');
    expect(result.availableBorrowsMarketReferenceCurrency).toEqual(
      '7.6673906363437052426',
    );
    expect(result.currentLoanToValue).toEqual('0.8');
    expect(result.currentLiquidationThreshold).toEqual(
      '0.82613698796199320993',
    );
    expect(result.healthFactor).toEqual('5.45961047859090456897');
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

describe('formatUserSummaryUSDMarket', () => {
  const request: FormatUserSummaryRequest = formatUserSummaryRequestUsdMarket;

  it('should return the correct response', () => {
    const result = formatUserSummary(request);
    expect(result.totalLiquidityMarketReferenceCurrency).toEqual(
      '2329.87871599398791011829',
    );
    expect(result.totalLiquidityUSD).toEqual('2329.87871599398791011829');
    expect(result.totalCollateralMarketReferenceCurrency).toEqual(
      '2329.87871599398791011829',
    );
    expect(result.totalCollateralUSD).toEqual('2329.87871599398791011829');
    expect(result.totalBorrowsMarketReferenceCurrency).toEqual(
      '136.59840744218485653285',
    );
    expect(result.totalBorrowsUSD).toEqual('136.59840744218485653285');
    expect(result.availableBorrowsMarketReferenceCurrency).toEqual(
      '1608.89187451612787352629',
    );
    expect(result.currentLoanToValue).toEqual('0.74917645711598356275');
    expect(result.currentLiquidationThreshold).toEqual(
      '0.79950587426959013765',
    );
    expect(result.healthFactor).toEqual('13.63670158864254157094');
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

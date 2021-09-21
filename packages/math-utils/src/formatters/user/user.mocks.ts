import { FormatUserSummaryRequest, RawUserReserveData } from './index';

export const usdcUserReserve: RawUserReserveData = {
  scaledATokenBalance: '2328085146',
  usageAsCollateralEnabledOnUser: true,
  scaledVariableDebt: '48856783',
  variableBorrowIndex: '0',
  stableBorrowRate: '0',
  principalStableDebt: '0',
  stableBorrowLastUpdateTimestamp: 0,
  reserve: {
    id:
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb480xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
    symbol: 'USDC',
    decimals: 6,
    liquidityRate: '46062683922433651545591283',
    reserveLiquidationBonus: '10500',
    lastUpdateTimestamp: 1629942075,
    priceInMarketReferenceCurrency: '310220648226635',
    reserveFactor: '1000',
    baseLTVasCollateral: '8000',
    averageStableRate: '106672256721053059345703064',
    stableDebtLastUpdateTimestamp: 1629942075,
    liquidityIndex: '1048540642417873765200833079',
    reserveLiquidationThreshold: '8500',
    variableBorrowIndex: '1070766170735867540788710974',
    variableBorrowRate: '56235456575090775514594900',
    availableLiquidity: '558016083020512',
    stableBorrowRate: '126235456575090775514594900',
    totalPrincipalStableDebt: '47382324949680',
    totalScaledVariableDebt: '4790920796601146',
    usageAsCollateralEnabled: true,
  },
};

export const xSushiUserReserve: RawUserReserveData = {
  scaledATokenBalance: '1031991722452535126997',
  usageAsCollateralEnabledOnUser: true,
  scaledVariableDebt: '0',
  variableBorrowIndex: '0',
  stableBorrowRate: '0',
  principalStableDebt: '0',
  stableBorrowLastUpdateTimestamp: 0,
  reserve: {
    id:
      '0x8798249c2e607446efb7ad49ec89dd1865ff42720xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
    symbol: 'XSUSHI',
    decimals: 18,
    liquidityRate: '60907795848090763073598',
    reserveLiquidationBonus: '11500',
    lastUpdateTimestamp: 1629936152,
    priceInMarketReferenceCurrency: '4461141236372503',
    reserveFactor: '3500',
    baseLTVasCollateral: '2500',
    averageStableRate: '0',
    stableDebtLastUpdateTimestamp: 0,
    liquidityIndex: '1000122254330797728596142162',
    reserveLiquidationThreshold: '4500',
    variableBorrowIndex: '1002026240154574876504626909',
    variableBorrowRate: '3817882220211400976902451',
    availableLiquidity: '14256005298876037133863099',
    stableBorrowRate: '0',
    totalPrincipalStableDebt: '0',
    totalScaledVariableDebt: '357971011986405973662046',
    usageAsCollateralEnabled: true,
  },
};

export const ethUserReserve: RawUserReserveData = {
  scaledATokenBalance: '99353924118371338',
  usageAsCollateralEnabledOnUser: true,
  scaledVariableDebt: '1761463562232346784',
  variableBorrowIndex: '0',
  stableBorrowRate: '0',
  principalStableDebt: '0',
  stableBorrowLastUpdateTimestamp: 0,
  reserve: {
    id:
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
    symbol: 'ETH',
    decimals: 18,
    liquidityRate: '254255556752591383202873',
    reserveLiquidationBonus: '10500',
    lastUpdateTimestamp: 1629941871,
    priceInMarketReferenceCurrency: '1000000000000000000',
    reserveFactor: '1000',
    baseLTVasCollateral: '8000',
    averageStableRate: '46637202204403154655675566',
    stableDebtLastUpdateTimestamp: 1629915693,
    liquidityIndex: '1007413997850700625419347606',

    reserveLiquidationThreshold: '8250',
    variableBorrowIndex: '1008848677653085643734896653',
    variableBorrowRate: '5738395583946989083240726',
    availableLiquidity: '1804347879848751129817047',
    stableBorrowRate: '37172994479933736354050909',
    totalPrincipalStableDebt: '692086532295070779065',
    totalScaledVariableDebt: '86780929701599575562906',
    usageAsCollateralEnabled: true,
  },
};

export const userReserves = [
  usdcUserReserve,
  xSushiUserReserve,
  ethUserReserve,
];

export const formatUserSummaryRequest: FormatUserSummaryRequest = {
  rawUserReserves: userReserves,
  usdPriceMarketReferenceCurrency: 309519442156873,
  marketReferenceCurrencyDecimals: 18,
  currentTimestamp: 1629942229,
};

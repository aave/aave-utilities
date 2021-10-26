// Reserve Incentives

import {
  ReserveCalculationData,
  ReserveIncentiveWithFeedsResponse,
  UserReserveCalculationData,
  UserReserveIncentiveDataHumanizedResponse,
} from './types';

export const aETHReserveIncentiveData: ReserveIncentiveWithFeedsResponse = {
  underlyingAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  aIncentiveData: {
    emissionPerSecond: '1979166666666666',
    incentivesLastUpdateTimestamp: 1631587511,
    tokenIncentivesIndex: '24733519699535219',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000a',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  vIncentiveData: {
    emissionPerSecond: '104166666666666',
    incentivesLastUpdateTimestamp: 1631587387,
    tokenIncentivesIndex: '26465727412280876',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000v',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  sIncentiveData: {
    emissionPerSecond: '0',
    incentivesLastUpdateTimestamp: 0,
    tokenIncentivesIndex: '0',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000s',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
};

export const aUSDCReserveIncentiveData: ReserveIncentiveWithFeedsResponse = {
  underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  aIncentiveData: {
    emissionPerSecond: '4629629629629629',
    incentivesLastUpdateTimestamp: 1631586625,
    tokenIncentivesIndex: '16055272805126608426463068',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000a',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  vIncentiveData: {
    emissionPerSecond: '4629629629629629',
    incentivesLastUpdateTimestamp: 1631586625,
    tokenIncentivesIndex: '21239260963515875537848724',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000v',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  sIncentiveData: {
    emissionPerSecond: '0',
    incentivesLastUpdateTimestamp: 0,
    tokenIncentivesIndex: '0',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000s',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
};

export const aXSUSHIReserveIncentiveData: ReserveIncentiveWithFeedsResponse = {
  underlyingAsset: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
  aIncentiveData: {
    emissionPerSecond: '173611111111111',
    incentivesLastUpdateTimestamp: 1631586256,
    tokenIncentivesIndex: '23156815865521',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000a',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  vIncentiveData: {
    emissionPerSecond: '0',
    incentivesLastUpdateTimestamp: 1629797428,
    tokenIncentivesIndex: '0',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000v',
    rewardTokenAddress: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
  sIncentiveData: {
    emissionPerSecond: '0',
    incentivesLastUpdateTimestamp: 0,
    tokenIncentivesIndex: '0',
    emissionEndTimestamp: 1637573428,
    tokenAddress: '0x000000000000000000000000000000000000000s',
    rewardTokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
    rewardTokenDecimals: 18,
    precision: 18,
    priceFeed: '78530386771994300',
    priceFeedTimestamp: 1000000000,
    priceFeedDecimals: 8,
  },
};

// User Incentives

export const aETHUserIncentiveData: UserReserveIncentiveDataHumanizedResponse =
  {
    underlyingAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    aTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000a',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    vTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '24934844000963410',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000v',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    sTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000s',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
  };

export const aUSDCUserIncentiveData: UserReserveIncentiveDataHumanizedResponse =
  {
    underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    aTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '8399742855606485876888576',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000a',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    vTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000v',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    sTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000s',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
  };

export const aXSUSHIUserIncentiveData: UserReserveIncentiveDataHumanizedResponse =
  {
    underlyingAsset: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
    aTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000a',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    vTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000v',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
    sTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000s',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
      rewardTokenDecimals: 18,
    },
  };

export const aUSDCUserIncentiveDataMultiController: UserReserveIncentiveDataHumanizedResponse =
  {
    underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    aTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '8399742855606485876888576',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000a',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000001',
      rewardTokenDecimals: 18,
    },
    vTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000v',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000002',
      rewardTokenDecimals: 18,
    },
    sTokenIncentivesUserData: {
      tokenIncentivesUserIndex: '0',
      userUnclaimedRewards: '43921819137644870',
      tokenAddress: '0x000000000000000000000000000000000000000s',
      rewardTokenAddress: '0x0000000000000000000000000000000000000000',
      incentiveControllerAddress: '0x0000000000000000000000000000000000000003',
      rewardTokenDecimals: 18,
    },
  };

// Total user incentives inputs
export const reserveIncentives: ReserveIncentiveWithFeedsResponse[] = [
  aETHReserveIncentiveData,
  aUSDCReserveIncentiveData,
  aXSUSHIReserveIncentiveData,
];
export const reserveIncentivesMissingUSDC: ReserveIncentiveWithFeedsResponse[] =
  [aETHReserveIncentiveData, aXSUSHIReserveIncentiveData];
export const userReserveIncentives = [
  aETHUserIncentiveData,
  aUSDCUserIncentiveData,
  aXSUSHIUserIncentiveData,
];

export const aETHReserve: UserReserveCalculationData = {
  underlyingAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  totalLiquidity: '2003772886310189627431436',
  liquidityIndex: '1007431539067282236768346040',
  totalScaledVariableDebt: '81689984341288838884434',
  totalPrincipalStableDebt: '681322787738991248642',
  scaledATokenBalance: '99353924118371338',
  scaledVariableDebt: '0',
  principalStableDebt: '0',
};
export const aUSDCReserve: UserReserveCalculationData = {
  underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  totalLiquidity: '5787718415383817',
  liquidityIndex: '1051634606451872054462648399',
  totalScaledVariableDebt: '4830283465422516',
  totalPrincipalStableDebt: '42316057119911',
  scaledATokenBalance: '2328085146',
  scaledVariableDebt: '48856783',
  principalStableDebt: '0',
};
export const aXSUSHIReserve: UserReserveCalculationData = {
  underlyingAsset: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
  totalLiquidity: '12633368340656382491578069',
  liquidityIndex: '1000123598083549765972697918',
  totalScaledVariableDebt: '40044734186804090188243',
  totalPrincipalStableDebt: '0',
  scaledATokenBalance: '1031991722452535126997',
  scaledVariableDebt: '0',
  principalStableDebt: '0',
};
export const userReserves: UserReserveCalculationData[] = [
  aETHReserve,
  aUSDCReserve,
  aXSUSHIReserve,
];

// Total reserve incentives inputs

export const allIncentivesReserves: ReserveCalculationData[] = [
  {
    underlyingAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'ETH',
    totalLiquidity: '2003772886310189627431436',
    totalVariableDebt: '81689984341288838884434',
    totalStableDebt: '681322787738991248642',
    priceInMarketReferenceCurrency: '1000000000000000000',
    marketReferenceCurrencyDecimals: 18,
    decimals: 18,
  },
  {
    underlyingAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    totalLiquidity: '1037303607422151',
    totalVariableDebt: '905362631532314',
    totalStableDebt: '0',
    priceInMarketReferenceCurrency: '267145370000000',
    marketReferenceCurrencyDecimals: 18,
    decimals: 6,
  },
  {
    underlyingAsset: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
    symbol: 'XSUSHI',
    totalLiquidity: '13051166036525999213246575',
    totalVariableDebt: '404110132365797056457861',
    totalStableDebt: '0',
    priceInMarketReferenceCurrency: '3441563382242556',
    marketReferenceCurrencyDecimals: 18,
    decimals: 18,
  },
];

// Used as price feed for stkAave incentives
const aaveReserve: ReserveCalculationData = {
  underlyingAsset: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  symbol: 'AAVE',
  totalLiquidity: '0',
  totalVariableDebt: '0',
  totalStableDebt: '0',
  priceInMarketReferenceCurrency: '78530386771994300',
  marketReferenceCurrencyDecimals: 18,
  decimals: 18,
};

export const allIncentivesReservesWithRewardReserve: ReserveCalculationData[] =
  [...allIncentivesReserves, aaveReserve];

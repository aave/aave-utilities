import {
  getLinearBalance,
  calculateCompoundedInterest,
  getCompoundedBalance,
  calculateLinearInterest,
  getReserveNormalizedIncome,
  getCompoundedStableBalance,
  calculateHealthFactorFromBalances,
  calculateHealthFactorFromBalancesBigUnits,
  calculateAvailableBorrowsMarketReferenceCurrency,
  getMarketReferenceCurrencyAndUsdBalance,
} from './pool-math';

describe('pool math', () => {
  it('should compute collateral balance from blockchain data', () => {
    // Data exported from user 0xa5a69107816c5e3dfa5561e6b621dfe6294f6e5b
    // at block number: 11581421
    // reserve: YFI
    const scaledATokenBalance = '161316503206059870';
    const liquidityIndex = '1001723339432542553527150680';
    const currentLiquidityRate = '22461916953455574582370088';
    const lastUpdateTimestamp = 1609673617;
    // At a later time, but on the same block
    // expected balance computed with hardhat
    const currentTimestamp = 1609675535;
    const expectedATokenBalance = '161594727054623229';
    const underlyingBalance = getLinearBalance({
      balance: scaledATokenBalance,
      index: liquidityIndex,
      rate: currentLiquidityRate,
      lastUpdateTimestamp,
      currentTimestamp,
    }).toString();
    expect(underlyingBalance).toEqual(expectedATokenBalance);
  });

  it('should calculate compounded interest', () => {
    const compoundedInterestRequest = {
      rate: 500000000000000000,
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const interest = calculateCompoundedInterest(compoundedInterestRequest);
    expect(interest.toFixed()).toEqual('1000000001585491184589599100');
  });

  it('should calculate compounded balance', () => {
    const compoundedBalanceRequest = {
      principalBalance: 10000,
      reserveIndex: '1048540642417873765200833079',
      reserveRate: 500000000000000000,
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const balance = getCompoundedBalance(compoundedBalanceRequest);
    expect(balance.toFixed()).toEqual('10485');

    const compoundedBalanceZeroRequest = {
      principalBalance: 0,
      reserveIndex: '1048540642417873765200833079',
      reserveRate: 500000000000000000,
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const balanceZero = getCompoundedBalance(compoundedBalanceZeroRequest);
    expect(balanceZero.toFixed()).toEqual('0');
  });

  it('should calculate linear interest', () => {
    const linearInterestRequest = {
      rate: 500000000000000000,
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const linearInterest = calculateLinearInterest(linearInterestRequest);
    expect(linearInterest.toFixed()).toEqual('1000000001585491184677828513');
  });

  it('should calculate reserve normalized income', () => {
    const reserveNormalizedIncomeRequest = {
      rate: 500000000000000000,
      index: '1048540642417873765200833079',
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const reserveNormalizedIncome = getReserveNormalizedIncome(
      reserveNormalizedIncomeRequest,
    );
    expect(reserveNormalizedIncome.toFixed()).toEqual(
      '1048540644080325710530799122',
    );
  });

  it('should return index if rate is 0', () => {
    const reserveNormalizedIncomeRequest = {
      rate: 0,
      index: '1048540642417873800000000000',
      currentTimestamp: 1729942300,
      lastUpdateTimestamp: 1629942200,
    };
    const reserveNormalizedIncome = getReserveNormalizedIncome(
      reserveNormalizedIncomeRequest,
    );
    expect(reserveNormalizedIncome.toFixed()).toEqual(
      '1048540642417873800000000000',
    );
  });

  it('should calculate compounded stable balances', () => {
    const compoundedStableBalanceRequest = {
      principalBalance: 2000000000000000000,
      userStableRate: 500000000000000000,
      currentTimestamp: 1749942229,
      lastUpdateTimestamp: 1629942229,
    };
    const compoundedStableBalance = getCompoundedStableBalance(
      compoundedStableBalanceRequest,
    );
    expect(compoundedStableBalance.toFixed()).toEqual('2000000003805175038');
  });

  it('should calculate health factor', () => {
    const minHealthFactorRequest = {
      collateralBalanceMarketReferenceCurrency: 100000000000000000,
      borrowBalanceMarketReferenceCurrency: 50000000000000000,
      currentLiquidationThreshold: 5000,
    };
    const minHealthFactor = calculateHealthFactorFromBalances(
      minHealthFactorRequest,
    );
    expect(minHealthFactor.toFixed()).toEqual('1');
    const healthFactorRequest = {
      collateralBalanceMarketReferenceCurrency: 100000000000000000,
      borrowBalanceMarketReferenceCurrency: 30000000000000000,
      currentLiquidationThreshold: 5000,
    };
    const healthFactor = calculateHealthFactorFromBalances(healthFactorRequest);
    expect(healthFactor.toFixed()).toEqual('1.66666666666666666667');
  });

  it('should return -1 health factor if borrowBalance is 0', () => {
    const healthFactorRequest = {
      collateralBalanceMarketReferenceCurrency: 100000000000000000,
      borrowBalanceMarketReferenceCurrency: 0,
      currentLiquidationThreshold: 5000,
    };
    const healthFactor = calculateHealthFactorFromBalances(healthFactorRequest);
    expect(healthFactor.toFixed()).toEqual('-1');
  });

  it('should calculate big unit health factor', () => {
    const minHealthFactorRequest = {
      collateralBalanceMarketReferenceCurrency: 100000000000000000,
      borrowBalanceMarketReferenceCurrency: 50000000000000000,
      currentLiquidationThreshold: 5000,
    };
    const minHealthFactor = calculateHealthFactorFromBalancesBigUnits(
      minHealthFactorRequest,
    );
    expect(minHealthFactor.toFixed()).toEqual('10000');
    const healthFactorRequest = {
      collateralBalanceMarketReferenceCurrency: 100000000000000000,
      borrowBalanceMarketReferenceCurrency: 30000000000000000,
      currentLiquidationThreshold: 5000,
    };
    const healthFactor =
      calculateHealthFactorFromBalancesBigUnits(healthFactorRequest);
    expect(healthFactor.toFixed()).toEqual('16666.66666666666666666667');
  });

  it('should calculate availableBorrows', () => {
    const availableBorrowsMaxedRequest = {
      collateralBalanceMarketReferenceCurrency: 1000000000000000000,
      borrowBalanceMarketReferenceCurrency: 50000000000000000,
      currentLtv: 0.5,
    };
    const availableBorrowsMaxed =
      calculateAvailableBorrowsMarketReferenceCurrency(
        availableBorrowsMaxedRequest,
      );
    expect(availableBorrowsMaxed.toFixed()).toEqual('0');
    const availableBorrowsRequest = {
      collateralBalanceMarketReferenceCurrency: 1000000000000000000,
      borrowBalanceMarketReferenceCurrency: 30000000000000000,
      currentLtv: 0.5,
    };
    const availableBorrows = calculateAvailableBorrowsMarketReferenceCurrency(
      availableBorrowsRequest,
    );
    expect(availableBorrows.toFixed()).toEqual('0');
  });

  it('should return availableBorrows = 0 if currentLtv = 0', () => {
    const availableBorrowsRequest = {
      collateralBalanceMarketReferenceCurrency: 1000000000000000000,
      borrowBalanceMarketReferenceCurrency: 50000000000000000,
      currentLtv: 0,
    };
    const availableBorrows = calculateAvailableBorrowsMarketReferenceCurrency(
      availableBorrowsRequest,
    );
    expect(availableBorrows.toFixed()).toEqual('0');
  });

  it('should convert balances to MarketReferenceCurrency and USD', () => {
    const balanceRequest = {
      balance: 10 ** 19, // 10
      priceInMarketReferenceCurrency: 10 ** 18, // 1
      marketReferenceCurrencyDecimals: 18,
      decimals: 18,
      marketReferencePriceInUsdNormalized: 2.5,
    };
    const { marketReferenceCurrencyBalance, usdBalance } =
      getMarketReferenceCurrencyAndUsdBalance(balanceRequest);
    expect(marketReferenceCurrencyBalance.toNumber()).toEqual(
      10 * 10 ** balanceRequest.marketReferenceCurrencyDecimals,
    );
    expect(usdBalance.toNumber()).toEqual(25);
  });
});

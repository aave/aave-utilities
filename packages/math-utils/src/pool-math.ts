import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  valueToBigNumber,
  valueToZDBigNumber,
} from './bignumber';
import { SECONDS_PER_YEAR, LTV_PRECISION, USD_DECIMALS } from './constants';
import * as RayMath from './ray.math';

interface CalculateCompoundedInterestRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateCompoundedInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: CalculateCompoundedInterestRequest): BigNumber {
  const timeDelta = valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp);
  const ratePerSecond = valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR);
  return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta);
}

interface CompoundedBalanceRequest {
  principalBalance: BigNumberValue;
  reserveIndex: BigNumberValue;
  reserveRate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}

export function getCompoundedBalance({
  principalBalance: _principalBalance,
  reserveIndex,
  reserveRate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CompoundedBalanceRequest): BigNumber {
  const principalBalance = valueToZDBigNumber(_principalBalance);
  if (principalBalance.eq('0')) {
    return principalBalance;
  }

  const compoundedInterest = calculateCompoundedInterest({
    rate: reserveRate,
    currentTimestamp,
    lastUpdateTimestamp,
  });
  const cumulatedInterest = RayMath.rayMul(compoundedInterest, reserveIndex);
  const principalBalanceRay = RayMath.wadToRay(principalBalance);

  return RayMath.rayToWad(
    RayMath.rayMul(principalBalanceRay, cumulatedInterest),
  );
}

interface LinearInterestRequest {
  rate: BigNumberValue;
  currentTimestamp: number;
  lastUpdateTimestamp: number;
}

export function calculateLinearInterest({
  rate,
  currentTimestamp,
  lastUpdateTimestamp,
}: LinearInterestRequest): BigNumber {
  const timeDelta = RayMath.wadToRay(
    valueToZDBigNumber(currentTimestamp - lastUpdateTimestamp),
  );
  const timeDeltaInSeconds = RayMath.rayDiv(
    timeDelta,
    RayMath.wadToRay(SECONDS_PER_YEAR),
  );
  const a = RayMath.rayMul(rate, timeDeltaInSeconds).plus(RayMath.RAY);
  return a;
}

interface ReserveNormalizedIncomeRequest {
  rate: BigNumberValue;
  index: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getReserveNormalizedIncome({
  rate,
  index,
  lastUpdateTimestamp,
  currentTimestamp,
}: ReserveNormalizedIncomeRequest): BigNumber {
  if (valueToZDBigNumber(rate).eq('0')) {
    return valueToZDBigNumber(index);
  }

  const cumulatedInterest = calculateLinearInterest({
    rate,
    currentTimestamp,
    lastUpdateTimestamp,
  });

  return RayMath.rayMul(cumulatedInterest, index);
}

interface LinearBalanceRequest {
  balance: BigNumberValue;
  index: BigNumberValue;
  rate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getLinearBalance({
  balance,
  index,
  rate,
  lastUpdateTimestamp,
  currentTimestamp,
}: LinearBalanceRequest) {
  return RayMath.rayToWad(
    RayMath.rayMul(
      RayMath.wadToRay(balance),
      getReserveNormalizedIncome({
        rate,
        index,
        lastUpdateTimestamp,
        currentTimestamp,
      }),
    ),
  );
}

interface CompoundedStableBalanceRequest {
  principalBalance: BigNumberValue;
  userStableRate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}

export function getCompoundedStableBalance({
  principalBalance: _principalBalance,
  userStableRate,
  lastUpdateTimestamp,
  currentTimestamp,
}: CompoundedStableBalanceRequest): BigNumber {
  const principalBalance = valueToZDBigNumber(_principalBalance);
  if (principalBalance.eq('0')) {
    return principalBalance;
  }

  const cumulatedInterest = calculateCompoundedInterest({
    rate: userStableRate,
    currentTimestamp,
    lastUpdateTimestamp,
  });
  const principalBalanceRay = RayMath.wadToRay(principalBalance);

  return RayMath.rayToWad(
    RayMath.rayMul(principalBalanceRay, cumulatedInterest),
  );
}

interface HealthFactorFromBalanceRequest {
  collateralBalanceETH: BigNumberValue;
  borrowBalanceETH: BigNumberValue;
  currentLiquidationThreshold: BigNumberValue;
}

export function calculateHealthFactorFromBalances({
  borrowBalanceETH,
  collateralBalanceETH,
  currentLiquidationThreshold,
}: HealthFactorFromBalanceRequest): BigNumber {
  if (valueToBigNumber(borrowBalanceETH).eq(0)) {
    return valueToBigNumber('-1'); // Invalid number
  }

  return valueToBigNumber(collateralBalanceETH)
    .multipliedBy(currentLiquidationThreshold)
    .shiftedBy(LTV_PRECISION * -1)
    .div(borrowBalanceETH);
}

interface HealthFactorFromBalanceBigUnitsRequest {
  collateralBalanceETH: BigNumberValue;
  borrowBalanceETH: BigNumberValue;
  currentLiquidationThreshold: BigNumberValue;
}
export function calculateHealthFactorFromBalancesBigUnits({
  collateralBalanceETH,
  borrowBalanceETH,
  currentLiquidationThreshold,
}: HealthFactorFromBalanceBigUnitsRequest): BigNumber {
  return calculateHealthFactorFromBalances({
    collateralBalanceETH,
    borrowBalanceETH,
    currentLiquidationThreshold: valueToBigNumber(currentLiquidationThreshold)
      .shiftedBy(LTV_PRECISION)
      .decimalPlaces(0, BigNumber.ROUND_DOWN),
  });
}

interface AvailableBorrowsETHRequest {
  collateralBalanceETH: BigNumberValue;
  borrowBalanceETH: BigNumberValue;
  currentLtv: BigNumberValue;
}

export function calculateAvailableBorrowsETH({
  collateralBalanceETH,
  borrowBalanceETH,
  currentLtv,
}: AvailableBorrowsETHRequest): BigNumber {
  if (valueToZDBigNumber(currentLtv).eq(0)) {
    return valueToZDBigNumber('0');
  }

  const availableBorrowsETH = valueToZDBigNumber(collateralBalanceETH)
    .multipliedBy(currentLtv)
    .shiftedBy(LTV_PRECISION * -1)
    .minus(borrowBalanceETH);
  return availableBorrowsETH.gt('0')
    ? availableBorrowsETH
    : valueToZDBigNumber('0');
}

interface MarketReferenceCurrencyAndUsdBalanceRequest {
  balance: BigNumberValue;
  priceInMarketReferenceCurrency: BigNumberValue;
  decimals: number;
  usdPriceMarketReferenceCurrency: BigNumberValue;
}

interface EthAndUsdBalanceResponse {
  marketReferenceCurrencyBalance: BigNumber;
  usdBalance: BigNumber;
}
export function getMarketReferenceCurrencyAndUsdBalance({
  balance,
  priceInMarketReferenceCurrency,
  decimals,
  usdPriceMarketReferenceCurrency,
}: MarketReferenceCurrencyAndUsdBalanceRequest): EthAndUsdBalanceResponse {
  const marketReferenceCurrencyBalance = valueToZDBigNumber(balance)
    .multipliedBy(priceInMarketReferenceCurrency)
    .shiftedBy(decimals * -1);
  const usdBalance = marketReferenceCurrencyBalance
    .shiftedBy(USD_DECIMALS)
    .dividedBy(usdPriceMarketReferenceCurrency);
  return { marketReferenceCurrencyBalance, usdBalance };
}

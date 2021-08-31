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

export function calculateCompoundedInterest(
  request: CalculateCompoundedInterestRequest,
): BigNumber {
  const timeDelta = valueToZDBigNumber(
    request.currentTimestamp - request.lastUpdateTimestamp,
  );
  const ratePerSecond = valueToZDBigNumber(request.rate).dividedBy(
    SECONDS_PER_YEAR,
  );
  return RayMath.binomialApproximatedRayPow(ratePerSecond, timeDelta);
}

interface CompoundedBalanceRequest {
  principalBalance: BigNumberValue;
  reserveIndex: BigNumberValue;
  reserveRate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}

export function getCompoundedBalance(
  request: CompoundedBalanceRequest,
): BigNumber {
  const principalBalance = valueToZDBigNumber(request.principalBalance);
  if (principalBalance.eq('0')) {
    return principalBalance;
  }

  const compoundedInterest = calculateCompoundedInterest({
    rate: request.reserveRate,
    currentTimestamp: request.currentTimestamp,
    lastUpdateTimestamp: request.lastUpdateTimestamp,
  });
  const cumulatedInterest = RayMath.rayMul(
    compoundedInterest,
    request.reserveIndex,
  );
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

export function calculateLinearInterest(
  request: LinearInterestRequest,
): BigNumber {
  const timeDelta = RayMath.wadToRay(
    valueToZDBigNumber(request.currentTimestamp - request.lastUpdateTimestamp),
  );
  const timeDeltaInSeconds = RayMath.rayDiv(
    timeDelta,
    RayMath.wadToRay(SECONDS_PER_YEAR),
  );
  const a = RayMath.rayMul(request.rate, timeDeltaInSeconds).plus(RayMath.RAY);
  return a;
}

interface ReserveNormalizedIncomeRequest {
  rate: BigNumberValue;
  index: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getReserveNormalizedIncome(
  request: ReserveNormalizedIncomeRequest,
): BigNumber {
  if (valueToZDBigNumber(request.rate).eq('0')) {
    return valueToZDBigNumber(request.index);
  }

  const cumulatedInterest = calculateLinearInterest({
    rate: request.rate,
    currentTimestamp: request.currentTimestamp,
    lastUpdateTimestamp: request.lastUpdateTimestamp,
  });

  return RayMath.rayMul(cumulatedInterest, request.index);
}

interface LinearBalanceRequest {
  balance: BigNumberValue;
  index: BigNumberValue;
  rate: BigNumberValue;
  lastUpdateTimestamp: number;
  currentTimestamp: number;
}
export function getLinearBalance(request: LinearBalanceRequest) {
  return RayMath.rayToWad(
    RayMath.rayMul(
      RayMath.wadToRay(request.balance),
      getReserveNormalizedIncome({
        rate: request.rate,
        index: request.index,
        lastUpdateTimestamp: request.lastUpdateTimestamp,
        currentTimestamp: request.currentTimestamp,
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

export function getCompoundedStableBalance(
  request: CompoundedStableBalanceRequest,
): BigNumber {
  const principalBalance = valueToZDBigNumber(request.principalBalance);
  if (principalBalance.eq('0')) {
    return principalBalance;
  }

  const cumulatedInterest = calculateCompoundedInterest({
    rate: request.userStableRate,
    currentTimestamp: request.currentTimestamp,
    lastUpdateTimestamp: request.lastUpdateTimestamp,
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

export function calculateHealthFactorFromBalances(
  request: HealthFactorFromBalanceRequest,
): BigNumber {
  if (valueToBigNumber(request.borrowBalanceETH).eq(0)) {
    return valueToBigNumber('-1'); // Invalid number
  }

  return valueToBigNumber(request.collateralBalanceETH)
    .multipliedBy(request.currentLiquidationThreshold)
    .shiftedBy(LTV_PRECISION * -1)
    .div(request.borrowBalanceETH);
}

interface HealthFactorFromBalanceBigUnitsRequest {
  collateralBalanceETH: BigNumberValue;
  borrowBalanceETH: BigNumberValue;
  currentLiquidationThreshold: BigNumberValue;
}
export function calculateHealthFactorFromBalancesBigUnits(
  request: HealthFactorFromBalanceBigUnitsRequest,
): BigNumber {
  return calculateHealthFactorFromBalances({
    collateralBalanceETH: request.collateralBalanceETH,
    borrowBalanceETH: request.borrowBalanceETH,
    currentLiquidationThreshold: valueToBigNumber(
      request.currentLiquidationThreshold,
    )
      .shiftedBy(LTV_PRECISION)
      .decimalPlaces(0, BigNumber.ROUND_DOWN),
  });
}

interface AvailableBorrowsETHRequest {
  collateralBalanceETH: BigNumberValue;
  borrowBalanceETH: BigNumberValue;
  currentLtv: BigNumberValue;
}

export function calculateAvailableBorrowsETH(
  request: AvailableBorrowsETHRequest,
): BigNumber {
  if (valueToZDBigNumber(request.currentLtv).eq(0)) {
    return valueToZDBigNumber('0');
  }

  const availableBorrowsETH = valueToZDBigNumber(request.collateralBalanceETH)
    .multipliedBy(request.currentLtv)
    .shiftedBy(LTV_PRECISION * -1)
    .minus(request.borrowBalanceETH);
  return availableBorrowsETH.gt('0')
    ? availableBorrowsETH
    : valueToZDBigNumber('0');
}

interface EthAndUsdBalanceRequest {
  balance: BigNumberValue;
  priceInEth: BigNumberValue;
  decimals: number;
  usdPriceEth: BigNumberValue;
}

interface EthAndUsdBalanceResponse {
  ethBalance: BigNumber;
  usdBalance: BigNumber;
}
export function getEthAndUsdBalance(
  request: EthAndUsdBalanceRequest,
): EthAndUsdBalanceResponse {
  const ethBalance = valueToZDBigNumber(request.balance)
    .multipliedBy(request.priceInEth)
    .shiftedBy(request.decimals * -1);
  const usdBalance = ethBalance
    .shiftedBy(USD_DECIMALS)
    .dividedBy(request.usdPriceEth);
  return { ethBalance, usdBalance };
}

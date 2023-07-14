import { normalize } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';
import { getCompoundedBalance } from '../../pool-math';
import { rayMul } from '../../ray.math';
import { calculateCompoundedRate } from '../compounded-interest';

export interface GhoReserveData {
  ghoBaseVariableBorrowRate: string;
  ghoReserveLastUpdateTimestamp: string;
  ghoDiscountedPerToken: string;
  ghoDiscountRate: string;
  ghoMinDebtTokenBalanceForDiscount: string;
  ghoMinDiscountTokenBalanceForDiscount: string;
  ghoCurrentBorrowIndex: string;
  aaveFacilitatorBucketLevel: string;
  aaveFacilitatorBucketMaxCapacity: string;
}

export interface GhoUserData {
  userGhoDiscountPercent: string;
  userDiscountTokenBalance: string;
  userPreviousGhoBorrowIndex: string;
  userGhoScaledBorrowBalance: string;
}

export interface FormattedGhoReserveData {
  aaveFacilitatorRemainingCapacity: number;
  aaveFacilitatorMintedPercent: number;
  aaveFacilitatorBucketLevel: number;
  aaveFacilitatorBucketMaxCapacity: number;
  ghoBorrowAPYWithMaxDiscount: number;
  ghoBaseVariableBorrowRate: number;
  ghoVariableBorrowAPY: number;
  ghoDiscountedPerToken: number;
  ghoDiscountRate: number;
  ghoMinDebtTokenBalanceForDiscount: number;
  ghoMinDiscountTokenBalanceForDiscount: number;
}

export interface FormattedGhoUserData {
  userGhoDiscountPercent: number;
  userDiscountTokenBalance: number;
  userGhoBorrowBalance: number;
  userDiscountedGhoInterest: number;
  userGhoAvailableToBorrowAtDiscount: number;
}

export function formatGhoReserveData({
  ghoReserveData,
}: {
  ghoReserveData: GhoReserveData;
}): FormattedGhoReserveData {
  const formattedGhoDiscountedPerToken = Number(
    normalize(ghoReserveData.ghoDiscountedPerToken, 18),
  );
  const formattedFacilitatorBucketLevel = Number(
    normalize(ghoReserveData.aaveFacilitatorBucketLevel, 18),
  );
  const formattedFacilitatorBucketMaxCapacity = Number(
    normalize(ghoReserveData.aaveFacilitatorBucketMaxCapacity, 18),
  );
  const formattedVariableBorrowAPY = calculateCompoundedRate({
    rate: ghoReserveData.ghoBaseVariableBorrowRate,
    duration: SECONDS_PER_YEAR,
  })
    .shiftedBy(-27)
    .toNumber();
  const formattedGhoDiscountRate = Number(
    normalize(ghoReserveData.ghoDiscountRate, 4),
  );
  return {
    ghoBaseVariableBorrowRate: Number(
      normalize(ghoReserveData.ghoBaseVariableBorrowRate, 27),
    ),
    ghoDiscountedPerToken: formattedGhoDiscountedPerToken,
    ghoDiscountRate: formattedGhoDiscountRate,
    aaveFacilitatorBucketLevel: formattedFacilitatorBucketLevel,
    aaveFacilitatorBucketMaxCapacity: formattedFacilitatorBucketMaxCapacity,
    ghoMinDebtTokenBalanceForDiscount: Number(
      normalize(ghoReserveData.ghoMinDebtTokenBalanceForDiscount, 18),
    ),
    ghoMinDiscountTokenBalanceForDiscount: Number(
      normalize(ghoReserveData.ghoMinDiscountTokenBalanceForDiscount, 18),
    ),
    ghoVariableBorrowAPY: formattedVariableBorrowAPY,
    aaveFacilitatorRemainingCapacity:
      formattedFacilitatorBucketMaxCapacity - formattedFacilitatorBucketLevel,
    aaveFacilitatorMintedPercent:
      formattedFacilitatorBucketMaxCapacity === 0
        ? 0
        : formattedFacilitatorBucketLevel /
          formattedFacilitatorBucketMaxCapacity,
    ghoBorrowAPYWithMaxDiscount:
      formattedVariableBorrowAPY * (1 - formattedGhoDiscountRate),
  };
}

export function formatGhoUserData({
  ghoReserveData,
  ghoUserData,
  currentTimestamp,
}: {
  ghoReserveData: GhoReserveData;
  ghoUserData: GhoUserData;
  currentTimestamp: number;
}): FormattedGhoUserData {
  const formattedUserDiscountTokenBalance = Number(
    normalize(ghoUserData.userDiscountTokenBalance, 18),
  );

  const formattedRequiredTokenBalanceForDiscount = Number(
    normalize(ghoReserveData.ghoMinDiscountTokenBalanceForDiscount, 18),
  );

  let userGhoAvailableToBorrowAtDiscount =
    Number(normalize(ghoReserveData.ghoDiscountedPerToken, 18)) *
    formattedUserDiscountTokenBalance;

  if (
    formattedUserDiscountTokenBalance < formattedRequiredTokenBalanceForDiscount
  ) {
    userGhoAvailableToBorrowAtDiscount = 0;
  }

  const userBalancePreDiscount = getCompoundedBalance({
    principalBalance: ghoUserData.userGhoScaledBorrowBalance,
    reserveIndex: ghoReserveData.ghoCurrentBorrowIndex,
    reserveRate: ghoReserveData.ghoBaseVariableBorrowRate,
    lastUpdateTimestamp: Number(ghoReserveData.ghoReserveLastUpdateTimestamp),
    currentTimestamp,
  });
  const accruedInterest = userBalancePreDiscount.minus(
    rayMul(
      ghoUserData.userGhoScaledBorrowBalance,
      ghoUserData.userPreviousGhoBorrowIndex,
    ),
  );
  const discount = accruedInterest.multipliedBy(
    1 - Number(normalize(ghoUserData.userGhoDiscountPercent, 4)),
  );
  const userBorrowBalance = userBalancePreDiscount.minus(discount);
  return {
    userGhoDiscountPercent: Number(
      normalize(ghoUserData.userGhoDiscountPercent, 4),
    ),
    userDiscountTokenBalance: formattedUserDiscountTokenBalance,
    userGhoBorrowBalance: Number(normalize(userBorrowBalance, 18)),
    userDiscountedGhoInterest: Number(normalize(discount, 18)),
    userGhoAvailableToBorrowAtDiscount,
  };
}

interface FormattedUserSummarySubset {
  totalBorrowsUSD: string;
  totalBorrowsMarketReferenceCurrency: string;
  netWorthUSD: string;
  availableBorrowsMarketReferenceCurrency: string;
  availableBorrowsUSD: string;
  healthFactor: string;
  currentLiquidationThreshold: string;
  totalCollateralMarketReferenceCurrency: string;
}

export function formatUserSummaryWithDiscount({
  userGhoDiscountedInterest,
  user,
  marketReferenceCurrencyPriceUSD,
}: {
  user: FormattedUserSummarySubset;
  userGhoDiscountedInterest: number;
  marketReferenceCurrencyPriceUSD: number;
}): FormattedUserSummarySubset {
  const totalBorrowsAfterDiscountUSD =
    Number(user.totalBorrowsUSD) - userGhoDiscountedInterest;

  const availableBorrowsAfterDiscountUSD =
    Number(user.availableBorrowsUSD) + userGhoDiscountedInterest;

  const totalBorrowsMarketReferenceCurrency =
    Number(user.totalBorrowsMarketReferenceCurrency) -
    userGhoDiscountedInterest / marketReferenceCurrencyPriceUSD;

  const healthFactor =
    totalBorrowsMarketReferenceCurrency === 0
      ? '-1'
      : (Number(user.totalCollateralMarketReferenceCurrency) *
          Number(user.currentLiquidationThreshold)) /
        totalBorrowsMarketReferenceCurrency;

  return {
    ...user,
    totalBorrowsMarketReferenceCurrency:
      totalBorrowsMarketReferenceCurrency.toString(),
    totalBorrowsUSD: totalBorrowsAfterDiscountUSD.toString(),
    netWorthUSD: (
      Number(user.netWorthUSD) + userGhoDiscountedInterest
    ).toString(),
    availableBorrowsUSD: availableBorrowsAfterDiscountUSD.toString(),
    availableBorrowsMarketReferenceCurrency: (
      availableBorrowsAfterDiscountUSD / marketReferenceCurrencyPriceUSD
    ).toString(),
    healthFactor: healthFactor.toString(),
  };
}

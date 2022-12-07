import { normalize } from '../../bignumber';
import { SECONDS_PER_YEAR } from '../../constants';
import { calculateCompoundedRate } from '../compounded-interest';
export interface GhoData {
  baseVariableBorrowRate: string;
  ghoDiscountedPerToken: string;
  ghoDiscountRate: string;
  ghoDiscountLockPeriod: string;
  facilitatorBucketLevel: string;
  facilitatorBucketMaxCapacity: string;
  ghoMinDebtTokenBalanceForDiscount: string;
  ghoMinDiscountTokenBalanceForDiscount: string;
  userGhoDiscountRate: string;
  userDiscountTokenBalance: string;
}

export interface FormattedGhoData extends GhoData {
  variableBorrowAPY: string;
  discountableAmount: string;
  facilitatorRemainingCapacity: string;
  facilitatorMintedPercent: string;
  borrowAPYWithMaxDiscount: string;
}

export function formatGhoData({
  ghoData,
}: {
  ghoData: GhoData;
}): FormattedGhoData {
  const formattedGhoDiscountedPerToken = normalize(
    ghoData.ghoDiscountedPerToken,
    18,
  );
  const formattedUserDiscountTokenBalance = normalize(
    ghoData.userDiscountTokenBalance,
    18,
  );
  const formattedFacilitatorBucketLevel = normalize(
    ghoData.facilitatorBucketLevel,
    18,
  );
  const formattedFacilitatorBucketMaxCapacity = normalize(
    ghoData.facilitatorBucketMaxCapacity,
    18,
  );
  const formattedVariableBorrowAPY = calculateCompoundedRate({
    rate: ghoData.baseVariableBorrowRate,
    duration: SECONDS_PER_YEAR,
  }).shiftedBy(-27);

  const formattedGhoDiscountRate = normalize(ghoData.ghoDiscountRate, 4);
  const bucketCapacityNumber = Number(formattedFacilitatorBucketMaxCapacity);
  return {
    baseVariableBorrowRate: normalize(ghoData.baseVariableBorrowRate, 27),
    ghoDiscountedPerToken: formattedGhoDiscountedPerToken,
    ghoDiscountRate: formattedGhoDiscountRate,
    ghoDiscountLockPeriod: ghoData.ghoDiscountLockPeriod,
    facilitatorBucketLevel: formattedFacilitatorBucketLevel,
    facilitatorBucketMaxCapacity: formattedFacilitatorBucketMaxCapacity,
    ghoMinDebtTokenBalanceForDiscount: normalize(
      ghoData.ghoMinDebtTokenBalanceForDiscount,
      18,
    ),
    ghoMinDiscountTokenBalanceForDiscount: normalize(
      ghoData.ghoMinDiscountTokenBalanceForDiscount,
      18,
    ),
    userGhoDiscountRate: normalize(ghoData.userGhoDiscountRate, 4),
    userDiscountTokenBalance: formattedUserDiscountTokenBalance,
    variableBorrowAPY: formattedVariableBorrowAPY.toString(),
    discountableAmount: (
      Number(formattedGhoDiscountedPerToken) *
      Number(formattedUserDiscountTokenBalance)
    ).toString(),
    facilitatorRemainingCapacity: (
      Number(formattedFacilitatorBucketMaxCapacity) -
      Number(formattedFacilitatorBucketLevel)
    ).toString(),
    facilitatorMintedPercent:
      bucketCapacityNumber === 0
        ? '0'
        : (
            Number(formattedFacilitatorBucketLevel) / bucketCapacityNumber
          ).toString(),
    borrowAPYWithMaxDiscount: (
      formattedVariableBorrowAPY.toNumber() *
      (1 - Number(formattedGhoDiscountRate))
    ).toString(),
  };
}

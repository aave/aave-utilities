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

export interface FormattedGhoData {
  variableBorrowAPY: number;
  discountableAmount: number;
  facilitatorRemainingCapacity: number;
  facilitatorMintedPercent: number;
  borrowAPYWithMaxDiscount: number;
  baseVariableBorrowRate: number;
  ghoDiscountedPerToken: number;
  ghoDiscountRate: number;
  ghoDiscountLockPeriod: number;
  facilitatorBucketLevel: number;
  facilitatorBucketMaxCapacity: number;
  ghoMinDebtTokenBalanceForDiscount: number;
  ghoMinDiscountTokenBalanceForDiscount: number;
  userGhoDiscountRate: number;
  userDiscountTokenBalance: number;
}

export function formatGhoData({
  ghoData,
}: {
  ghoData: GhoData;
}): FormattedGhoData {
  const formattedGhoDiscountedPerToken = Number(
    normalize(ghoData.ghoDiscountedPerToken, 18),
  );
  const formattedUserDiscountTokenBalance = Number(
    normalize(ghoData.userDiscountTokenBalance, 18),
  );
  const formattedFacilitatorBucketLevel = Number(
    normalize(ghoData.facilitatorBucketLevel, 18),
  );
  const formattedFacilitatorBucketMaxCapacity = Number(
    normalize(ghoData.facilitatorBucketMaxCapacity, 18),
  );
  const formattedVariableBorrowAPY = calculateCompoundedRate({
    rate: ghoData.baseVariableBorrowRate,
    duration: SECONDS_PER_YEAR,
  })
    .shiftedBy(-27)
    .toNumber();
  const formattedGhoDiscountRate = Number(
    normalize(ghoData.ghoDiscountRate, 4),
  );
  return {
    baseVariableBorrowRate: Number(
      normalize(ghoData.baseVariableBorrowRate, 27),
    ),
    ghoDiscountedPerToken: formattedGhoDiscountedPerToken,
    ghoDiscountRate: formattedGhoDiscountRate,
    ghoDiscountLockPeriod: Number(ghoData.ghoDiscountLockPeriod),
    facilitatorBucketLevel: formattedFacilitatorBucketLevel,
    facilitatorBucketMaxCapacity: formattedFacilitatorBucketMaxCapacity,
    ghoMinDebtTokenBalanceForDiscount: Number(
      normalize(ghoData.ghoMinDebtTokenBalanceForDiscount, 18),
    ),
    ghoMinDiscountTokenBalanceForDiscount: Number(
      normalize(ghoData.ghoMinDiscountTokenBalanceForDiscount, 18),
    ),
    userGhoDiscountRate: Number(normalize(ghoData.userGhoDiscountRate, 4)),
    userDiscountTokenBalance: formattedUserDiscountTokenBalance,
    variableBorrowAPY: formattedVariableBorrowAPY,
    discountableAmount:
      formattedGhoDiscountedPerToken * formattedUserDiscountTokenBalance,
    facilitatorRemainingCapacity:
      formattedFacilitatorBucketMaxCapacity - formattedFacilitatorBucketLevel,
    facilitatorMintedPercent:
      formattedFacilitatorBucketMaxCapacity === 0
        ? 0
        : formattedFacilitatorBucketLevel /
          formattedFacilitatorBucketMaxCapacity,
    borrowAPYWithMaxDiscount:
      formattedVariableBorrowAPY * (1 - formattedGhoDiscountRate),
  };
}

import { normalize, valueToBigNumber } from 'math-utils/src/bignumber';
import { LTV_PRECISION } from 'math-utils/src/constants';

interface EModeCategoryData {
  ltv: string;
  liquidationThreshold: string;
  liquidationBonus: string;
  collateralBitmap: string;
  label: string;
  borrowableBitmap: string;
}

interface EModeData {
  id: number;
  eMode: EModeCategoryData;
}

interface FormattedEModeCategory extends EModeCategoryData {
  formattedLtv: string;
  formattedLiquidationThreshold: string;
  formattedLiquidationBonus: string;
}

export function formatEModeCategory(
  eModeCategory: EModeCategoryData,
): FormattedEModeCategory {
  return {
    ...eModeCategory,
    formattedLtv: normalize(eModeCategory.ltv, LTV_PRECISION),
    formattedLiquidationThreshold: normalize(
      eModeCategory.liquidationThreshold,
      LTV_PRECISION,
    ),
    formattedLiquidationBonus: normalize(
      valueToBigNumber(eModeCategory.liquidationBonus).minus(
        10 ** LTV_PRECISION,
      ),
      4,
    ),
  };
}

export function formatEModes(eModes: EModeData[]) {
  return eModes.map(eMode => ({
    ...eMode,
    eMode: formatEModeCategory(eMode.eMode),
  }));
}

import { normalize, valueToBigNumber } from '../../bignumber';
import { LTV_PRECISION } from '../../constants';

interface EModeCategoryData {
  ltv: string;
  liquidationThreshold: string;
  liquidationBonus: string;
  collateralBitmap: string;
  label: string;
  borrowableBitmap: string;
}

interface FormattedEModeCategory extends EModeCategoryData {
  formattedLtv: string;
  formattedLiquidationThreshold: string;
  formattedLiquidationBonus: string;
}

export interface EModeData {
  id: number;
  eMode: EModeCategoryData;
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

export interface ReserveEMode extends EModeData {
  collateralEnabled: boolean;
  borrowingEnabled: boolean;
}

export function getReservesEModes(
  reserveId: number,
  eModes: EModeData[],
): ReserveEMode[] {
  return eModes.reduce<ReserveEMode[]>((acc, eMode) => {
    const { borrowableBitmap, collateralBitmap } = eMode.eMode;
    const borrowingEnabled =
      borrowableBitmap[borrowableBitmap.length - reserveId - 1] === '1';
    const collateralEnabled =
      collateralBitmap[collateralBitmap.length - reserveId - 1] === '1';
    if (borrowingEnabled || collateralEnabled) {
      acc.push({
        id: eMode.id,
        collateralEnabled,
        borrowingEnabled,
        eMode: eMode.eMode,
      });
    }

    return acc;
  }, []);
}

export interface FormattedReserveEMode extends Omit<ReserveEMode, 'eMode'> {
  eMode: FormattedEModeCategory;
}

export function getAndFormatReserveEModes(
  reserveId: number,
  eModes: EModeData[],
): FormattedReserveEMode[] {
  return getReservesEModes(reserveId, eModes).map(eMode => ({
    ...eMode,
    eMode: formatEModeCategory(eMode.eMode),
  }));
}

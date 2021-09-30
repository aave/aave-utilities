import { BigNumber } from 'ethers';

export enum PERMISSION {
  DEPOSITOR = 'DEPOSITOR',
  BORROWER = 'BORROWER',
  LIQUIDATOR = 'LIQUIDATOR',
  STABLE_RATE_MANAGER = 'STABLE_RATE_MANAGER',
}

export const PERMISSION_MAP = {
  0: PERMISSION.DEPOSITOR,
  1: PERMISSION.BORROWER,
  2: PERMISSION.LIQUIDATOR,
  3: PERMISSION.STABLE_RATE_MANAGER,
};

export interface GetUserPermissionsResponse {
  0: BigNumber[];
  1: BigNumber;
}

export type GetHumanizedUserPermissionsResponse = PERMISSION[];

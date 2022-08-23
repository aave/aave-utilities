import { BigNumber } from 'ethers';
export declare enum PERMISSION {
  DEPOSITOR = 'DEPOSITOR',
  BORROWER = 'BORROWER',
  LIQUIDATOR = 'LIQUIDATOR',
  STABLE_RATE_MANAGER = 'STABLE_RATE_MANAGER',
}
export declare const PERMISSION_MAP: {
  0: PERMISSION;
  1: PERMISSION;
  2: PERMISSION;
  3: PERMISSION;
};
export interface GetUserPermissionsResponse {
  0: BigNumber[];
  1: BigNumber;
}
export declare type GetHumanizedUserPermissionsResponse = PERMISSION[];
//# sourceMappingURL=PermissionManagerTypes.d.ts.map

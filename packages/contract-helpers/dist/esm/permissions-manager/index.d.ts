import { providers } from 'ethers';
import {
  GetHumanizedUserPermissionsResponse,
  GetUserPermissionsResponse,
} from './types/PermissionManagerTypes';
export interface PermissionManagerContext {
  permissionManagerAddress: string;
  provider: providers.Provider;
}
export declare class PermissionManager {
  private readonly _contract;
  constructor(context: PermissionManagerContext);
  getUserPermissions(user: string): Promise<GetUserPermissionsResponse>;
  getHumanizedUserPermissions(
    user: string,
  ): Promise<GetHumanizedUserPermissionsResponse>;
}
//# sourceMappingURL=index.d.ts.map

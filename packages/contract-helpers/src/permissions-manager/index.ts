import { BigNumber, providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { PermissionManager as PermissionManagerContract } from './typechain/PermissionManager';
import { PermissionManagerFactory } from './typechain/PermissionManagerFactory';
import {
  GetHumanizedUserPermissionsResponse,
  GetUserPermissionsResponse,
  PERMISSION,
  PERMISSION_MAP,
} from './types/PermissionManagerTypes';

export interface PermissionManagerContext {
  permissionManagerAddress: string;
  provider: providers.Provider;
}

export class PermissionManager {
  private readonly _contract: PermissionManagerContract;

  public constructor(context: PermissionManagerContext) {
    if (!isAddress(context.permissionManagerAddress)) {
      throw new Error('contract address is not valid');
    }

    this._contract = PermissionManagerFactory.connect(
      context.permissionManagerAddress,
      context.provider,
    );
  }

  public async getUserPermissions(
    user: string,
  ): Promise<GetUserPermissionsResponse> {
    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserPermissions(user);
  }

  public async getHumanizedUserPermissions(
    user: string,
  ): Promise<GetHumanizedUserPermissionsResponse> {
    const { 0: permissions, 1: permissionsNumber } =
      await this.getUserPermissions(user);

    const parsedPermissions: PERMISSION[] = [];
    permissions.forEach((permission: BigNumber, index: number) => {
      if (index < permissionsNumber.toNumber()) {
        const permissionIndex = permission.toNumber();
        if (permissionIndex < 0 || permissionIndex > 4)
          throw new Error('Error parsing permission');
        parsedPermissions[index] =
          PERMISSION_MAP[permissionIndex as 0 | 1 | 2 | 3];
      }
    });
    return parsedPermissions;
  }
}

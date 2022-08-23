import { isAddress } from 'ethers/lib/utils';
import { PermissionManagerFactory } from './typechain/PermissionManagerFactory';
import { PERMISSION_MAP, } from './types/PermissionManagerTypes';
export class PermissionManager {
    constructor(context) {
        if (!isAddress(context.permissionManagerAddress)) {
            throw new Error('contract address is not valid');
        }
        this._contract = PermissionManagerFactory.connect(context.permissionManagerAddress, context.provider);
    }
    async getUserPermissions(user) {
        if (!isAddress(user)) {
            throw new Error('User address is not a valid ethereum address');
        }
        return this._contract.getUserPermissions(user);
    }
    async getHumanizedUserPermissions(user) {
        const { 0: permissions, 1: permissionsNumber } = await this.getUserPermissions(user);
        const parsedPermissions = [];
        permissions.forEach((permission, index) => {
            if (index < permissionsNumber.toNumber()) {
                const permissionIndex = permission.toNumber();
                if (permissionIndex < 0 || permissionIndex > 4)
                    throw new Error('Error parsing permission');
                parsedPermissions[index] =
                    PERMISSION_MAP[permissionIndex];
            }
        });
        return parsedPermissions;
    }
}
//# sourceMappingURL=index.js.map
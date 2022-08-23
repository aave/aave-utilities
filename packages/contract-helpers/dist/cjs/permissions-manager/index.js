"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionManager = void 0;
const utils_1 = require("ethers/lib/utils");
const PermissionManagerFactory_1 = require("./typechain/PermissionManagerFactory");
const PermissionManagerTypes_1 = require("./types/PermissionManagerTypes");
class PermissionManager {
    constructor(context) {
        if (!(0, utils_1.isAddress)(context.permissionManagerAddress)) {
            throw new Error('contract address is not valid');
        }
        this._contract = PermissionManagerFactory_1.PermissionManagerFactory.connect(context.permissionManagerAddress, context.provider);
    }
    async getUserPermissions(user) {
        if (!(0, utils_1.isAddress)(user)) {
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
                    PermissionManagerTypes_1.PERMISSION_MAP[permissionIndex];
            }
        });
        return parsedPermissions;
    }
}
exports.PermissionManager = PermissionManager;
//# sourceMappingURL=index.js.map
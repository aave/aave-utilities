"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_MAP = exports.PERMISSION = void 0;
var PERMISSION;
(function (PERMISSION) {
    PERMISSION["DEPOSITOR"] = "DEPOSITOR";
    PERMISSION["BORROWER"] = "BORROWER";
    PERMISSION["LIQUIDATOR"] = "LIQUIDATOR";
    PERMISSION["STABLE_RATE_MANAGER"] = "STABLE_RATE_MANAGER";
})(PERMISSION = exports.PERMISSION || (exports.PERMISSION = {}));
exports.PERMISSION_MAP = {
    0: PERMISSION.DEPOSITOR,
    1: PERMISSION.BORROWER,
    2: PERMISSION.LIQUIDATOR,
    3: PERMISSION.STABLE_RATE_MANAGER,
};
//# sourceMappingURL=PermissionManagerTypes.js.map
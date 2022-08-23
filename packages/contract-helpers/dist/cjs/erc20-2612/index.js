"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20_2612Service = void 0;
const tslib_1 = require("tslib");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IERC202612__factory_1 = require("./typechain/IERC202612__factory");
class ERC20_2612Service extends BaseService_1.default {
    constructor(provider) {
        super(provider, IERC202612__factory_1.IERC202612__factory);
        this.getNonce = this.getNonce.bind(this);
    }
    async getNonce({ token, owner }) {
        const tokenContract = this.getContractInstance(token);
        let nonce;
        try {
            nonce = await tokenContract.nonces(owner);
            return nonce.toNumber();
        }
        catch (_) {
            // Skip console log here since other nonce method can also work
        }
        try {
            nonce = await tokenContract._nonces(owner);
            return nonce.toNumber();
        }
        catch (_) {
            console.log(`Token ${token} does not implement nonces or _nonces method`);
        }
        return null;
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.ERC20Validator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('token')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('owner')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], ERC20_2612Service.prototype, "getNonce", null);
exports.ERC20_2612Service = ERC20_2612Service;
//# sourceMappingURL=index.js.map
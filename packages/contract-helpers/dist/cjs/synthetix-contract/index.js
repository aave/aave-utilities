"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthetixService = exports.synthetixProxyByChainId = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const ISynthetix__factory_1 = require("./typechain/ISynthetix__factory");
exports.synthetixProxyByChainId = {
    [types_1.ChainId.mainnet]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
};
class SynthetixService extends BaseService_1.default {
    constructor(provider) {
        super(provider, ISynthetix__factory_1.ISynthetix__factory);
        this.synthetixValidation = this.synthetixValidation.bind(this);
    }
    async synthetixValidation({ user, reserve, amount, // wei
     }) {
        const { chainId } = await this.provider.getNetwork();
        if (exports.synthetixProxyByChainId[chainId] &&
            reserve.toLowerCase() === exports.synthetixProxyByChainId[chainId].toLowerCase()) {
            const synthContract = this.getContractInstance(exports.synthetixProxyByChainId[chainId]);
            const transferableAmount = await synthContract.transferableSynthetix(user);
            return ethers_1.BigNumber.from(amount).lte(transferableAmount);
        }
        return true;
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.SynthetixValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('reserve')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('amount')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], SynthetixService.prototype, "synthetixValidation", null);
exports.SynthetixService = SynthetixService;
//# sourceMappingURL=index.js.map
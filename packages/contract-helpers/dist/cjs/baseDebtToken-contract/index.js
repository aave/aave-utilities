"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDebtToken = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const utils_1 = require("../commons/utils");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IDebtTokenBase__factory_1 = require("./typechain/IDebtTokenBase__factory");
class BaseDebtToken extends BaseService_1.default {
    constructor(provider, erc20Service) {
        super(provider, IDebtTokenBase__factory_1.IDebtTokenBase__factory);
        this.erc20Service = erc20Service;
    }
    approveDelegation({ user, delegatee, debtTokenAddress, amount }) {
        const debtTokenContract = this.getContractInstance(debtTokenAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => debtTokenContract.populateTransaction.approveDelegation(delegatee, amount),
            from: user,
        });
        return {
            tx: txCallback,
            txType: types_1.eEthereumTxType.ERC20_APPROVAL,
            gas: this.generateTxPriceEstimation([], txCallback),
        };
    }
    async isDelegationApproved({ debtTokenAddress, allowanceGiver, allowanceReceiver, amount, }) {
        const decimals = await this.erc20Service.decimalsOf(debtTokenAddress);
        const debtTokenContract = this.getContractInstance(debtTokenAddress);
        const delegatedAllowance = await debtTokenContract.borrowAllowance(allowanceGiver, allowanceReceiver);
        const amountBNWithDecimals = ethers_1.BigNumber.from((0, utils_1.valueToWei)(amount, decimals));
        return delegatedAllowance.gt(amountBNWithDecimals);
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.DebtTokenValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('debtTokenAddress')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('amount')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], BaseDebtToken.prototype, "approveDelegation", null);
(0, tslib_1.__decorate)([
    methodValidators_1.DebtTokenValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('debtTokenAddress')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('allowanceGiver')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('allowanceReceiver')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('amount')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], BaseDebtToken.prototype, "isDelegationApproved", null);
exports.BaseDebtToken = BaseDebtToken;
//# sourceMappingURL=index.js.map
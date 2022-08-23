"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2Pool = void 0;
const tslib_1 = require("tslib");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const utils_1 = require("../commons/utils");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IL2Pool__factory_1 = require("./typechain/IL2Pool__factory");
const L2Encoder__factory_1 = require("./typechain/L2Encoder__factory");
class L2Pool extends BaseService_1.default {
    constructor(provider, l2PoolConfig) {
        super(provider, IL2Pool__factory_1.IL2Pool__factory);
        const { l2PoolAddress, encoderAddress } = l2PoolConfig !== null && l2PoolConfig !== void 0 ? l2PoolConfig : {};
        this.l2PoolAddress = l2PoolAddress !== null && l2PoolAddress !== void 0 ? l2PoolAddress : '';
        this.encoderAddress = encoderAddress !== null && encoderAddress !== void 0 ? encoderAddress : '';
    }
    async supply({ user, reserve, amount, referralCode }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeSupplyParams(reserve, amount, referralCode !== null && referralCode !== void 0 ? referralCode : 0);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.supply(encodedParams),
            from: user,
            value: (0, utils_1.getTxValue)(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, types_1.ProtocolAction.supply),
        });
        return txs;
    }
    async supplyWithPermit({ user, reserve, amount, deadline, referralCode, permitR, permitS, permitV, }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeSupplyWithPermitParams(reserve, amount, referralCode !== null && referralCode !== void 0 ? referralCode : 0, deadline, permitV, permitR, permitS);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.supplyWithPermit(encodedParams[0], permitR, permitS),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async withdraw({ user, reserve, amount, }) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeWithdrawParams(reserve, amount);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.withdraw(encodedParams),
            from: user,
            action: types_1.ProtocolAction.withdraw,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback, types_1.ProtocolAction.supply),
            },
        ];
    }
    async borrow({ user, reserve, amount, numericRateMode, referralCode, }) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeBorrowParams(reserve, amount, numericRateMode, referralCode !== null && referralCode !== void 0 ? referralCode : 0);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.borrow(encodedParams),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async repay({ reserve, user, amount, numericRateMode }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeRepayParams(reserve, amount, numericRateMode);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.repay(encodedParams),
            from: user,
            value: (0, utils_1.getTxValue)(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, types_1.ProtocolAction.repay),
        });
        return txs;
    }
    async repayWithPermit({ user, reserve, amount, numericRateMode, permitR, permitS, permitV, deadline, }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeRepayWithPermitParams(reserve, amount, numericRateMode, deadline, permitV, permitR, permitS);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.repayWithPermit(encodedParams[0], permitR, permitS),
            from: user,
            value: (0, utils_1.getTxValue)(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, types_1.ProtocolAction.repay),
        });
        return txs;
    }
    async repayWithATokens({ reserve, user, amount, numericRateMode }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeRepayWithATokensParams(reserve, amount, numericRateMode);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.repayWithATokens(encodedParams),
            from: user,
            value: (0, utils_1.getTxValue)(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, types_1.ProtocolAction.repay),
        });
        return txs;
    }
    async swapBorrowRateMode({ reserve, numericRateMode, user, }) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeSwapBorrowRateMode(reserve, numericRateMode);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.swapBorrowRateMode(encodedParams),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async setUserUseReserveAsCollateral({ reserve, usageAsCollateral, user, }) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeSetUserUseReserveAsCollateral(reserve, usageAsCollateral);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.setUserUseReserveAsCollateral(encodedParams),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async liquidationCall({ liquidator, liquidatedUser, debtReserve, collateralReserve, debtToCover, getAToken, }, txs) {
        const encoder = this.getEncoder();
        const encodedParams = await encoder.encodeLiquidationCall(collateralReserve, debtReserve, liquidatedUser, debtToCover, getAToken !== null && getAToken !== void 0 ? getAToken : false);
        const l2PoolContract = this.getContractInstance(this.l2PoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => l2PoolContract.populateTransaction.liquidationCall(encodedParams[0], encodedParams[1]),
            from: liquidator,
            value: (0, utils_1.getTxValue)(debtReserve, debtToCover),
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation([], txCallback, types_1.ProtocolAction.liquidationCall),
        });
        return txs;
    }
    getEncoder() {
        if (!this.encoderContract && this.encoderAddress !== '') {
            this.encoderContract = L2Encoder__factory_1.L2Encoder__factory.connect(this.encoderAddress, this.provider);
        }
        return this.encoderContract;
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "supply", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isDeadline32Bytes)('deadline')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "supplyWithPermit", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "withdraw", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "borrow", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "repay", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isDeadline32Bytes)('deadline')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "repayWithPermit", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "repayWithATokens", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "swapBorrowRateMode", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "setUserUseReserveAsCollateral", null);
(0, tslib_1.__decorate)([
    methodValidators_1.L2PValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], L2Pool.prototype, "liquidationCall", null);
exports.L2Pool = L2Pool;
//# sourceMappingURL=index.js.map
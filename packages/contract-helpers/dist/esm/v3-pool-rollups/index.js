import { __decorate, __metadata, __param } from "tslib";
import BaseService from '../commons/BaseService';
import { eEthereumTxType, ProtocolAction, } from '../commons/types';
import { getTxValue } from '../commons/utils';
import { L2PValidator } from '../commons/validators/methodValidators';
import { isDeadline32Bytes } from '../commons/validators/paramValidators';
import { IL2Pool__factory } from './typechain/IL2Pool__factory';
import { L2Encoder__factory } from './typechain/L2Encoder__factory';
export class L2Pool extends BaseService {
    constructor(provider, l2PoolConfig) {
        super(provider, IL2Pool__factory);
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
            value: getTxValue(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.supply),
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
            txType: eEthereumTxType.DLP_ACTION,
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
            action: ProtocolAction.withdraw,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback, ProtocolAction.supply),
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
                txType: eEthereumTxType.DLP_ACTION,
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
            value: getTxValue(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repay),
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
            value: getTxValue(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repay),
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
            value: getTxValue(reserve, amount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repay),
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
                txType: eEthereumTxType.DLP_ACTION,
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
                txType: eEthereumTxType.DLP_ACTION,
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
            value: getTxValue(debtReserve, debtToCover),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation([], txCallback, ProtocolAction.liquidationCall),
        });
        return txs;
    }
    getEncoder() {
        if (!this.encoderContract && this.encoderAddress !== '') {
            this.encoderContract = L2Encoder__factory.connect(this.encoderAddress, this.provider);
        }
        return this.encoderContract;
    }
}
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "supply", null);
__decorate([
    L2PValidator,
    __param(0, isDeadline32Bytes('deadline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "supplyWithPermit", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "withdraw", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "borrow", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "repay", null);
__decorate([
    L2PValidator,
    __param(0, isDeadline32Bytes('deadline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "repayWithPermit", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "repayWithATokens", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "swapBorrowRateMode", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "setUserUseReserveAsCollateral", null);
__decorate([
    L2PValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], L2Pool.prototype, "liquidationCall", null);
//# sourceMappingURL=index.js.map
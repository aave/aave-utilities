"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepayWithCollateralAdapterService = void 0;
const tslib_1 = require("tslib");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IRepayWithCollateral__factory_1 = require("./typechain/IRepayWithCollateral__factory");
class RepayWithCollateralAdapterService extends BaseService_1.default {
    constructor(provider, repayWithCollateralAddress) {
        super(provider, IRepayWithCollateral__factory_1.IRepayWithCollateral__factory);
        this.repayWithCollateralAddress = repayWithCollateralAddress !== null && repayWithCollateralAddress !== void 0 ? repayWithCollateralAddress : '';
        this.swapAndRepay = this.swapAndRepay.bind(this);
    }
    swapAndRepay({ user, collateralAsset, debtAsset, collateralAmount, debtRepayAmount, debtRateMode, permit, useEthPath, }, txs) {
        const numericInterestRate = debtRateMode === types_1.InterestRate.Stable ? 1 : 2;
        const repayWithCollateralContract = this.getContractInstance(this.repayWithCollateralAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => repayWithCollateralContract.populateTransaction.swapAndRepay(collateralAsset, debtAsset, collateralAmount, debtRepayAmount, numericInterestRate, permit, useEthPath !== null && useEthPath !== void 0 ? useEthPath : false),
            from: user,
        });
        return {
            tx: txCallback,
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs !== null && txs !== void 0 ? txs : [], txCallback, types_1.ProtocolAction.repayCollateral),
        };
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.RepayWithCollateralValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('collateralAsset')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('debtAsset')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('collateralAmount')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('debtRepayAmount')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], RepayWithCollateralAdapterService.prototype, "swapAndRepay", null);
exports.RepayWithCollateralAdapterService = RepayWithCollateralAdapterService;
//# sourceMappingURL=index.js.map
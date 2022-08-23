"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParaswapRepayWithCollateral = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const utils_1 = require("../commons/utils");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const ParaSwapRepayAdapter__factory_1 = require("./typechain/ParaSwapRepayAdapter__factory");
class ParaswapRepayWithCollateral extends BaseService_1.default {
    constructor(provider, repayWithCollateralAddress) {
        super(provider, ParaSwapRepayAdapter__factory_1.ParaSwapRepayAdapter__factory);
        this.repayWithCollateralAddress = repayWithCollateralAddress !== null && repayWithCollateralAddress !== void 0 ? repayWithCollateralAddress : '';
        this.swapAndRepay = this.swapAndRepay.bind(this);
    }
    swapAndRepay({ collateralAsset, debtAsset, collateralAmount, debtRepayAmount, debtRateMode, repayAll, permitParams, swapAndRepayCallData, user, augustus, }, txs) {
        const numericInterestRate = debtRateMode === types_1.InterestRate.Stable ? 1 : 2;
        const swapAndRepayContract = this.getContractInstance(this.repayWithCollateralAddress);
        const callDataEncoded = ethers_1.utils.defaultAbiCoder.encode(['bytes', 'address'], [swapAndRepayCallData, augustus]);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => swapAndRepayContract.populateTransaction.swapAndRepay(collateralAsset, debtAsset, collateralAmount, debtRepayAmount, numericInterestRate, repayAll
                ? (0, utils_1.augustusToAmountOffsetFromCalldata)(swapAndRepayCallData)
                : 0, callDataEncoded, permitParams),
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
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('augustus')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], ParaswapRepayWithCollateral.prototype, "swapAndRepay", null);
exports.ParaswapRepayWithCollateral = ParaswapRepayWithCollateral;
//# sourceMappingURL=index.js.map
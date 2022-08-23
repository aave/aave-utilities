import { __decorate, __metadata, __param } from "tslib";
import BaseService from '../commons/BaseService';
import { eEthereumTxType, InterestRate, ProtocolAction, } from '../commons/types';
import { RepayWithCollateralValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, } from '../commons/validators/paramValidators';
import { IRepayWithCollateral__factory } from './typechain/IRepayWithCollateral__factory';
export class RepayWithCollateralAdapterService extends BaseService {
    constructor(provider, repayWithCollateralAddress) {
        super(provider, IRepayWithCollateral__factory);
        this.repayWithCollateralAddress = repayWithCollateralAddress !== null && repayWithCollateralAddress !== void 0 ? repayWithCollateralAddress : '';
        this.swapAndRepay = this.swapAndRepay.bind(this);
    }
    swapAndRepay({ user, collateralAsset, debtAsset, collateralAmount, debtRepayAmount, debtRateMode, permit, useEthPath, }, txs) {
        const numericInterestRate = debtRateMode === InterestRate.Stable ? 1 : 2;
        const repayWithCollateralContract = this.getContractInstance(this.repayWithCollateralAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => repayWithCollateralContract.populateTransaction.swapAndRepay(collateralAsset, debtAsset, collateralAmount, debtRepayAmount, numericInterestRate, permit, useEthPath !== null && useEthPath !== void 0 ? useEthPath : false),
            from: user,
        });
        return {
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs !== null && txs !== void 0 ? txs : [], txCallback, ProtocolAction.repayCollateral),
        };
    }
}
__decorate([
    RepayWithCollateralValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('collateralAsset')),
    __param(0, isEthAddress('debtAsset')),
    __param(0, isPositiveAmount('collateralAmount')),
    __param(0, isPositiveAmount('debtRepayAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Object)
], RepayWithCollateralAdapterService.prototype, "swapAndRepay", null);
//# sourceMappingURL=index.js.map
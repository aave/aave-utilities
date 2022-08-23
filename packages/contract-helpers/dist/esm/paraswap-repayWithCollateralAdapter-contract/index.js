import { __decorate, __metadata, __param } from "tslib";
import { utils } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, InterestRate, ProtocolAction, } from '../commons/types';
import { augustusToAmountOffsetFromCalldata } from '../commons/utils';
import { RepayWithCollateralValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, } from '../commons/validators/paramValidators';
import { ParaSwapRepayAdapter__factory } from './typechain/ParaSwapRepayAdapter__factory';
export class ParaswapRepayWithCollateral extends BaseService {
    constructor(provider, repayWithCollateralAddress) {
        super(provider, ParaSwapRepayAdapter__factory);
        this.repayWithCollateralAddress = repayWithCollateralAddress !== null && repayWithCollateralAddress !== void 0 ? repayWithCollateralAddress : '';
        this.swapAndRepay = this.swapAndRepay.bind(this);
    }
    swapAndRepay({ collateralAsset, debtAsset, collateralAmount, debtRepayAmount, debtRateMode, repayAll, permitParams, swapAndRepayCallData, user, augustus, }, txs) {
        const numericInterestRate = debtRateMode === InterestRate.Stable ? 1 : 2;
        const swapAndRepayContract = this.getContractInstance(this.repayWithCollateralAddress);
        const callDataEncoded = utils.defaultAbiCoder.encode(['bytes', 'address'], [swapAndRepayCallData, augustus]);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => swapAndRepayContract.populateTransaction.swapAndRepay(collateralAsset, debtAsset, collateralAmount, debtRepayAmount, numericInterestRate, repayAll
                ? augustusToAmountOffsetFromCalldata(swapAndRepayCallData)
                : 0, callDataEncoded, permitParams),
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
    __param(0, isEthAddress('augustus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Object)
], ParaswapRepayWithCollateral.prototype, "swapAndRepay", null);
//# sourceMappingURL=index.js.map
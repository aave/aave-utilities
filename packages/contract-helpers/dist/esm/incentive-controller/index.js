import { __decorate, __metadata, __param } from "tslib";
import { constants } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isEthAddressArray, } from '../commons/validators/paramValidators';
import { IAaveIncentivesController__factory } from './typechain/IAaveIncentivesController__factory';
export class IncentivesController extends BaseService {
    constructor(provider) {
        super(provider, IAaveIncentivesController__factory);
    }
    claimRewards({ user, assets, to, incentivesControllerAddress }) {
        const incentivesContract = this.getContractInstance(incentivesControllerAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => incentivesContract.populateTransaction.claimRewards(assets, constants.MaxUint256.toString(), to !== null && to !== void 0 ? to : user),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.REWARD_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
}
__decorate([
    IncentivesValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('incentivesControllerAddress')),
    __param(0, isEthAddress('to')),
    __param(0, isEthAddressArray('assets')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], IncentivesController.prototype, "claimRewards", null);
//# sourceMappingURL=index.js.map
import { __decorate, __metadata, __param } from "tslib";
import { constants } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isEthAddressArray, } from '../commons/validators/paramValidators';
import { IAaveIncentivesControllerV2__factory } from './typechain/IAaveIncentivesControllerV2__factory';
export class IncentivesControllerV2 extends BaseService {
    constructor(provider) {
        super(provider, IAaveIncentivesControllerV2__factory);
    }
    claimRewards({ user, assets, to, incentivesControllerAddress, reward, }) {
        const incentivesContract = this.getContractInstance(incentivesControllerAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => incentivesContract.populateTransaction.claimRewards(assets, constants.MaxUint256.toString(), to !== null && to !== void 0 ? to : user, reward),
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
    claimAllRewards({ user, assets, to, incentivesControllerAddress, }) {
        const incentivesContract = this.getContractInstance(incentivesControllerAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => incentivesContract.populateTransaction.claimAllRewards(assets, to !== null && to !== void 0 ? to : user),
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
    __param(0, isEthAddress('reward')),
    __param(0, isEthAddressArray('assets')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], IncentivesControllerV2.prototype, "claimRewards", null);
__decorate([
    IncentivesValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('incentivesControllerAddress')),
    __param(0, isEthAddress('to')),
    __param(0, isEthAddressArray('assets')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], IncentivesControllerV2.prototype, "claimAllRewards", null);
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncentivesControllerV2 = void 0;
const tslib_1 = require("tslib");
const ethers_1 = require("ethers");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IAaveIncentivesControllerV2__factory_1 = require("./typechain/IAaveIncentivesControllerV2__factory");
class IncentivesControllerV2 extends BaseService_1.default {
    constructor(provider) {
        super(provider, IAaveIncentivesControllerV2__factory_1.IAaveIncentivesControllerV2__factory);
    }
    claimRewards({ user, assets, to, incentivesControllerAddress, reward, }) {
        const incentivesContract = this.getContractInstance(incentivesControllerAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => incentivesContract.populateTransaction.claimRewards(assets, ethers_1.constants.MaxUint256.toString(), to !== null && to !== void 0 ? to : user, reward),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.REWARD_ACTION,
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
                txType: types_1.eEthereumTxType.REWARD_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.IncentivesValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('incentivesControllerAddress')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('to')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('reward')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressArray)('assets')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Array)
], IncentivesControllerV2.prototype, "claimRewards", null);
(0, tslib_1.__decorate)([
    methodValidators_1.IncentivesValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('incentivesControllerAddress')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('to')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressArray)('assets')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Array)
], IncentivesControllerV2.prototype, "claimAllRewards", null);
exports.IncentivesControllerV2 = IncentivesControllerV2;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiStakeDataProvider = void 0;
const tslib_1 = require("tslib");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const StakeUiHelperFactory_1 = require("./typechain/StakeUiHelperFactory");
(0, tslib_1.__exportStar)(require("./types"), exports);
class UiStakeDataProvider {
    constructor(context) {
        this._contract = StakeUiHelperFactory_1.StakeUiHelperFactory.connect(context.uiStakeDataProvider, context.provider);
    }
    async getUserStakeUIData({ user }) {
        return this._contract.getUserStakeUIData(user);
    }
    async getUserStakeUIDataHumanized({ user }) {
        const { 0: aave, 1: bpt, 2: usdPriceEth, } = await this.getUserStakeUIData({ user });
        return {
            aave: {
                stakeTokenUserBalance: aave.stakeTokenUserBalance.toString(),
                underlyingTokenUserBalance: aave.underlyingTokenUserBalance.toString(),
                userCooldown: aave.userCooldown.toNumber(),
                userIncentivesToClaim: aave.userIncentivesToClaim.toString(),
                userPermitNonce: aave.userPermitNonce.toString(),
            },
            bpt: {
                stakeTokenUserBalance: bpt.stakeTokenUserBalance.toString(),
                underlyingTokenUserBalance: bpt.underlyingTokenUserBalance.toString(),
                userCooldown: bpt.userCooldown.toNumber(),
                userIncentivesToClaim: bpt.userIncentivesToClaim.toString(),
                userPermitNonce: bpt.userPermitNonce.toString(),
            },
            usdPriceEth: usdPriceEth.toString(),
        };
    }
    async getGeneralStakeUIData() {
        return this._contract.getGeneralStakeUIData();
    }
    async getGeneralStakeUIDataHumanized() {
        const { 0: aave, 1: bpt, 2: usdPriceEth, } = await this.getGeneralStakeUIData();
        return {
            aave: {
                stakeTokenTotalSupply: aave.stakeTokenTotalSupply.toString(),
                stakeCooldownSeconds: aave.stakeCooldownSeconds.toNumber(),
                stakeUnstakeWindow: aave.stakeUnstakeWindow.toNumber(),
                stakeTokenPriceEth: aave.stakeTokenPriceEth.toString(),
                rewardTokenPriceEth: aave.rewardTokenPriceEth.toString(),
                stakeApy: aave.stakeApy.toString(),
                distributionPerSecond: aave.distributionPerSecond.toString(),
                distributionEnd: aave.distributionEnd.toString(),
            },
            bpt: {
                stakeTokenTotalSupply: bpt.stakeTokenTotalSupply.toString(),
                stakeCooldownSeconds: bpt.stakeCooldownSeconds.toNumber(),
                stakeUnstakeWindow: bpt.stakeUnstakeWindow.toNumber(),
                stakeTokenPriceEth: bpt.stakeTokenPriceEth.toString(),
                rewardTokenPriceEth: bpt.rewardTokenPriceEth.toString(),
                stakeApy: bpt.stakeApy.toString(),
                distributionPerSecond: bpt.distributionPerSecond.toString(),
                distributionEnd: bpt.distributionEnd.toString(),
            },
            usdPriceEth: usdPriceEth.toString(),
        };
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.StackeUiDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiStakeDataProvider.prototype, "getUserStakeUIData", null);
(0, tslib_1.__decorate)([
    methodValidators_1.StackeUiDataProviderValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], UiStakeDataProvider.prototype, "getUserStakeUIDataHumanized", null);
exports.UiStakeDataProvider = UiStakeDataProvider;
//# sourceMappingURL=index.js.map
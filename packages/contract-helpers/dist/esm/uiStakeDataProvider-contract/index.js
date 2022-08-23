import { __decorate, __metadata, __param } from "tslib";
import { StackeUiDataProviderValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { StakeUiHelperFactory } from './typechain/StakeUiHelperFactory';
export * from './types';
export class UiStakeDataProvider {
    constructor(context) {
        this._contract = StakeUiHelperFactory.connect(context.uiStakeDataProvider, context.provider);
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
__decorate([
    StackeUiDataProviderValidator,
    __param(0, isEthAddress('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiStakeDataProvider.prototype, "getUserStakeUIData", null);
__decorate([
    StackeUiDataProviderValidator,
    __param(0, isEthAddress('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UiStakeDataProvider.prototype, "getUserStakeUIDataHumanized", null);
//# sourceMappingURL=index.js.map
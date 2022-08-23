import { __decorate, __metadata, __param } from "tslib";
import { BigNumber } from 'ethers';
import BaseService from '../commons/BaseService';
import { ChainId } from '../commons/types';
import { SynthetixValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, } from '../commons/validators/paramValidators';
import { ISynthetix__factory } from './typechain/ISynthetix__factory';
export const synthetixProxyByChainId = {
    [ChainId.mainnet]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
};
export class SynthetixService extends BaseService {
    constructor(provider) {
        super(provider, ISynthetix__factory);
        this.synthetixValidation = this.synthetixValidation.bind(this);
    }
    async synthetixValidation({ user, reserve, amount, // wei
     }) {
        const { chainId } = await this.provider.getNetwork();
        if (synthetixProxyByChainId[chainId] &&
            reserve.toLowerCase() === synthetixProxyByChainId[chainId].toLowerCase()) {
            const synthContract = this.getContractInstance(synthetixProxyByChainId[chainId]);
            const transferableAmount = await synthContract.transferableSynthetix(user);
            return BigNumber.from(amount).lte(transferableAmount);
        }
        return true;
    }
}
__decorate([
    SynthetixValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __param(0, isPositiveAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SynthetixService.prototype, "synthetixValidation", null);
//# sourceMappingURL=index.js.map
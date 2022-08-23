import { __decorate, __metadata, __param } from "tslib";
import BaseService from '../commons/BaseService';
import { ERC20Validator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IERC202612__factory } from './typechain/IERC202612__factory';
export class ERC20_2612Service extends BaseService {
    constructor(provider) {
        super(provider, IERC202612__factory);
        this.getNonce = this.getNonce.bind(this);
    }
    async getNonce({ token, owner }) {
        const tokenContract = this.getContractInstance(token);
        let nonce;
        try {
            nonce = await tokenContract.nonces(owner);
            return nonce.toNumber();
        }
        catch (_) {
            // Skip console log here since other nonce method can also work
        }
        try {
            nonce = await tokenContract._nonces(owner);
            return nonce.toNumber();
        }
        catch (_) {
            console.log(`Token ${token} does not implement nonces or _nonces method`);
        }
        return null;
    }
}
__decorate([
    ERC20Validator,
    __param(0, isEthAddress('token')),
    __param(0, isEthAddress('owner')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ERC20_2612Service.prototype, "getNonce", null);
//# sourceMappingURL=index.js.map
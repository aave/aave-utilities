import { __decorate, __metadata, __param } from "tslib";
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { mintAmountsPerToken, DEFAULT_NULL_VALUE_ON_TX, } from '../commons/utils';
import { FaucetValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IFaucet__factory } from './typechain/IFaucet__factory';
export class FaucetService extends BaseService {
    constructor(provider, faucetAddress) {
        super(provider, IFaucet__factory);
        this.faucetAddress = faucetAddress !== null && faucetAddress !== void 0 ? faucetAddress : '';
    }
    mint({ userAddress, reserve, tokenSymbol }) {
        const amount = mintAmountsPerToken[tokenSymbol];
        if (!amount) {
            console.log(`No amount predefined for minting for token : ${tokenSymbol}`);
            return [];
        }
        const faucetContract = this.getContractInstance(this.faucetAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => faucetContract.populateTransaction.mint(reserve, amount),
            from: userAddress,
            value: DEFAULT_NULL_VALUE_ON_TX,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.FAUCET_MINT,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
}
__decorate([
    FaucetValidator,
    __param(0, isEthAddress('userAddress')),
    __param(0, isEthAddress('reserve')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], FaucetService.prototype, "mint", null);
//# sourceMappingURL=index.js.map
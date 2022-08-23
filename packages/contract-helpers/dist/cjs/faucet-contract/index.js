"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetService = void 0;
const tslib_1 = require("tslib");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const utils_1 = require("../commons/utils");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IFaucet__factory_1 = require("./typechain/IFaucet__factory");
class FaucetService extends BaseService_1.default {
    constructor(provider, faucetAddress) {
        super(provider, IFaucet__factory_1.IFaucet__factory);
        this.faucetAddress = faucetAddress !== null && faucetAddress !== void 0 ? faucetAddress : '';
    }
    mint({ userAddress, reserve, tokenSymbol }) {
        const amount = utils_1.mintAmountsPerToken[tokenSymbol];
        if (!amount) {
            console.log(`No amount predefined for minting for token : ${tokenSymbol}`);
            return [];
        }
        const faucetContract = this.getContractInstance(this.faucetAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => faucetContract.populateTransaction.mint(reserve, amount),
            from: userAddress,
            value: utils_1.DEFAULT_NULL_VALUE_ON_TX,
        });
        return [
            {
                tx: txCallback,
                txType: types_1.eEthereumTxType.FAUCET_MINT,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.FaucetValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('userAddress')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('reserve')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Array)
], FaucetService.prototype, "mint", null);
exports.FaucetService = FaucetService;
//# sourceMappingURL=index.js.map
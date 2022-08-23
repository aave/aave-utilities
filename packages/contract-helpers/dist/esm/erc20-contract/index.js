import { __decorate, __metadata, __param } from "tslib";
import { BigNumber } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { API_ETH_MOCK_ADDRESS, valueToWei, SUPER_BIG_ALLOWANCE_NUMBER, } from '../commons/utils';
import { ERC20Validator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, isPositiveOrMinusOneAmount, } from '../commons/validators/paramValidators';
import { IERC20Detailed__factory } from './typechain/IERC20Detailed__factory';
export class ERC20Service extends BaseService {
    constructor(provider) {
        super(provider, IERC20Detailed__factory);
        this.tokenDecimals = {};
        this.tokenMetadata = {};
        this.approve = this.approve.bind(this);
        this.isApproved = this.isApproved.bind(this);
        this.getTokenData = this.getTokenData.bind(this);
        this.decimalsOf = this.decimalsOf.bind(this);
    }
    approve({ user, token, spender, amount }) {
        const erc20Contract = this.getContractInstance(token);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => erc20Contract.populateTransaction.approve(spender, amount),
            from: user,
        });
        return {
            tx: txCallback,
            txType: eEthereumTxType.ERC20_APPROVAL,
            gas: this.generateTxPriceEstimation([], txCallback),
        };
    }
    async isApproved({ user, token, spender, amount }) {
        if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
            return true;
        const decimals = await this.decimalsOf(token);
        const erc20Contract = this.getContractInstance(token);
        const allowance = await erc20Contract.allowance(user, spender);
        const amountBNWithDecimals = amount === '-1'
            ? BigNumber.from(SUPER_BIG_ALLOWANCE_NUMBER)
            : BigNumber.from(valueToWei(amount, decimals));
        return allowance.gte(amountBNWithDecimals);
    }
    async decimalsOf(token) {
        if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
            return 18;
        if (!this.tokenDecimals[token]) {
            const erc20Contract = this.getContractInstance(token);
            this.tokenDecimals[token] = await erc20Contract.decimals();
        }
        return this.tokenDecimals[token];
    }
    async getTokenData(token) {
        if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
            return {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
                address: token,
            };
        }
        // Needed because MKR does not return string for symbol and Name
        if (token.toLowerCase() ===
            '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'.toLowerCase()) {
            return {
                name: 'Maker',
                symbol: 'MKR',
                decimals: 18,
                address: token,
            };
        }
        if (!this.tokenMetadata[token]) {
            const { name: nameGetter, symbol: symbolGetter } = this.getContractInstance(token);
            const [name, symbol, decimals] = await Promise.all([
                nameGetter(),
                symbolGetter(),
                this.decimalsOf(token),
            ]);
            this.tokenMetadata[token] = {
                name,
                symbol,
                decimals,
                address: token,
            };
        }
        return this.tokenMetadata[token];
    }
}
__decorate([
    ERC20Validator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('token')),
    __param(0, isEthAddress('spender')),
    __param(0, isPositiveAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], ERC20Service.prototype, "approve", null);
__decorate([
    ERC20Validator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('token')),
    __param(0, isEthAddress('spender')),
    __param(0, isPositiveOrMinusOneAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ERC20Service.prototype, "isApproved", null);
__decorate([
    ERC20Validator,
    __param(0, isEthAddress()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ERC20Service.prototype, "decimalsOf", null);
__decorate([
    ERC20Validator,
    __param(0, isEthAddress()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ERC20Service.prototype, "getTokenData", null);
//# sourceMappingURL=index.js.map
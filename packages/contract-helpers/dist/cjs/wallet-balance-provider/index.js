"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBalanceProvider = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("ethers/lib/utils");
const WalletBalanceProviderFactory_1 = require("./typechain/WalletBalanceProviderFactory");
(0, tslib_1.__exportStar)(require("./types/WalletBalanceProviderTypes"), exports);
class WalletBalanceProvider {
    /**
     * Constructor
     * @param context The wallet balance provider context
     */
    constructor(context) {
        this._contract = WalletBalanceProviderFactory_1.WalletBalanceProviderFactory.connect(context.walletBalanceProviderAddress, context.provider);
    }
    /**
     *  Get the balance for a user on a token
     * @param user The user address
     * @param token The token address
     */
    async balanceOf(user, token) {
        if (!(0, utils_1.isAddress)(user)) {
            throw new Error('User address is not a valid ethereum address');
        }
        if (!(0, utils_1.isAddress)(token)) {
            throw new Error('Token address is not a valid ethereum address');
        }
        return this._contract.balanceOf(user, token);
    }
    /**
     *  Get the balance for a user on a token
     * @param users The users addresses
     * @param tokens The tokens addresses
     */
    async batchBalanceOf(users, tokens) {
        if (!users.every(u => (0, utils_1.isAddress)(u))) {
            throw new Error('One of the user address is not a valid ethereum address');
        }
        if (!tokens.every(u => (0, utils_1.isAddress)(u))) {
            throw new Error('One of the token address is not a valid ethereum address');
        }
        return this._contract.batchBalanceOf(users, tokens);
    }
    /**
     *  Provides balances of user wallet for all reserves available on the pool
     * @param user The user
     * @param lendingPoolAddressProvider The lending pool address provider
     */
    async getUserWalletBalancesForLendingPoolProvider(user, lendingPoolAddressProvider) {
        if (!(0, utils_1.isAddress)(user)) {
            throw new Error('User address is not a valid ethereum address');
        }
        if (!(0, utils_1.isAddress)(lendingPoolAddressProvider)) {
            throw new Error('Lending pool address provider is not a valid ethereum address');
        }
        return this._contract.getUserWalletBalances(lendingPoolAddressProvider, user);
    }
}
exports.WalletBalanceProvider = WalletBalanceProvider;
//# sourceMappingURL=index.js.map
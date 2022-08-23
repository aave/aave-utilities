"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernancePowerDelegationTokenService = void 0;
const tslib_1 = require("tslib");
const bytes_1 = require("@ethersproject/bytes");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const utils_1 = require("../commons/utils");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IGovernancePowerDelegationToken__factory_1 = require("./typechain/IGovernancePowerDelegationToken__factory");
class GovernancePowerDelegationTokenService extends BaseService_1.default {
    constructor(provider) {
        super(provider, IGovernancePowerDelegationToken__factory_1.IGovernancePowerDelegationToken__factory);
    }
    async delegate({ user, delegatee, governanceToken }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegate(delegateeAddress),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async delegateByType({ user, delegatee, delegationType, governanceToken }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegateByType(delegateeAddress, delegationType),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async delegateBySig({ user, delegatee, expiry, signature, governanceToken }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const nonce = await this.getNonce({ user, governanceToken });
        const { v, r, s } = (0, bytes_1.splitSignature)(signature);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegateBySig(delegateeAddress, nonce, expiry, v, r, s),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async delegateByTypeBySig({ user, delegatee, delegationType, expiry, signature, governanceToken, }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const nonce = await this.getNonce({ user, governanceToken });
        const { v, r, s } = (0, bytes_1.splitSignature)(signature);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegateByTypeBySig(delegateeAddress, delegationType, nonce, expiry, v, r, s),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: types_1.eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async prepareDelegateSignature({ delegatee, nonce, expiry, governanceTokenName, governanceToken, }) {
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const { chainId } = await this.provider.getNetwork();
        const typeData = {
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                Delegate: [
                    { name: 'delegatee', type: 'address' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'expiry', type: 'uint256' },
                ],
            },
            primaryType: 'Delegate',
            domain: {
                name: governanceTokenName,
                chainId,
                verifyingContract: governanceToken,
            },
            message: {
                delegatee: delegateeAddress,
                nonce,
                expiry,
            },
        };
        return JSON.stringify(typeData);
    }
    async prepareDelegateByTypeSignature({ delegatee, type, nonce, expiry, governanceTokenName, governanceToken, }) {
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const { chainId } = await this.provider.getNetwork();
        const typeData = {
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                DelegateByType: [
                    { name: 'delegatee', type: 'address' },
                    { name: 'type', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'expiry', type: 'uint256' },
                ],
            },
            primaryType: 'DelegateByType',
            domain: {
                name: governanceTokenName,
                chainId,
                verifyingContract: governanceToken,
            },
            message: {
                delegatee: delegateeAddress,
                type,
                nonce,
                expiry,
            },
        };
        return JSON.stringify(typeData);
    }
    async getDelegateeByType({ delegator, delegationType, governanceToken }) {
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        return governanceDelegationToken.getDelegateeByType(delegator, delegationType);
    }
    async getPowerCurrent({ user, delegationType, governanceToken }) {
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        return (await governanceDelegationToken.getPowerCurrent(user, delegationType)).toString();
    }
    async getPowerAtBlock({ user, blockNumber, delegationType, governanceToken }) {
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        return (await governanceDelegationToken.getPowerAtBlock(user, blockNumber, delegationType)).toString();
    }
    async getNonce({ user, governanceToken }) {
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        return (await governanceDelegationToken._nonces(user)).toString();
    }
    async getDelegateeAddress(delegatee) {
        if ((0, utils_1.canBeEnsAddress)(delegatee)) {
            const delegateeAddress = await this.provider.resolveName(delegatee);
            if (!delegateeAddress)
                throw new Error(`Address: ${delegatee} is not a valid ENS address`);
            return delegateeAddress;
        }
        return delegatee;
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegate", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateByType", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateBySig", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateByTypeBySig", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.is0OrPositiveAmount)('nonce')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "prepareDelegateSignature", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressOrENS)('delegatee')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.is0OrPositiveAmount)('nonce')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "prepareDelegateByTypeSignature", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('delegator')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getDelegateeByType", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getPowerCurrent", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('blockNumber')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getPowerAtBlock", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovDelegationValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('governanceToken')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getNonce", null);
exports.GovernancePowerDelegationTokenService = GovernancePowerDelegationTokenService;
//# sourceMappingURL=index.js.map
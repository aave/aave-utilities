import { __decorate, __metadata, __param } from "tslib";
import { splitSignature } from '@ethersproject/bytes';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { canBeEnsAddress } from '../commons/utils';
import { GovDelegationValidator } from '../commons/validators/methodValidators';
import { is0OrPositiveAmount, isEthAddress, isEthAddressOrENS, isPositiveAmount, } from '../commons/validators/paramValidators';
import { IGovernancePowerDelegationToken__factory } from './typechain/IGovernancePowerDelegationToken__factory';
export class GovernancePowerDelegationTokenService extends BaseService {
    constructor(provider) {
        super(provider, IGovernancePowerDelegationToken__factory);
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
            txType: eEthereumTxType.GOV_DELEGATION_ACTION,
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
            txType: eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async delegateBySig({ user, delegatee, expiry, signature, governanceToken }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const nonce = await this.getNonce({ user, governanceToken });
        const { v, r, s } = splitSignature(signature);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegateBySig(delegateeAddress, nonce, expiry, v, r, s),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.GOV_DELEGATION_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async delegateByTypeBySig({ user, delegatee, delegationType, expiry, signature, governanceToken, }) {
        const txs = [];
        const governanceDelegationToken = this.getContractInstance(governanceToken);
        const nonce = await this.getNonce({ user, governanceToken });
        const { v, r, s } = splitSignature(signature);
        const delegateeAddress = await this.getDelegateeAddress(delegatee);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => governanceDelegationToken.populateTransaction.delegateByTypeBySig(delegateeAddress, delegationType, nonce, expiry, v, r, s),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.GOV_DELEGATION_ACTION,
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
        if (canBeEnsAddress(delegatee)) {
            const delegateeAddress = await this.provider.resolveName(delegatee);
            if (!delegateeAddress)
                throw new Error(`Address: ${delegatee} is not a valid ENS address`);
            return delegateeAddress;
        }
        return delegatee;
    }
}
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegate", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateByType", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateBySig", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "delegateByTypeBySig", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __param(0, is0OrPositiveAmount('nonce')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "prepareDelegateSignature", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddressOrENS('delegatee')),
    __param(0, isEthAddress('governanceToken')),
    __param(0, is0OrPositiveAmount('nonce')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "prepareDelegateByTypeSignature", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('delegator')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getDelegateeByType", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getPowerCurrent", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('governanceToken')),
    __param(0, isPositiveAmount('blockNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getPowerAtBlock", null);
__decorate([
    GovDelegationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('governanceToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernancePowerDelegationTokenService.prototype, "getNonce", null);
//# sourceMappingURL=index.js.map
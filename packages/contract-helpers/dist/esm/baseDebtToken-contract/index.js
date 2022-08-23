import { __decorate, __metadata, __param } from "tslib";
import { BigNumber } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { valueToWei } from '../commons/utils';
import { DebtTokenValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, } from '../commons/validators/paramValidators';
import { IDebtTokenBase__factory } from './typechain/IDebtTokenBase__factory';
export class BaseDebtToken extends BaseService {
    constructor(provider, erc20Service) {
        super(provider, IDebtTokenBase__factory);
        this.erc20Service = erc20Service;
    }
    approveDelegation({ user, delegatee, debtTokenAddress, amount }) {
        const debtTokenContract = this.getContractInstance(debtTokenAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => debtTokenContract.populateTransaction.approveDelegation(delegatee, amount),
            from: user,
        });
        return {
            tx: txCallback,
            txType: eEthereumTxType.ERC20_APPROVAL,
            gas: this.generateTxPriceEstimation([], txCallback),
        };
    }
    async isDelegationApproved({ debtTokenAddress, allowanceGiver, allowanceReceiver, amount, }) {
        const decimals = await this.erc20Service.decimalsOf(debtTokenAddress);
        const debtTokenContract = this.getContractInstance(debtTokenAddress);
        const delegatedAllowance = await debtTokenContract.borrowAllowance(allowanceGiver, allowanceReceiver);
        const amountBNWithDecimals = BigNumber.from(valueToWei(amount, decimals));
        return delegatedAllowance.gt(amountBNWithDecimals);
    }
}
__decorate([
    DebtTokenValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('delegatee')),
    __param(0, isEthAddress('debtTokenAddress')),
    __param(0, isPositiveAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], BaseDebtToken.prototype, "approveDelegation", null);
__decorate([
    DebtTokenValidator,
    __param(0, isEthAddress('debtTokenAddress')),
    __param(0, isEthAddress('allowanceGiver')),
    __param(0, isEthAddress('allowanceReceiver')),
    __param(0, isPositiveAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseDebtToken.prototype, "isDelegationApproved", null);
//# sourceMappingURL=index.js.map
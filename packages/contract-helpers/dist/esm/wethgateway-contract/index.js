import { __decorate, __metadata, __param } from "tslib";
import { constants } from 'ethers';
import { BaseDebtToken, } from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, InterestRate, ProtocolAction, } from '../commons/types';
import { valueToWei } from '../commons/utils';
import { WETHValidator } from '../commons/validators/methodValidators';
import { is0OrPositiveAmount, isEthAddress, isPositiveAmount, isPositiveOrMinusOneAmount, } from '../commons/validators/paramValidators';
import { IWETHGateway__factory } from './typechain/IWETHGateway__factory';
export class WETHGatewayService extends BaseService {
    constructor(provider, erc20Service, wethGatewayAddress) {
        super(provider, IWETHGateway__factory);
        this.erc20Service = erc20Service;
        this.baseDebtTokenService = new BaseDebtToken(this.provider, this.erc20Service);
        this.wethGatewayAddress = wethGatewayAddress !== null && wethGatewayAddress !== void 0 ? wethGatewayAddress : '';
        this.depositETH = this.depositETH.bind(this);
        this.withdrawETH = this.withdrawETH.bind(this);
        this.repayETH = this.repayETH.bind(this);
        this.borrowETH = this.borrowETH.bind(this);
    }
    depositETH({ lendingPool, user, amount, onBehalfOf, referralCode, }) {
        const convertedAmount = valueToWei(amount, 18);
        const wethGatewayContract = this.getContractInstance(this.wethGatewayAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => wethGatewayContract.populateTransaction.depositETH(lendingPool, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
            from: user,
            value: convertedAmount,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async borrowETH({ lendingPool, user, amount, debtTokenAddress, interestRateMode, referralCode, }) {
        const txs = [];
        const convertedAmount = valueToWei(amount, 18);
        const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
        const delegationApproved = await this.baseDebtTokenService.isDelegationApproved({
            debtTokenAddress,
            allowanceGiver: user,
            allowanceReceiver: this.wethGatewayAddress,
            amount,
        });
        if (!delegationApproved) {
            const approveDelegationTx = this.baseDebtTokenService.approveDelegation({
                user,
                delegatee: this.wethGatewayAddress,
                debtTokenAddress,
                amount: constants.MaxUint256.toString(),
            });
            txs.push(approveDelegationTx);
        }
        const wethGatewayContract = this.getContractInstance(this.wethGatewayAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => wethGatewayContract.populateTransaction.borrowETH(lendingPool, convertedAmount, numericRateMode, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.borrowETH),
        });
        return txs;
    }
    async withdrawETH({ lendingPool, user, amount, onBehalfOf, aTokenAddress, }) {
        const txs = [];
        const { isApproved, approve } = this.erc20Service;
        const convertedAmount = amount === '-1'
            ? constants.MaxUint256.toString()
            : valueToWei(amount, 18);
        const approved = await isApproved({
            token: aTokenAddress,
            user,
            spender: this.wethGatewayAddress,
            amount,
        });
        if (!approved) {
            const approveTx = approve({
                user,
                token: aTokenAddress,
                spender: this.wethGatewayAddress,
                amount: constants.MaxUint256.toString(),
            });
            txs.push(approveTx);
        }
        const wethGatewayContract = this.getContractInstance(this.wethGatewayAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => wethGatewayContract.populateTransaction.withdrawETH(lendingPool, convertedAmount, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.withdrawETH),
        });
        return txs;
    }
    repayETH({ lendingPool, user, amount, interestRateMode, onBehalfOf, }) {
        const convertedAmount = valueToWei(amount, 18);
        const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
        const wethGatewayContract = this.getContractInstance(this.wethGatewayAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => wethGatewayContract.populateTransaction.repayETH(lendingPool, convertedAmount, numericRateMode, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user),
            gasSurplus: 30,
            from: user,
            value: convertedAmount,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
}
__decorate([
    WETHValidator,
    __param(0, isEthAddress('lendingPool')),
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isPositiveAmount('amount')),
    __param(0, is0OrPositiveAmount('referralCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], WETHGatewayService.prototype, "depositETH", null);
__decorate([
    WETHValidator,
    __param(0, isEthAddress('lendingPool')),
    __param(0, isEthAddress('user')),
    __param(0, isPositiveAmount('amount')),
    __param(0, isEthAddress('debtTokenAddress')),
    __param(0, is0OrPositiveAmount('referralCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WETHGatewayService.prototype, "borrowETH", null);
__decorate([
    WETHValidator,
    __param(0, isEthAddress('lendingPool')),
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isPositiveOrMinusOneAmount('amount')),
    __param(0, isEthAddress('aTokenAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WETHGatewayService.prototype, "withdrawETH", null);
__decorate([
    WETHValidator,
    __param(0, isEthAddress('lendingPool')),
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isPositiveAmount('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], WETHGatewayService.prototype, "repayETH", null);
//# sourceMappingURL=index.js.map
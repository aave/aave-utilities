import { __decorate, __metadata, __param } from "tslib";
import { constants, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, InterestRate, ProtocolAction, } from '../commons/types';
import { getTxValue, valueToWei, API_ETH_MOCK_ADDRESS, DEFAULT_APPROVE_AMOUNT, SURPLUS, augustusToAmountOffsetFromCalldata, } from '../commons/utils';
import { LPFlashLiquidationValidator, LPRepayWithCollateralValidator, LPSwapCollateralValidator, LPValidator, } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, isPositiveOrMinusOneAmount, } from '../commons/validators/paramValidators';
import { ERC20Service } from '../erc20-contract';
import { augustusFromAmountOffsetFromCalldata, LiquiditySwapAdapterService, } from '../paraswap-liquiditySwapAdapter-contract';
import { ParaswapRepayWithCollateral, } from '../paraswap-repayWithCollateralAdapter-contract';
import { RepayWithCollateralAdapterService, } from '../repayWithCollateralAdapter-contract';
import { SynthetixService } from '../synthetix-contract';
import { WETHGatewayService, } from '../wethgateway-contract';
import { ILendingPool__factory } from './typechain/ILendingPool__factory';
const buildParaSwapLiquiditySwapParams = (assetToSwapTo, minAmountToReceive, swapAllBalanceOffset, swapCalldata, augustus, permitAmount, deadline, v, r, s) => {
    return utils.defaultAbiCoder.encode([
        'address',
        'uint256',
        'uint256',
        'bytes',
        'address',
        'tuple(uint256,uint256,uint8,bytes32,bytes32)',
    ], [
        assetToSwapTo,
        minAmountToReceive,
        swapAllBalanceOffset,
        swapCalldata,
        augustus,
        [permitAmount, deadline, v, r, s],
    ]);
};
export class LendingPool extends BaseService {
    constructor(provider, lendingPoolConfig) {
        super(provider, ILendingPool__factory);
        const { LENDING_POOL, FLASH_LIQUIDATION_ADAPTER, REPAY_WITH_COLLATERAL_ADAPTER, SWAP_COLLATERAL_ADAPTER, WETH_GATEWAY, } = lendingPoolConfig !== null && lendingPoolConfig !== void 0 ? lendingPoolConfig : {};
        this.lendingPoolAddress = LENDING_POOL !== null && LENDING_POOL !== void 0 ? LENDING_POOL : '';
        this.flashLiquidationAddress = FLASH_LIQUIDATION_ADAPTER !== null && FLASH_LIQUIDATION_ADAPTER !== void 0 ? FLASH_LIQUIDATION_ADAPTER : '';
        this.swapCollateralAddress = SWAP_COLLATERAL_ADAPTER !== null && SWAP_COLLATERAL_ADAPTER !== void 0 ? SWAP_COLLATERAL_ADAPTER : '';
        this.repayWithCollateralAddress = REPAY_WITH_COLLATERAL_ADAPTER !== null && REPAY_WITH_COLLATERAL_ADAPTER !== void 0 ? REPAY_WITH_COLLATERAL_ADAPTER : '';
        // initialize services
        this.erc20Service = new ERC20Service(provider);
        this.synthetixService = new SynthetixService(provider);
        this.wethGatewayService = new WETHGatewayService(provider, this.erc20Service, WETH_GATEWAY);
        this.liquiditySwapAdapterService = new LiquiditySwapAdapterService(provider, SWAP_COLLATERAL_ADAPTER);
        this.repayWithCollateralAdapterService =
            new RepayWithCollateralAdapterService(provider, REPAY_WITH_COLLATERAL_ADAPTER);
        this.paraswapRepayWithCollateralAdapterService =
            new ParaswapRepayWithCollateral(provider, REPAY_WITH_COLLATERAL_ADAPTER);
    }
    async deposit({ user, reserve, amount, onBehalfOf, referralCode }) {
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
            return this.wethGatewayService.depositETH({
                lendingPool: this.lendingPoolAddress,
                user,
                amount,
                onBehalfOf,
                referralCode,
            });
        }
        const { isApproved, approve, decimalsOf } = this.erc20Service;
        const txs = [];
        const reserveDecimals = await decimalsOf(reserve);
        const convertedAmount = valueToWei(amount, reserveDecimals);
        const fundsAvailable = await this.synthetixService.synthetixValidation({
            user,
            reserve,
            amount: convertedAmount,
        });
        if (!fundsAvailable) {
            throw new Error('Not enough funds to execute operation');
        }
        const approved = await isApproved({
            token: reserve,
            user,
            spender: this.lendingPoolAddress,
            amount,
        });
        if (!approved) {
            const approveTx = approve({
                user,
                token: reserve,
                spender: this.lendingPoolAddress,
                amount: DEFAULT_APPROVE_AMOUNT,
            });
            txs.push(approveTx);
        }
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.deposit(reserve, convertedAmount, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
            from: user,
            value: getTxValue(reserve, convertedAmount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.deposit),
        });
        return txs;
    }
    async withdraw({ user, reserve, amount, onBehalfOf, aTokenAddress }) {
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
            if (!aTokenAddress) {
                throw new Error('To withdraw ETH you need to pass the aWETH token address');
            }
            return this.wethGatewayService.withdrawETH({
                lendingPool: this.lendingPoolAddress,
                user,
                amount,
                onBehalfOf,
                aTokenAddress,
            });
        }
        const { decimalsOf } = this.erc20Service;
        const decimals = await decimalsOf(reserve);
        const convertedAmount = amount === '-1'
            ? constants.MaxUint256.toString()
            : valueToWei(amount, decimals);
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.withdraw(reserve, convertedAmount, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user),
            from: user,
            action: ProtocolAction.withdraw,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback, ProtocolAction.withdraw),
            },
        ];
    }
    async borrow({ user, reserve, amount, interestRateMode, debtTokenAddress, onBehalfOf, referralCode, }) {
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
            if (!debtTokenAddress) {
                throw new Error(`To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`);
            }
            return this.wethGatewayService.borrowETH({
                lendingPool: this.lendingPoolAddress,
                user,
                amount,
                debtTokenAddress,
                interestRateMode,
                referralCode,
            });
        }
        const { decimalsOf } = this.erc20Service;
        const reserveDecimals = await decimalsOf(reserve);
        const formatAmount = valueToWei(amount, reserveDecimals);
        const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.borrow(reserve, formatAmount, numericRateMode, referralCode !== null && referralCode !== void 0 ? referralCode : 0, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async repay({ user, reserve, amount, interestRateMode, onBehalfOf }) {
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
            return this.wethGatewayService.repayETH({
                lendingPool: this.lendingPoolAddress,
                user,
                amount,
                interestRateMode,
                onBehalfOf,
            });
        }
        const txs = [];
        const { isApproved, approve, decimalsOf } = this.erc20Service;
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const { populateTransaction } = lendingPoolContract;
        const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
        const decimals = await decimalsOf(reserve);
        const convertedAmount = amount === '-1'
            ? constants.MaxUint256.toString()
            : valueToWei(amount, decimals);
        if (amount !== '-1') {
            const fundsAvailable = await this.synthetixService.synthetixValidation({
                user,
                reserve,
                amount: convertedAmount,
            });
            if (!fundsAvailable) {
                throw new Error('Not enough funds to execute operation');
            }
        }
        const approved = await isApproved({
            token: reserve,
            user,
            spender: this.lendingPoolAddress,
            amount,
        });
        if (!approved) {
            const approveTx = approve({
                user,
                token: reserve,
                spender: this.lendingPoolAddress,
                amount: DEFAULT_APPROVE_AMOUNT,
            });
            txs.push(approveTx);
        }
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => populateTransaction.repay(reserve, convertedAmount, numericRateMode, onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user),
            from: user,
            value: getTxValue(reserve, convertedAmount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repay),
        });
        return txs;
    }
    swapBorrowRateMode({ user, reserve, interestRateMode }) {
        const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.swapBorrowRateMode(reserve, numericRateMode),
            from: user,
        });
        return [
            {
                txType: eEthereumTxType.DLP_ACTION,
                tx: txCallback,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    setUsageAsCollateral({ user, reserve, usageAsCollateral }) {
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.setUserUseReserveAsCollateral(reserve, usageAsCollateral),
            from: user,
        });
        return [
            {
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation([], txCallback),
            },
        ];
    }
    async liquidationCall({ liquidator, liquidatedUser, debtReserve, collateralReserve, purchaseAmount, getAToken, liquidateAll, }) {
        const txs = [];
        const { isApproved, approve, decimalsOf } = this.erc20Service;
        const approved = await isApproved({
            token: debtReserve,
            user: liquidator,
            spender: this.lendingPoolAddress,
            amount: purchaseAmount,
        });
        if (!approved) {
            const approveTx = approve({
                user: liquidator,
                token: debtReserve,
                spender: this.lendingPoolAddress,
                amount: DEFAULT_APPROVE_AMOUNT,
            });
            txs.push(approveTx);
        }
        let convertedAmount = constants.MaxUint256.toString();
        if (!liquidateAll) {
            const reserveDecimals = await decimalsOf(debtReserve);
            convertedAmount = valueToWei(purchaseAmount, reserveDecimals);
        }
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.liquidationCall(collateralReserve, debtReserve, liquidatedUser, convertedAmount, getAToken !== null && getAToken !== void 0 ? getAToken : false),
            from: liquidator,
            value: getTxValue(debtReserve, convertedAmount),
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.liquidationCall),
        });
        return txs;
    }
    async swapCollateral({ user, flash, fromAsset, fromAToken, toAsset, fromAmount, minToAmount, permitSignature, swapAll, onBehalfOf, referralCode, augustus, swapCallData, }) {
        const txs = [];
        const permitParams = permitSignature !== null && permitSignature !== void 0 ? permitSignature : {
            amount: '0',
            deadline: '0',
            v: 0,
            r: '0x0000000000000000000000000000000000000000000000000000000000000000',
            s: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };
        const approved = await this.erc20Service.isApproved({
            token: fromAToken,
            user,
            spender: this.swapCollateralAddress,
            amount: fromAmount,
        });
        if (!approved) {
            const approveTx = this.erc20Service.approve({
                user,
                token: fromAToken,
                spender: this.swapCollateralAddress,
                amount: constants.MaxUint256.toString(),
            });
            txs.push(approveTx);
        }
        const tokenDecimals = await this.erc20Service.decimalsOf(fromAsset);
        const convertedAmount = valueToWei(fromAmount, tokenDecimals);
        const tokenToDecimals = await this.erc20Service.decimalsOf(toAsset);
        const amountSlippageConverted = valueToWei(minToAmount, tokenToDecimals);
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        if (flash) {
            const params = buildParaSwapLiquiditySwapParams(toAsset, amountSlippageConverted, swapAll
                ? augustusFromAmountOffsetFromCalldata(swapCallData)
                : 0, swapCallData, augustus, permitParams.amount, permitParams.deadline, permitParams.v, permitParams.r, permitParams.s);
            const amountWithSurplus = (Number(fromAmount) +
                (Number(fromAmount) * Number(SURPLUS)) / 100).toString();
            const convertedAmountWithSurplus = valueToWei(amountWithSurplus, tokenDecimals);
            const txCallback = this.generateTxCallback({
                rawTxMethod: async () => lendingPoolContract.populateTransaction.flashLoan(this.swapCollateralAddress, [fromAsset], swapAll ? [convertedAmountWithSurplus] : [convertedAmount], [0], // interest rate mode to NONE for flashloan to not open debt
                onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user, params, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
                from: user,
            });
            txs.push({
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.swapCollateral),
            });
            return txs;
        }
        // Direct call to swap and deposit
        const swapAndDepositTx = this.liquiditySwapAdapterService.swapAndDeposit({
            user,
            assetToSwapFrom: fromAsset,
            assetToSwapTo: toAsset,
            amountToSwap: convertedAmount,
            minAmountToReceive: amountSlippageConverted,
            swapAll,
            swapCallData,
            augustus,
            permitParams,
        }, txs);
        txs.push(swapAndDepositTx);
        return txs;
    }
    async repayWithCollateral({ user, fromAsset, fromAToken, assetToRepay, repayWithAmount, repayAmount, permitSignature, repayAllDebt, rateMode, onBehalfOf, referralCode, flash, useEthPath, }) {
        const txs = [];
        const permitParams = permitSignature !== null && permitSignature !== void 0 ? permitSignature : {
            amount: '0',
            deadline: '0',
            v: 0,
            r: '0x0000000000000000000000000000000000000000000000000000000000000000',
            s: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };
        const approved = await this.erc20Service.isApproved({
            token: fromAToken,
            user,
            spender: this.repayWithCollateralAddress,
            amount: repayWithAmount,
        });
        if (!approved) {
            const approveTx = this.erc20Service.approve({
                user,
                token: fromAToken,
                spender: this.repayWithCollateralAddress,
                amount: constants.MaxUint256.toString(),
            });
            txs.push(approveTx);
        }
        const fromDecimals = await this.erc20Service.decimalsOf(fromAsset);
        const convertedRepayWithAmount = valueToWei(repayWithAmount, fromDecimals);
        const repayAmountWithSurplus = (Number(repayAmount) +
            (Number(repayAmount) * Number(SURPLUS)) / 100).toString();
        const decimals = await this.erc20Service.decimalsOf(assetToRepay);
        const convertedRepayAmount = repayAllDebt
            ? valueToWei(repayAmountWithSurplus, decimals)
            : valueToWei(repayAmount, decimals);
        const numericInterestRate = rateMode === InterestRate.Stable ? 1 : 2;
        if (flash) {
            const params = utils.defaultAbiCoder.encode([
                'address',
                'uint256',
                'uint256',
                'uint256',
                'uint256',
                'uint8',
                'bytes32',
                'bytes32',
                'bool',
            ], [
                fromAsset,
                convertedRepayWithAmount,
                numericInterestRate,
                permitParams.amount,
                permitParams.deadline,
                permitParams.v,
                permitParams.r,
                permitParams.s,
                useEthPath !== null && useEthPath !== void 0 ? useEthPath : false,
            ]);
            const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
            const txCallback = this.generateTxCallback({
                rawTxMethod: async () => lendingPoolContract.populateTransaction.flashLoan(this.repayWithCollateralAddress, [assetToRepay], [convertedRepayAmount], [0], // interest rate mode to NONE for flashloan to not open debt
                onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user, params, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
                from: user,
            });
            txs.push({
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repayCollateral),
            });
            return txs;
        }
        const swapAndRepayTx = this.repayWithCollateralAdapterService.swapAndRepay({
            user,
            collateralAsset: fromAsset,
            debtAsset: assetToRepay,
            collateralAmount: convertedRepayWithAmount,
            debtRepayAmount: convertedRepayAmount,
            debtRateMode: rateMode,
            permit: permitParams,
            useEthPath,
        }, txs);
        txs.push(swapAndRepayTx);
        return txs;
    }
    async paraswapRepayWithCollateral({ user, fromAsset, fromAToken, assetToRepay, repayWithAmount, repayAmount, permitSignature, repayAllDebt, rateMode, onBehalfOf, referralCode, flash, swapAndRepayCallData, augustus, }) {
        const txs = [];
        const permitParams = permitSignature !== null && permitSignature !== void 0 ? permitSignature : {
            amount: '0',
            deadline: '0',
            v: 0,
            r: '0x0000000000000000000000000000000000000000000000000000000000000000',
            s: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };
        const approved = await this.erc20Service.isApproved({
            token: fromAToken,
            user,
            spender: this.repayWithCollateralAddress,
            amount: repayWithAmount,
        });
        if (!approved) {
            const approveTx = this.erc20Service.approve({
                user,
                token: fromAToken,
                spender: this.repayWithCollateralAddress,
                amount: constants.MaxUint256.toString(),
            });
            txs.push(approveTx);
        }
        const fromDecimals = await this.erc20Service.decimalsOf(fromAsset);
        const convertedRepayWithAmount = valueToWei(repayWithAmount, fromDecimals);
        const repayWithAmountWithSurplus = (Number(repayWithAmount) +
            (Number(repayWithAmount) * Number(SURPLUS)) / 100).toString();
        const convertedRepayWithAmountWithSurplus = valueToWei(repayWithAmountWithSurplus, fromDecimals);
        const decimals = await this.erc20Service.decimalsOf(assetToRepay);
        const convertedRepayAmount = valueToWei(repayAmount, decimals);
        const numericInterestRate = rateMode === InterestRate.Stable ? 1 : 2;
        if (flash) {
            const callDataEncoded = utils.defaultAbiCoder.encode(['bytes', 'address'], [swapAndRepayCallData, augustus]);
            const params = utils.defaultAbiCoder.encode([
                'address',
                'uint256',
                'uint256',
                'uint256',
                'bytes',
                'uint256',
                'uint256',
                'uint8',
                'bytes32',
                'bytes32',
            ], [
                assetToRepay,
                convertedRepayAmount,
                repayAllDebt
                    ? augustusToAmountOffsetFromCalldata(swapAndRepayCallData)
                    : 0,
                numericInterestRate,
                callDataEncoded,
                permitParams.amount,
                permitParams.deadline,
                permitParams.v,
                permitParams.r,
                permitParams.s,
            ]);
            const poolContract = this.getContractInstance(this.lendingPoolAddress);
            const txCallback = this.generateTxCallback({
                rawTxMethod: async () => poolContract.populateTransaction.flashLoan(this.repayWithCollateralAddress, [fromAsset], repayAllDebt
                    ? [convertedRepayWithAmountWithSurplus]
                    : [convertedRepayWithAmount], [0], // interest rate mode to NONE for flashloan to not open debt
                onBehalfOf !== null && onBehalfOf !== void 0 ? onBehalfOf : user, params, referralCode !== null && referralCode !== void 0 ? referralCode : '0'),
                from: user,
            });
            txs.push({
                tx: txCallback,
                txType: eEthereumTxType.DLP_ACTION,
                gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.repayCollateral),
            });
            return txs;
        }
        const swapAndRepayTx = this.paraswapRepayWithCollateralAdapterService.swapAndRepay({
            user,
            collateralAsset: fromAsset,
            debtAsset: assetToRepay,
            collateralAmount: convertedRepayWithAmount,
            debtRepayAmount: convertedRepayAmount,
            debtRateMode: rateMode,
            permitParams,
            repayAll: repayAllDebt !== null && repayAllDebt !== void 0 ? repayAllDebt : false,
            swapAndRepayCallData,
            augustus,
        }, txs);
        txs.push(swapAndRepayTx);
        return txs;
    }
    async flashLiquidation({ user, collateralAsset, borrowedAsset, debtTokenCover, liquidateAll, initiator, useEthPath, }) {
        const addSurplus = (amount) => {
            return (Number(amount) +
                (Number(amount) * Number(amount)) / 100).toString();
        };
        const txs = [];
        const lendingPoolContract = this.getContractInstance(this.lendingPoolAddress);
        const tokenDecimals = await this.erc20Service.decimalsOf(borrowedAsset);
        const convertedDebt = valueToWei(debtTokenCover, tokenDecimals);
        const convertedDebtTokenCover = liquidateAll
            ? constants.MaxUint256.toString()
            : convertedDebt;
        const flashBorrowAmount = liquidateAll
            ? valueToWei(addSurplus(debtTokenCover), tokenDecimals)
            : convertedDebt;
        const params = utils.defaultAbiCoder.encode(['address', 'address', 'address', 'uint256', 'bool'], [
            collateralAsset,
            borrowedAsset,
            user,
            convertedDebtTokenCover,
            useEthPath !== null && useEthPath !== void 0 ? useEthPath : false,
        ]);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => lendingPoolContract.populateTransaction.flashLoan(this.flashLiquidationAddress, [borrowedAsset], [flashBorrowAmount], [0], initiator, params, '0'),
            from: initiator,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.liquidationFlash),
        });
        return txs;
    }
}
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __param(0, isPositiveAmount('amount')),
    __param(0, isEthAddress('onBehalfOf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "deposit", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __param(0, isPositiveOrMinusOneAmount('amount')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isEthAddress('aTokenAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "withdraw", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __param(0, isPositiveAmount('amount')),
    __param(0, isEthAddress('debtTokenAddress')),
    __param(0, isEthAddress('onBehalfOf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "borrow", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __param(0, isPositiveOrMinusOneAmount('amount')),
    __param(0, isEthAddress('onBehalfOf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "repay", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], LendingPool.prototype, "swapBorrowRateMode", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('reserve')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], LendingPool.prototype, "setUsageAsCollateral", null);
__decorate([
    LPValidator,
    __param(0, isEthAddress('liquidator')),
    __param(0, isEthAddress('liquidatedUser')),
    __param(0, isEthAddress('debtReserve')),
    __param(0, isEthAddress('collateralReserve')),
    __param(0, isPositiveAmount('purchaseAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "liquidationCall", null);
__decorate([
    LPSwapCollateralValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('fromAsset')),
    __param(0, isEthAddress('fromAToken')),
    __param(0, isEthAddress('toAsset')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isEthAddress('augustus')),
    __param(0, isPositiveAmount('fromAmount')),
    __param(0, isPositiveAmount('minToAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "swapCollateral", null);
__decorate([
    LPRepayWithCollateralValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('fromAsset')),
    __param(0, isEthAddress('fromAToken')),
    __param(0, isEthAddress('assetToRepay')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isPositiveAmount('repayWithAmount')),
    __param(0, isPositiveAmount('repayAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "repayWithCollateral", null);
__decorate([
    LPRepayWithCollateralValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('fromAsset')),
    __param(0, isEthAddress('fromAToken')),
    __param(0, isEthAddress('assetToRepay')),
    __param(0, isEthAddress('onBehalfOf')),
    __param(0, isPositiveAmount('repayWithAmount')),
    __param(0, isPositiveAmount('repayAmount')),
    __param(0, isEthAddress('augustus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "paraswapRepayWithCollateral", null);
__decorate([
    LPFlashLiquidationValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('collateralAsset')),
    __param(0, isEthAddress('borrowedAsset')),
    __param(0, isPositiveAmount('debtTokenCover')),
    __param(0, isEthAddress('initiator')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LendingPool.prototype, "flashLiquidation", null);
//# sourceMappingURL=index.js.map
import { __decorate, __metadata, __param } from "tslib";
import BaseService from '../commons/BaseService';
import { eEthereumTxType, ProtocolAction, } from '../commons/types';
import { LiquiditySwapValidator } from '../commons/validators/methodValidators';
import { isEthAddress, isPositiveAmount, } from '../commons/validators/paramValidators';
import { IParaSwapLiquiditySwapAdapter__factory } from './typechain/IParaSwapLiquiditySwapAdapter__factory';
export function augustusFromAmountOffsetFromCalldata(calldata) {
    switch (calldata.slice(0, 10)) {
        case '0xda8567c8': // Augustus V3 multiSwap
            return 100; // 4 + 3 * 32
        case '0x58b9d179': // Augustus V4 swapOnUniswap
            return 4; // 4 + 0 * 32
        case '0x0863b7ac': // Augustus V4 swapOnUniswapFork
            return 68; // 4 + 2 * 32
        case '0x8f00eccb': // Augustus V4 multiSwap
            return 68; // 4 + 2 * 32
        case '0xec1d21dd': // Augustus V4 megaSwap
            return 68; // 4 + 2 * 32
        case '0x54840d1a': // Augustus V5 swapOnUniswap
            return 4; // 4 + 0 * 32
        case '0xf5661034': // Augustus V5 swapOnUniswapFork
            return 68; // 4 + 2 * 32
        case '0x0b86a4c1': // Augustus V5 swapOnUniswapV2Fork
            return 36; // 4 + 1 * 32
        case '0x64466805': // Augustus V5 swapOnZeroXv4
            return 68; // 4 + 2 * 32
        case '0xa94e78ef': // Augustus V5 multiSwap
            return 68; // 4 + 2 * 32
        case '0x46c67b6d': // Augustus V5 megaSwap
            return 68; // 4 + 2 * 32
        default:
            throw new Error('Unrecognized function selector for Augustus');
    }
}
export class LiquiditySwapAdapterService extends BaseService {
    constructor(provider, swapCollateralAdapterAddress) {
        super(provider, IParaSwapLiquiditySwapAdapter__factory);
        this.liquiditySwapAdapterAddress = swapCollateralAdapterAddress !== null && swapCollateralAdapterAddress !== void 0 ? swapCollateralAdapterAddress : '';
        this.swapAndDeposit = this.swapAndDeposit.bind(this);
    }
    swapAndDeposit({ user, assetToSwapFrom, assetToSwapTo, amountToSwap, minAmountToReceive, permitParams, augustus, swapCallData, swapAll, }, txs) {
        const liquiditySwapContract = this.getContractInstance(this.liquiditySwapAdapterAddress);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => liquiditySwapContract.populateTransaction.swapAndDeposit(assetToSwapFrom, assetToSwapTo, amountToSwap, minAmountToReceive, swapAll
                ? augustusFromAmountOffsetFromCalldata(swapCallData)
                : 0, swapCallData, augustus, permitParams),
            from: user,
        });
        return {
            tx: txCallback,
            txType: eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs !== null && txs !== void 0 ? txs : [], txCallback, ProtocolAction.swapCollateral),
        };
    }
}
__decorate([
    LiquiditySwapValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddress('assetToSwapFrom')),
    __param(0, isEthAddress('assetToSwapTo')),
    __param(0, isEthAddress('augustus')),
    __param(0, isPositiveAmount('amountToSwap')),
    __param(0, isPositiveAmount('minAmountToReceive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Object)
], LiquiditySwapAdapterService.prototype, "swapAndDeposit", null);
//# sourceMappingURL=index.js.map
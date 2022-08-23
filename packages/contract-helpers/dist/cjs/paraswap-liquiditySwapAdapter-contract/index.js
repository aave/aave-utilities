"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquiditySwapAdapterService = exports.augustusFromAmountOffsetFromCalldata = void 0;
const tslib_1 = require("tslib");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IParaSwapLiquiditySwapAdapter__factory_1 = require("./typechain/IParaSwapLiquiditySwapAdapter__factory");
function augustusFromAmountOffsetFromCalldata(calldata) {
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
exports.augustusFromAmountOffsetFromCalldata = augustusFromAmountOffsetFromCalldata;
class LiquiditySwapAdapterService extends BaseService_1.default {
    constructor(provider, swapCollateralAdapterAddress) {
        super(provider, IParaSwapLiquiditySwapAdapter__factory_1.IParaSwapLiquiditySwapAdapter__factory);
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
            txType: types_1.eEthereumTxType.DLP_ACTION,
            gas: this.generateTxPriceEstimation(txs !== null && txs !== void 0 ? txs : [], txCallback, types_1.ProtocolAction.swapCollateral),
        };
    }
}
(0, tslib_1.__decorate)([
    methodValidators_1.LiquiditySwapValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('assetToSwapFrom')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('assetToSwapTo')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('augustus')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('amountToSwap')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isPositiveAmount)('minAmountToReceive')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Array]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], LiquiditySwapAdapterService.prototype, "swapAndDeposit", null);
exports.LiquiditySwapAdapterService = LiquiditySwapAdapterService;
//# sourceMappingURL=index.js.map
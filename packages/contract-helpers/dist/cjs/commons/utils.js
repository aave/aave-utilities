"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.augustusToAmountOffsetFromCalldata = exports.mintAmountsPerToken = exports.gasLimitRecommendations = exports.SURPLUS = exports.uniswapEthAmount = exports.API_ETH_MOCK_ADDRESS = exports.SUPER_BIG_ALLOWANCE_NUMBER = exports.MAX_UINT_AMOUNT = exports.DEFAULT_APPROVE_AMOUNT = exports.DEFAULT_NULL_VALUE_ON_TX = exports.getTxValue = exports.decimalsToCurrencyUnits = exports.canBeEnsAddress = exports.valueToWei = void 0;
const bignumber_js_1 = require("bignumber.js");
const ethers_1 = require("ethers");
const types_1 = require("./types");
const valueToWei = (value, decimals) => {
    return new bignumber_js_1.BigNumber(value).shiftedBy(decimals).toFixed(0);
};
exports.valueToWei = valueToWei;
const canBeEnsAddress = (ensAddress) => {
    return ensAddress.toLowerCase().endsWith('.eth');
};
exports.canBeEnsAddress = canBeEnsAddress;
const decimalsToCurrencyUnits = (value, decimals) => new bignumber_js_1.BigNumber(value).shiftedBy(decimals * -1).toFixed();
exports.decimalsToCurrencyUnits = decimalsToCurrencyUnits;
// .div(new BigNumberJs(10).pow(decimals)).toFixed();
const getTxValue = (reserve, amount) => {
    return reserve.toLowerCase() === exports.API_ETH_MOCK_ADDRESS.toLowerCase()
        ? amount
        : exports.DEFAULT_NULL_VALUE_ON_TX;
};
exports.getTxValue = getTxValue;
exports.DEFAULT_NULL_VALUE_ON_TX = ethers_1.BigNumber.from(0).toHexString();
exports.DEFAULT_APPROVE_AMOUNT = ethers_1.constants.MaxUint256.toString();
exports.MAX_UINT_AMOUNT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
exports.SUPER_BIG_ALLOWANCE_NUMBER = '11579208923731619542357098500868790785326998466564056403945758400791';
exports.API_ETH_MOCK_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
exports.uniswapEthAmount = '0.1';
exports.SURPLUS = '0.05';
exports.gasLimitRecommendations = {
    [types_1.ProtocolAction.default]: {
        limit: '210000',
        recommended: '210000',
    },
    [types_1.ProtocolAction.supply]: {
        limit: '300000',
        recommended: '300000',
    },
    [types_1.ProtocolAction.deposit]: {
        limit: '300000',
        recommended: '300000',
    },
    [types_1.ProtocolAction.withdraw]: {
        limit: '230000',
        recommended: '300000',
    },
    [types_1.ProtocolAction.liquidationCall]: {
        limit: '700000',
        recommended: '700000',
    },
    [types_1.ProtocolAction.liquidationFlash]: {
        limit: '995000',
        recommended: '995000',
    },
    [types_1.ProtocolAction.repay]: {
        limit: '300000',
        recommended: '300000',
    },
    [types_1.ProtocolAction.borrowETH]: {
        limit: '450000',
        recommended: '450000',
    },
    [types_1.ProtocolAction.withdrawETH]: {
        limit: '640000',
        recommended: '640000',
    },
    [types_1.ProtocolAction.swapCollateral]: {
        limit: '1000000',
        recommended: '1000000',
    },
    [types_1.ProtocolAction.repayCollateral]: {
        limit: '700000',
        recommended: '700000',
    },
};
exports.mintAmountsPerToken = {
    AAVE: (0, exports.valueToWei)('100', 18),
    BAT: (0, exports.valueToWei)('100000', 18),
    BUSD: (0, exports.valueToWei)('10000', 18),
    DAI: (0, exports.valueToWei)('10000', 18),
    ENJ: (0, exports.valueToWei)('100000', 18),
    KNC: (0, exports.valueToWei)('10000', 18),
    LEND: (0, exports.valueToWei)('1000', 18),
    LINK: (0, exports.valueToWei)('1000', 18),
    MANA: (0, exports.valueToWei)('100000', 18),
    MKR: (0, exports.valueToWei)('10', 18),
    WETH: (0, exports.valueToWei)('10', 18),
    REN: (0, exports.valueToWei)('10000', 18),
    REP: (0, exports.valueToWei)('1000', 18),
    SNX: (0, exports.valueToWei)('100', 18),
    SUSD: (0, exports.valueToWei)('10000', 18),
    TUSD: '0',
    UNI: (0, exports.valueToWei)('1000', 18),
    USDC: (0, exports.valueToWei)('10000', 6),
    USDT: (0, exports.valueToWei)('10000', 6),
    WBTC: (0, exports.valueToWei)('1', 8),
    YFI: (0, exports.valueToWei)('1', 18),
    ZRX: (0, exports.valueToWei)('100000', 18),
    UNIUSDC: (0, exports.valueToWei)(exports.uniswapEthAmount, 6),
    UNIDAI: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNIUSDT: (0, exports.valueToWei)(exports.uniswapEthAmount, 6),
    UNIDAIETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNIUSDCETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNISETHETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNILENDETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNILINKETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    UNIMKRETH: (0, exports.valueToWei)(exports.uniswapEthAmount, 18),
    EURS: (0, exports.valueToWei)('10000', 2),
    AGEUR: (0, exports.valueToWei)('10000', 18),
    BAL: (0, exports.valueToWei)('10000', 18),
    CRV: (0, exports.valueToWei)('10000', 18),
    DPI: (0, exports.valueToWei)('10000', 18),
    GHST: (0, exports.valueToWei)('10000', 18),
    JEUR: (0, exports.valueToWei)('10000', 18),
    SUSHI: (0, exports.valueToWei)('10000', 18),
};
const augustusToAmountOffsetFromCalldata = (calldata) => {
    switch (calldata.slice(0, 10)) {
        case '0x935fb84b': // Augustus V5 buyOnUniswap
            return 36; // 4 + 1 * 32
        case '0xc03786b0': // Augustus V5 buyOnUniswapFork
            return 100; // 4 + 3 * 32
        case '0xb2f1e6db': // Augustus V5 buyOnUniswapV2Fork
            return 68; // 4 + 2 * 32
        case '0xb66bcbac': // Augustus V5 buy (old)
        case '0x35326910': // Augustus V5 buy
            return 164; // 4 + 5 * 32
        default:
            throw new Error('Unrecognized function selector for Augustus');
    }
};
exports.augustusToAmountOffsetFromCalldata = augustusToAmountOffsetFromCalldata;
//# sourceMappingURL=utils.js.map
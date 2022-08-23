"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGasByNetwork = exports.estimateGas = void 0;
const types_1 = require("./types");
const DEFAULT_SURPLUS = 30; // 30%
// polygon gas estimation is very off for some reason
const POLYGON_SURPLUS = 60; // 60%
const estimateGas = async (tx, provider, gasSurplus) => {
    const estimatedGas = await provider.estimateGas(tx);
    return estimatedGas.add(estimatedGas.mul(gasSurplus !== null && gasSurplus !== void 0 ? gasSurplus : DEFAULT_SURPLUS).div(100));
};
exports.estimateGas = estimateGas;
const estimateGasByNetwork = async (tx, provider, gasSurplus) => {
    const estimatedGas = await provider.estimateGas(tx);
    const providerNework = await provider.getNetwork();
    if (providerNework.chainId === types_1.ChainId.polygon) {
        return estimatedGas.add(estimatedGas.mul(POLYGON_SURPLUS).div(100));
    }
    return estimatedGas.add(estimatedGas.mul(gasSurplus !== null && gasSurplus !== void 0 ? gasSurplus : DEFAULT_SURPLUS).div(100));
};
exports.estimateGasByNetwork = estimateGasByNetwork;
//# sourceMappingURL=gasStation.js.map
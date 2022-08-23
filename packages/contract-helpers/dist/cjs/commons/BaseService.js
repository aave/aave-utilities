"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const gasStation_1 = require("./gasStation");
const types_1 = require("./types");
const utils_1 = require("./utils");
class BaseService {
    constructor(provider, contractFactory) {
        this.getContractInstance = (address) => {
            if (!this.contractInstances[address]) {
                this.contractInstances[address] = this.contractFactory.connect(address, this.provider);
            }
            return this.contractInstances[address];
        };
        this.generateTxCallback = ({ rawTxMethod, from, value, gasSurplus, action, }) => async () => {
            const txRaw = await rawTxMethod();
            const tx = Object.assign(Object.assign({}, txRaw), { from, value: value !== null && value !== void 0 ? value : utils_1.DEFAULT_NULL_VALUE_ON_TX });
            tx.gasLimit = await (0, gasStation_1.estimateGasByNetwork)(tx, this.provider, gasSurplus);
            if (action &&
                utils_1.gasLimitRecommendations[action] &&
                tx.gasLimit.lte(ethers_1.BigNumber.from(utils_1.gasLimitRecommendations[action].limit))) {
                tx.gasLimit = ethers_1.BigNumber.from(utils_1.gasLimitRecommendations[action].recommended);
            }
            return tx;
        };
        this.generateTxPriceEstimation = (txs, txCallback, action = types_1.ProtocolAction.default) => async (force = false) => {
            const gasPrice = await this.provider.getGasPrice();
            const hasPendingApprovals = txs.find(tx => tx.txType === types_1.eEthereumTxType.ERC20_APPROVAL);
            if (!hasPendingApprovals || force) {
                const { gasLimit, gasPrice: gasPriceProv } = await txCallback();
                if (!gasLimit) {
                    // If we don't recieve the correct gas we throw a error
                    throw new Error('Transaction calculation error');
                }
                return {
                    gasLimit: gasLimit.toString(),
                    gasPrice: gasPriceProv
                        ? gasPriceProv.toString()
                        : gasPrice.toString(),
                };
            }
            return {
                gasLimit: utils_1.gasLimitRecommendations[action].recommended,
                gasPrice: gasPrice.toString(),
            };
        };
        this.contractFactory = contractFactory;
        this.provider = provider;
        this.contractInstances = {};
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map
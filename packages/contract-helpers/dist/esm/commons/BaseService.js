import { BigNumber, } from 'ethers';
import { estimateGasByNetwork } from './gasStation';
import { ProtocolAction, eEthereumTxType, } from './types';
import { DEFAULT_NULL_VALUE_ON_TX, gasLimitRecommendations } from './utils';
export default class BaseService {
    constructor(provider, contractFactory) {
        this.getContractInstance = (address) => {
            if (!this.contractInstances[address]) {
                this.contractInstances[address] = this.contractFactory.connect(address, this.provider);
            }
            return this.contractInstances[address];
        };
        this.generateTxCallback = ({ rawTxMethod, from, value, gasSurplus, action, }) => async () => {
            const txRaw = await rawTxMethod();
            const tx = Object.assign(Object.assign({}, txRaw), { from, value: value !== null && value !== void 0 ? value : DEFAULT_NULL_VALUE_ON_TX });
            tx.gasLimit = await estimateGasByNetwork(tx, this.provider, gasSurplus);
            if (action &&
                gasLimitRecommendations[action] &&
                tx.gasLimit.lte(BigNumber.from(gasLimitRecommendations[action].limit))) {
                tx.gasLimit = BigNumber.from(gasLimitRecommendations[action].recommended);
            }
            return tx;
        };
        this.generateTxPriceEstimation = (txs, txCallback, action = ProtocolAction.default) => async (force = false) => {
            const gasPrice = await this.provider.getGasPrice();
            const hasPendingApprovals = txs.find(tx => tx.txType === eEthereumTxType.ERC20_APPROVAL);
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
                gasLimit: gasLimitRecommendations[action].recommended,
                gasPrice: gasPrice.toString(),
            };
        };
        this.contractFactory = contractFactory;
        this.provider = provider;
        this.contractInstances = {};
    }
}
//# sourceMappingURL=BaseService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainlinkFeedsRegistry = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("ethers/lib/utils");
const FeedRegistryInterface__factory_1 = require("./typechain/FeedRegistryInterface__factory");
const ChainlinkFeedsRegistryTypes_1 = require("./types/ChainlinkFeedsRegistryTypes");
(0, tslib_1.__exportStar)(require("./types/ChainlinkFeedsRegistryTypes"), exports);
class ChainlinkFeedsRegistry {
    constructor({ provider, chainlinkFeedsRegistry, }) {
        this.latestRoundData = async (tokenAddress, quote) => {
            if (!(0, utils_1.isAddress)(tokenAddress)) {
                throw new Error('tokenAddress is not valid');
            }
            return this._registryContract.latestRoundData(tokenAddress, ChainlinkFeedsRegistryTypes_1.DenominationAddresses[quote]);
        };
        this.decimals = async (tokenAddress, quote) => {
            if (!(0, utils_1.isAddress)(tokenAddress)) {
                throw new Error('tokenAddress is not valid');
            }
            return this._registryContract.decimals(tokenAddress, ChainlinkFeedsRegistryTypes_1.DenominationAddresses[quote]);
        };
        this.getPriceFeed = async (tokenAddress, quote) => {
            const rawFeed = await this.latestRoundData(tokenAddress, quote);
            const feedDecimals = await this.decimals(tokenAddress, quote);
            return {
                answer: rawFeed[1].toString(),
                updatedAt: rawFeed[3].toNumber(),
                decimals: feedDecimals,
            };
        };
        if (!(0, utils_1.isAddress)(chainlinkFeedsRegistry)) {
            throw new Error('contract address is not valid');
        }
        this._registryContract = FeedRegistryInterface__factory_1.FeedRegistryInterface__factory.connect(chainlinkFeedsRegistry, provider);
    }
}
exports.ChainlinkFeedsRegistry = ChainlinkFeedsRegistry;
//# sourceMappingURL=index.js.map
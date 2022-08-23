import { isAddress } from 'ethers/lib/utils';
import { FeedRegistryInterface__factory } from './typechain/FeedRegistryInterface__factory';
import { DenominationAddresses, } from './types/ChainlinkFeedsRegistryTypes';
export * from './types/ChainlinkFeedsRegistryTypes';
export class ChainlinkFeedsRegistry {
    constructor({ provider, chainlinkFeedsRegistry, }) {
        this.latestRoundData = async (tokenAddress, quote) => {
            if (!isAddress(tokenAddress)) {
                throw new Error('tokenAddress is not valid');
            }
            return this._registryContract.latestRoundData(tokenAddress, DenominationAddresses[quote]);
        };
        this.decimals = async (tokenAddress, quote) => {
            if (!isAddress(tokenAddress)) {
                throw new Error('tokenAddress is not valid');
            }
            return this._registryContract.decimals(tokenAddress, DenominationAddresses[quote]);
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
        if (!isAddress(chainlinkFeedsRegistry)) {
            throw new Error('contract address is not valid');
        }
        this._registryContract = FeedRegistryInterface__factory.connect(chainlinkFeedsRegistry, provider);
    }
}
//# sourceMappingURL=index.js.map
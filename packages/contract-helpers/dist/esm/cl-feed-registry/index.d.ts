import { providers } from 'ethers';
import {
  Denominations,
  LatestRoundData,
  PriceFeed,
} from './types/ChainlinkFeedsRegistryTypes';
export * from './types/ChainlinkFeedsRegistryTypes';
export interface ChainlinkFeedsRegistryInterface {
  latestRoundData: (
    tokenAddress: string,
    quote: Denominations,
  ) => Promise<LatestRoundData>;
  decimals: (tokenAddress: string, quote: Denominations) => Promise<number>;
  getPriceFeed: (
    tokenAddress: string,
    quote: Denominations,
  ) => Promise<PriceFeed>;
}
export interface ChainlinkFeedsRegistryContext {
  chainlinkFeedsRegistry: string;
  provider: providers.Provider;
}
export declare class ChainlinkFeedsRegistry
  implements ChainlinkFeedsRegistryInterface
{
  private readonly _registryContract;
  constructor({
    provider,
    chainlinkFeedsRegistry,
  }: ChainlinkFeedsRegistryContext);
  latestRoundData: (
    tokenAddress: string,
    quote: Denominations,
  ) => Promise<LatestRoundData>;
  decimals: (tokenAddress: string, quote: Denominations) => Promise<number>;
  getPriceFeed: (
    tokenAddress: string,
    quote: Denominations,
  ) => Promise<PriceFeed>;
}
//# sourceMappingURL=index.d.ts.map

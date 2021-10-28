import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { FeedRegistryInterface } from './typechain/FeedRegistryInterface';
import { FeedRegistryInterface__factory } from './typechain/FeedRegistryInterface__factory';
import {
  DenominationAddresses,
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

export class ChainlinkFeedsRegistry implements ChainlinkFeedsRegistryInterface {
  private readonly _registryContract: FeedRegistryInterface;

  public constructor({
    provider,
    chainlinkFeedsRegistry,
  }: ChainlinkFeedsRegistryContext) {
    if (!isAddress(chainlinkFeedsRegistry)) {
      throw new Error('contract address is not valid');
    }

    this._registryContract = FeedRegistryInterface__factory.connect(
      chainlinkFeedsRegistry,
      provider,
    );
  }

  public latestRoundData = async (
    tokenAddress: string,
    quote: Denominations,
  ): Promise<LatestRoundData> => {
    if (!isAddress(tokenAddress)) {
      throw new Error('tokenAddress is not valid');
    }

    return this._registryContract.latestRoundData(
      tokenAddress,
      DenominationAddresses[quote],
    );
  };

  public decimals = async (
    tokenAddress: string,
    quote: Denominations,
  ): Promise<number> => {
    if (!isAddress(tokenAddress)) {
      throw new Error('tokenAddress is not valid');
    }

    return this._registryContract.decimals(
      tokenAddress,
      DenominationAddresses[quote],
    );
  };

  public getPriceFeed = async (
    tokenAddress: string,
    quote: Denominations,
  ): Promise<PriceFeed> => {
    const rawFeed = await this.latestRoundData(tokenAddress, quote);
    const feedDecimals = await this.decimals(tokenAddress, quote);

    return {
      answer: rawFeed[1].toString(),
      updatedAt: rawFeed[3].toNumber(),
      decimals: feedDecimals,
    };
  };
}

import { ethers, providers } from 'ethers';
import {
  ChainId,
  ChainIdToNetwork,
  DefaultProviderKeys,
  Network,
} from './types';

export type Context = {
  chainId: ChainId;
  injectedProvider?: providers.Provider | string | undefined;
  defaultProviderKeys?: DefaultProviderKeys;
};

export default class BaseTxBuilder {
  readonly network: Network;

  readonly provider: providers.Provider;

  readonly chainId: ChainId;

  constructor({ chainId, injectedProvider, defaultProviderKeys }: Context) {
    this.chainId = chainId;

    if (!injectedProvider) {
      if (defaultProviderKeys && Object.keys(defaultProviderKeys).length > 1) {
        this.provider = ethers.getDefaultProvider(
          ChainIdToNetwork[chainId],
          defaultProviderKeys,
        );
      } else {
        this.provider = ethers.getDefaultProvider(ChainIdToNetwork[chainId]);
        console.log(
          `These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`,
        );
      }
    } else if (typeof injectedProvider === 'string') {
      this.provider = new providers.StaticJsonRpcProvider(
        injectedProvider,
        chainId,
      );
    } else if (injectedProvider instanceof providers.Provider) {
      this.provider = injectedProvider;
    } else {
      this.provider = new providers.Web3Provider(injectedProvider, chainId);
    }
  }
}

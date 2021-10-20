import { ethers, providers } from 'ethers';
import { ChainId, DefaultProviderKeys, Network } from './types';

export type Context = {
  network: Network;
  injectedProvider?: providers.Provider | string | undefined;
  defaultProviderKeys?: DefaultProviderKeys;
};

export default class BaseTxBuilder {
  readonly network: Network;

  readonly provider: providers.Provider;

  constructor({ network, injectedProvider, defaultProviderKeys }: Context) {
    const chainId = ChainId[network];

    if (!injectedProvider) {
      if (defaultProviderKeys && Object.keys(defaultProviderKeys).length > 1) {
        this.provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        this.provider = ethers.getDefaultProvider(network);
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

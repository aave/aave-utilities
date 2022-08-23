import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/providers';
import { ContractFactory } from '@ethersproject/contracts';
import { UiPoolDataProvider } from './UiPoolDataProvider';
export declare class UiPoolDataProviderFactory extends ContractFactory {
  constructor(signer?: Signer);
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): UiPoolDataProvider;
}
//# sourceMappingURL=UiPoolDataProviderFactory.d.ts.map

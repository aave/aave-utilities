import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/providers';
import { ContractFactory } from '@ethersproject/contracts';
import { UiIncentiveDataProvider } from './UiIncentiveDataProvider';
export declare class UiIncentiveDataProviderFactory extends ContractFactory {
  constructor(signer?: Signer);
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): UiIncentiveDataProvider;
}
//# sourceMappingURL=UiIncentiveDataProviderFactory.d.ts.map

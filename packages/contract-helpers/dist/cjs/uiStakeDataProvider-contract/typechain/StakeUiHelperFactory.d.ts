import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import type { StakeUiHelperI } from './StakeUiHelperI';
export declare class StakeUiHelperFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): StakeUiHelperI;
}
//# sourceMappingURL=StakeUiHelperFactory.d.ts.map

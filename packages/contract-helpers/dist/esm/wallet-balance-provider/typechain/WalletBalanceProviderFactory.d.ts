import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/providers';
import { ContractFactory } from '@ethersproject/contracts';
import { WalletBalanceProvider } from './WalletBalanceProvider';
export declare class WalletBalanceProviderFactory extends ContractFactory {
  constructor(signer?: Signer);
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): WalletBalanceProvider;
}
//# sourceMappingURL=WalletBalanceProviderFactory.d.ts.map

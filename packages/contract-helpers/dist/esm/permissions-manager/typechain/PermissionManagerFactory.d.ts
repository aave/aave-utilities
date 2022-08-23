import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/providers';
import { ContractFactory } from '@ethersproject/contracts';
import { PermissionManager } from './PermissionManager';
export declare class PermissionManagerFactory extends ContractFactory {
  constructor(signer?: Signer);
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): PermissionManager;
}
//# sourceMappingURL=PermissionManagerFactory.d.ts.map

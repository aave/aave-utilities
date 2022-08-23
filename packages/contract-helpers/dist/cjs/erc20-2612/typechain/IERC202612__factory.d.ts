import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { IERC202612, IERC202612Interface } from './IERC202612';
export declare class IERC202612__factory {
  static readonly abi: {
    inputs: {
      internalType: string;
      name: string;
      type: string;
    }[];
    name: string;
    outputs: {
      internalType: string;
      name: string;
      type: string;
    }[];
    stateMutability: string;
    type: string;
  }[];
  static createInterface(): IERC202612Interface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): IERC202612;
}
//# sourceMappingURL=IERC202612__factory.d.ts.map

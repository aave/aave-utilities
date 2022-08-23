import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { IL2Pool, IL2PoolInterface } from './IL2Pool';
export declare class IL2Pool__factory {
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
  static createInterface(): IL2PoolInterface;
  static connect(address: string, signerOrProvider: Signer | Provider): IL2Pool;
}
//# sourceMappingURL=IL2Pool__factory.d.ts.map

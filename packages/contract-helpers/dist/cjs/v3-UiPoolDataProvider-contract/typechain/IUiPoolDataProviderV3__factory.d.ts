import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type {
  IUiPoolDataProviderV3,
  IUiPoolDataProviderV3Interface,
} from './IUiPoolDataProviderV3';
export declare class IUiPoolDataProviderV3__factory {
  static readonly abi: {
    inputs: {
      internalType: string;
      name: string;
      type: string;
    }[];
    name: string;
    outputs: (
      | {
          components: {
            internalType: string;
            name: string;
            type: string;
          }[];
          internalType: string;
          name: string;
          type: string;
        }
      | {
          internalType: string;
          name: string;
          type: string;
          components?: undefined;
        }
    )[];
    stateMutability: string;
    type: string;
  }[];
  static createInterface(): IUiPoolDataProviderV3Interface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): IUiPoolDataProviderV3;
}
//# sourceMappingURL=IUiPoolDataProviderV3__factory.d.ts.map

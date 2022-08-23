import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type {
  IUiIncentiveDataProviderV3,
  IUiIncentiveDataProviderV3Interface,
} from './IUiIncentiveDataProviderV3';
export declare class IUiIncentiveDataProviderV3__factory {
  static readonly abi: {
    inputs: {
      internalType: string;
      name: string;
      type: string;
    }[];
    name: string;
    outputs: {
      components: (
        | {
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
          }
        | {
            components: (
              | {
                  internalType: string;
                  name: string;
                  type: string;
                  components?: undefined;
                }
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
            )[];
            internalType: string;
            name: string;
            type: string;
          }
      )[];
      internalType: string;
      name: string;
      type: string;
    }[];
    stateMutability: string;
    type: string;
  }[];
  static createInterface(): IUiIncentiveDataProviderV3Interface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): IUiIncentiveDataProviderV3;
}
//# sourceMappingURL=IUiIncentiveDataProviderV3__factory.d.ts.map

import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type {
  IAaveIncentivesControllerV2,
  IAaveIncentivesControllerV2Interface,
} from './IAaveIncentivesControllerV2';
export declare class IAaveIncentivesControllerV2__factory {
  static readonly abi: (
    | {
        anonymous: boolean;
        inputs: {
          indexed: boolean;
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
      }
    | {
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
        anonymous?: undefined;
      }
    | {
        inputs: {
          components: {
            internalType: string;
            name: string;
            type: string;
          }[];
          internalType: string;
          name: string;
          type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
      }
  )[];
  static createInterface(): IAaveIncentivesControllerV2Interface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): IAaveIncentivesControllerV2;
}
//# sourceMappingURL=IAaveIncentivesControllerV2__factory.d.ts.map

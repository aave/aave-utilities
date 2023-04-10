/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IUiGhoDataProvider,
  IUiGhoDataProviderInterface,
} from "./IUiGhoDataProvider";

const _abi = [
  {
    inputs: [],
    name: "getGhoReserveData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ghoBaseVariableBorrowRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ghoDiscountedPerToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ghoDiscountRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ghoMinDebtTokenBalanceForDiscount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ghoMinDiscountTokenBalanceForDiscount",
            type: "uint256",
          },
          {
            internalType: "uint40",
            name: "ghoReserveLastUpdateTimestamp",
            type: "uint40",
          },
          {
            internalType: "uint128",
            name: "ghoCurrentBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint256",
            name: "aaveFacilitatorBucketLevel",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "aaveFacilitatorBucketMaxCapacity",
            type: "uint256",
          },
        ],
        internalType: "struct IUiGhoDataProvider.GhoReserveData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getGhoUserData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "userGhoDiscountPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userDiscountTokenBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userPreviousGhoBorrowIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userGhoScaledBorrowBalance",
            type: "uint256",
          },
        ],
        internalType: "struct IUiGhoDataProvider.GhoUserData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IUiGhoDataProvider__factory {
  static readonly abi = _abi;
  static createInterface(): IUiGhoDataProviderInterface {
    return new utils.Interface(_abi) as IUiGhoDataProviderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUiGhoDataProvider {
    return new Contract(address, _abi, signerOrProvider) as IUiGhoDataProvider;
  }
}

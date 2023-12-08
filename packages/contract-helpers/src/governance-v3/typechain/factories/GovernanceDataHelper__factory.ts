/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  GovernanceDataHelper,
  GovernanceDataHelperInterface,
} from "../GovernanceDataHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IGovernanceCore",
        name: "govCore",
        type: "address",
      },
      {
        internalType: "enum PayloadsControllerUtils.AccessControl[]",
        name: "accessLevels",
        type: "uint8[]",
      },
    ],
    name: "getConstants",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "enum PayloadsControllerUtils.AccessControl",
                name: "accessLevel",
                type: "uint8",
              },
              {
                components: [
                  {
                    internalType: "uint24",
                    name: "coolDownBeforeVotingStart",
                    type: "uint24",
                  },
                  {
                    internalType: "uint24",
                    name: "votingDuration",
                    type: "uint24",
                  },
                  {
                    internalType: "uint56",
                    name: "yesThreshold",
                    type: "uint56",
                  },
                  {
                    internalType: "uint56",
                    name: "yesNoDifferential",
                    type: "uint56",
                  },
                  {
                    internalType: "uint56",
                    name: "minPropositionPower",
                    type: "uint56",
                  },
                ],
                internalType: "struct IGovernanceCore.VotingConfig",
                name: "config",
                type: "tuple",
              },
            ],
            internalType: "struct IGovernanceDataHelper.VotingConfig[]",
            name: "votingConfigs",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "precisionDivider",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cooldownPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cancellationFee",
            type: "uint256",
          },
        ],
        internalType: "struct IGovernanceDataHelper.Constants",
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
        internalType: "contract IGovernanceCore",
        name: "govCore",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "from",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "to",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pageSize",
        type: "uint256",
      },
    ],
    name: "getProposalsData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingChainId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum IGovernanceCore.State",
                name: "state",
                type: "uint8",
              },
              {
                internalType: "enum PayloadsControllerUtils.AccessControl",
                name: "accessLevel",
                type: "uint8",
              },
              {
                internalType: "uint40",
                name: "creationTime",
                type: "uint40",
              },
              {
                internalType: "uint24",
                name: "votingDuration",
                type: "uint24",
              },
              {
                internalType: "uint40",
                name: "votingActivationTime",
                type: "uint40",
              },
              {
                internalType: "uint40",
                name: "queuingTime",
                type: "uint40",
              },
              {
                internalType: "uint40",
                name: "cancelTimestamp",
                type: "uint40",
              },
              {
                internalType: "address",
                name: "creator",
                type: "address",
              },
              {
                internalType: "address",
                name: "votingPortal",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "snapshotBlockHash",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "ipfsHash",
                type: "bytes32",
              },
              {
                internalType: "uint128",
                name: "forVotes",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "againstVotes",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "cancellationFee",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "chain",
                    type: "uint256",
                  },
                  {
                    internalType: "enum PayloadsControllerUtils.AccessControl",
                    name: "accessLevel",
                    type: "uint8",
                  },
                  {
                    internalType: "address",
                    name: "payloadsController",
                    type: "address",
                  },
                  {
                    internalType: "uint40",
                    name: "payloadId",
                    type: "uint40",
                  },
                ],
                internalType: "struct PayloadsControllerUtils.Payload[]",
                name: "payloads",
                type: "tuple[]",
              },
            ],
            internalType: "struct IGovernanceCore.Proposal",
            name: "proposalData",
            type: "tuple",
          },
        ],
        internalType: "struct IGovernanceDataHelper.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IGovernanceCore",
        name: "govCore",
        type: "address",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "chainIds",
        type: "uint256[]",
      },
    ],
    name: "getRepresentationData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "representative",
            type: "address",
          },
        ],
        internalType: "struct IGovernanceDataHelper.Representatives[]",
        name: "",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "votersRepresented",
            type: "address[]",
          },
        ],
        internalType: "struct IGovernanceDataHelper.Represented[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class GovernanceDataHelper__factory {
  static readonly abi = _abi;
  static createInterface(): GovernanceDataHelperInterface {
    return new utils.Interface(_abi) as GovernanceDataHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GovernanceDataHelper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as GovernanceDataHelper;
  }
}

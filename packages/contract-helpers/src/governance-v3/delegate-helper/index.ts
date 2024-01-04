import { BigNumber, PopulatedTransaction, providers } from 'ethers';
import { tEthereumAddress, ENS, ProtocolAction } from '../../commons/types';
import { gasLimitRecommendations } from '../../commons/utils';
import { MetaDelegateHelper } from '../typechain/MetaDelegateHelper';
import { MetaDelegateHelper__factory } from '../typechain/factories/MetaDelegateHelper__factory';
export enum DelegationType {
  VOTING,
  PROPOSITION,
  ALL,
}

export type MetaDelegateParams = {
  delegator: string;
  delegatee: string;
  underlyingAsset: string;
  deadline: string;
  v: number;
  r: string;
  s: string;
  delegationType: number;
};

export type DelegateMetaSigParams = {
  underlyingAsset: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: DelegationType;
  delegator: tEthereumAddress;
  increaseNonce: boolean;
  governanceTokenName: string;
  nonce: string;
  connectedChainId: number;
  deadline: string;
};

export class MetaDelegateHelperService {
  readonly _contract: MetaDelegateHelper;

  readonly _contractInterface = MetaDelegateHelper__factory.createInterface();
  private readonly metaDelegateHelperContractAddress: string;

  constructor(
    metaDelegateHelperContractAddress: string,
    provider: providers.Provider,
  ) {
    this.metaDelegateHelperContractAddress = metaDelegateHelperContractAddress; // Assign the contract address

    this._contract = MetaDelegateHelper__factory.connect(
      metaDelegateHelperContractAddress,
      provider,
    );
  }

  public batchMetaDelegate(
    user: string,
    delegateParams: MetaDelegateParams[],
  ): PopulatedTransaction {
    const tx: PopulatedTransaction = {
      data: this._contractInterface.encodeFunctionData('batchMetaDelegate', [
        delegateParams,
      ]),
      to: this.metaDelegateHelperContractAddress,
      from: user,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.batchMetaDelegate].limit,
      ),
    };
    return tx;
  }

  public async prepareV3DelegateByTypeSignature({
    underlyingAsset,
    delegatee,
    delegationType,
    delegator,
    increaseNonce,
    governanceTokenName,
    nonce,
    connectedChainId,
    deadline,
  }: DelegateMetaSigParams): Promise<string> {
    const isAllDelegate = delegationType === DelegationType.ALL;

    const sigBaseType = [
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ];
    const sigParametersType = [
      { name: 'delegator', type: 'address' },
      { name: 'delegatee', type: 'address' },
    ];
    const sigDelegationTypeType = [{ name: 'delegationType', type: 'uint8' }];

    const typesData = {
      delegator,
      delegatee,
      nonce: BigInt(increaseNonce ? Number(nonce) + 1 : nonce).toString(),
      deadline,
    };

    const eIP712DomainType = {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
    };

    const typeData = {
      domain: {
        name: governanceTokenName,
        version: '2',
        chainId: connectedChainId,
        verifyingContract: underlyingAsset,
      },
      types: isAllDelegate
        ? {
            ...eIP712DomainType,
            Delegate: [...sigParametersType, ...sigBaseType],
          }
        : {
            ...eIP712DomainType,

            DelegateByType: [
              ...sigParametersType,
              ...sigDelegationTypeType,
              ...sigBaseType,
            ],
          },
      primaryType: isAllDelegate ? 'Delegate' : 'DelegateByType',
      message: isAllDelegate
        ? { ...typesData }
        : { ...typesData, delegationType },
    };

    return JSON.stringify(typeData);
  }
}

import { SignatureLike } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction, Signature, utils } from 'ethers';
import { tEthereumAddress, ENS } from '../../commons/types';
import { MetaDelegateHelperInterface } from '../typechain/MetaDelegateHelper';
import { MetaDelegateHelper__factory } from '../typechain/factories/MetaDelegateHelper__factory';
export enum DelegationType {
  VOTING,
  PROPOSITION,
  ALL,
}

export type MetaDelegateParams = {
  underlyingAsset: string;
  delegationType: DelegationType;
  delegator: string;
  delegatee: string;
  deadline: string;
  signature: SignatureLike;
};

export type GovPrepareDelegateSigByType = {
  delegatee: tEthereumAddress | ENS;
  type: string;
  nonce: string;
  expiry: string;
  governanceTokenName: string;
  governanceToken: tEthereumAddress;
};

interface DelegateMetaSigParams {
  underlyingAsset: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: DelegationType;
  delegator: tEthereumAddress;
  increaseNonce: boolean;
  governanceTokenName: string;
  nonce: string;
  connectedChainId: number;
  deadline: string;
}

export class MetaDelegateHelperService {
  private readonly _contractInterface: MetaDelegateHelperInterface;

  constructor(private readonly metaDelegateHelperContracAddress: string) {
    this._contractInterface = MetaDelegateHelper__factory.createInterface();
  }

  public batchMetaDelegate(
    user: string,
    delegateParams: MetaDelegateParams[],
  ): PopulatedTransaction {
    const params = delegateParams.map(p => {
      const sig: Signature = utils.splitSignature(p.signature);
      return {
        ...p,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };
    });

    const tx: PopulatedTransaction = {
      data: this._contractInterface.encodeFunctionData('batchMetaDelegate', [
        params,
      ]),
      to: this.metaDelegateHelperContracAddress,
      from: user,
      gasLimit: BigNumber.from('1000000'),
    };
    return tx;
  }

  // @GovDelegationValidator
  public async prepareV3DelegateByTypeSignature(
    // @isEthAddressOrENS('delegatee')
    // @isEthAddress('governanceToken')
    // @is0OrPositiveAmount('nonce')
    {
      underlyingAsset,
      delegatee,
      delegationType,
      delegator,
      increaseNonce,
      governanceTokenName,
      nonce,
      connectedChainId,
      deadline,
    }: DelegateMetaSigParams,
  ): Promise<string> {
    const isAllDelegate = Number(delegationType) === Number(DelegationType.ALL);

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

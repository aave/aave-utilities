import { splitSignature } from '@ethersproject/bytes';
import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  ENS,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { canBeEnsAddress } from '../commons/utils';
import { GovDelegationValidator } from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
  isEthAddressOrENS,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { IGovernancePowerDelegationToken } from './typechain/IGovernancePowerDelegationToken';
import { IGovernancePowerDelegationToken__factory } from './typechain/IGovernancePowerDelegationToken__factory';

export type GovDelegate = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  governanceToken: tEthereumAddress;
};

export type GovDelegateByType = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: string;
  governanceToken: tEthereumAddress;
};

export type GovDelegateBySig = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  expiry: string;
  signature: string;
  governanceToken: tEthereumAddress;
};

export type GovDelegateByTypeBySig = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: string;
  expiry: string;
  signature: string;
  governanceToken: tEthereumAddress;
};

export type GovPrepareDelegateSig = {
  delegatee: tEthereumAddress | ENS;
  nonce: string;
  expiry: string;
  governanceTokenName: string;
  governanceToken: tEthereumAddress;
};

export type GovPrepareDelegateSigByType = {
  delegatee: tEthereumAddress | ENS;
  type: string;
  nonce: string;
  expiry: string;
  governanceTokenName: string;
  governanceToken: tEthereumAddress;
};

// Data types
export type GovGetDelegateeByType = {
  delegator: tEthereumAddress;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export type GovGetPowerCurrent = {
  user: tEthereumAddress;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export type GovGetPowerAtBlock = {
  user: tEthereumAddress;
  blockNumber: string;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export type GovGetNonce = {
  user: tEthereumAddress;
  governanceToken: tEthereumAddress;
};

export interface GovernancePowerDelegationToken {
  delegate: (args: GovDelegate) => Promise<EthereumTransactionTypeExtended[]>;
  delegateByType: (
    args: GovDelegateByType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  delegateBySig: (
    args: GovDelegateBySig,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  delegateByTypeBySig: (
    args: GovDelegateByTypeBySig,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  prepareDelegateSignature: (args: GovPrepareDelegateSig) => Promise<string>;
  prepareDelegateByTypeSignature: (
    args: GovPrepareDelegateSigByType,
  ) => Promise<string>;
  getDelegateeByType: (
    args: GovGetDelegateeByType,
  ) => Promise<tEthereumAddress>;
  getPowerCurrent: (args: GovGetPowerCurrent) => Promise<string>;
  getPowerAtBlock: (args: GovGetPowerAtBlock) => Promise<string>;
  getNonce: (args: GovGetNonce) => Promise<string>;
}

export class GovernancePowerDelegationTokenService
  extends BaseService<IGovernancePowerDelegationToken>
  implements GovernancePowerDelegationToken
{
  constructor(provider: providers.Provider) {
    super(provider, IGovernancePowerDelegationToken__factory);
  }

  @GovDelegationValidator
  public async delegate(
    @isEthAddress('user')
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    { user, delegatee, governanceToken }: GovDelegate,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);

    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        governanceDelegationToken.populateTransaction.delegate(
          delegateeAddress,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOV_DELEGATION_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @GovDelegationValidator
  public async delegateByType(
    @isEthAddress('user')
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    { user, delegatee, delegationType, governanceToken }: GovDelegateByType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);

    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        governanceDelegationToken.populateTransaction.delegateByType(
          delegateeAddress,
          delegationType,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOV_DELEGATION_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @GovDelegationValidator
  public async delegateBySig(
    @isEthAddress('user')
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    { user, delegatee, expiry, signature, governanceToken }: GovDelegateBySig,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);
    const nonce = await this.getNonce({ user, governanceToken });
    const { v, r, s } = splitSignature(signature);

    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        governanceDelegationToken.populateTransaction.delegateBySig(
          delegateeAddress,
          nonce,
          expiry,
          v,
          r,
          s,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOV_DELEGATION_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @GovDelegationValidator
  public async delegateByTypeBySig(
    @isEthAddress('user')
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    {
      user,
      delegatee,
      delegationType,
      expiry,
      signature,
      governanceToken,
    }: GovDelegateByTypeBySig,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);
    const nonce = await this.getNonce({ user, governanceToken });
    const { v, r, s } = splitSignature(signature);

    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        governanceDelegationToken.populateTransaction.delegateByTypeBySig(
          delegateeAddress,
          delegationType,
          nonce,
          expiry,
          v,
          r,
          s,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOV_DELEGATION_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @GovDelegationValidator
  public async prepareDelegateSignature(
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    @is0OrPositiveAmount('nonce')
    {
      delegatee,
      nonce,
      expiry,
      governanceTokenName,
      governanceToken,
    }: GovPrepareDelegateSig,
  ): Promise<string> {
    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);
    const { chainId } = await this.provider.getNetwork();

    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Delegate: [
          { name: 'delegatee', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expiry', type: 'uint256' },
        ],
      },
      primaryType: 'Delegate' as const,
      domain: {
        name: governanceTokenName,
        version: '1',
        chainId,
        verifyingContract: governanceToken,
      },
      message: {
        delegatee: delegateeAddress,
        nonce,
        expiry,
      },
    };

    return JSON.stringify(typeData);
  }

  @GovDelegationValidator
  public async prepareDelegateByTypeSignature(
    @isEthAddressOrENS('delegatee')
    @isEthAddress('governanceToken')
    @is0OrPositiveAmount('nonce')
    {
      delegatee,
      type,
      nonce,
      expiry,
      governanceTokenName,
      governanceToken,
    }: GovPrepareDelegateSigByType,
  ): Promise<string> {
    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);
    const { chainId } = await this.provider.getNetwork();

    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        DelegateByType: [
          { name: 'delegatee', type: 'address' },
          { name: 'type', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expiry', type: 'uint256' },
        ],
      },
      primaryType: 'DelegateByType' as const,
      domain: {
        name: governanceTokenName,
        version: '1',
        chainId,
        verifyingContract: governanceToken,
      },
      message: {
        delegatee: delegateeAddress,
        type,
        nonce,
        expiry,
      },
    };

    return JSON.stringify(typeData);
  }

  @GovDelegationValidator
  public async getDelegateeByType(
    @isEthAddress('delegator')
    @isEthAddress('governanceToken')
    { delegator, delegationType, governanceToken }: GovGetDelegateeByType,
  ): Promise<tEthereumAddress> {
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);
    return governanceDelegationToken.getDelegateeByType(
      delegator,
      delegationType,
    );
  }

  @GovDelegationValidator
  public async getPowerCurrent(
    @isEthAddress('user')
    @isEthAddress('governanceToken')
    { user, delegationType, governanceToken }: GovGetPowerCurrent,
  ): Promise<string> {
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);
    return (
      await governanceDelegationToken.getPowerCurrent(user, delegationType)
    ).toString();
  }

  @GovDelegationValidator
  public async getPowerAtBlock(
    @isEthAddress('user')
    @isEthAddress('governanceToken')
    @isPositiveAmount('blockNumber')
    { user, blockNumber, delegationType, governanceToken }: GovGetPowerAtBlock,
  ): Promise<string> {
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);
    return (
      await governanceDelegationToken.getPowerAtBlock(
        user,
        blockNumber,
        delegationType,
      )
    ).toString();
  }

  @GovDelegationValidator
  public async getNonce(
    @isEthAddress('user')
    @isEthAddress('governanceToken')
    { user, governanceToken }: GovGetNonce,
  ): Promise<string> {
    const governanceDelegationToken: IGovernancePowerDelegationToken =
      this.getContractInstance(governanceToken);

    return (await governanceDelegationToken._nonces(user)).toString();
  }

  private async getDelegateeAddress(delegatee: string): Promise<string> {
    if (canBeEnsAddress(delegatee)) {
      const delegateeAddress = await this.provider.resolveName(delegatee);
      if (!delegateeAddress)
        throw new Error(`Address: ${delegatee} is not a valid ENS address`);

      return delegateeAddress;
    }

    return delegatee;
  }
}

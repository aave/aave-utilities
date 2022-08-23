import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  ENS,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
} from '../commons/types';
import { IGovernancePowerDelegationToken } from './typechain/IGovernancePowerDelegationToken';
export declare type GovDelegate = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  governanceToken: tEthereumAddress;
};
export declare type GovDelegateByType = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export declare type GovDelegateBySig = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  expiry: string;
  signature: string;
  governanceToken: tEthereumAddress;
};
export declare type GovDelegateByTypeBySig = {
  user: tEthereumAddress;
  delegatee: tEthereumAddress | ENS;
  delegationType: string;
  expiry: string;
  signature: string;
  governanceToken: tEthereumAddress;
};
export declare type GovPrepareDelegateSig = {
  delegatee: tEthereumAddress | ENS;
  nonce: string;
  expiry: string;
  governanceTokenName: string;
  governanceToken: tEthereumAddress;
};
export declare type GovPrepareDelegateSigByType = {
  delegatee: tEthereumAddress | ENS;
  type: string;
  nonce: string;
  expiry: string;
  governanceTokenName: string;
  governanceToken: tEthereumAddress;
};
export declare type GovGetDelegateeByType = {
  delegator: tEthereumAddress;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export declare type GovGetPowerCurrent = {
  user: tEthereumAddress;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export declare type GovGetPowerAtBlock = {
  user: tEthereumAddress;
  blockNumber: string;
  delegationType: string;
  governanceToken: tEthereumAddress;
};
export declare type GovGetNonce = {
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
export declare class GovernancePowerDelegationTokenService
  extends BaseService<IGovernancePowerDelegationToken>
  implements GovernancePowerDelegationToken
{
  constructor(provider: providers.Provider);
  delegate({
    user,
    delegatee,
    governanceToken,
  }: GovDelegate): Promise<EthereumTransactionTypeExtended[]>;
  delegateByType({
    user,
    delegatee,
    delegationType,
    governanceToken,
  }: GovDelegateByType): Promise<EthereumTransactionTypeExtended[]>;
  delegateBySig({
    user,
    delegatee,
    expiry,
    signature,
    governanceToken,
  }: GovDelegateBySig): Promise<EthereumTransactionTypeExtended[]>;
  delegateByTypeBySig({
    user,
    delegatee,
    delegationType,
    expiry,
    signature,
    governanceToken,
  }: GovDelegateByTypeBySig): Promise<EthereumTransactionTypeExtended[]>;
  prepareDelegateSignature({
    delegatee,
    nonce,
    expiry,
    governanceTokenName,
    governanceToken,
  }: GovPrepareDelegateSig): Promise<string>;
  prepareDelegateByTypeSignature({
    delegatee,
    type,
    nonce,
    expiry,
    governanceTokenName,
    governanceToken,
  }: GovPrepareDelegateSigByType): Promise<string>;
  getDelegateeByType({
    delegator,
    delegationType,
    governanceToken,
  }: GovGetDelegateeByType): Promise<tEthereumAddress>;
  getPowerCurrent({
    user,
    delegationType,
    governanceToken,
  }: GovGetPowerCurrent): Promise<string>;
  getPowerAtBlock({
    user,
    blockNumber,
    delegationType,
    governanceToken,
  }: GovGetPowerAtBlock): Promise<string>;
  getNonce({ user, governanceToken }: GovGetNonce): Promise<string>;
  private getDelegateeAddress;
}
//# sourceMappingURL=index.d.ts.map

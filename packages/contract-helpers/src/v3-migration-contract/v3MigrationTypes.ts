import { SignatureLike } from '@ethersproject/bytes';
import { BigNumberish } from 'ethers';
import { InterestRate, tEthereumAddress } from '../commons/types';

export type V3MigrationHelperSignedPermit = {
  deadline: BigNumberish;
  aToken: tEthereumAddress;
  value: BigNumberish;
  signedPermit: SignatureLike;
};

export type V3MigrationHelperSignedCreditDelegationPermit = {
  deadline: BigNumberish;
  debtToken: tEthereumAddress;
  value: BigNumberish;
  signedPermit: SignatureLike;
};

export type MigrationSupplyAsset = {
  aToken: tEthereumAddress;
  underlyingAsset: tEthereumAddress;
  deadline: number;
  amount: string;
};

export type MigrationRepayAsset = {
  debtToken: tEthereumAddress;
  underlyingAsset: tEthereumAddress;
  rateMode: InterestRate;
  deadline: number;
  amount: string;
};

export type MigrationDelegationApproval = {
  debtTokenAddress: tEthereumAddress;
  amount: string;
};

export type V3MigrationType = {
  creditDelegationApprovals: MigrationDelegationApproval[];
  user: tEthereumAddress;
  supplyAssets: MigrationSupplyAsset[];
  repayAssets: MigrationRepayAsset[];
  signedSupplyPermits?: V3MigrationHelperSignedPermit[];
  signedCreditDelegationPermits: V3MigrationHelperSignedCreditDelegationPermit[];
};

export type V3GetMigrationSupplyType = {
  asset: tEthereumAddress;
  amount: string;
};

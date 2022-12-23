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

export type V3SupplyAsset = {
  aToken: tEthereumAddress;
  underlyingAsset: tEthereumAddress;
  deadline: number;
  amount: string;
};

export type V3RepayAsset = {
  underlyingAsset: tEthereumAddress;
  rateMode: InterestRate;
  deadline: number;
  amount: string;
};

export type V3MigrationType = {
  user: tEthereumAddress;
  supplyAssets: V3SupplyAsset[];
  repayAssets: V3RepayAsset[];
  signedSupplyPermits?: V3MigrationHelperSignedPermit[];
  signedCreditDelegationPermits: V3MigrationHelperSignedCreditDelegationPermit[];
};

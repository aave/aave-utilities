import { SignatureLike } from '@ethersproject/bytes';
import { BigNumberish } from 'ethers';
import { InterestRate, tEthereumAddress } from '../commons/types';

export type V3MigrationHelperSignedPermit = {
  deadline: BigNumberish;
  aToken: tEthereumAddress;
  value: BigNumberish;
  signedPermit: SignatureLike;
};

export type V3MigrationNoBorrowWithPermitsType = {
  user: tEthereumAddress;
  assets: tEthereumAddress[];
  deadline: BigNumberish;
  signedPermits: V3MigrationHelperSignedPermit[];
};

export type V3SupplyAsset = {
  aToken: tEthereumAddress;
  underlyingAsset: tEthereumAddress;
  deadline: number;
  amount: string;
};

export type V3MigrationNoBorrowType = {
  user: tEthereumAddress;
  assets: V3SupplyAsset[];
};

export type V3MigrateWithBorrowType = {
  borrowedPositions: Array<{
    amount: string;
    address: string;
    interestRate: InterestRate;
  }>;
  user: string;
  suppliedPositions: V3SupplyAsset[];
  signedPermits: V3MigrationHelperSignedPermit[];
};

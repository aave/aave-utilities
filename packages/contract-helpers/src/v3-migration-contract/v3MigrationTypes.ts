import { SignatureLike } from '@ethersproject/bytes';
import { BigNumberish } from 'ethers';
import { tEthereumAddress } from '../commons/types';

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

export type V3MigrationNoBorrowType = {
  user: tEthereumAddress;
  assets: Array<{
    aToken: tEthereumAddress;
    underlyingAsset: tEthereumAddress;
    deadline: number;
    amount: string;
  }>;
};

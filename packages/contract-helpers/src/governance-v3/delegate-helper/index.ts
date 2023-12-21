import { SignatureLike } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction, Signature, utils } from 'ethers';
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
}

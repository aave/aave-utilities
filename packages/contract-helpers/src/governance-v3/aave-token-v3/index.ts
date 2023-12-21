import { BigNumber, PopulatedTransaction, providers } from 'ethers';
import { AaveTokenV3 } from '../typechain/AaveTokenV3';
import { AaveTokenV3__factory } from '../typechain/factories/AaveTokenV3__factory';

export enum GovernancePowerType {
  VOTING,
  PROPOSITION,
  ALL,
}

export class AaveTokenV3Service {
  readonly _contract: AaveTokenV3;
  readonly _contractInterface = AaveTokenV3__factory.createInterface();

  constructor(tokenAddress: string, provider: providers.Provider) {
    this._contract = AaveTokenV3__factory.connect(tokenAddress, provider);
  }

  public async balanceOf(user: string) {
    return this._contract.balanceOf(user);
  }

  public async getPowerAt(
    blockNumber: number,
    user: string,
    delegationType: GovernancePowerType,
  ) {
    return this._contract.functions.getPowerCurrent(user, delegationType, {
      blockTag: blockNumber,
    });
  }

  public getDelegateTxData(
    user: string,
    delegateTo: string,
    type: GovernancePowerType,
  ): PopulatedTransaction {
    const tx: PopulatedTransaction = {};
    if (type === GovernancePowerType.ALL) {
      tx.data = this._contractInterface.encodeFunctionData('delegate', [
        delegateTo,
      ]);
    } else {
      tx.data = this._contractInterface.encodeFunctionData('delegateByType', [
        delegateTo,
        type,
      ]);
    }

    return {
      ...tx,
      to: this._contract.address,
      from: user,
      gasLimit: BigNumber.from('1000000'),
    };
  }
}

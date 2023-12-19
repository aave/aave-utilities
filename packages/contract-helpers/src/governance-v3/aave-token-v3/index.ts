import { providers } from 'ethers';
import { AaveTokenV3 } from '../typechain/AaveTokenV3';
import { AaveTokenV3__factory } from '../typechain/factories/AaveTokenV3__factory';

export enum GovernancePowerType {
  VOTING,
  PROPOSITION,
}

export class AaveTokenV3Service {
  readonly _contract: AaveTokenV3;

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
}

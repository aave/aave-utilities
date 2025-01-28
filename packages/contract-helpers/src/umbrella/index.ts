import { BigNumber, providers } from 'ethers';
import { Umbrella } from './typechain/Umbrella';
import { Umbrella__factory } from './typechain/Umbrella__factory';

export interface UmbrellaInterface {
  getStkTokens: () => Promise<string[]>;
  getReserveSlashingConfig: (
    reserve: string,
    stakeToken: string,
  ) => Promise<{
    stakeToken: string;
    oracle: string;
    liquidationBonus: BigNumber;
    isReserveStataToken: boolean;
  }>;
}

export class UmbrellaService implements UmbrellaInterface {
  private readonly _contract: Umbrella;

  constructor(provider: providers.Provider, umbrellaAddress: string) {
    this._contract = Umbrella__factory.connect(umbrellaAddress, provider);
  }

  async getStkTokens(): Promise<string[]> {
    return this._contract.getStkTokens();
  }

  async getReserveSlashingConfig(
    reserve: string,
    stakeToken: string,
  ): Promise<{
    stakeToken: string;
    oracle: string;
    liquidationBonus: BigNumber;
    isReserveStataToken: boolean;
  }> {
    return this._contract.getReserveSlashingConfig(reserve, stakeToken);
  }
}

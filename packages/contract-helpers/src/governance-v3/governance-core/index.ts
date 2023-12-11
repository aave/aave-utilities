import { providers } from 'ethers';
import { GovernanceCore } from '../typechain/GovernanceCore';
import { GovernanceCore__factory } from '../typechain/factories/GovernanceCore__factory';

export interface GovernanceCoreInterface {
  getProposalCount: () => Promise<number>;
}
export class GovernanceCoreService implements GovernanceCoreInterface {
  private readonly _contract: GovernanceCore;

  constructor(
    governanceCoreContractAddress: string,
    provider: providers.Provider,
  ) {
    this._contract = GovernanceCore__factory.connect(
      governanceCoreContractAddress,
      provider,
    );
  }

  public async getProposalCount(): Promise<number> {
    const count = await this._contract.getProposalsCount();
    return count.toNumber();
  }
}

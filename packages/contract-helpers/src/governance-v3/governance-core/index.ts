import { BigNumber, PopulatedTransaction, providers } from 'ethers';
import { ChainId, ProtocolAction } from '../../commons/types';
import { gasLimitRecommendations } from '../../commons/utils';
import {
  GovernanceCore,
  GovernanceCoreInterface,
} from '../typechain/GovernanceCore';
import { GovernanceCore__factory } from '../typechain/factories/GovernanceCore__factory';

export interface GovernanceCoreServiceInterface {
  getProposalCount: () => Promise<number>;
  updateRepresentativesForChain: (
    user: string,
    representatives: Array<{ representative: string; chainId: ChainId }>,
  ) => PopulatedTransaction;
}
export class GovernanceCoreService implements GovernanceCoreServiceInterface {
  private readonly _contractInterface: GovernanceCoreInterface;
  private readonly _contractInstance: GovernanceCore;

  constructor(
    governanceCoreContractAddress: string,
    provider: providers.Provider,
  ) {
    this._contractInterface = GovernanceCore__factory.createInterface();
    this._contractInstance = GovernanceCore__factory.connect(
      governanceCoreContractAddress,
      provider,
    );
  }

  public async getProposalCount(): Promise<number> {
    const count = await this._contractInstance.getProposalsCount();
    return count.toNumber();
  }

  public updateRepresentativesForChain(
    user: string,
    representatives: Array<{ representative: string; chainId: ChainId }>,
  ): PopulatedTransaction {
    const actionTx: PopulatedTransaction = {
      data: this._contractInterface.encodeFunctionData(
        'updateRepresentativesForChain',
        [representatives],
      ),
      to: this._contractInstance.address,
      from: user,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.updateRepresentatives].limit,
      ),
    };

    return actionTx;
  }
}

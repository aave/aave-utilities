import { BytesLike, providers } from 'ethers';
import { VotingMachineDataHelper } from '../typechain/VotingMachineDataHelper';
import { VotingMachineDataHelper__factory } from '../typechain/index';

export type InitialProposals = {
  id: number;
  snapshotBlockHash: BytesLike;
};

export enum VotingMachineProposalState {
  NotCreated,
  Active,
  Finished,
  SentToGovernance,
}

type Proposal = {
  id: string;
  sentToGovernance: boolean;
  startTime: number;
  endTime: number;
  votingClosedAndSentTimestamp: number;
  forVotes: string;
  againstVotes: string;
  creationBlockNumber: number;
  votingClosedAndSentBlockNumber: number;
};

export type VotingMachineProposal = {
  proposalData: Proposal;
  votedInfo: {
    support: boolean;
    votingPower: string;
  };
  strategy: string;
  dataWarehouse: string;
  votingAssets: string[];
  hasRequiredRoots: boolean;
  voteConfig: {
    votingDuration: string;
    l1ProposalBlockHash: BytesLike;
  };
  state: VotingMachineProposalState;
};

export interface VotingMachineDataHelperInterface {
  getProposalsData: (
    votingMachineContractAddress: string,
    proposals: InitialProposals[],
    userAddress?: string,
  ) => Promise<VotingMachineProposal[]>;
}

export class VotingMachineDataHelperService
  implements VotingMachineDataHelperInterface
{
  private readonly _contract: VotingMachineDataHelper;

  constructor(
    votingMachineDataHelperContractAddress: string,
    provider: providers.Provider,
  ) {
    this._contract = VotingMachineDataHelper__factory.connect(
      votingMachineDataHelperContractAddress,
      provider,
    );
  }

  public async getProposalsData(
    votingMachineContractAddress: string,
    proposals: InitialProposals[],
    userAddress?: string,
  ) {
    const data = await this._contract.getProposalsData(
      votingMachineContractAddress,
      proposals,
      userAddress ?? '0x0',
    );

    return data.map<VotingMachineProposal>(proposal => {
      return {
        proposalData: {
          id: proposal.proposalData.id.toString(),
          sentToGovernance: proposal.proposalData.sentToGovernance,
          startTime: proposal.proposalData.startTime,
          endTime: proposal.proposalData.endTime,
          votingClosedAndSentTimestamp:
            proposal.proposalData.votingClosedAndSentTimestamp,
          forVotes: proposal.proposalData.forVotes.toString(),
          againstVotes: proposal.proposalData.againstVotes.toString(),
          creationBlockNumber:
            proposal.proposalData.creationBlockNumber.toNumber(),
          votingClosedAndSentBlockNumber:
            proposal.proposalData.votingClosedAndSentBlockNumber.toNumber(),
        },
        votedInfo: {
          support: proposal.votedInfo.support,
          votingPower: proposal.votedInfo.votingPower.toString(),
        },
        strategy: proposal.strategy,
        dataWarehouse: proposal.dataWarehouse,
        votingAssets: proposal.votingAssets,
        hasRequiredRoots: proposal.hasRequiredRoots,
        voteConfig: {
          votingDuration: proposal.voteConfig.votingDuration.toString(),
          l1ProposalBlockHash: proposal.voteConfig.l1ProposalBlockHash,
        },
        state: proposal.state,
      };
    });
  }
}

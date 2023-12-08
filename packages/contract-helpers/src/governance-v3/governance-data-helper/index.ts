import { providers } from 'ethers';
import {
  GovernanceDataHelper as GovernanceDataHelperContract,
  IGovernanceDataHelper,
} from '../typechain/GovernanceDataHelper';
import { GovernanceDataHelper__factory } from '../typechain/factories/GovernanceDataHelper__factory';

export enum AccessLevel {
  /** Do not use */
  None,
  /** listing assets, changes of assets params, updates of the protocol etc */
  Short_Executor,
  /** payloads controller updates */
  Long_Executor,
}

export enum ProposalV3State {
  /** proposal does not exist */
  Null,
  /** created, waiting for a cooldown to initiate the balances snapshot */
  Created,
  /** balances snapshot set, voting in progress */
  Active,
  /** voting results submitted, but proposal is under grace period when guardian can cancel it */
  Queued,
  /** results sent to the execution chain(s) */
  Executed,
  /** voting was not successful */
  Failed,
  /** got cancelled by guardian, or because proposition power of creator dropped below allowed minimum */
  Cancelled,
  Expired,
}

export type ProposalPayload = {
  chain: number;
  accessLevel: number;
  payloadsController: string;
  payloadId: number;
};

export type ProposalV3 = {
  state: ProposalV3State;
  accessLevel: AccessLevel;
  creationTime: number;
  votingDuration: number;
  votingActivationTime: number;
  queuingTime: number;
  cancelTimestamp: number;
  creator: string;
  votingPortal: string;
  snapshotBlockHash: string;
  ipfsHash: string;
  forVotes: string;
  againstVotes: string;
  cancellationFee: string;
};

export type ProposalData = {
  id: string;
  votingChainId: number;
  proposalData: ProposalV3;
};

export interface GovernanceDataHelperInterface {
  getConstants: (
    govCore: string,
    accessLevels: number[],
  ) => Promise<IGovernanceDataHelper.ConstantsStruct>;
  getProposalsData: (
    govCore: string,
    from: number,
    to: number,
    pageSize: number,
  ) => Promise<ProposalData[]>;
  getRepresentationData: (
    govCore: string,
    wallet: string,
    chainIds: number[],
  ) => Promise<
    [
      IGovernanceDataHelper.RepresentativesStruct[],
      IGovernanceDataHelper.RepresentedStruct[],
    ]
  >;
}

export class GovernanceDataHelperService
  implements GovernanceDataHelperInterface
{
  private readonly _contract: GovernanceDataHelperContract;

  constructor(
    governanceDataHelperContractAddress: string,
    provider: providers.Provider,
  ) {
    this._contract = GovernanceDataHelper__factory.connect(
      governanceDataHelperContractAddress,
      provider,
    );
  }

  public async getConstants(govCore: string, accessLevels: number[]) {
    return this._contract.getConstants(govCore, accessLevels);
  }

  public async getProposalsData(
    govCore: string,
    from: number,
    to: number,
    pageSize: number,
  ) {
    const data = await this._contract.getProposalsData(
      govCore,
      from,
      to,
      pageSize,
    );

    return data.map<ProposalData>(proposalData => {
      return {
        id: proposalData.id.toString(),
        votingChainId: proposalData.votingChainId.toNumber(),
        proposalData: {
          state: proposalData.proposalData.state,
          accessLevel: proposalData.proposalData.accessLevel,
          creationTime: proposalData.proposalData.creationTime,
          votingDuration: proposalData.proposalData.votingDuration,
          votingActivationTime: proposalData.proposalData.votingActivationTime,
          queuingTime: proposalData.proposalData.queuingTime,
          cancelTimestamp: proposalData.proposalData.cancelTimestamp,
          creator: proposalData.proposalData.creator,
          votingPortal: proposalData.proposalData.votingPortal,
          snapshotBlockHash: proposalData.proposalData.snapshotBlockHash,
          ipfsHash: proposalData.proposalData.ipfsHash,
          forVotes: proposalData.proposalData.forVotes.toString(),
          againstVotes: proposalData.proposalData.againstVotes.toString(),
          cancellationFee: proposalData.proposalData.cancellationFee.toString(),
        },
      };
    });
  }

  public async getRepresentationData(
    govCore: string,
    wallet: string,
    chainIds: number[],
  ) {
    return this._contract.getRepresentationData(govCore, wallet, chainIds);
  }
}

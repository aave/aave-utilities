import { providers } from 'ethers';
import { GovernanceDataHelper as GovernanceDataHelperContract } from '../typechain/GovernanceDataHelper';
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
  accessLevel: AccessLevel;
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
  payloads: ProposalPayload[];
};

export type ProposalData = {
  id: string;
  votingChainId: number;
  proposalData: ProposalV3;
};

export type VotingConfig = {
  accessLevel: AccessLevel;
  config: {
    coolDownBeforeVotingStart: string;
    votingDuration: string;
    quorum: string;
    differential: string;
    minPropositionPower: string;
  };
};

export type Constants = {
  votingConfigs: VotingConfig[];
  precisionDivider: string;
  cooldownPeriod: string;
  expirationTime: string;
  cancellationFee: string;
};

export type Representative = {
  chainId: number;
  representative: string;
};

export type Rpresented = {
  chainId: number;
  votersRepresented: string[];
};

export interface GovernanceDataHelperInterface {
  getConstants: (govCore: string, accessLevels: number[]) => Promise<Constants>;
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
  ) => Promise<{
    Representatives: Representative[];
    Represented: Rpresented[];
  }>;
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

  public async getConstants(
    govCore: string,
    accessLevels: number[],
  ): Promise<Constants> {
    const data = await this._contract.getConstants(govCore, accessLevels);

    const votingConfigs = data.votingConfigs.map<VotingConfig>(votingConfig => {
      return {
        accessLevel: votingConfig.accessLevel,
        config: {
          coolDownBeforeVotingStart:
            votingConfig.config.coolDownBeforeVotingStart.toString(),
          votingDuration: votingConfig.config.votingDuration.toString(),
          quorum: votingConfig.config.yesThreshold.toString(),
          differential: votingConfig.config.yesNoDifferential.toString(),
          minPropositionPower:
            votingConfig.config.minPropositionPower.toString(),
        },
      };
    });

    return {
      votingConfigs,
      precisionDivider: data.precisionDivider.toString(),
      cooldownPeriod: data.cooldownPeriod.toString(),
      expirationTime: data.expirationTime.toString(),
      cancellationFee: data.cancellationFee.toString(),
    };
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
          payloads: proposalData.proposalData.payloads.map<ProposalPayload>(
            payload => {
              return {
                chain: payload.chain.toNumber(),
                accessLevel: payload.accessLevel,
                payloadsController: payload.payloadsController,
                payloadId: payload.payloadId,
              };
            },
          ),
        },
      };
    });
  }

  public async getRepresentationData(
    govCore: string,
    wallet: string,
    chainIds: number[],
  ): Promise<{ Representatives: Representative[]; Represented: Rpresented[] }> {
    const data = await this._contract.getRepresentationData(
      govCore,
      wallet,
      chainIds,
    );

    return {
      Representatives: data[0].map<Representative>(representative => {
        return {
          chainId: representative.chainId.toNumber(),
          representative: representative.representative,
        };
      }),
      Represented: data[1].map<Rpresented>(represented => {
        return {
          chainId: represented.chainId.toNumber(),
          votersRepresented: represented.votersRepresented,
        };
      }),
    };
  }
}

import { BigNumber, BytesLike } from 'ethers';
import { tEthereumAddress } from '../commons/types';
export declare enum ExecutorType {
  Short = 0,
  Long = 1,
}
export declare type GovCreateType = {
  user: tEthereumAddress;
  targets: tEthereumAddress[];
  values: string[];
  signatures: string[];
  calldatas: BytesLike[];
  withDelegateCalls: boolean[];
  ipfsHash: BytesLike;
  executor: ExecutorType;
};
export declare type GovCancelType = {
  user: tEthereumAddress;
  proposalId: number;
};
export declare type GovQueueType = {
  user: tEthereumAddress;
  proposalId: number;
};
export declare type GovExecuteType = {
  user: tEthereumAddress;
  proposalId: number;
};
export declare type GovSubmitVoteType = {
  user: tEthereumAddress;
  proposalId: number;
  support: boolean;
};
export declare type GovSubmitVoteSignType = {
  user: tEthereumAddress;
  proposalId: number;
  support: boolean;
  signature: string;
};
export declare type GovSignVotingType = {
  user: tEthereumAddress;
  support: boolean;
  proposalId: number;
  nonce: number;
};
export declare type GovGetProposalsType = {
  skip: number;
  limit: number;
};
export declare type GovGetProposalType = {
  proposalId: number;
};
export declare type GovGetVotingSupplyType = {
  block: number;
  strategy: tEthereumAddress;
};
export declare type GovGetVotingAtBlockType = {
  user: tEthereumAddress;
  strategy: tEthereumAddress;
  block: number;
};
export declare type GovGetTokensVotingPower = {
  user: tEthereumAddress;
  tokens: tEthereumAddress[];
};
export declare type GovGetVoteOnProposal = {
  proposalId: number;
  user: tEthereumAddress;
};
export declare enum ProposalState {
  Pending = 'Pending',
  Canceled = 'Canceled',
  Active = 'Active',
  Failed = 'Failed',
  Succeeded = 'Succeeded',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed',
}
export declare type ProposalIpfs = {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  creator: tEthereumAddress;
  executor: tEthereumAddress;
  targets: tEthereumAddress[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  withDelegatecalls: boolean[];
  startBlock: number;
  endBlock: number;
  executionTime: string;
  executionTimeWithGracePeriod: string;
  forVotes: string;
  againstVotes: string;
  executed: boolean;
  canceled: boolean;
  strategy: string;
  ipfsHash: string;
  state: ProposalState;
  minimumQuorum: string;
  minimumDiff: string;
  proposalCreated: number;
  totalVotingSupply: string;
};
export declare type Proposal = {
  id: number;
  creator: tEthereumAddress;
  executor: tEthereumAddress;
  targets: tEthereumAddress[];
  values: BigNumber[];
  signatures: string[];
  calldatas: string[];
  withDelegatecalls: boolean[];
  startBlock: number;
  endBlock: number;
  executionTime: number;
  executionTimeWithGracePeriod: number;
  forVotes: string;
  againstVotes: string;
  executed: boolean;
  canceled: boolean;
  strategy: string;
  ipfsHash: string;
  state: ProposalState;
  minimumQuorum: string;
  minimumDiff: string;
  proposalCreated: number;
  totalVotingSupply: string;
};
export declare type ProposalRPC = {
  totalVotingSupply: BigNumber;
  minimumQuorum: BigNumber;
  minimumDiff: BigNumber;
  executionTimeWithGracePeriod: BigNumber;
  proposalCreated: BigNumber;
  id: BigNumber;
  creator: string;
  executor: string;
  targets: string[];
  values: BigNumber[];
  signatures: string[];
  calldatas: string[];
  withDelegatecalls: boolean[];
  startBlock: BigNumber;
  endBlock: BigNumber;
  executionTime: BigNumber;
  forVotes: BigNumber;
  againstVotes: BigNumber;
  executed: boolean;
  canceled: boolean;
  strategy: string;
  ipfsHash: string;
  proposalState: number;
};
export declare type Power = {
  votingPower: BigNumber;
  delegatedAddressVotingPower: string;
  propositionPower: BigNumber;
  delegatedAddressPropositionPower: string;
  0: BigNumber;
  1: string;
  2: BigNumber;
  3: string;
};
export declare type Vote = {
  support: boolean;
  votingPower: BigNumber;
  0: boolean;
  1: BigNumber;
};
//# sourceMappingURL=types.d.ts.map

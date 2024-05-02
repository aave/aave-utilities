import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export enum ExecutorType {
  Short,
  Long,
}

export type GovCreateType = {
  user: tEthereumAddress;
  targets: tEthereumAddress[];
  values: string[];
  signatures: string[];
  calldatas: BytesLike[];
  withDelegateCalls: boolean[];
  ipfsHash: BytesLike;
  executor: ExecutorType;
};
export type GovCancelType = {
  user: tEthereumAddress;
  proposalId: number;
};
export type GovQueueType = {
  user: tEthereumAddress;
  proposalId: number;
};
export type GovExecuteType = {
  user: tEthereumAddress;
  proposalId: number;
};

export type GovSubmitVoteType = {
  user: tEthereumAddress;
  proposalId: number;
  support: boolean;
};

export type GovSubmitVoteSignType = {
  user: tEthereumAddress;
  proposalId: number;
  support: boolean;
  signature: string;
};

export type GovSignVotingType = {
  user: tEthereumAddress;
  support: boolean;
  proposalId: number;
  nonce: number;
};

export type GovGetProposalsType = {
  skip: number;
  limit: number;
};

export type GovGetProposalType = {
  proposalId: number;
};

export type GovGetVotingSupplyType = {
  block: number;
  strategy: tEthereumAddress;
};

export type GovGetVotingAtBlockType = {
  user: tEthereumAddress;
  strategy: tEthereumAddress;
  block: number;
};

export type GovGetTokensVotingPower = {
  user: tEthereumAddress;
  tokens: tEthereumAddress[];
};

export type GovGetVoteOnProposal = {
  proposalId: number;
  user: tEthereumAddress;
};

export type DelegateSignature = {
  nonce: string;
  expiry: string;
  v: string;
  r: string;
  s: string;
};

export type GovDelegateTokensBySig = {
  user: tEthereumAddress;
  tokens: tEthereumAddress[];
  data: Array<{
    delegatee: tEthereumAddress;
    nonce: BigNumberish;
    expiry: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  }>;
};

export type GovDelegateTokensByTypeBySig = {
  user: tEthereumAddress;
  tokens: tEthereumAddress[];
  data: Array<{
    delegatee: tEthereumAddress;
    delegationType: BigNumberish;
    nonce: BigNumberish;
    expiry: BigNumberish;
    v: BigNumberish;
    r: BytesLike;
    s: BytesLike;
  }>;
};

export enum ProposalState {
  Pending = 'Pending',
  Canceled = 'Canceled',
  Active = 'Active',
  Failed = 'Failed',
  Succeeded = 'Succeeded',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed',
}

export type ProposalIpfs = {
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

export type Proposal = {
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

export type ProposalRPC = {
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

export type Power = {
  votingPower: BigNumber;
  delegatedAddressVotingPower: string;
  propositionPower: BigNumber;
  delegatedAddressPropositionPower: string;
  0: BigNumber;
  1: string;
  2: BigNumber;
  3: string;
};

export type Vote = {
  support: boolean;
  votingPower: BigNumber;
  0: boolean;
  1: BigNumber;
};

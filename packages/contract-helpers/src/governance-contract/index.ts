import { providers, Signature, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import { getProposalMetadata } from '../commons/ipfs';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  GovernanceConfig,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { GovValidator } from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
} from '../commons/validators/paramValidators';
import { IAaveGovernanceV2 } from './typechain/IAaveGovernanceV2';
import { IAaveGovernanceV2__factory } from './typechain/IAaveGovernanceV2__factory';
import { IGovernanceStrategy } from './typechain/IGovernanceStrategy';
import { IGovernanceStrategy__factory } from './typechain/IGovernanceStrategy__factory';
import { IGovernanceV2Helper } from './typechain/IGovernanceV2Helper';
import { IGovernanceV2Helper__factory } from './typechain/IGovernanceV2Helper__factory';
import {
  ExecutorType,
  GovCancelType,
  GovCreateType,
  GovExecuteType,
  GovGetProposalsType,
  GovGetProposalType,
  GovGetVotingAtBlockType,
  GovGetVotingSupplyType,
  GovQueueType,
  GovSignVotingType,
  GovSubmitVoteSignType,
  GovSubmitVoteType,
  GovGetTokensVotingPower as GovGetPower,
  GovGetVoteOnProposal,
  Proposal,
  ProposalState,
  Power,
  ProposalRPC,
  Vote,
} from './types';

const parseProposal = async (rawProposal: ProposalRPC): Promise<Proposal> => {
  const {
    id,
    creator,
    executor,
    targets,
    values,
    signatures,
    calldatas,
    withDelegatecalls,
    startBlock,
    endBlock,
    executionTime,
    forVotes,
    againstVotes,
    executed,
    canceled,
    strategy,
    ipfsHash: ipfsHex,
    totalVotingSupply,
    minimumQuorum,
    minimumDiff,
    executionTimeWithGracePeriod,
    proposalCreated,
    proposalState,
  } = rawProposal;

  const proposalMetadata = await getProposalMetadata(ipfsHex);
  const proposal: Proposal = {
    id: Number(id.toString()),
    creator,
    executor,
    targets,
    values,
    signatures,
    calldatas,
    withDelegatecalls,
    startBlock: Number(startBlock.toString()),
    endBlock: Number(endBlock.toString()),
    executionTime: executionTime.toString(),
    forVotes: forVotes.toString(),
    againstVotes: againstVotes.toString(),
    executed,
    canceled,
    strategy,
    ipfsHash: proposalMetadata.ipfsHash,
    state: Object.values(ProposalState)[proposalState],
    minimumQuorum: minimumQuorum.toString(),
    minimumDiff: minimumDiff.toString(),
    executionTimeWithGracePeriod: executionTimeWithGracePeriod.toString(),
    title: proposalMetadata.title,
    description: proposalMetadata.description,
    shortDescription: proposalMetadata.shortDescription,
    proposalCreated: Number(proposalCreated.toString()),
    totalVotingSupply: totalVotingSupply.toString(),
  };

  return proposal;
};

export interface AaveGovernanceV2Interface {
  create: (args: GovCreateType) => Promise<EthereumTransactionTypeExtended[]>;
  cancel: (args: GovCancelType) => Promise<EthereumTransactionTypeExtended[]>;
  queue: (args: GovQueueType) => Promise<EthereumTransactionTypeExtended[]>;
  execute: (args: GovExecuteType) => Promise<EthereumTransactionTypeExtended[]>;
  submitVote: (
    args: GovSubmitVoteType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  submitVoteBySignature: (
    args: GovSubmitVoteSignType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  signVoting: (args: GovSignVotingType) => Promise<string>;
  getProposals: (args: GovGetProposalsType) => Promise<Proposal[]>;
  getProposal: (args: GovGetProposalType) => Promise<Proposal>;
  getPropositionPowerAt: (args: GovGetVotingAtBlockType) => Promise<string>;
  getVotingPowerAt: (args: GovGetVotingAtBlockType) => Promise<string>;
  getTotalPropositionSupplyAt: (
    args: GovGetVotingSupplyType,
  ) => Promise<string>;
  getTotalVotingSupplyAt: (args: GovGetVotingSupplyType) => Promise<string>;
  getTokensPower: (args: GovGetPower) => Promise<Power[]>;
  getVoteOnProposal: (args: GovGetVoteOnProposal) => Promise<Vote>;
}

export default class AaveGovernanceV2Service
  extends BaseService<IAaveGovernanceV2>
  implements AaveGovernanceV2Interface
{
  readonly aaveGovernanceV2Address: string;

  readonly aaveGovernanceV2HelperAddress: string;

  readonly executors: tEthereumAddress[] = [];

  readonly governanceConfig: GovernanceConfig | undefined;

  constructor(
    provider: providers.Provider,
    governanceConfig?: GovernanceConfig,
  ) {
    super(provider, IAaveGovernanceV2__factory);
    this.governanceConfig = governanceConfig;

    const {
      AAVE_GOVERNANCE_V2,
      AAVE_GOVERNANCE_V2_HELPER,
      AAVE_GOVERNANCE_V2_EXECUTOR_SHORT,
      AAVE_GOVERNANCE_V2_EXECUTOR_LONG,
    } = this.governanceConfig ?? {};

    this.aaveGovernanceV2Address = AAVE_GOVERNANCE_V2 ?? '';
    this.aaveGovernanceV2HelperAddress = AAVE_GOVERNANCE_V2_HELPER ?? '';
    this.executors[ExecutorType.Short] =
      AAVE_GOVERNANCE_V2_EXECUTOR_SHORT ?? '';
    this.executors[ExecutorType.Long] = AAVE_GOVERNANCE_V2_EXECUTOR_LONG ?? '';
  }

  @GovValidator
  public async create(
    @isEthAddress('user')
    {
      user,
      targets,
      values,
      signatures,
      calldatas,
      withDelegateCalls,
      ipfsHash,
      executor,
    }: GovCreateType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.create(
          this.executors[executor],
          targets,
          values,
          signatures,
          calldatas,
          withDelegateCalls,
          ipfsHash,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async cancel(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId }: GovCancelType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.cancel(proposalId),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async queue(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId }: GovQueueType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.queue(proposalId),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async execute(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId }: GovExecuteType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.execute(proposalId),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async submitVote(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId, support }: GovSubmitVoteType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.submitVote(proposalId, support),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async signVoting(
    @is0OrPositiveAmount('proposalId')
    { support, proposalId }: GovSignVotingType,
  ): Promise<string> {
    const { chainId } = await this.provider.getNetwork();
    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        VoteEmitted: [
          { name: 'id', type: 'uint256' },
          { name: 'support', type: 'bool' },
        ],
      },
      primaryType: 'VoteEmitted',
      domain: {
        name: 'Aave Governance v2',
        chainId,
        verifyingContract: this.aaveGovernanceV2Address,
      },
      message: {
        support,
        id: proposalId,
      },
    };

    return JSON.stringify(typeData);
  }

  @GovValidator
  public async submitVoteBySignature(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId, support, signature }: GovSubmitVoteSignType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const sig: Signature = utils.splitSignature(signature);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.submitVoteBySignature(
          proposalId,
          support,
          sig.v,
          sig.r,
          sig.s,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }

  @GovValidator
  public async getProposals({
    skip,
    limit,
  }: GovGetProposalsType): Promise<Proposal[]> {
    const helper: IGovernanceV2Helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );

    const result = await helper.getProposals(
      skip.toString(),
      limit.toString(),
      this.aaveGovernanceV2Address,
    );

    const proposals: Promise<Proposal[]> = Promise.all(
      result.map(
        async (rawProposal: ProposalRPC): Promise<Proposal> =>
          parseProposal(rawProposal),
      ),
    );

    return proposals;
  }

  @GovValidator
  public async getProposal({
    proposalId,
  }: GovGetProposalType): Promise<Proposal> {
    const helper: IGovernanceV2Helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );

    const proposal = await helper.getProposal(
      proposalId,
      this.aaveGovernanceV2Address,
    );

    return parseProposal(proposal);
  }

  @GovValidator
  public async getPropositionPowerAt({
    user,
    block,
    strategy,
  }: GovGetVotingAtBlockType): Promise<string> {
    const proposalStrategy: IGovernanceStrategy =
      IGovernanceStrategy__factory.connect(strategy, this.provider);

    const power = await proposalStrategy.getPropositionPowerAt(
      user,
      block.toString(),
    );
    return formatEther(power);
  }

  @GovValidator
  public async getVotingPowerAt({
    user,
    block,
    strategy,
  }: GovGetVotingAtBlockType): Promise<string> {
    const proposalStrategy: IGovernanceStrategy =
      IGovernanceStrategy__factory.connect(strategy, this.provider);

    const power = await proposalStrategy.getVotingPowerAt(
      user,
      block.toString(),
    );
    return formatEther(power);
  }

  @GovValidator
  public async getTotalPropositionSupplyAt({
    block,
    strategy,
  }: GovGetVotingSupplyType): Promise<string> {
    const proposalStrategy: IGovernanceStrategy =
      IGovernanceStrategy__factory.connect(strategy, this.provider);

    const total = await proposalStrategy.getTotalPropositionSupplyAt(
      block.toString(),
    );
    return formatEther(total);
  }

  @GovValidator
  public async getTotalVotingSupplyAt({
    block,
    strategy,
  }: GovGetVotingSupplyType): Promise<string> {
    const proposalStrategy: IGovernanceStrategy =
      IGovernanceStrategy__factory.connect(strategy, this.provider);

    const total = await proposalStrategy.getTotalVotingSupplyAt(
      block.toString(),
    );
    return formatEther(total);
  }

  @GovValidator
  public async getTokensPower({ user, tokens }: GovGetPower): Promise<Power[]> {
    const helper: IGovernanceV2Helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );
    const power = helper.getTokensPower(user, tokens);
    return power as Promise<Power[]>;
  }

  @GovValidator
  public async getVoteOnProposal({
    proposalId,
    user,
  }: GovGetVoteOnProposal): Promise<Vote> {
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );
    return govContract.getVoteOnProposal(proposalId, user) as Promise<Vote>;
  }
}

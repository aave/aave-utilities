import { providers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  GovHelperValidator,
  GovValidator,
} from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
  isEthAddressArray,
} from '../commons/validators/paramValidators';
import { IAaveGovernanceV2 } from './typechain/IAaveGovernanceV2';
import { IAaveGovernanceV2__factory } from './typechain/IAaveGovernanceV2__factory';
import { IGovernanceStrategy } from './typechain/IGovernanceStrategy';
import { IGovernanceStrategy__factory } from './typechain/IGovernanceStrategy__factory';
import { IGovernanceV2Helper } from './typechain/IGovernanceV2Helper';
import { IGovernanceV2Helper__factory } from './typechain/IGovernanceV2Helper__factory';
import {
  GovGetProposalsType,
  GovGetProposalType,
  GovGetVotingAtBlockType,
  GovSubmitVoteType,
  GovGetTokensVotingPower as GovGetPower,
  GovGetVoteOnProposal,
  Proposal,
  ProposalState,
  Power,
  ProposalRPC,
  Vote,
  GovDelegateTokensByTypeBySig,
  GovDelegateTokensBySig,
} from './types';

export const humanizeProposal = (rawProposal: ProposalRPC): Proposal => {
  return {
    id: Number(rawProposal.id.toString()),
    creator: rawProposal.creator,
    executor: rawProposal.executor,
    targets: rawProposal.targets,
    values: rawProposal.values,
    signatures: rawProposal.signatures,
    calldatas: rawProposal.calldatas,
    withDelegatecalls: rawProposal.withDelegatecalls,
    startBlock: Number(rawProposal.startBlock.toString()),
    endBlock: Number(rawProposal.endBlock.toString()),
    executionTime: Number(rawProposal.executionTime.toString()),
    forVotes: rawProposal.forVotes.toString(),
    againstVotes: rawProposal.againstVotes.toString(),
    executed: rawProposal.executed,
    canceled: rawProposal.canceled,
    strategy: rawProposal.strategy,
    state: Object.values(ProposalState)[rawProposal.proposalState],
    minimumQuorum: rawProposal.minimumQuorum.toString(),
    minimumDiff: rawProposal.minimumDiff.toString(),
    executionTimeWithGracePeriod: Number(
      rawProposal.executionTimeWithGracePeriod.toString(),
    ),
    proposalCreated: Number(rawProposal.proposalCreated.toString()),
    totalVotingSupply: rawProposal.totalVotingSupply.toString(),
    ipfsHash: rawProposal.ipfsHash,
  };
};

export interface AaveGovernanceInterface {
  submitVote: (args: GovSubmitVoteType) => EthereumTransactionTypeExtended[];
  getProposal: (args: GovGetProposalType) => Promise<Proposal>;
  getProposals: (args: GovGetProposalsType) => Promise<Proposal[]>;
  getVotingPowerAt: (args: GovGetVotingAtBlockType) => Promise<string>;
  getTokensPower: (args: GovGetPower) => Promise<Power[]>;
  getVoteOnProposal: (args: GovGetVoteOnProposal) => Promise<Vote>;
  getProposalsCount: () => Promise<number>;
}

type AaveGovernanceServiceConfig = {
  GOVERNANCE_ADDRESS: string;
  GOVERNANCE_HELPER_ADDRESS?: string;
  ipfsGateway?: string;
};

export class AaveGovernanceService
  extends BaseService<IAaveGovernanceV2>
  implements AaveGovernanceInterface
{
  readonly aaveGovernanceV2Address: string;

  readonly aaveGovernanceV2HelperAddress: string;

  constructor(
    provider: providers.Provider,
    config: AaveGovernanceServiceConfig,
  ) {
    super(provider, IAaveGovernanceV2__factory);

    this.aaveGovernanceV2Address = config.GOVERNANCE_ADDRESS;
    this.aaveGovernanceV2HelperAddress = config.GOVERNANCE_HELPER_ADDRESS ?? '';
  }

  @GovValidator
  public submitVote(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { user, proposalId, support }: GovSubmitVoteType,
  ): EthereumTransactionTypeExtended[] {
    const txs: EthereumTransactionTypeExtended[] = [];
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        govContract.populateTransaction.submitVote(proposalId, support),
      from: user,
      action: ProtocolAction.vote,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.vote),
    });
    return txs;
  }

  @GovHelperValidator
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

    return result.map(proposal => humanizeProposal(proposal));
  }

  @GovHelperValidator
  public async getProposal(
    @is0OrPositiveAmount('proposalId')
    { proposalId }: GovGetProposalType,
  ) {
    const helper: IGovernanceV2Helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );
    const result = await helper.getProposal(
      proposalId,
      this.aaveGovernanceV2Address,
    );

    return humanizeProposal(result);
  }

  @GovValidator
  public async getVotingPowerAt(
    @isEthAddress('user') { user, block, strategy }: GovGetVotingAtBlockType,
  ): Promise<string> {
    const proposalStrategy: IGovernanceStrategy =
      IGovernanceStrategy__factory.connect(strategy, this.provider);

    const power = await proposalStrategy.getVotingPowerAt(
      user,
      block.toString(),
    );
    return formatEther(power);
  }

  @GovHelperValidator
  public async getTokensPower(
    @isEthAddress('user')
    @isEthAddressArray('tokens')
    { user, tokens }: GovGetPower,
  ): Promise<Power[]> {
    const helper: IGovernanceV2Helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );

    return helper.getTokensPower(user, tokens);
  }

  @GovValidator
  public async getVoteOnProposal(
    @isEthAddress('user')
    @is0OrPositiveAmount('proposalId')
    { proposalId, user }: GovGetVoteOnProposal,
  ): Promise<Vote> {
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );
    return govContract.getVoteOnProposal(proposalId, user);
  }

  @GovValidator
  public async getProposalsCount() {
    const govContract: IAaveGovernanceV2 = this.getContractInstance(
      this.aaveGovernanceV2Address,
    );

    return (await govContract.getProposalsCount()).toNumber();
  }

  @GovHelperValidator
  public async delegateTokensBySig(
    @isEthAddress('user')
    @isEthAddressArray('tokens')
    { user, tokens, data }: GovDelegateTokensBySig,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        helper.populateTransaction.delegateTokensBySig(tokens, data),
      from: user,
    });
    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.GOV_DELEGATION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @GovHelperValidator
  public async delegateTokensByTypeBySig(
    @isEthAddress('user')
    @isEthAddressArray('tokens')
    { user, tokens, data }: GovDelegateTokensByTypeBySig,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const helper = IGovernanceV2Helper__factory.connect(
      this.aaveGovernanceV2HelperAddress,
      this.provider,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        helper.populateTransaction.delegateTokensByTypeBySig(tokens, data),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.GOV_DELEGATION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}

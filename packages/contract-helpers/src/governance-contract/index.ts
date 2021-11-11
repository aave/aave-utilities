import { providers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import { getProposalMetadata } from '../commons/ipfs';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
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
  GovGetVotingAtBlockType,
  GovSubmitVoteType,
  GovGetTokensVotingPower as GovGetPower,
  GovGetVoteOnProposal,
  Proposal,
  ProposalState,
  Power,
  ProposalRPC,
  Vote,
} from './types';

export const parseProposal = async (
  rawProposal: ProposalRPC,
): Promise<Proposal> => {
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
    state: Object.values(ProposalState)[proposalState],
    minimumQuorum: minimumQuorum.toString(),
    minimumDiff: minimumDiff.toString(),
    executionTimeWithGracePeriod: executionTimeWithGracePeriod.toString(),
    proposalCreated: Number(proposalCreated.toString()),
    totalVotingSupply: totalVotingSupply.toString(),
    ...proposalMetadata,
  };

  return proposal;
};

export interface AaveGovernanceInterface {
  submitVote: (args: GovSubmitVoteType) => EthereumTransactionTypeExtended[];
  getProposals: (args: GovGetProposalsType) => Promise<Proposal[]>;
  getVotingPowerAt: (args: GovGetVotingAtBlockType) => Promise<string>;
  getTokensPower: (args: GovGetPower) => Promise<Power[]>;
  getVoteOnProposal: (args: GovGetVoteOnProposal) => Promise<Vote>;
}

type AaveGovernanceServiceConfig = {
  GOVERNANCE_ADDRESS: string;
  GOVERNANCE_HELPER_ADDRESS?: string;
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
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
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

    const proposals: Promise<Proposal[]> = Promise.all(
      result.map(
        async (rawProposal: ProposalRPC): Promise<Proposal> =>
          parseProposal(rawProposal),
      ),
    );

    return proposals;
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
}

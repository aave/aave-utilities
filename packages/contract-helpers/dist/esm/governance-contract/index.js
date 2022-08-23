import { __decorate, __metadata, __param } from "tslib";
import { formatEther } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import { eEthereumTxType, } from '../commons/types';
import { GovHelperValidator, GovValidator, } from '../commons/validators/methodValidators';
import { is0OrPositiveAmount, isEthAddress, isEthAddressArray, } from '../commons/validators/paramValidators';
import { IAaveGovernanceV2__factory } from './typechain/IAaveGovernanceV2__factory';
import { IGovernanceStrategy__factory } from './typechain/IGovernanceStrategy__factory';
import { IGovernanceV2Helper__factory } from './typechain/IGovernanceV2Helper__factory';
import { ProposalState, } from './types';
export const humanizeProposal = (rawProposal) => {
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
        executionTimeWithGracePeriod: Number(rawProposal.executionTimeWithGracePeriod.toString()),
        proposalCreated: Number(rawProposal.proposalCreated.toString()),
        totalVotingSupply: rawProposal.totalVotingSupply.toString(),
        ipfsHash: rawProposal.ipfsHash,
    };
};
export class AaveGovernanceService extends BaseService {
    constructor(provider, config) {
        var _a;
        super(provider, IAaveGovernanceV2__factory);
        this.aaveGovernanceV2Address = config.GOVERNANCE_ADDRESS;
        this.aaveGovernanceV2HelperAddress = (_a = config.GOVERNANCE_HELPER_ADDRESS) !== null && _a !== void 0 ? _a : '';
    }
    submitVote({ user, proposalId, support }) {
        const txs = [];
        const govContract = this.getContractInstance(this.aaveGovernanceV2Address);
        const txCallback = this.generateTxCallback({
            rawTxMethod: async () => govContract.populateTransaction.submitVote(proposalId, support),
            from: user,
        });
        txs.push({
            tx: txCallback,
            txType: eEthereumTxType.GOVERNANCE_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async getProposals({ skip, limit, }) {
        const helper = IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
        const result = await helper.getProposals(skip.toString(), limit.toString(), this.aaveGovernanceV2Address);
        return result.map(proposal => humanizeProposal(proposal));
    }
    async getProposal({ proposalId }) {
        const helper = IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
        const result = await helper.getProposal(proposalId, this.aaveGovernanceV2Address);
        return humanizeProposal(result);
    }
    async getVotingPowerAt({ user, block, strategy }) {
        const proposalStrategy = IGovernanceStrategy__factory.connect(strategy, this.provider);
        const power = await proposalStrategy.getVotingPowerAt(user, block.toString());
        return formatEther(power);
    }
    async getTokensPower({ user, tokens }) {
        const helper = IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
        return helper.getTokensPower(user, tokens);
    }
    async getVoteOnProposal({ proposalId, user }) {
        const govContract = this.getContractInstance(this.aaveGovernanceV2Address);
        return govContract.getVoteOnProposal(proposalId, user);
    }
    async getProposalsCount() {
        const govContract = this.getContractInstance(this.aaveGovernanceV2Address);
        return (await govContract.getProposalsCount()).toNumber();
    }
}
__decorate([
    GovValidator,
    __param(0, isEthAddress('user')),
    __param(0, is0OrPositiveAmount('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Array)
], AaveGovernanceService.prototype, "submitVote", null);
__decorate([
    GovHelperValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposals", null);
__decorate([
    GovHelperValidator,
    __param(0, is0OrPositiveAmount('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposal", null);
__decorate([
    GovValidator,
    __param(0, isEthAddress('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getVotingPowerAt", null);
__decorate([
    GovHelperValidator,
    __param(0, isEthAddress('user')),
    __param(0, isEthAddressArray('tokens')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getTokensPower", null);
__decorate([
    GovValidator,
    __param(0, isEthAddress('user')),
    __param(0, is0OrPositiveAmount('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getVoteOnProposal", null);
__decorate([
    GovValidator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposalsCount", null);
//# sourceMappingURL=index.js.map
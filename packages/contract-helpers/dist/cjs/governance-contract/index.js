"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveGovernanceService = exports.humanizeProposal = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("ethers/lib/utils");
const BaseService_1 = (0, tslib_1.__importDefault)(require("../commons/BaseService"));
const types_1 = require("../commons/types");
const methodValidators_1 = require("../commons/validators/methodValidators");
const paramValidators_1 = require("../commons/validators/paramValidators");
const IAaveGovernanceV2__factory_1 = require("./typechain/IAaveGovernanceV2__factory");
const IGovernanceStrategy__factory_1 = require("./typechain/IGovernanceStrategy__factory");
const IGovernanceV2Helper__factory_1 = require("./typechain/IGovernanceV2Helper__factory");
const types_2 = require("./types");
const humanizeProposal = (rawProposal) => {
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
        state: Object.values(types_2.ProposalState)[rawProposal.proposalState],
        minimumQuorum: rawProposal.minimumQuorum.toString(),
        minimumDiff: rawProposal.minimumDiff.toString(),
        executionTimeWithGracePeriod: Number(rawProposal.executionTimeWithGracePeriod.toString()),
        proposalCreated: Number(rawProposal.proposalCreated.toString()),
        totalVotingSupply: rawProposal.totalVotingSupply.toString(),
        ipfsHash: rawProposal.ipfsHash,
    };
};
exports.humanizeProposal = humanizeProposal;
class AaveGovernanceService extends BaseService_1.default {
    constructor(provider, config) {
        var _a;
        super(provider, IAaveGovernanceV2__factory_1.IAaveGovernanceV2__factory);
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
            txType: types_1.eEthereumTxType.GOVERNANCE_ACTION,
            gas: this.generateTxPriceEstimation(txs, txCallback),
        });
        return txs;
    }
    async getProposals({ skip, limit, }) {
        const helper = IGovernanceV2Helper__factory_1.IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
        const result = await helper.getProposals(skip.toString(), limit.toString(), this.aaveGovernanceV2Address);
        return result.map(proposal => (0, exports.humanizeProposal)(proposal));
    }
    async getProposal({ proposalId }) {
        const helper = IGovernanceV2Helper__factory_1.IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
        const result = await helper.getProposal(proposalId, this.aaveGovernanceV2Address);
        return (0, exports.humanizeProposal)(result);
    }
    async getVotingPowerAt({ user, block, strategy }) {
        const proposalStrategy = IGovernanceStrategy__factory_1.IGovernanceStrategy__factory.connect(strategy, this.provider);
        const power = await proposalStrategy.getVotingPowerAt(user, block.toString());
        return (0, utils_1.formatEther)(power);
    }
    async getTokensPower({ user, tokens }) {
        const helper = IGovernanceV2Helper__factory_1.IGovernanceV2Helper__factory.connect(this.aaveGovernanceV2HelperAddress, this.provider);
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
(0, tslib_1.__decorate)([
    methodValidators_1.GovValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.is0OrPositiveAmount)('proposalId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Array)
], AaveGovernanceService.prototype, "submitVote", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovHelperValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposals", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovHelperValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.is0OrPositiveAmount)('proposalId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposal", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getVotingPowerAt", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovHelperValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddressArray)('tokens')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getTokensPower", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovValidator,
    (0, tslib_1.__param)(0, (0, paramValidators_1.isEthAddress)('user')),
    (0, tslib_1.__param)(0, (0, paramValidators_1.is0OrPositiveAmount)('proposalId')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getVoteOnProposal", null);
(0, tslib_1.__decorate)([
    methodValidators_1.GovValidator,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AaveGovernanceService.prototype, "getProposalsCount", null);
exports.AaveGovernanceService = AaveGovernanceService;
//# sourceMappingURL=index.js.map
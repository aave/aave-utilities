"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalState = exports.ExecutorType = void 0;
var ExecutorType;
(function (ExecutorType) {
    ExecutorType[ExecutorType["Short"] = 0] = "Short";
    ExecutorType[ExecutorType["Long"] = 1] = "Long";
})(ExecutorType = exports.ExecutorType || (exports.ExecutorType = {}));
var ProposalState;
(function (ProposalState) {
    ProposalState["Pending"] = "Pending";
    ProposalState["Canceled"] = "Canceled";
    ProposalState["Active"] = "Active";
    ProposalState["Failed"] = "Failed";
    ProposalState["Succeeded"] = "Succeeded";
    ProposalState["Queued"] = "Queued";
    ProposalState["Expired"] = "Expired";
    ProposalState["Executed"] = "Executed";
})(ProposalState = exports.ProposalState || (exports.ProposalState = {}));
//# sourceMappingURL=types.js.map
/** InterestRate options */
export var InterestRate;
(function (InterestRate) {
    InterestRate["None"] = "None";
    InterestRate["Stable"] = "Stable";
    InterestRate["Variable"] = "Variable";
})(InterestRate || (InterestRate = {}));
export const ChainIdToNetwork = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan',
    100: 'xDAI',
    137: 'polygon',
    80001: 'mumbai',
    43114: 'avalanche',
    43113: 'fuji',
    42161: 'arbitrum_one',
    421611: 'arbitrum_rinkeby',
    421613: 'arbitrum_goerli',
    250: 'fantom_opera',
    4002: 'fantom_testnet',
    10: 'optimism',
    69: 'optimism_kovan',
    420: 'optimism_goerli',
    1666600000: 'harmony',
    1666700000: 'harmony_testnet',
};
export var ChainId;
(function (ChainId) {
    ChainId[ChainId["mainnet"] = 1] = "mainnet";
    ChainId[ChainId["ropsten"] = 3] = "ropsten";
    ChainId[ChainId["rinkeby"] = 4] = "rinkeby";
    ChainId[ChainId["goerli"] = 5] = "goerli";
    ChainId[ChainId["kovan"] = 42] = "kovan";
    ChainId[ChainId["xdai"] = 100] = "xdai";
    ChainId[ChainId["polygon"] = 137] = "polygon";
    ChainId[ChainId["mumbai"] = 80001] = "mumbai";
    ChainId[ChainId["avalanche"] = 43114] = "avalanche";
    ChainId[ChainId["fuji"] = 43113] = "fuji";
    ChainId[ChainId["arbitrum_one"] = 42161] = "arbitrum_one";
    ChainId[ChainId["arbitrum_rinkeby"] = 421611] = "arbitrum_rinkeby";
    ChainId[ChainId["arbitrum_goerli"] = 421613] = "arbitrum_goerli";
    ChainId[ChainId["fantom"] = 250] = "fantom";
    ChainId[ChainId["fantom_testnet"] = 4002] = "fantom_testnet";
    ChainId[ChainId["optimism"] = 10] = "optimism";
    ChainId[ChainId["optimism_kovan"] = 69] = "optimism_kovan";
    ChainId[ChainId["optimism_goerli"] = 420] = "optimism_goerli";
    ChainId[ChainId["harmony"] = 1666600000] = "harmony";
    ChainId[ChainId["harmony_testnet"] = 1666700000] = "harmony_testnet";
})(ChainId || (ChainId = {}));
export var eEthereumTxType;
(function (eEthereumTxType) {
    eEthereumTxType["ERC20_APPROVAL"] = "ERC20_APPROVAL";
    eEthereumTxType["DLP_ACTION"] = "DLP_ACTION";
    eEthereumTxType["GOVERNANCE_ACTION"] = "GOVERNANCE_ACTION";
    eEthereumTxType["GOV_DELEGATION_ACTION"] = "GOV_DELEGATION_ACTION";
    eEthereumTxType["STAKE_ACTION"] = "STAKE_ACTION";
    eEthereumTxType["MIGRATION_LEND_AAVE"] = "MIGRATION_LEND_AAVE";
    eEthereumTxType["FAUCET_MINT"] = "FAUCET_MINT";
    eEthereumTxType["REWARD_ACTION"] = "REWARD_ACTION";
})(eEthereumTxType || (eEthereumTxType = {}));
export var ProtocolAction;
(function (ProtocolAction) {
    ProtocolAction["default"] = "default";
    ProtocolAction["supply"] = "supply";
    ProtocolAction["withdraw"] = "withdraw";
    ProtocolAction["deposit"] = "deposit";
    ProtocolAction["liquidationCall"] = "liquidationCall";
    ProtocolAction["liquidationFlash"] = "liquidationFlash";
    ProtocolAction["repay"] = "repay";
    ProtocolAction["swapCollateral"] = "swapCollateral";
    ProtocolAction["repayCollateral"] = "repayCollateral";
    ProtocolAction["withdrawETH"] = "withdrawETH";
    ProtocolAction["borrowETH"] = "borrwoETH";
})(ProtocolAction || (ProtocolAction = {}));
export var GovernanceVote;
(function (GovernanceVote) {
    GovernanceVote[GovernanceVote["Abstain"] = 0] = "Abstain";
    GovernanceVote[GovernanceVote["Yes"] = 1] = "Yes";
    GovernanceVote[GovernanceVote["No"] = 2] = "No";
})(GovernanceVote || (GovernanceVote = {}));
export var Stake;
(function (Stake) {
    Stake["aave"] = "aave";
    Stake["bpt"] = "bpt";
})(Stake || (Stake = {}));
//# sourceMappingURL=types.js.map
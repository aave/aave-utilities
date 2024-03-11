import { BigNumber, BytesLike, PopulatedTransaction } from 'ethers';
import {
  LPBorrowParamsType,
  LPRepayParamsType,
  LPRepayWithATokensType,
  LPSignedRepayParamsType,
} from '../v3-pool-contract/lendingPoolTypes';

export type tEthereumAddress = string;
export type ENS = string; // something.eth

/** InterestRate options */
export enum InterestRate {
  None = 'None',
  Stable = 'Stable',
  Variable = 'Variable',
}

export const ChainIdToNetwork: Record<number, string> = {
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
  421613: 'arbitrum_goerli',
  421614: 'arbitrum_sepolia',
  250: 'fantom_opera',
  4002: 'fantom_testnet',
  10: 'optimism',
  11155420: 'optimism_sepolia',
  1666600000: 'harmony',
  1666700000: 'harmony_testnet',
  11155111: 'sepolia',
  534353: 'scroll_alpha',
  534351: 'scroll_sepolia',
  534352: 'scroll',
  1088: 'metis_andromeda',
  8453: 'base',
  84532: 'base_sepolia',
  56: 'bnb',
};

export enum ChainId {
  mainnet = 1,
  ropsten = 3,
  rinkeby = 4,
  goerli = 5,
  kovan = 42,
  xdai = 100,
  polygon = 137,
  mumbai = 80001,
  avalanche = 43114,
  fuji = 43113, // avalanche test network
  arbitrum_one = 42161,
  arbitrum_goerli = 421613,
  arbitrum_sepolia = 421614,
  fantom = 250,
  fantom_testnet = 4002,
  optimism = 10,
  optimism_sepolia = 11155420,
  harmony = 1666600000,
  harmony_testnet = 1666700000,
  zkevm_testnet = 1402,
  sepolia = 11155111,
  scroll_alpha = 534353,
  scroll_sepolia = 534351,
  scroll = 534352,
  metis_andromeda = 1088,
  base = 8453,
  base_sepolia = 84532,
  bnb = 56,
}
export type ConstantAddressesByNetwork = Record<
  string,
  {
    SYNTHETIX_PROXY_ADDRESS?: tEthereumAddress;
  }
>;

export type MigratorConfig = {
  LEND_TO_AAVE_MIGRATOR: tEthereumAddress;
};

export type LendingPoolMarketConfig = {
  LENDING_POOL: tEthereumAddress;
  WETH_GATEWAY?: tEthereumAddress;
  FLASH_LIQUIDATION_ADAPTER?: tEthereumAddress;
  REPAY_WITH_COLLATERAL_ADAPTER?: tEthereumAddress;
  SWAP_COLLATERAL_ADAPTER?: tEthereumAddress;
};

export type LendingPoolConfig = Record<
  string,
  Record<string, LendingPoolMarketConfig>
>;

export enum eEthereumTxType {
  ERC20_APPROVAL = 'ERC20_APPROVAL',
  DLP_ACTION = 'DLP_ACTION',
  GOVERNANCE_ACTION = 'GOVERNANCE_ACTION',
  GOV_DELEGATION_ACTION = 'GOV_DELEGATION_ACTION',
  STAKE_ACTION = 'STAKE_ACTION',
  MIGRATION_LEND_AAVE = 'MIGRATION_LEND_AAVE',
  FAUCET_MINT = 'FAUCET_MINT',
  REWARD_ACTION = 'REWARD_ACTION',
  V3_MIGRATION_ACTION = 'V3_MIGRATION_ACTION',
  FAUCET_V2_MINT = 'FAUCET_V2_MINT',
}

export enum ProtocolAction {
  default = 'default',
  supply = 'supply',
  borrow = 'borrow',
  withdraw = 'withdraw',
  deposit = 'deposit',
  liquidationCall = 'liquidationCall',
  liquidationFlash = 'liquidationFlash',
  repay = 'repay',
  repayETH = 'repayETH',
  repayWithATokens = 'repayWithATokens',
  swapCollateral = 'swapCollateral',
  repayCollateral = 'repayCollateral',
  withdrawETH = 'withdrawETH',
  borrowETH = 'borrwoETH',
  migrateV3 = 'migrateV3',
  supplyWithPermit = 'supplyWithPermit',
  repayWithPermit = 'repayWithPermit',
  stakeWithPermit = 'stakeWithPermit',
  vote = 'vote',
  approval = 'approval',
  creditDelegationApproval = 'creditDelegationApproval',
  stake = 'stake',
  stakeCooldown = 'stakeCooldown',
  unstake = 'unstake',
  switchBorrowRateMode = 'switchBorrowRateMode',
  setEModeUsage = 'setEModeUsage',
  governanceDelegation = 'governanceDelegation',
  claimRewards = 'claimRewards',
  claimRewardsAndStake = 'claimRewardsAndStake',
  setUsageAsCollateral = 'setUsageAsCollateral',
  withdrawAndSwitch = 'withdrawAndSwitch',
  batchMetaDelegate = 'batchMetaDelegate',
  updateRepresentatives = 'updateRepresentatives',
}

export enum GovernanceVote {
  Abstain = 0,
  Yes = 1,
  No = 2,
}

export enum Stake {
  aave = 'aave',
  bpt = 'bpt',
  gho = 'gho',
  bptv2 = 'bptv2',
}

export type GasRecommendationType = Record<
  string,
  {
    limit: string;
    recommended: string;
  }
>;

export type GeneratedTx = {
  tx: transactionType;
  gas: {
    price: string;
    limit: string;
  };
};

export type transactionType = {
  value?: string;
  from?: string;
  to?: string;
  nonce?: number;
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  data?: string;
  chainId?: number;
};

export type AddressModel = {
  ADDRESS_PROVIDER_ADDRESS: tEthereumAddress;
  LENDINGPOOL_ADDRESS: tEthereumAddress;
  LENDINGPOOL_CORE_ADDRESS: tEthereumAddress;
  SYNTHETIX_PROXY_ADDRESS: tEthereumAddress;
  GOVERNANCE_PROTO_CONTRACT: tEthereumAddress;
  LEND_TO_AAVE_MIGRATOR: tEthereumAddress;
  WETH_GATEWAY: tEthereumAddress;
  FAUCET: tEthereumAddress;
  SWAP_COLLATERAL_ADAPTER: tEthereumAddress;
  REPAY_WITH_COLLATERAL_ADAPTER: tEthereumAddress;
  AAVE_GOVERNANCE_V2: tEthereumAddress;
  AAVE_GOVERNANCE_V2_EXECUTOR_SHORT: tEthereumAddress;
  AAVE_GOVERNANCE_V2_EXECUTOR_LONG: tEthereumAddress;
  AAVE_GOVERNANCE_V2_HELPER: tEthereumAddress;
  FLASHLIQUIDATION: tEthereumAddress;
  INCENTIVES_CONTROLLER: tEthereumAddress;
  INCENTIVES_CONTROLLER_REWARD_TOKEN: tEthereumAddress;
};

export type tCommonContractAddressBetweenMarkets = Pick<
  AddressModel,
  | 'SYNTHETIX_PROXY_ADDRESS'
  | 'GOVERNANCE_PROTO_CONTRACT'
  | 'LEND_TO_AAVE_MIGRATOR'
  | 'WETH_GATEWAY'
  | 'FAUCET'
  | 'SWAP_COLLATERAL_ADAPTER'
  | 'REPAY_WITH_COLLATERAL_ADAPTER'
  | 'FLASHLIQUIDATION'
  | 'INCENTIVES_CONTROLLER'
  | 'INCENTIVES_CONTROLLER_REWARD_TOKEN'
>;

export type tDistinctContractAddressBetweenMarkets = Pick<
  AddressModel,
  | 'ADDRESS_PROVIDER_ADDRESS'
  | 'LENDINGPOOL_ADDRESS'
  | 'LENDINGPOOL_CORE_ADDRESS'
>;

export type tDistinctContractAddressBetweenMarketsV2 = Pick<
  AddressModel,
  'LENDINGPOOL_ADDRESS'
>;

export type tDistinctGovernanceV2Addresses = Pick<
  AddressModel,
  | 'AAVE_GOVERNANCE_V2'
  | 'AAVE_GOVERNANCE_V2_EXECUTOR_SHORT'
  | 'AAVE_GOVERNANCE_V2_EXECUTOR_LONG'
  | 'AAVE_GOVERNANCE_V2_HELPER'
>;

export type tdistinctStakingAddressesBetweenTokens = {
  TOKEN_STAKING_ADDRESS: tEthereumAddress;
  STAKING_REWARD_TOKEN_ADDRESS: tEthereumAddress;
  STAKING_HELPER_ADDRESS: tEthereumAddress;
  canUsePermit: boolean;
};

export type ContractAddresses = Record<string, tEthereumAddress>;

export type EthereumTransactionTypeExtended = {
  txType: eEthereumTxType;
  tx: () => Promise<transactionType>;
  gas: GasResponse;
};

export type TransactionGenerationMethod = {
  rawTxMethod: () => Promise<PopulatedTransaction>;
  from: tEthereumAddress;
  value?: string;
  gasSurplus?: number;
  action?: ProtocolAction;
};

export type TransactionGenerationMethodNew = {
  tx: PopulatedTransaction;
  gasSurplus?: number;
  action?: ProtocolAction;
  skipGasEstimation?: boolean;
};

export type TransactionGasGenerationMethod = {
  txCallback: () => Promise<transactionType>;
  action?: ProtocolAction;
};

export type GasType = {
  gasLimit: string | undefined;
  gasPrice: string;
};
export type GasResponse = (force?: boolean) => Promise<GasType | null>;

export type DefaultProviderKeys = {
  etherscan?: string;
  infura?: string;
  alchemy?: string;
};

export type GovernanceConfigType = Record<
  string,
  tDistinctGovernanceV2Addresses
>;
export type StakingConfigType = Record<
  string,
  Record<string, tdistinctStakingAddressesBetweenTokens>
>;

export type CommonConfigType = Record<
  string,
  tCommonContractAddressBetweenMarkets
>;

export type LendingPoolConfigType = Record<
  string,
  Record<string, tDistinctContractAddressBetweenMarketsV2>
>;

export type PermitSignature = {
  amount: string;
  deadline: string;
  v: number;
  r: BytesLike;
  s: BytesLike;
};

export type FlashLoanParams = {
  assetToSwapToList: tEthereumAddress[]; // List of the addresses of the reserve to be swapped to and deposited
  minAmountsToReceive: string[]; // List of min amounts to be received from the swap
  swapAllBalance: boolean[]; // Flag indicating if all the user balance should be swapped
  permitAmount: string[]; // List of amounts for the permit signature
  deadline: string[]; // List of deadlines for the permit signature
  v: number[]; // List of v param for the permit signature
  r: BytesLike[]; // List of r param for the permit signature
  s: BytesLike[]; // List of s param for the permit signature
};

export interface SignedActionRequest {
  signatures: string[];
}

export type ActionBundle = {
  action: PopulatedTransaction;
  approvalRequired: boolean;
  approvals: PopulatedTransaction[];
  signatureRequests: string[];
  generateSignedAction: ({
    signatures,
  }: SignedActionRequest) => Promise<PopulatedTransaction>;
  signedActionGasEstimate: string;
};

export const DEFAULT_DEADLINE = Math.floor(Date.now() / 1000 + 3600).toString();

export type BorrowTxBuilder = {
  generateTxData: ({
    user,
    reserve,
    amount,
    interestRateMode,
    debtTokenAddress,
    onBehalfOf,
    referralCode,
    useOptimizedPath,
    encodedTxData,
  }: LPBorrowParamsType) => PopulatedTransaction;
  encodeBorrowParams: ({
    reserve,
    amount,
    interestRateMode,
    referralCode,
  }: Omit<LPBorrowParamsType, 'user'>) => Promise<string>;
};

export type RepayTxBuilder = {
  generateTxData: (params: LPRepayParamsType) => PopulatedTransaction;
  generateSignedTxData: (
    params: LPSignedRepayParamsType,
  ) => PopulatedTransaction;
  encodeRepayParams: ({
    reserve,
    amount,
    interestRateMode,
  }: Omit<LPRepayParamsType, 'user'>) => Promise<string>;
  encodeRepayWithPermitParams: ({
    reserve,
    amount,
    interestRateMode,
    deadline,
    signature,
  }: Pick<
    LPSignedRepayParamsType,
    'reserve' | 'amount' | 'interestRateMode' | 'signature' | 'deadline'
  >) => Promise<[string, string, string]>;
};

export type RepayWithATokensTxBuilder = {
  generateTxData: (params: LPRepayWithATokensType) => PopulatedTransaction;
  encodeRepayWithATokensParams: ({
    reserve,
    amount,
    rateMode,
  }: Omit<LPRepayWithATokensType, 'user'>) => Promise<string>;
};

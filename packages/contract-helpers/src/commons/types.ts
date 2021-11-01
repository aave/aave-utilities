import { BigNumber, BytesLike, PopulatedTransaction } from 'ethers';

export type tEthereumAddress = string;
export type ENS = string; // something.eth

/** InterestRate options */
export enum InterestRate {
  None = 'None',
  Stable = 'Stable',
  Variable = 'Variable',
}

export enum Market {
  Proto = 'proto',
  AMM = 'amm',
}

export const ChainIdToNetwork: Record<number, string> = {
  1: 'mainnet', // 'homestead', //
  3: 'ropsten',
  42: 'kovan',
  100: 'xDAI',
  137: 'polygon',
  1337: 'fork',
  3030: 'fork2',
  80001: 'mumbai',
  1338: 'polygon_fork',
  43114: 'avalanche',
  1339: 'avalanche_fork',
  43113: 'fuji',
  42161: 'arbitrum_one',
  421611: 'arbitrum_rinkeby',
};

export enum ChainId {
  mainnet = 1,
  ropsten = 3,
  kovan = 42,
  polygon = 137,
  fork = 1337,
  fork2 = 3030,
  mumbai = 80001,
  polygon_fork = 1338,
  avalanche = 43114,
  avalanche_fork = 1337,
  fuji = 43113, // avalanche test network
  arbitrum_one = 42161,
  arbitrum_rinkeby = 421611,
  xDAI = 100,
}

export type ConstantAddressesByNetwork = Record<
  string,
  {
    SYNTHETIX_PROXY_ADDRESS?: tEthereumAddress;
  }
>;
export type GovernanceConfig = {
  AAVE_GOVERNANCE_V2: tEthereumAddress;
  AAVE_GOVERNANCE_V2_EXECUTOR_SHORT: tEthereumAddress;
  AAVE_GOVERNANCE_V2_EXECUTOR_LONG: tEthereumAddress;
  AAVE_GOVERNANCE_V2_HELPER: tEthereumAddress;
};

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

export type StakingNetworkConfig = {
  TOKEN_STAKING: tEthereumAddress;
  STAKING_REWARD_TOKEN: tEthereumAddress;
  STAKING_HELPER?: tEthereumAddress;
};

export type StakingConfig = Record<
  string,
  Record<string, StakingNetworkConfig>
>;

export type TxBuilderConfig = {
  governance?: Record<string, GovernanceConfig>;
  migrator?: Record<string, MigratorConfig>;
  lendingPool?: LendingPoolConfig;
  staking?: StakingConfig;
};

export enum eEthereumTxType {
  ERC20_APPROVAL = 'ERC20_APPROVAL',
  DLP_ACTION = 'DLP_ACTION',
  GOVERNANCE_ACTION = 'GOVERNANCE_ACTION',
  GOV_DELEGATION_ACTION = 'GOV_DELEGATION_ACTION',
  STAKE_ACTION = 'STAKE_ACTION',
  MIGRATION_LEND_AAVE = 'MIGRATION_LEND_AAVE',
  FAUCET_MINT = 'FAUCET_MINT',
  REWARD_ACTION = 'REWARD_ACTION',
}

export enum ProtocolAction {
  default = 'default',
  withdraw = 'withdraw',
  deposit = 'deposit',
  liquidationCall = 'liquidationCall',
  liquidationFlash = 'liquidationFlash',
  repay = 'repay',
  swapCollateral = 'swapCollateral',
  repayCollateral = 'repayCollateral',
  withdrawETH = 'withdrawETH',
  borrowETH = 'borrwoETH',
}

export enum GovernanceVote {
  Abstain = 0,
  Yes = 1,
  No = 2,
}

export enum Stake {
  aave = 'aave',
  bpt = 'bpt',
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

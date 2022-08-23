import { SignatureLike } from '@ethersproject/bytes';
import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  tEthereumAddress,
} from '../commons/types';
import { IERC20ServiceInterface } from '../erc20-contract';
import { IAaveStakingHelper } from './typechain/IAaveStakingHelper';
import { IStakedToken } from './typechain/IStakedToken';
export interface StakingInterface {
  stakingContractAddress: tEthereumAddress;
  stake: (
    user: tEthereumAddress,
    amount: string,
    onBehalfOf?: tEthereumAddress,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  redeem: (
    user: tEthereumAddress,
    amount: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  cooldown: (user: tEthereumAddress) => EthereumTransactionTypeExtended[];
  claimRewards: (
    user: tEthereumAddress,
    amount: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  signStaking: (
    user: tEthereumAddress,
    amount: string,
    nonce: string,
  ) => Promise<string>;
  stakeWithPermit: (
    user: tEthereumAddress,
    amount: string,
    signature: string,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}
declare type StakingServiceConfig = {
  TOKEN_STAKING_ADDRESS: string;
  STAKING_HELPER_ADDRESS?: string;
};
export declare class StakingService
  extends BaseService<IStakedToken>
  implements StakingInterface
{
  readonly stakingHelperContract: IAaveStakingHelper;
  readonly stakingContractAddress: tEthereumAddress;
  readonly stakingHelperContractAddress: tEthereumAddress;
  readonly erc20Service: IERC20ServiceInterface;
  constructor(
    provider: providers.Provider,
    stakingServiceConfig: StakingServiceConfig,
  );
  signStaking(
    user: tEthereumAddress,
    amount: string,
    nonce: string,
  ): Promise<string>;
  stakeWithPermit(
    user: tEthereumAddress,
    amount: string,
    signature: SignatureLike,
  ): Promise<EthereumTransactionTypeExtended[]>;
  stake(
    user: tEthereumAddress,
    amount: string,
    onBehalfOf?: tEthereumAddress,
  ): Promise<EthereumTransactionTypeExtended[]>;
  redeem(
    user: tEthereumAddress,
    amount: string,
  ): Promise<EthereumTransactionTypeExtended[]>;
  cooldown(user: tEthereumAddress): EthereumTransactionTypeExtended[];
  claimRewards(
    user: tEthereumAddress,
    amount: string,
  ): Promise<EthereumTransactionTypeExtended[]>;
}
export {};
//# sourceMappingURL=index.d.ts.map

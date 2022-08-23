import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { EthereumTransactionTypeExtended } from '../commons/types';
import { IAaveIncentivesControllerV2 } from './typechain/IAaveIncentivesControllerV2';
export declare type ClaimRewardsV2MethodType = {
  user: string;
  assets: string[];
  reward: string;
  to?: string;
  incentivesControllerAddress: string;
};
export declare type ClaimAllRewardsV2MethodType = {
  user: string;
  assets: string[];
  to?: string;
  incentivesControllerAddress: string;
};
export interface IncentivesControllerV2Interface {
  claimRewards: (
    args: ClaimRewardsV2MethodType,
  ) => EthereumTransactionTypeExtended[];
  claimAllRewards: (
    args: ClaimAllRewardsV2MethodType,
  ) => EthereumTransactionTypeExtended[];
}
export declare class IncentivesControllerV2
  extends BaseService<IAaveIncentivesControllerV2>
  implements IncentivesControllerV2Interface
{
  constructor(provider: providers.Provider);
  claimRewards({
    user,
    assets,
    to,
    incentivesControllerAddress,
    reward,
  }: ClaimRewardsV2MethodType): EthereumTransactionTypeExtended[];
  claimAllRewards({
    user,
    assets,
    to,
    incentivesControllerAddress,
  }: ClaimAllRewardsV2MethodType): EthereumTransactionTypeExtended[];
}
//# sourceMappingURL=index.d.ts.map

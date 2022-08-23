import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { EthereumTransactionTypeExtended } from '../commons/types';
import { IAaveIncentivesController } from './typechain/IAaveIncentivesController';
export declare type ClaimRewardsMethodType = {
  user: string;
  assets: string[];
  to?: string;
  incentivesControllerAddress: string;
};
export interface IncentivesControllerInterface {
  claimRewards: (
    args: ClaimRewardsMethodType,
  ) => EthereumTransactionTypeExtended[];
}
export declare class IncentivesController
  extends BaseService<IAaveIncentivesController>
  implements IncentivesControllerInterface
{
  constructor(provider: providers.Provider);
  claimRewards({
    user,
    assets,
    to,
    incentivesControllerAddress,
  }: ClaimRewardsMethodType): EthereumTransactionTypeExtended[];
}
//# sourceMappingURL=index.d.ts.map

import { BigNumber, BigNumberish, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { GhoDiscountRateStrategy__factory } from './typechain/GhoDiscountRateStrategy__factory';
import type { IGhoDiscountRateStrategy } from './typechain/IGhoDiscountRateStrategy';

// Types
type GhoServiceConfig = {
  DISCOUNT_RATE_STRATEGY_ADDRESS: string;
};

export interface GhoDiscountRateServiceInterface {
  calculateDiscountRate: (
    ghoBalance: BigNumberish,
    skAaveBalance: BigNumberish,
  ) => Promise<BigNumber>;
}

// Class
export class GhoDiscountRateService
  extends BaseService<IGhoDiscountRateStrategy>
  implements GhoDiscountRateServiceInterface
{
  readonly ghoDiscountRateStrategyAddress: string;

  constructor(provider: providers.Provider, config: GhoServiceConfig) {
    super(provider, GhoDiscountRateStrategy__factory);

    this.ghoDiscountRateStrategyAddress = config.DISCOUNT_RATE_STRATEGY_ADDRESS;
  }

  public async calculateDiscountRate(
    ghoBalance: BigNumberish,
    stakedAaveBalance: BigNumberish,
  ) {
    const contract: IGhoDiscountRateStrategy = this.getContractInstance(
      this.ghoDiscountRateStrategyAddress,
    );
    const result = await contract.calculateDiscountRate(
      ghoBalance,
      stakedAaveBalance,
    );
    return result;
  }
}

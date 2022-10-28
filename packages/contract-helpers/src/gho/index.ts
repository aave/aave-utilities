import { Contract, ContractInterface, providers, Signer } from 'ethers';
import BaseService, { ContractsFactory } from '../commons/BaseService';
import { GhoDiscountRateStrategy } from './typechain/GhoDiscountRateStrategy';
import { GhoInterestRateStrategy } from './typechain/GhoInterestRateStrategy';
import { GhoDiscountRateStrategy__factory } from './typechain/GhoDiscountRateStrategy__factory'
import { GhoInterestRateStrategy__factory } from './typechain/GhoInterestRateStrategy__factory'
import { IGhoDiscountRateStrategy } from './typechain/IGhoDiscountRateStrategy'


// Types
type GhoServiceConfig = {
  DISCOUNT_RATE_STRATEGY_ADDRESS: string;
  INTEREST_RATE_STRATEGY_ADDRESS: string;
}

export interface GhoServiceInterface {
  calculateDiscountRate: (ghoBalance: number, skAaveBalance: number) => Promise<number>
}

// Class
export class GhoDiscountRateService extends BaseService<IGhoDiscountRateStrategy> implements GhoServiceInterface {

  constructor(provider: providers.Provider, config: GhoServiceConfig) {
    super(provider, GhoDiscountRateStrategy__factory);
  }

  public async calculateDiscountRate(ghoBalance: number, skAaveBalance: number) {
    return 100
  }
}

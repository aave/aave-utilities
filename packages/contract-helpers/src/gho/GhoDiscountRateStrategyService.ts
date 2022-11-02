import { BigNumber, BigNumberish, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { GhoDiscountRateStrategy__factory } from './typechain/GhoDiscountRateStrategy__factory';
import type { IGhoDiscountRateStrategy } from './typechain/IGhoDiscountRateStrategy';

export interface GhoDiscountRateServiceInterface {
  calculateDiscountRate: (
    ghoDebtTokenBalance: BigNumberish,
    skAaveBalance: BigNumberish,
  ) => Promise<BigNumber>;
}

/**
 * The service for interacting with the GhoDiscountRateStrategy.sol smart contract
 * https://github.com/aave/gho/blob/main/src/contracts/facilitators/aave/interestStrategy/GhoDiscountRateStrategy.sol
 */
export class GhoDiscountRateStrategyService
  extends BaseService<IGhoDiscountRateStrategy>
  implements GhoDiscountRateServiceInterface
{
  readonly ghoDiscountRateStrategyAddress: string;

  constructor(
    provider: providers.Provider,
    discountRateStrategyAddress: string,
  ) {
    super(provider, GhoDiscountRateStrategy__factory);
    this.ghoDiscountRateStrategyAddress = discountRateStrategyAddress;
  }

  /**
   * Calculates the discounted interest rate charged on the borrowed native GHO token from the Aave Protocol. Currently this is set to be 20% on 100 GHO borrowed per stkAAVE held. Additionally, a user's discount rate is
   * updated anytime they send or receive the discount token (stkAAVE). Users are entitled to this discount for a given amount of time without needing to perform any additional actions (i.e. the discount lock period).
   * @param ghoDebtTokenBalance - The balance for the user's GhoVariableDebtToken, i.e. the amount they currently have borrowed from the protocol
   * @param stakedAaveBalance - The balance of the user's stkAAVE token balance
   * @returns - The discounted interest rate charged on the borrowed native GHO token.
   */
  public async calculateDiscountRate(
    ghoDebtTokenBalance: BigNumberish,
    stakedAaveBalance: BigNumberish,
  ) {
    const contract = this.getContractInstance(
      this.ghoDiscountRateStrategyAddress,
    );
    const result = await contract.calculateDiscountRate(
      ghoDebtTokenBalance,
      stakedAaveBalance,
    );
    return result;
  }
}

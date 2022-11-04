import { BigNumber, BigNumberish, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  GhoVariableDebtTokenService,
  IGhoVariableDebtTokenService,
} from './GhoVariableDebtTokenService';
import type { GhoDiscountRateStrategy } from './typechain/GhoDiscountRateStrategy';
import { GhoDiscountRateStrategy__factory } from './typechain/GhoDiscountRateStrategy__factory';

interface IGhoDiscountRateStrategyService {
  getGhoDiscountedPerDiscountToken: () => Promise<BigNumber>;
  getGhoDiscountRate: () => Promise<BigNumber>;
  getGhoMinDiscountTokenBalance: () => Promise<BigNumber>;
  getGhoMinDebtTokenBalance: () => Promise<BigNumber>;
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
  extends BaseService<GhoDiscountRateStrategy>
  implements IGhoDiscountRateStrategyService
{
  readonly ghoVariableDebtTokenService: IGhoVariableDebtTokenService;

  constructor(
    provider: providers.Provider,
    ghoVariableDebtTokenAddress: string,
  ) {
    super(provider, GhoDiscountRateStrategy__factory);
    this.ghoVariableDebtTokenService = new GhoVariableDebtTokenService(
      provider,
      ghoVariableDebtTokenAddress,
    );
  }

  /**
   * Gets the amount of debt that is entitled to get a discount per unit of discount token
   * @returns - A BigNumber representing the amount of GHO tokens per discount token that are eligible to be discounted, expressed with the number of decimals of the discount token
   */
  public async getGhoDiscountedPerDiscountToken() {
    const ghoDiscountRateStrategyAddress =
      await this.ghoVariableDebtTokenService.getDiscountRateStrategy();
    const contract = this.getContractInstance(ghoDiscountRateStrategyAddress);
    // eslint-disable-next-line new-cap
    const result = await contract.GHO_DISCOUNTED_PER_DISCOUNT_TOKEN();
    return result;
  }

  /**
   * Gets the percentage of discount to apply to the part of the debt that is entitled to get a discount
   * @returns - A BigNumber representing the current maximum discount rate, expressed in bps, a value of 2000 results in 20.00%
   */
  public async getGhoDiscountRate() {
    const ghoDiscountRateStrategyAddress =
      await this.ghoVariableDebtTokenService.getDiscountRateStrategy();
    const contract = this.getContractInstance(ghoDiscountRateStrategyAddress);
    // eslint-disable-next-line new-cap
    const result = await contract.DISCOUNT_RATE();
    return result;
  }

  /**
   * Gets the minimum balance amount of discount token to be entitled to a discount
   * @returns - A BigNumber representing the minimum amount of discount tokens needed to be eligible for a discount, expressed with the number of decimals of the discount token
   */
  public async getGhoMinDiscountTokenBalance() {
    const ghoDiscountRateStrategyAddress =
      await this.ghoVariableDebtTokenService.getDiscountRateStrategy();
    const contract = this.getContractInstance(ghoDiscountRateStrategyAddress);
    // eslint-disable-next-line new-cap
    const result = await contract.MIN_DISCOUNT_TOKEN_BALANCE();
    return result;
  }

  /**
   * Gets the minimum balance amount of debt token to be entitled to a discount
   * @returns - A BigNumber representing the minimum amount of debt tokens needed to be eligible for a discount, expressed with the number of decimals of the debt token
   */
  public async getGhoMinDebtTokenBalance() {
    const ghoDiscountRateStrategyAddress =
      await this.ghoVariableDebtTokenService.getDiscountRateStrategy();
    const contract = this.getContractInstance(ghoDiscountRateStrategyAddress);
    // eslint-disable-next-line new-cap
    const result = await contract.MIN_DEBT_TOKEN_BALANCE();
    return result;
  }

  /**
   * Calculates the discounted interest rate charged on the borrowed native GHO token from the Aave Protocol. Currently this is set to be 20% on 100 GHO borrowed per stkAAVE held. Additionally, a user's discount rate is updated anytime they send or receive the discount token (stkAAVE). Users are entitled to this discount for a given amount of time without needing to perform any additional actions (i.e. the discount lock period).
   * @param ghoDebtTokenBalance - The balance for the user's GhoVariableDebtToken, i.e. the amount they currently have borrowed from the protocol
   * @param stakedAaveBalance - The balance of the user's stkAAVE token balance
   * @returns - A BigNumber representing the discounted interest rate charged on the borrowed native GHO token, expresed in bps
   */
  public async calculateDiscountRate(
    ghoDebtTokenBalance: BigNumberish,
    stakedAaveBalance: BigNumberish,
  ) {
    const ghoDiscountRateStrategyAddress =
      await this.ghoVariableDebtTokenService.getDiscountRateStrategy();
    const contract = this.getContractInstance(ghoDiscountRateStrategyAddress);
    const result = await contract.calculateDiscountRate(
      ghoDebtTokenBalance,
      stakedAaveBalance,
    );
    return result;
  }
}

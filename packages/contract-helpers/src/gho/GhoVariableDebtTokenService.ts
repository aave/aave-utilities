import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { GhoVariableDebtToken__factory } from './typechain/GhoVariableDebtToken__factory';
import type { IGhoVariableDebtToken } from './typechain/IGhoVariableDebtToken';

export interface IGhoVariableDebtTokenService {
  getDiscountToken: () => Promise<string>;
  getDiscountLockPeriod: () => Promise<BigNumber>;
  getUserDiscountPercent: (userAddress: string) => Promise<BigNumber>;
  getUserRebalanceTimestamp: (userAddress: string) => Promise<BigNumber>;
  getDiscountRateStrategy: () => Promise<string>;
  scaledBalanceof: (userAddress: string) => Promise<BigNumber>;
  getPreviousIndex: (userAddress: string) => Promise<BigNumber>;
}

/**
 * The service for interacting with the GhoToken.sol smart contract.
 * This contract controls operations minting & burning the native GHO token as well as facilitator management.
 * https://github.com/aave/gho/blob/main/src/contracts/gho/GhoToken.sol
 */
export class GhoVariableDebtTokenService
  extends BaseService<IGhoVariableDebtToken>
  implements IGhoVariableDebtTokenService
{
  readonly ghoVariableDebtTokenAddress: string;

  constructor(
    provider: providers.Provider,
    ghoVariableDebtTokenAddress: string,
  ) {
    super(provider, GhoVariableDebtToken__factory);
    this.ghoVariableDebtTokenAddress = ghoVariableDebtTokenAddress;
  }

  /**
   * Gets the discount token address tied the variable debt token (stkAAVE currently)
   * @returns - A string representing the address for the deployed smart contract of the token
   */
  public async getDiscountToken() {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getDiscountToken();
    return result;
  }

  /**
   * Gets the current discount percent lock period
   * @returns - A BigNumber representing the discount percent lock period, expressed in seconds
   */
  public async getDiscountLockPeriod() {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getDiscountLockPeriod();
    return result;
  }

  /**
   * Gets the discount percent being applied to the GHO debt interest for the provided user
   * @param userAddress - The address for the given user to query for
   * @returns - A BigNumber representing the user's discount percentage, expressed in bps
   */
  public async getUserDiscountPercent(userAddress: string) {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getDiscountPercent(userAddress);
    return result;
  }

  /**
   * Gets the timestamp at which a user's discount percent can be rebalanced
   * @param userAddress - The address of the user's rebalance timestamp being requested
   * @returns - A BigNumber representing the time when a users discount percent can be rebalanced, expressed in seconds
   */
  public async getUserRebalanceTimestamp(userAddress: string) {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getUserRebalanceTimestamp(userAddress);
    return result;
  }

  /**
   * Gets the discount rate strategy currently in use
   * @returns - Address of current GhoDiscountRateStrategy
   */
  public async getDiscountRateStrategy() {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getDiscountRateStrategy();
    return result;
  }

  public async scaledBalanceof(userAddress: string) {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.scaledBalanceOf(userAddress);
    return result;
  }

  public async getPreviousIndex(userAddress: string) {
    const contract = this.getContractInstance(this.ghoVariableDebtTokenAddress);
    const result = await contract.getPreviousIndex(userAddress);
    return result;
  }
}

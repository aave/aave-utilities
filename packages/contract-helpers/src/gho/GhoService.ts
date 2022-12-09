import { BigNumber, Contract, ethers, providers } from 'ethers';
import { tEthereumAddress } from '../commons/types';
import { Pool } from '../v3-pool-contract';
import { GhoDiscountRateStrategyService } from './GhoDiscountRateStrategyService';
import { GhoTokenService } from './GhoTokenService';
import { GhoVariableDebtTokenService } from './GhoVariableDebtTokenService';
import { GhoReserveData, GhoUserData } from './types';

export interface IGhoService {
  getGhoReserveData: () => Promise<GhoReserveData>;
  getGhoUserData: (
    userAddress: tEthereumAddress,
    ghoDiscountTokenAddress?: tEthereumAddress,
  ) => Promise<GhoUserData>;
}

// Wrapper service for fetching gho reserve, discount, facilitator, and user data for UI purposes
export class GhoService implements IGhoService {
  readonly ghoTokenService: GhoTokenService;
  readonly poolService: Pool;
  readonly ghoVariableDebtTokenService: GhoVariableDebtTokenService;
  readonly ghoDiscountRateStrategyService: GhoDiscountRateStrategyService;
  readonly ghoTokenAddress: tEthereumAddress;
  readonly ghoATokenAddress: tEthereumAddress;
  readonly provider: providers.Provider;
  constructor({
    provider,
    ghoTokenAddress,
    ghoVariableDebtTokenAddress,
    ghoATokenAddress,
    poolAddress,
  }: {
    provider: providers.Provider;
    ghoTokenAddress: tEthereumAddress;
    ghoVariableDebtTokenAddress: tEthereumAddress;
    ghoATokenAddress: tEthereumAddress;
    poolAddress: tEthereumAddress;
  }) {
    this.ghoTokenService = new GhoTokenService(provider, ghoTokenAddress);
    this.poolService = new Pool(provider, { POOL: poolAddress });
    this.ghoVariableDebtTokenService = new GhoVariableDebtTokenService(
      provider,
      ghoVariableDebtTokenAddress,
    );
    this.ghoDiscountRateStrategyService = new GhoDiscountRateStrategyService(
      provider,
      ghoVariableDebtTokenAddress,
    );
    this.ghoTokenAddress = ghoTokenAddress;
    this.ghoATokenAddress = ghoATokenAddress;
    this.provider = provider;
  }

  /**
   * Fetches Gho reserve, discount, facilitator data
   * @returns - instance of GhoReserveData with reserve, discount, facilitator data
   */
  // Below line is temporary, variableDebtToken mock functions are not working despite them working line for line in GhoVariableDebtTokenService.test.ts
  /* istanbul ignore next */
  public async getGhoReserveData(): Promise<GhoReserveData> {
    const [
      reserve,
      ghoDiscountedPerToken,
      ghoDiscountRate,
      ghoDiscountLockPeriod,
      facilitatorInfo,
      ghoMinDebtTokenBalanceForDiscount,
      ghoMinDiscountTokenBalanceForDiscount,
    ] = await Promise.all([
      this.poolService.getReserveData(this.ghoTokenAddress),
      this.ghoDiscountRateStrategyService.getGhoDiscountedPerDiscountToken(),
      this.ghoDiscountRateStrategyService.getGhoDiscountRate(),
      this.ghoVariableDebtTokenService.getDiscountLockPeriod(),
      this.ghoTokenService.getFacilitatorBucket(this.ghoATokenAddress),
      this.ghoDiscountRateStrategyService.getGhoMinDebtTokenBalance(),
      this.ghoDiscountRateStrategyService.getGhoMinDiscountTokenBalance(),
    ]);

    return {
      ghoBaseVariableBorrowRate: reserve.currentVariableBorrowRate.toString(),
      ghoDiscountedPerToken: ghoDiscountedPerToken.toString(),
      ghoDiscountRate: ghoDiscountRate.toString(),
      ghoDiscountLockPeriod: ghoDiscountLockPeriod.toString(),
      aaveFacilitatorBucketMaxCapacity: facilitatorInfo.maxCapacity.toString(),
      aaveFacilitatorBucketLevel: facilitatorInfo.level.toString(),
      ghoMinDebtTokenBalanceForDiscount:
        ghoMinDebtTokenBalanceForDiscount.toString(),
      ghoMinDiscountTokenBalanceForDiscount:
        ghoMinDiscountTokenBalanceForDiscount.toString(),
      ghoCurrentBorrowIndex: reserve.variableBorrowIndex.toString(),
      ghoReserveLastUpdateTimestamp: reserve.lastUpdateTimestamp.toString(),
    };
  }

  /**
   * Fetches Gho user data for UI display
   * @param userAddress - Address of user to fetch ghoDiscountRate, ghoDiscountTokenBalance, and gho balance indeces
   * @returns - instance of GhoUserData
   */
  public async getGhoUserData(
    userAddress: tEthereumAddress,
    ghoDiscountTokenAddress?: tEthereumAddress,
  ): Promise<GhoUserData> {
    let discountTokenAddress = ghoDiscountTokenAddress;
    if (!discountTokenAddress) {
      discountTokenAddress =
        await this.ghoVariableDebtTokenService.getDiscountToken();
    }

    // This is subotimal but will be unncessary once there's a helper contract, so probably not worth creating a new ERC20Service for this now
    const abi = ['function balanceOf(address owner) view returns (uint256)'];
    interface ERC20Contract extends Contract {
      balanceOf(tokenOwner: string): Promise<BigNumber>;
    }
    const discountTokenErc20: ERC20Contract = new ethers.Contract(
      discountTokenAddress,
      abi,
      this.provider,
    ) as ERC20Contract;

    const [
      userDiscountRate,
      userDiscountTokenBalance,
      userGhoScaledBorrowBalance,
      userPreviousGhoBorrowIndex,
      userDiscountLockPeriodEnd,
    ] = await Promise.all([
      this.ghoVariableDebtTokenService.getUserDiscountPercent(userAddress),
      discountTokenErc20.balanceOf(userAddress),
      this.ghoVariableDebtTokenService.scaledBalanceof(userAddress),
      this.ghoVariableDebtTokenService.getPreviousIndex(userAddress),
      this.ghoVariableDebtTokenService.getUserRebalanceTimestamp(userAddress),
    ]);

    return {
      userGhoDiscountRate: userDiscountRate.toString(),
      userDiscountTokenBalance: userDiscountTokenBalance.toString(),
      userGhoScaledBorrowBalance: userGhoScaledBorrowBalance.toString(),
      userPreviousGhoBorrowIndex: userPreviousGhoBorrowIndex.toString(),
      userDiscountLockPeriodEndTimestamp: userDiscountLockPeriodEnd.toString(),
    };
  }
}

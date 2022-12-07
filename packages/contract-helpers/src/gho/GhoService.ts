import { BigNumber, Contract, ethers, providers } from 'ethers';
import { tEthereumAddress } from '../commons/types';
import { ERC20Service } from '../erc20-contract';
import { Pool } from '../v3-pool-contract';
import { GhoDiscountRateStrategyService } from './GhoDiscountRateStrategyService';
import { GhoTokenService } from './GhoTokenService';
import { GhoVariableDebtTokenService } from './GhoVariableDebtTokenService';
import { GhoData } from './types';

export interface IGhoService {
  getGhoData: (userAddress?: string) => Promise<GhoData>;
}

// Wrapper service for fetching gho reserve, discount, facilitator, and user data for UI purposes
export class GhoService implements IGhoService {
  readonly ghoTokenService: GhoTokenService;
  readonly poolService: Pool;
  readonly erc20Service: ERC20Service;
  readonly ghoTokenAddress: string;
  readonly provider: providers.Provider;
  constructor({
    provider,
    ghoTokenAddress,
    poolAddress,
  }: {
    provider: providers.Provider;
    ghoTokenAddress: tEthereumAddress;
    poolAddress: tEthereumAddress;
  }) {
    this.ghoTokenService = new GhoTokenService(provider, ghoTokenAddress);
    this.poolService = new Pool(provider, { POOL: poolAddress });
    this.erc20Service = new ERC20Service(provider);
    this.ghoTokenAddress = ghoTokenAddress;
    this.provider = provider;
  }

  /**
   * Fetches Gho reserve, discount, facilitator and optionally user data for UI display
   * @param @optional userAddress - Address of user to fetch ghoDiscountRate and ghoDiscountTokenBalance
   * @returns - instance of GhoData with reserve, discount, facilitator and optional user data
   */
  public async getGhoData(userAddress?: string): Promise<GhoData> {
    const reserve = await this.poolService.getReserveData(this.ghoTokenAddress);
    const ghoVariableDebtTokenService = new GhoVariableDebtTokenService(
      this.provider,
      reserve.variableDebtTokenAddress,
    );
    const ghoDiscountRateService = new GhoDiscountRateStrategyService(
      this.provider,
      reserve.variableDebtTokenAddress,
    );
    const [
      ghoDiscountedPerToken,
      ghoDiscountRate,
      ghoDiscountLockPeriod,
      facilitatorInfo,
      ghoMinDebtTokenBalanceForDiscount,
      ghoMinDiscountTokenBalanceForDiscount,
      ghoDiscountToken,
    ] = await Promise.all([
      ghoDiscountRateService.getGhoDiscountedPerDiscountToken(),
      ghoDiscountRateService.getGhoDiscountRate(),
      ghoVariableDebtTokenService.getDiscountLockPeriod(),
      this.ghoTokenService.getFacilitatorBucket(reserve.aTokenAddress),
      ghoDiscountRateService.getGhoMinDebtTokenBalance(),
      ghoDiscountRateService.getGhoMinDiscountTokenBalance(),
      ghoVariableDebtTokenService.getDiscountToken(),
    ]);

    // Fetch gho user data
    let userGhoData = {
      userDiscountRate: '0',
      userDiscountTokenBalance: '0',
      userGhoBorrowBalance: '0',
    };
    if (userAddress) {
      // This is subotimal but will be unncessary once there's a helper contract, so probably not worth creating a new ERC20Service for this now
      const abi = ['function balanceOf(address owner) view returns (uint256)'];
      interface ERC20Contract extends Contract {
        balanceOf(tokenOwner: string): Promise<BigNumber>;
      }
      const discountTokenErc20: ERC20Contract = new ethers.Contract(
        ghoDiscountToken,
        abi,
        this.provider,
      ) as ERC20Contract;

      const variableDebtTokenErc20: ERC20Contract = new ethers.Contract(
        reserve.variableDebtTokenAddress,
        abi,
        this.provider,
      ) as ERC20Contract;

      const [userDiscountRate, userDiscountTokenBalance, userGhoBorrowBalance] =
        await Promise.all([
          ghoVariableDebtTokenService.getUserDiscountPercent(userAddress),
          discountTokenErc20.balanceOf(userAddress),
          variableDebtTokenErc20.balanceOf(userAddress),
        ]);
      userGhoData = {
        userDiscountRate: userDiscountRate.toString(),
        userDiscountTokenBalance: userDiscountTokenBalance.toString(),
        userGhoBorrowBalance: userGhoBorrowBalance.toString(),
      };
    }

    return {
      ghoBaseVariableBorrowRate: reserve.currentVariableBorrowRate.toString(),
      ghoDiscountedPerToken: ghoDiscountedPerToken.toString(),
      ghoDiscountRate: ghoDiscountRate.toString(),
      ghoDiscountLockPeriod: ghoDiscountLockPeriod.toString(),
      facilitatorBucketMaxCapacity: facilitatorInfo.maxCapacity.toString(),
      facilitatorBucketLevel: facilitatorInfo.level.toString(),
      ghoMinDebtTokenBalanceForDiscount:
        ghoMinDebtTokenBalanceForDiscount.toString(),
      ghoMinDiscountTokenBalanceForDiscount:
        ghoMinDiscountTokenBalanceForDiscount.toString(),
      userGhoDiscountRate: userGhoData.userDiscountRate,
      userDiscountTokenBalance: userGhoData.userDiscountTokenBalance,
      userGhoBorowBalance: userGhoData.userGhoBorrowBalance,
    };
  }
}

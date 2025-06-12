import { providers } from 'ethers';
import { StakeDataProvider } from './typechain/StakeDataProvider';
import { StakeDataProvider__factory } from './typechain/StakeDataProvider__factory';

export interface StakeData {
  tokenAddress: string;
  name: string;
  symbol: string;
  price: string;
  totalAssets: string;
  targetLiquidity: string;
  underlyingTokenAddress: string;
  underlyingTokenName: string;
  underlyingTokenSymbol: string;
  underlyingTokenDecimals: number;
  cooldownSeconds: number;
  unstakeWindowSeconds: number;
  underlyingIsStataToken: boolean;
  stataTokenData: StataTokenData;
  rewards: Reward[];
}

export interface StataTokenData {
  asset: string;
  assetName: string;
  assetSymbol: string;
  aToken: string;
  aTokenName: string;
  aTokenSymbol: string;
}

export interface Reward {
  rewardAddress: string;
  rewardName: string;
  rewardSymbol: string;
  price: string;
  decimals: number;
  index: string;
  maxEmissionPerSecond: string;
  distributionEnd: string;
  currentEmissionPerSecond: string;
  apy: string;
}

export interface StakeUserData {
  stakeToken: string;
  stakeTokenName: string;
  balances: StakeUserBalances;
  cooldown: StakeUserCooldown;
  rewards: UserRewards[];
}

export interface StakeUserBalances {
  stakeTokenBalance: string;
  stakeTokenRedeemableAmount: string;
  underlyingTokenBalance: string;
  stataTokenAssetBalance: string;
  stataTokenATokenBalance: string;
}

export interface StakeUserCooldown {
  cooldownAmount: string;
  endOfCooldown: number;
  withdrawalWindow: number;
}

export interface UserRewards {
  rewardAddress: string;
  accrued: string;
}

export class StakeDataProviderService {
  private readonly _contract: StakeDataProvider;

  constructor(stakeDataProviderAddress: string, provider: providers.Provider) {
    this._contract = StakeDataProvider__factory.connect(
      stakeDataProviderAddress,
      provider,
    );
  }

  public async getStakeData() {
    const result = await this._contract.getStakeData();
    return result;
  }

  public async getUserStakeData(user: string) {
    const result = await this._contract.getUserStakeData(user);
    return result;
  }

  public async getStakeDataHumanized() {
    const result = await this.getStakeData();
    return result.map<StakeData>(r => ({
      tokenAddress: r.tokenAddress,
      name: r.name,
      symbol: r.symbol,
      price: r.price.toString(),
      totalAssets: r.totalAssets.toString(),
      targetLiquidity: r.targetLiquidity.toString(),
      underlyingTokenAddress: r.underlyingTokenAddress,
      underlyingTokenName: r.underlyingTokenName,
      underlyingTokenSymbol: r.underlyingTokenSymbol,
      underlyingTokenDecimals: r.underlyingTokenDecimals,
      cooldownSeconds: r.cooldownSeconds.toNumber(),
      unstakeWindowSeconds: r.unstakeWindowSeconds.toNumber(),
      underlyingIsStataToken: r.underlyingIsStataToken,
      stataTokenData: {
        asset: r.stataTokenData.asset,
        assetName: r.stataTokenData.assetName,
        assetSymbol: r.stataTokenData.assetSymbol,
        aToken: r.stataTokenData.aToken,
        aTokenName: r.stataTokenData.aTokenName,
        aTokenSymbol: r.stataTokenData.aTokenSymbol,
      },
      rewards: r.rewards.map<Reward>(reward => ({
        rewardAddress: reward.rewardAddress,
        rewardName: reward.rewardName,
        rewardSymbol: reward.rewardSymbol,
        price: reward.price.toString(),
        decimals: reward.decimals,
        index: reward.index.toString(),
        maxEmissionPerSecond: reward.maxEmissionPerSecond.toString(),
        distributionEnd: reward.distributionEnd.toString(),
        currentEmissionPerSecond: reward.currentEmissionPerSecond.toString(),
        apy: reward.apy.toString(),
      })),
    }));
  }

  public async getUserStakeDataHumanized(user: string) {
    const result = await this.getUserStakeData(user);
    return result.map<StakeUserData>(r => ({
      stakeToken: r.stakeToken,
      stakeTokenName: r.stakeTokenName,
      balances: {
        stakeTokenBalance: r.balances.stakeTokenBalance.toString(),
        stakeTokenRedeemableAmount:
          r.balances.stakeTokenRedeemableAmount.toString(),
        underlyingTokenBalance: r.balances.underlyingTokenBalance.toString(),
        stataTokenAssetBalance: r.balances.stataTokenAssetBalance.toString(),
        stataTokenATokenBalance: r.balances.stataTokenATokenBalance.toString(),
      },
      cooldown: {
        cooldownAmount: r.cooldown.cooldownAmount.toString(),
        endOfCooldown: r.cooldown.endOfCooldown,
        withdrawalWindow: r.cooldown.withdrawalWindow,
      },
      rewards: r.rewards.map<UserRewards>((reward, index) => ({
        rewardAddress: reward,
        accrued: r.rewardsAccrued[index].toString(),
      })),
    }));
  }
}

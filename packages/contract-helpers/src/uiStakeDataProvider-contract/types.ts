import { BigNumber } from 'ethers';

export type GeneralStakeUIData = {
  stkAaveData: {
    stakedTokenTotalSupply: BigNumber;
    stakeCooldownSeconds: BigNumber;
    stakeUnstakeWindow: BigNumber;
    rewardTokenPriceEth: BigNumber;
    distributionEnd: BigNumber;
    distributionPerSecond: BigNumber;
    stakedTokenPriceEth: BigNumber;
    stakeApy: BigNumber;
  };
  stkBptData: {
    stakedTokenTotalSupply: BigNumber;
    stakeCooldownSeconds: BigNumber;
    stakeUnstakeWindow: BigNumber;
    rewardTokenPriceEth: BigNumber;
    distributionEnd: BigNumber;
    distributionPerSecond: BigNumber;
    stakedTokenPriceEth: BigNumber;
    stakeApy: BigNumber;
  };
  ethPrice: BigNumber;
};

export type GetUserStakeUIData = {
  stkAaveData: {
    stakedTokenUserBalance: BigNumber;
    underlyingTokenUserBalance: BigNumber;
    stakedTokenRedeemableAmount: BigNumber;
    userCooldownAmount: BigNumber;
    rewardsToClaim: BigNumber;
  };
  stkBptData: {
    stakedTokenUserBalance: BigNumber;
    underlyingTokenUserBalance: BigNumber;
    stakedTokenRedeemableAmount: BigNumber;
    userCooldownAmount: BigNumber;
    rewardsToClaim: BigNumber;
  };
  ethPrice: BigNumber;
};

export type GeneralStakeUIDataHumanized = {
  aave: {
    stakeTokenTotalSupply: string;
    stakeCooldownSeconds: number;
    stakeUnstakeWindow: number;
    stakeTokenPriceEth: string;
    rewardTokenPriceEth: string;
    stakeApy: string;
    distributionPerSecond: string;
    distributionEnd: string;
  };
  bpt: {
    stakeTokenTotalSupply: string;
    stakeCooldownSeconds: number;
    stakeUnstakeWindow: number;
    stakeTokenPriceEth: string;
    rewardTokenPriceEth: string;
    stakeApy: string;
    distributionPerSecond: string;
    distributionEnd: string;
  };
  ethPriceUsd: string;
};

export type GetUserStakeUIDataHumanized = {
  aave: {
    stakeTokenUserBalance: string;
    underlyingTokenUserBalance: string;
    stakeTokenRedeemableAmount: string;
    userCooldown: number;
    userIncentivesToClaim: string;
  };
  bpt: {
    stakeTokenUserBalance: string;
    underlyingTokenUserBalance: string;
    stakeTokenRedeemableAmount: string;
    userCooldown: number;
    userIncentivesToClaim: string;
  };
  ethPriceUsd: string;
};

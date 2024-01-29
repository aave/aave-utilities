import { BigNumber } from 'ethers';

export type StakedTokenData = {
  stakedTokenTotalSupply: BigNumber;
  stakedTokenTotalRedeemableAmount: BigNumber;
  stakeCooldownSeconds: BigNumber;
  stakeUnstakeWindow: BigNumber;
  rewardTokenPriceUsd: BigNumber;
  distributionEnd: BigNumber;
  distributionPerSecond: BigNumber;
  stakedTokenPriceUsd: BigNumber;
  stakeApy: BigNumber;
  inPostSlashingPeriod: boolean;
  maxSlashablePercentage: BigNumber;
};

export type StakedContractUserData = {
  stakedTokenUserBalance: BigNumber;
  underlyingTokenUserBalance: BigNumber;
  stakedTokenRedeemableAmount: BigNumber;
  userCooldownAmount: BigNumber;
  userCooldownTimestamp: number;
  rewardsToClaim: BigNumber;
};

export type StakeUIUserData = {
  stakeTokenUserBalance: string;
  underlyingTokenUserBalance: string;
  stakeTokenRedeemableAmount: string;
  userCooldownAmount: string;
  userCooldownTimestamp: number;
  userIncentivesToClaim: string;
};

export type StakeTokenUIData = {
  inPostSlashingPeriod: boolean;
  stakeTokenTotalSupply: string;
  stakeTokenTotalRedeemableAmount: string;
  stakeCooldownSeconds: number;
  stakeUnstakeWindow: number;
  stakeTokenPriceUSD: string;
  rewardTokenPriceUSD: string;
  stakeApy: string;
  distributionPerSecond: string;
  distributionEnd: string;
  maxSlashablePercentage: string;
};

export type GeneralStakeUIDataHumanized = {
  stakeData: StakeTokenUIData[];
  ethPriceUsd: string;
};

export type GetUserStakeUIDataHumanized = {
  stakeUserData: StakeUIUserData[];
  ethPriceUsd: string;
};

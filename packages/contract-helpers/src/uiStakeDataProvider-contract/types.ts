import { BigNumber } from 'ethers';

export type GeneralStakeUIData = {
  0: {
    stakeTokenTotalSupply: BigNumber;
    stakeCooldownSeconds: BigNumber;
    stakeUnstakeWindow: BigNumber;
    stakeTokenPriceEth: BigNumber;
    rewardTokenPriceEth: BigNumber;
    stakeApy: BigNumber;
    distributionPerSecond: BigNumber;
    distributionEnd: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
    6: BigNumber;
    7: BigNumber;
  };
  1: {
    stakeTokenTotalSupply: BigNumber;
    stakeCooldownSeconds: BigNumber;
    stakeUnstakeWindow: BigNumber;
    stakeTokenPriceEth: BigNumber;
    rewardTokenPriceEth: BigNumber;
    stakeApy: BigNumber;
    distributionPerSecond: BigNumber;
    distributionEnd: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
    6: BigNumber;
    7: BigNumber;
  };
  2: BigNumber;
};

export type GetUserStakeUIData = {
  0: {
    stakeTokenUserBalance: BigNumber;
    underlyingTokenUserBalance: BigNumber;
    userCooldown: BigNumber;
    userIncentivesToClaim: BigNumber;
    userPermitNonce: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
  };
  1: {
    stakeTokenUserBalance: BigNumber;
    underlyingTokenUserBalance: BigNumber;
    userCooldown: BigNumber;
    userIncentivesToClaim: BigNumber;
    userPermitNonce: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
  };
  2: BigNumber;
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
  usdPriceEth: string;
};

export type GetUserStakeUIDataHumanized = {
  aave: {
    stakeTokenUserBalance: string;
    underlyingTokenUserBalance: string;
    userCooldown: number;
    userIncentivesToClaim: string;
    userPermitNonce: string;
  };
  bpt: {
    stakeTokenUserBalance: string;
    underlyingTokenUserBalance: string;
    userCooldown: number;
    userIncentivesToClaim: string;
    userPermitNonce: string;
  };
  usdPriceEth: string;
};

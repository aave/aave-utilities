/* istanbul ignore file */
import { providers } from 'ethers';

import { Abi as IStakedTokenDataProvider, Abi__factory } from './typechain';

import {
  StakedTokenData,
  GeneralStakeUIDataHumanized,
  StakedContractUserData,
  GetUserStakeUIDataHumanized,
} from './types';

type EthAddress = string;

export interface UiStakeDataProviderInterfaceV3 {
  getStakedAssetDataBatch: (
    stakedAssets: EthAddress[],
    oracles: EthAddress[],
  ) => Promise<GeneralStakeUIDataHumanized>;
  getUserStakeUIDataHumanized: (params: {
    user: string;
    stakedAssets: EthAddress[];
    oracles: EthAddress[];
  }) => Promise<GetUserStakeUIDataHumanized>;
}

export type UiStakeDataProviderContext = {
  uiStakeDataProvider: string;
  provider: providers.Provider;
};

export class UiStakeDataProviderV3 implements UiStakeDataProviderInterfaceV3 {
  private readonly _contract: IStakedTokenDataProvider;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = Abi__factory.connect(
      context.uiStakeDataProvider,
      context.provider,
    );
  }

  public async getUserStakeUIDataHumanized({
    user,
    stakedAssets,
    oracles,
  }: {
    user: string;
    stakedAssets: EthAddress[];
    oracles: EthAddress[];
  }): Promise<GetUserStakeUIDataHumanized> {
    const [, stakedUserData] = await this._contract.getStakedUserDataBatch(
      stakedAssets,
      oracles,
      user,
    );

    // // NOTE only fetching eth price here, should we call oracle directly?
    const [, ethPrice] = await this._contract.getStakedAssetDataBatch(
      stakedAssets,
      oracles,
    );

    const parsedUserStakedData = handleUserStakedData(stakedUserData);

    return {
      stakeUserData: parsedUserStakedData,
      ethPriceUsd: ethPrice.toString(),
    };
  }

  public async getStakedAssetDataBatch(
    stakedAssets: EthAddress[],
    oracles: EthAddress[],
  ): Promise<GeneralStakeUIDataHumanized> {
    const [stakedData, ethPrice] = await this._contract.getStakedAssetDataBatch(
      stakedAssets,
      oracles,
    );

    const parsedStakedData = handleParsedStakedData(stakedData);
    return { stakeData: parsedStakedData, ethPriceUsd: ethPrice.toString() };
  }
}

function handleUserStakedData(stakeUserData: StakedContractUserData[]) {
  return stakeUserData.map((data: StakedContractUserData) => {
    return {
      stakeTokenUserBalance: data.stakedTokenUserBalance.toString(),
      underlyingTokenUserBalance: data.underlyingTokenUserBalance.toString(),
      stakeTokenRedeemableAmount: data.stakedTokenRedeemableAmount.toString(),
      userCooldownAmount: data.userCooldownAmount.toString(),
      userCooldownTimestamp: data.userCooldownTimestamp,
      userIncentivesToClaim: data.rewardsToClaim.toString(),
    };
  });
}

function handleParsedStakedData(stakedData: StakedTokenData[]) {
  return stakedData.map((data: StakedTokenData) => {
    return {
      inPostSlashingPeriod: data.inPostSlashingPeriod,
      stakeTokenTotalSupply: data.stakedTokenTotalSupply.toString(),
      stakeTokenTotalRedeemableAmount:
        data.stakedTokenTotalRedeemableAmount.toString(),
      stakeCooldownSeconds: data.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: data.stakeUnstakeWindow.toNumber(),
      stakeTokenPriceEth: data.stakedTokenPriceEth.toString(),
      rewardTokenPriceEth: data.rewardTokenPriceEth.toString(),
      stakeApy: data.stakeApy.toString(),
      distributionPerSecond: data.distributionPerSecond.toString(),
      distributionEnd: data.distributionEnd.toString(),
    };
  });
}

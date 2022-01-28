import { providers } from 'ethers';
import { StackeUiDataProviderValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { StakeUiHelperFactory } from './typechain/StakeUiHelperFactory';
import { StakeUiHelperI } from './typechain/StakeUiHelperI';
import {
  GeneralStakeUIData,
  GeneralStakeUIDataHumanized,
  GetUserStakeUIData,
  GetUserStakeUIDataHumanized,
} from './types';

export * from './types';

export interface UiStakeDataProviderInterface {
  getUserStakeUIData: (params: { user: string }) => Promise<GetUserStakeUIData>;
  getGeneralStakeUIData: () => Promise<GeneralStakeUIData>;
  getUserStakeUIDataHumanized: (params: {
    user: string;
  }) => Promise<GetUserStakeUIDataHumanized>;
  getGeneralStakeUIDataHumanized: () => Promise<GeneralStakeUIDataHumanized>;
}

export type UiStakeDataProviderContext = {
  uiStakeDataProvider: string;
  provider: providers.Provider;
};

export class UiStakeDataProvider implements UiStakeDataProviderInterface {
  private readonly _contract: StakeUiHelperI;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = StakeUiHelperFactory.connect(
      context.uiStakeDataProvider,
      context.provider,
    );
  }

  @StackeUiDataProviderValidator
  public async getUserStakeUIData(
    @isEthAddress('user') { user }: { user: string },
  ): Promise<GetUserStakeUIData> {
    return this._contract.getUserStakeUIData(user);
  }

  @StackeUiDataProviderValidator
  public async getUserStakeUIDataHumanized(
    @isEthAddress('user') { user }: { user: string },
  ): Promise<GetUserStakeUIDataHumanized> {
    const {
      0: aave,
      1: bpt,
      2: usdPriceEth,
    } = await this.getUserStakeUIData({ user });

    return {
      aave: {
        stakeTokenUserBalance: aave.stakeTokenUserBalance.toString(),
        underlyingTokenUserBalance: aave.underlyingTokenUserBalance.toString(),
        userCooldown: aave.userCooldown.toNumber(),
        userIncentivesToClaim: aave.userIncentivesToClaim.toString(),
        userPermitNonce: aave.userPermitNonce.toString(),
      },
      bpt: {
        stakeTokenUserBalance: bpt.stakeTokenUserBalance.toString(),
        underlyingTokenUserBalance: bpt.underlyingTokenUserBalance.toString(),
        userCooldown: bpt.userCooldown.toNumber(),
        userIncentivesToClaim: bpt.userIncentivesToClaim.toString(),
        userPermitNonce: bpt.userPermitNonce.toString(),
      },
      usdPriceEth: usdPriceEth.toString(),
    };
  }

  public async getGeneralStakeUIData(): Promise<GeneralStakeUIData> {
    return this._contract.getGeneralStakeUIData();
  }

  public async getGeneralStakeUIDataHumanized(): Promise<GeneralStakeUIDataHumanized> {
    const {
      0: aave,
      1: bpt,
      2: usdPriceEth,
    } = await this.getGeneralStakeUIData();

    return {
      aave: {
        stakeTokenTotalSupply: aave.stakeTokenTotalSupply.toString(),
        stakeCooldownSeconds: aave.stakeCooldownSeconds.toNumber(),
        stakeUnstakeWindow: aave.stakeUnstakeWindow.toNumber(),
        stakeTokenPriceEth: aave.stakeTokenPriceEth.toString(),
        rewardTokenPriceEth: aave.rewardTokenPriceEth.toString(),
        stakeApy: aave.stakeApy.toString(),
        distributionPerSecond: aave.distributionPerSecond.toString(),
        distributionEnd: aave.distributionEnd.toString(),
      },
      bpt: {
        stakeTokenTotalSupply: bpt.stakeTokenTotalSupply.toString(),
        stakeCooldownSeconds: bpt.stakeCooldownSeconds.toNumber(),
        stakeUnstakeWindow: bpt.stakeUnstakeWindow.toNumber(),
        stakeTokenPriceEth: bpt.stakeTokenPriceEth.toString(),
        rewardTokenPriceEth: bpt.rewardTokenPriceEth.toString(),
        stakeApy: bpt.stakeApy.toString(),
        distributionPerSecond: bpt.distributionPerSecond.toString(),
        distributionEnd: bpt.distributionEnd.toString(),
      },
      usdPriceEth: usdPriceEth.toString(),
    };
  }
}

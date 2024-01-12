import { providers } from 'ethers';
import { StakeUiDataProviderValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { StakedTokenDataProvider } from './typechain/StakedTokenDataProvider';
import { StakedTokenDataProvider__factory } from './typechain/StakedTokenDataProviderFactory';
import {
  GeneralStakeUIData,
  GeneralStakeUIDataHumanized,
  GetUserStakeUIData,
  GetUserStakeUIDataHumanized,
} from './types';

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
  private readonly _contract: StakedTokenDataProvider;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = StakedTokenDataProvider__factory.connect(
      context.uiStakeDataProvider,
      context.provider,
    );
  }

  @StakeUiDataProviderValidator
  public async getUserStakeUIData(
    @isEthAddress('user') { user }: { user: string },
  ): Promise<GetUserStakeUIData> {
    const {
      stkAaveData,
      stkAaveUserData,
      stkBptData,
      stkBptUserData,
      ethPrice,
    } = await this._contract.getAllStakedTokenUserData(user);

    return {
      stkAaveData: {
        ...stkAaveData,
        stakedTokenUserBalance: stkAaveUserData.stakedTokenUserBalance,
        underlyingTokenUserBalance: stkAaveUserData.underlyingTokenUserBalance,
        stakedTokenRedeemableAmount:
          stkAaveUserData.stakedTokenRedeemableAmount,
        userCooldownAmount: stkAaveUserData.userCooldownAmount,
        userCooldownTimestamp: stkAaveUserData.userCooldownTimestamp,
        rewardsToClaim: stkAaveUserData.rewardsToClaim,
      },
      stkBptData: {
        ...stkBptData,
        stakedTokenUserBalance: stkBptUserData.stakedTokenUserBalance,
        underlyingTokenUserBalance: stkBptUserData.underlyingTokenUserBalance,
        stakedTokenRedeemableAmount: stkBptUserData.stakedTokenRedeemableAmount,
        userCooldownAmount: stkBptUserData.userCooldownAmount,
        userCooldownTimestamp: stkBptUserData.userCooldownTimestamp,
        rewardsToClaim: stkBptUserData.rewardsToClaim,
      },
      ethPrice,
    };
  }

  @StakeUiDataProviderValidator
  public async getUserStakeUIDataHumanized(
    @isEthAddress('user') { user }: { user: string },
  ): Promise<GetUserStakeUIDataHumanized> {
    const contractResult = await this.getUserStakeUIData({ user });

    return {
      aave: {
        stakeTokenUserBalance:
          contractResult.stkAaveData.stakedTokenUserBalance.toString(),
        underlyingTokenUserBalance:
          contractResult.stkAaveData.underlyingTokenUserBalance.toString(),
        stakeTokenRedeemableAmount:
          contractResult.stkAaveData.stakedTokenRedeemableAmount.toString(),
        userCooldownAmount:
          contractResult.stkAaveData.userCooldownAmount.toString(),
        userCooldownTimestamp: contractResult.stkAaveData.userCooldownTimestamp,
        userIncentivesToClaim:
          contractResult.stkAaveData.rewardsToClaim.toString(),
      },
      bpt: {
        stakeTokenUserBalance:
          contractResult.stkBptData.stakedTokenUserBalance.toString(),
        underlyingTokenUserBalance:
          contractResult.stkBptData.underlyingTokenUserBalance.toString(),
        stakeTokenRedeemableAmount:
          contractResult.stkBptData.stakedTokenRedeemableAmount.toString(),
        userCooldownAmount:
          contractResult.stkBptData.userCooldownAmount.toString(),
        userCooldownTimestamp: contractResult.stkBptData.userCooldownTimestamp,
        userIncentivesToClaim:
          contractResult.stkBptData.rewardsToClaim.toString(),
      },
      ethPriceUsd: contractResult.ethPrice.toString(),
    };
  }

  public async getGeneralStakeUIData(): Promise<GeneralStakeUIData> {
    const { stkAaveData, stkBptData, ethPrice } =
      await this._contract.getAllStakedTokenData();

    return {
      stkAaveData,
      stkBptData,
      ethPrice,
    };
  }

  public async getGeneralStakeUIDataHumanized(): Promise<GeneralStakeUIDataHumanized> {
    const contractResult = await this.getGeneralStakeUIData();

    return {
      aave: {
        stakeTokenTotalSupply:
          contractResult.stkAaveData.stakedTokenTotalSupply.toString(),
        stakeTokenTotalRedeemableAmount:
          contractResult.stkAaveData.stakedTokenTotalRedeemableAmount.toString(),
        stakeCooldownSeconds:
          contractResult.stkAaveData.stakeCooldownSeconds.toNumber(),
        stakeUnstakeWindow:
          contractResult.stkAaveData.stakeUnstakeWindow.toNumber(),
        stakeTokenPriceEth:
          contractResult.stkAaveData.stakedTokenPriceEth.toString(),
        rewardTokenPriceEth:
          contractResult.stkAaveData.rewardTokenPriceEth.toString(),
        stakeApy: contractResult.stkAaveData.stakeApy.toString(),
        distributionPerSecond:
          contractResult.stkAaveData.distributionPerSecond.toString(),
        distributionEnd: contractResult.stkAaveData.distributionEnd.toString(),
      },
      bpt: {
        stakeTokenTotalSupply:
          contractResult.stkBptData.stakedTokenTotalSupply.toString(),
        stakeTokenTotalRedeemableAmount:
          contractResult.stkAaveData.stakedTokenTotalRedeemableAmount.toString(),
        stakeCooldownSeconds:
          contractResult.stkBptData.stakeCooldownSeconds.toNumber(),
        stakeUnstakeWindow:
          contractResult.stkBptData.stakeUnstakeWindow.toNumber(),
        stakeTokenPriceEth:
          contractResult.stkBptData.stakedTokenPriceEth.toString(),
        rewardTokenPriceEth:
          contractResult.stkBptData.rewardTokenPriceEth.toString(),
        stakeApy: contractResult.stkBptData.stakeApy.toString(),
        distributionPerSecond:
          contractResult.stkBptData.distributionPerSecond.toString(),
        distributionEnd: contractResult.stkBptData.distributionEnd.toString(),
      },
      ethPriceUsd: contractResult.ethPrice.toString(),
    };
  }
}

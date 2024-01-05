import { providers } from 'ethers';
// import { StakeUiDataProviderValidator } from '../commons/validators/methodValidators';
// import { isEthAddress } from '../commons/validators/paramValidators';
import {
  Abi as IStakedTokenDataProvider,
  Abi__factory as StakedTokenDataProvider__factory,
} from './typechain';
import {
  StakedTokenData,
  HumanizedStakeResponse,
  // GeneralStakeUIData,
  // GeneralStakeUIDataHumanized,
  // GetUserStakeUIData,
  // GetUserStakeUIDataHumanized,
} from './types';

type EthAddress = string;

export interface UiStakeDataProviderInterface {
  // getUserStakeUIData: (params: { user: string }) => Promise<GetUserStakeUIData>;
  getGeneralStakeUIData: (
    stakedAssets: EthAddress[],
    priceFeeds: EthAddress[],
  ) => Promise<HumanizedStakeResponse>;
  // getUserStakeUIDataHumanized: (params: {
  //   user: string;
  // }) => Promise<GetUserStakeUIDataHumanized>;
  // getGeneralStakeUIDataHumanized: () => Promise<GeneralStakeUIDataHumanized>;
}

export type UiStakeDataProviderContext = {
  uiStakeDataProvider: string;
  provider: providers.Provider;
};

export class UiStakeDataProviderV3 implements UiStakeDataProviderInterface {
  private readonly _contract: IStakedTokenDataProvider;

  public constructor(context: UiStakeDataProviderContext) {
    this._contract = StakedTokenDataProvider__factory.connect(
      context.uiStakeDataProvider,
      context.provider,
    );
  }

  // @StakeUiDataProviderValidator
  // public async getUserStakeUIData(
  //   stakedTokens: EthAddress[],
  //   oracleAddresses: EthAddress[],
  //   @isEthAddress('user') { user }: { user: string },
  // ): Promise<GetUserStakeUIData> {
  //   const {
  //     stkAaveData,
  //     stkAaveUserData,
  //     stkBptData,
  //     stkBptUserData,
  //     ethPrice,
  //   } = await this._contract.getStakedUserDataBatch(
  //     stakedTokens,
  //     oracleAddresses,
  //     user,
  //   );
  //   // TODO do we need the ETH price? add to contract if necessary

  //   return {
  //     stkAaveData: {
  //       ...stkAaveData,
  //       stakedTokenUserBalance: stkAaveUserData.stakedTokenUserBalance,
  //       underlyingTokenUserBalance: stkAaveUserData.underlyingTokenUserBalance,
  //       stakedTokenRedeemableAmount:
  //         stkAaveUserData.stakedTokenRedeemableAmount,
  //       userCooldownAmount: stkAaveUserData.userCooldownAmount,
  //       userCooldownTimestamp: stkAaveUserData.userCooldownTimestamp,
  //       rewardsToClaim: stkAaveUserData.rewardsToClaim,
  //     },
  //     stkBptData: {
  //       ...stkBptData,
  //       stakedTokenUserBalance: stkBptUserData.stakedTokenUserBalance,
  //       underlyingTokenUserBalance: stkBptUserData.underlyingTokenUserBalance,
  //       stakedTokenRedeemableAmount: stkBptUserData.stakedTokenRedeemableAmount,
  //       userCooldownAmount: stkBptUserData.userCooldownAmount,
  //       userCooldownTimestamp: stkBptUserData.userCooldownTimestamp,
  //       rewardsToClaim: stkBptUserData.rewardsToClaim,
  //     },
  //     stkGho: {
  //       ...stkAaveData,
  //       stakedTokenUserBalance: stkAaveUserData.stakedTokenUserBalance,
  //       underlyingTokenUserBalance: stkAaveUserData.underlyingTokenUserBalance,
  //       stakedTokenRedeemableAmount:
  //         stkAaveUserData.stakedTokenRedeemableAmount,
  //       userCooldownAmount: stkAaveUserData.userCooldownAmount,
  //       userCooldownTimestamp: stkAaveUserData.userCooldownTimestamp,
  //       rewardsToClaim: stkAaveUserData.rewardsToClaim,
  //     },
  //     ethPrice,
  //   };
  // }

  // @StakeUiDataProviderValidator
  // public async getUserStakeUIDataHumanized(
  //   @isEthAddress('user') { user }: { user: string },
  // ): Promise<GetUserStakeUIDataHumanized> {
  //   const contractResult = await this.getUserStakeUIData({ user });

  //   return {
  //     aave: {
  //       stakeTokenUserBalance:
  //         contractResult.stkAaveData.stakedTokenUserBalance.toString(),
  //       underlyingTokenUserBalance:
  //         contractResult.stkAaveData.underlyingTokenUserBalance.toString(),
  //       stakeTokenRedeemableAmount:
  //         contractResult.stkAaveData.stakedTokenRedeemableAmount.toString(),
  //       userCooldownAmount:
  //         contractResult.stkAaveData.userCooldownAmount.toString(),
  //       userCooldownTimestamp: contractResult.stkAaveData.userCooldownTimestamp,
  //       userIncentivesToClaim:
  //         contractResult.stkAaveData.rewardsToClaim.toString(),
  //     },
  //     bpt: {
  //       stakeTokenUserBalance:
  //         contractResult.stkBptData.stakedTokenUserBalance.toString(),
  //       underlyingTokenUserBalance:
  //         contractResult.stkBptData.underlyingTokenUserBalance.toString(),
  //       stakeTokenRedeemableAmount:
  //         contractResult.stkBptData.stakedTokenRedeemableAmount.toString(),
  //       userCooldownAmount:
  //         contractResult.stkBptData.userCooldownAmount.toString(),
  //       userCooldownTimestamp: contractResult.stkBptData.userCooldownTimestamp,
  //       userIncentivesToClaim:
  //         contractResult.stkBptData.rewardsToClaim.toString(),
  //     },
  //     gho: {
  //       stakeTokenUserBalance:
  //         contractResult.stkAaveData.stakedTokenUserBalance.toString(),
  //       underlyingTokenUserBalance:
  //         contractResult.stkAaveData.underlyingTokenUserBalance.toString(),
  //       stakeTokenRedeemableAmount:
  //         contractResult.stkAaveData.stakedTokenRedeemableAmount.toString(),
  //       userCooldownAmount:
  //         contractResult.stkAaveData.userCooldownAmount.toString(),
  //       userCooldownTimestamp: contractResult.stkAaveData.userCooldownTimestamp,
  //       userIncentivesToClaim:
  //         contractResult.stkAaveData.rewardsToClaim.toString(),
  //     },
  //     ethPriceUsd: contractResult.ethPrice.toString(),
  //   };
  // }

  public async getGeneralStakeUIData(
    stakedAssets: EthAddress[],
    priceFeeds: EthAddress[],
  ): Promise<HumanizedStakeResponse> {
    const [stakedData, ,] =
      // add ethPrice back in
      await this._contract.getStakedAssetDataBatch(stakedAssets, priceFeeds);

    const parsedStakedData = handleParsedStakedData(stakedData);

    return {
      // @ts-expect-error for now need to fix type
      parsedStakedData,
      parsedPrices: [],
      ethPriceUsd: '123', //  ethPrice.toString(),
    };
  }

  // public async getGeneralStakeUIDataHumanized(
  //   stakedAssets: EthAddress[],
  //   priceFeeds: EthAddress[],
  // ): Promise<GeneralStakeUIDataHumanized> {
  //   const stakedData = await this.getGeneralStakeUIData(
  //     stakedAssets,
  //     priceFeeds,
  //   );

  //   const parsedStakedData = handleParsedStakedData(stakedData);

  //   return parsedStakedData;

  //   // return {
  //   //   aave: {
  //   //     stakeTokenTotalSupply:
  //   //       contractResult.stkAaveData.stakedTokenTotalSupply.toString(),
  //   //     stakeTokenTotalRedeemableAmount:
  //   //       contractResult.stkAaveData.stakedTokenTotalRedeemableAmount.toString(),
  //   //     stakeCooldownSeconds:
  //   //       contractResult.stkAaveData.stakeCooldownSeconds.toNumber(),
  //   //     stakeUnstakeWindow:
  //   //       contractResult.stkAaveData.stakeUnstakeWindow.toNumber(),
  //   //     stakeTokenPriceEth:
  //   //       contractResult.stkAaveData.stakedTokenPriceEth.toString(),
  //   //     rewardTokenPriceEth:
  //   //       contractResult.stkAaveData.rewardTokenPriceEth.toString(),
  //   //     stakeApy: contractResult.stkAaveData.stakeApy.toString(),
  //   //     distributionPerSecond:
  //   //       contractResult.stkAaveData.distributionPerSecond.toString(),
  //   //     distributionEnd: contractResult.stkAaveData.distributionEnd.toString(),
  //   //   },
  //   //   bpt: {
  //   //     stakeTokenTotalSupply:
  //   //       contractResult.stkBptData.stakedTokenTotalSupply.toString(),
  //   //     stakeTokenTotalRedeemableAmount:
  //   //       contractResult.stkAaveData.stakedTokenTotalRedeemableAmount.toString(),
  //   //     stakeCooldownSeconds:
  //   //       contractResult.stkBptData.stakeCooldownSeconds.toNumber(),
  //   //     stakeUnstakeWindow:
  //   //       contractResult.stkBptData.stakeUnstakeWindow.toNumber(),
  //   //     stakeTokenPriceEth:
  //   //       contractResult.stkBptData.stakedTokenPriceEth.toString(),
  //   //     rewardTokenPriceEth:
  //   //       contractResult.stkBptData.rewardTokenPriceEth.toString(),
  //   //     stakeApy: contractResult.stkBptData.stakeApy.toString(),
  //   //     distributionPerSecond:
  //   //       contractResult.stkBptData.distributionPerSecond.toString(),
  //   //     distributionEnd: contractResult.stkBptData.distributionEnd.toString(),
  //   //   },
  //   //   gho: {
  //   //     stakeTokenTotalSupply:
  //   //       contractResult.stkGho.stakedTokenTotalSupply.toString(),
  //   //     stakeTokenTotalRedeemableAmount:
  //   //       contractResult.stkGho.stakedTokenTotalRedeemableAmount.toString(),
  //   //     stakeCooldownSeconds:
  //   //       contractResult.stkGho.stakeCooldownSeconds.toNumber(),
  //   //     stakeUnstakeWindow: contractResult.stkGho.stakeUnstakeWindow.toNumber(),
  //   //     stakeTokenPriceEth:
  //   //       contractResult.stkGho.stakedTokenPriceEth.toString(),
  //   //     rewardTokenPriceEth:
  //   //       contractResult.stkGho.rewardTokenPriceEth.toString(),
  //   //     stakeApy: contractResult.stkGho.stakeApy.toString(),
  //   //     distributionPerSecond:
  //   //       contractResult.stkGho.distributionPerSecond.toString(),
  //   //     distributionEnd: contractResult.stkGho.distributionEnd.toString(),
  //   //   },
  //   //   ethPriceUsd: contractResult.ethPrice.toString(),
  //   // };
  // }
}
function handleParsedStakedData(stakedData: StakedTokenData[]) {
  return stakedData.map((data: StakedTokenData) => {
    return {
      // foo: 'bar',
      inPostSlashingPeriod: data.inPostSlashingPeriod,
      stakedTokenTotalSupply: data.stakedTokenTotalSupply.toString(),
      stakedTokenTotalRedeemableAmount:
        data.stakedTokenTotalRedeemableAmount.toString(),
      stakeCooldownSeconds: data.stakeCooldownSeconds.toNumber(),
      stakeUnstakeWindow: data.stakeUnstakeWindow.toNumber(),
      stakedTokenPriceEth: data.stakedTokenPriceEth.toString(),
      rewardTokenPriceEth: data.rewardTokenPriceEth.toString(),
      stakeApy: data.stakeApy.toString(),
      distributionPerSecond: data.distributionPerSecond.toString(),
      distributionEnd: data.distributionEnd.toString(),
    };
  });
}

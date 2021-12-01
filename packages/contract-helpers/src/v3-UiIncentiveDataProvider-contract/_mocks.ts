import { BigNumber } from 'ethers';
import { ReservesIncentiveData, UserReservesIncentivesData } from './types';

export const getReservesIncentivesDataMock: ReservesIncentiveData[] = [
  {
    underlyingAsset: '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367',
    aIncentiveData: {
      tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      rewardsTokenInformation: [
        {
          rewardTokenSymbol: 'REW',
          rewardTokenAddress: '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
          rewardOracleAddress: '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
          emissionPerSecond: BigNumber.from({
            _hex: '0x04464ecbc45ffe',
            _isBigNumber: true,
          }),
          incentivesLastUpdateTimestamp: BigNumber.from({
            _hex: '0x61a5167a',
            _isBigNumber: true,
          }),
          tokenIncentivesIndex: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          emissionEndTimestamp: BigNumber.from({
            _hex: '0x638649fa',
            _isBigNumber: true,
          }),
          rewardPriceFeed: BigNumber.from({
            _hex: '0x05f5e100',
            _isBigNumber: true,
          }),
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeedDecimals: 0,
        },
      ],
    },
    vIncentiveData: {
      tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      rewardsTokenInformation: [
        {
          rewardTokenSymbol: 'REW',
          rewardTokenAddress: '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
          rewardOracleAddress: '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
          emissionPerSecond: BigNumber.from({
            _hex: '0x04464ecbc45ffe',
            _isBigNumber: true,
          }),
          incentivesLastUpdateTimestamp: BigNumber.from({
            _hex: '0x61a5167a',
            _isBigNumber: true,
          }),
          tokenIncentivesIndex: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          emissionEndTimestamp: BigNumber.from({
            _hex: '0x638649fa',
            _isBigNumber: true,
          }),
          rewardPriceFeed: BigNumber.from({
            _hex: '0x05f5e100',
            _isBigNumber: true,
          }),
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeedDecimals: 0,
        },
      ],
    },
    sIncentiveData: {
      tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      rewardsTokenInformation: [
        {
          rewardTokenSymbol: 'REW',
          rewardTokenAddress: '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
          rewardOracleAddress: '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
          emissionPerSecond: BigNumber.from({
            _hex: '0x04464ecbc45ffe',
            _isBigNumber: true,
          }),
          incentivesLastUpdateTimestamp: BigNumber.from({
            _hex: '0x61a5167a',
            _isBigNumber: true,
          }),
          tokenIncentivesIndex: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          emissionEndTimestamp: BigNumber.from({
            _hex: '0x638649fa',
            _isBigNumber: true,
          }),
          rewardPriceFeed: BigNumber.from({
            _hex: '0x05f5e100',
            _isBigNumber: true,
          }),
          rewardTokenDecimals: 18,
          precision: 18,
          priceFeedDecimals: 0,
        },
      ],
    },
  },
];

export const getUserIncentivesDataMock: UserReservesIncentivesData[] = [
  {
    underlyingAsset: '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367',
    aTokenIncentivesUserData: {
      tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      userRewardsInformation: [
        {
          rewardTokenSymbol: 'REW',
          rewardOracleAddress: '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
          rewardTokenAddress: '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
          userUnclaimedRewards: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          tokenIncentivesUserIndex: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          rewardPriceFeed: BigNumber.from({
            _hex: '0x05f5e100',
            _isBigNumber: true,
          }),
          priceFeedDecimals: 0,
          rewardTokenDecimals: 18,
        },
      ],
    },
    vTokenIncentivesUserData: {
      tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      userRewardsInformation: [
        {
          rewardTokenSymbol: 'REW',
          rewardOracleAddress: '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
          rewardTokenAddress: '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
          userUnclaimedRewards: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          tokenIncentivesUserIndex: BigNumber.from({
            _hex: '0x00',
            _isBigNumber: true,
          }),
          rewardPriceFeed: BigNumber.from({
            _hex: '0x05f5e100',
            _isBigNumber: true,
          }),
          priceFeedDecimals: 0,
          rewardTokenDecimals: 18,
        },
      ],
    },
    sTokenIncentivesUserData: {
      tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
      incentiveControllerAddress: '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
      userRewardsInformation: [],
    },
  },
];

import { BigNumber, providers } from 'ethers';
import {
  RewardStruct,
  StakeDataStruct,
  StakeUserDataStruct,
  StataTokenDataStruct,
} from './typechain/StakeDataProvider';
import { StakeDataProviderService } from './index';

const mockStataTokenData: StataTokenDataStruct = {
  asset: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  assetName: 'Mock Stata Token Asset',
  assetSymbol: 'MSTAT',
  aToken: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  aTokenName: 'Mock Stata Token AToken',
  aTokenSymbol: 'MSTATA',
};

const mockRewardData: RewardStruct = {
  rewardAddress: '0xfeabcdefabcdefabcdefabcdefabcdefabcdef',
  rewardName: 'Mock Reward Token',
  rewardSymbol: 'MRT',
  price: BigNumber.from('1000000'),
  decimals: 18,
  index: BigNumber.from('1000000000000000000'),
  maxEmissionPerSecond: BigNumber.from('500000000000000'),
  distributionEnd: BigNumber.from('1800000000'),
  currentEmissionPerSecond: BigNumber.from('250000000000000'),
  apy: BigNumber.from('500000000000000000'),
};

const mockStakeData: StakeDataStruct = {
  tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
  name: 'Mock Staking Token',
  symbol: 'MST',
  price: BigNumber.from('1000000000000000000'),
  totalAssets: BigNumber.from('1000000000000000000000000'),
  targetLiquidity: BigNumber.from('2000000000000000000000000'),
  underlyingTokenAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  underlyingTokenName: 'Mock Underlying Token',
  underlyingTokenSymbol: 'MUT',
  underlyingTokenDecimals: 18,
  cooldownSeconds: BigNumber.from('86400'),
  unstakeWindowSeconds: BigNumber.from('43200'),
  underlyingIsStataToken: false,
  stataTokenData: mockStataTokenData,
  rewards: [mockRewardData],
};

export const mockStakeUserData: StakeUserDataStruct = {
  stakeToken: '0x1234567890abcdef1234567890abcdef12345678',
  stakeTokenName: 'Mock Staking Token',
  balances: {
    stakeTokenBalance: BigNumber.from('500000000000000000000'),
    stakeTokenRedeemableAmount: BigNumber.from('200000000000000000000'),
    underlyingTokenBalance: BigNumber.from('100000000000000000000'),
    stataTokenAssetBalance: BigNumber.from('150000000000000000000'),
    stataTokenATokenBalance: BigNumber.from('50000000000000000000'),
  },
  cooldown: {
    cooldownAmount: BigNumber.from('250000000000000000000'),
    endOfCooldown: 1739822860,
    withdrawalWindow: 7200,
  },
  rewards: [
    '0xfeabcdefabcdefabcdefabcdefabcdefabcdef',
    '0xcaabcdefabcdefabcdefabcdefabcdefabcdef',
  ],
  rewardsAccrued: [
    BigNumber.from('3000000000000000000'),
    BigNumber.from('5000000000000000000'),
  ],
};

describe('Umbrella StakeDataProvider', () => {
  const mockAddress = '0x88757f2f99175387ab4c6a4b3067c77a695b0349';

  const createService = () => {
    const service = new StakeDataProviderService(
      mockAddress,
      new providers.JsonRpcProvider(),
    );

    const mockGetStakeData = jest.fn();
    const mockGetUserStakeData = jest.fn();

    mockGetStakeData.mockResolvedValue([mockStakeData]);
    mockGetUserStakeData.mockResolvedValue([mockStakeUserData]);

    // @ts-expect-error readonly
    service._contract = {
      getStakeData: mockGetStakeData,
      getUserStakeData: mockGetUserStakeData,
    };

    return service;
  };

  it('should be defined', () => {
    const service = createService();
    expect(service).toBeDefined();
  });

  it('should fetch stake data', async () => {
    const service = createService();
    const result = await service.getStakeData();
    expect(result).toEqual([mockStakeData]);
  });

  it('should fetch user stake data', async () => {
    const service = createService();
    const result = await service.getUserStakeData(mockAddress);
    expect(result).toEqual([mockStakeUserData]);
  });

  it('should fetch stake data humanized', async () => {
    const service = createService();
    const result = await service.getStakeDataHumanized();
    expect(result[0]).toEqual({
      ...mockStakeData,
      totalAssets: '1000000000000000000000000',
      price: '1000000000000000000',
      targetLiquidity: '2000000000000000000000000',
      cooldownSeconds: 86400,
      unstakeWindowSeconds: 43200,
      rewards: [
        {
          ...mockRewardData,
          price: '1000000',
          currentEmissionPerSecond: '250000000000000',
          apy: '500000000000000000',
          distributionEnd: '1800000000',
          index: '1000000000000000000',
          maxEmissionPerSecond: '500000000000000',
        },
      ],
    });
  });

  it('should fetch user stake data humanized', async () => {
    const service = createService();
    const result = await service.getUserStakeDataHumanized(mockAddress);
    expect(result[0]).toEqual({
      stakeToken: mockStakeUserData.stakeToken,
      stakeTokenName: mockStakeUserData.stakeTokenName,
      balances: {
        stakeTokenBalance: '500000000000000000000',
        stakeTokenRedeemableAmount: '200000000000000000000',
        underlyingTokenBalance: '100000000000000000000',
        stataTokenAssetBalance: '150000000000000000000',
        stataTokenATokenBalance: '50000000000000000000',
      },
      cooldown: {
        cooldownAmount: '250000000000000000000',
        endOfCooldown: 1739822860,
        withdrawalWindow: 7200,
      },
      rewards: [
        {
          accrued: '3000000000000000000',
          rewardAddress: '0xfeabcdefabcdefabcdefabcdefabcdefabcdef',
        },
        {
          accrued: '5000000000000000000',
          rewardAddress: '0xcaabcdefabcdefabcdefabcdefabcdefabcdef',
        },
      ],
    });
  });
});

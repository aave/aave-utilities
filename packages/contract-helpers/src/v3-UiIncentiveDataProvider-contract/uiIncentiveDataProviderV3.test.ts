import { BigNumber, providers } from 'ethers';
import { ChainlinkFeedsRegistry } from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import {
  getReservesIncentivesDataMock,
  getUserIncentivesDataMock,
} from './_mocks';
import { IUiIncentiveDataProviderV3 } from './typechain/IUiIncentiveDataProviderV3';
import { IUiIncentiveDataProviderV3__factory } from './typechain/IUiIncentiveDataProviderV3__factory';
import { UiIncentiveDataProvider } from './index';

jest.mock('../cl-feed-registry/index', () => {
  const clInstance = { getPriceFeed: jest.fn() };
  const cl = jest.fn(() => clInstance);
  return { ChainlinkFeedsRegistry: cl };
});

describe('UiIncentiveDataProvider', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  const user = '0x0000000000000000000000000000000000000001';
  const lendingPoolAddressProvider =
    '0x0000000000000000000000000000000000000002';
  const uiIncentiveDataProviderAddress =
    '0x0000000000000000000000000000000000000003';

  describe('creating', () => {
    it('Expects to initialize', () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress,
        provider: new providers.JsonRpcProvider(),
        chainId: 137,
      });
      expect(instance instanceof UiIncentiveDataProvider).toEqual(true);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getFullReservesIncentiveData', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getFullReservesIncentiveData({
          user,
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const user = 'asdf';
      await expect(async () =>
        instance.getFullReservesIncentiveData({
          user,
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getFullReservesIncentiveData({
          user,
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrowError(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('should not throw if user and lending pool address provider is a valid ethereum address', async () => {
      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getFullReservesIncentiveData: async () => Promise.resolve({}),
        } as unknown as IUiIncentiveDataProviderV3);
      await instance.getFullReservesIncentiveData({
        user,
        lendingPoolAddressProvider,
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getReservesIncentivesData', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getReservesIncentivesData({ lendingPoolAddressProvider }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getReservesIncentivesData({ lendingPoolAddressProvider }),
      ).rejects.toThrow(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('should not throw', async () => {
      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      await instance.getReservesIncentivesData({ lendingPoolAddressProvider });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getUserReserves', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getUserReservesIncentivesData({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('should throw if lending pool address provider is not a valid ethereum address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getUserReservesIncentivesData({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrow(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const user = 'asdf';
      await expect(async () =>
        instance.getUserReservesIncentivesData({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrow(`Address: ${user} is not a valid ethereum Address`);
    });
    it('should not throw if user is a valid ethereum address', async () => {
      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getUserReservesIncentivesData: async () =>
            Promise.resolve(getUserIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      await instance.getUserReservesIncentivesData({
        lendingPoolAddressProvider,
        user,
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getReservesIncentivesDataHumanized', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('Expects to fail if lendingPoolAddressProvider not an eth address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrow(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('Expects to parse the incentives response to a human readable object', async () => {
      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const data = await instance.getReservesIncentivesDataHumanized({
        lendingPoolAddressProvider,
      });
      expect(spy).toHaveBeenCalled();
      expect(data).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
  });

  describe('getUserReservesIncentivesDataHumanized', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getUserReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('Expects to fail if lendingPoolAddressProvider not an eth address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getUserReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrow(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail if user not an eth address', async () => {
      const user = 'asdf';
      await expect(async () =>
        instance.getUserReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
          user,
        }),
      ).rejects.toThrow(`Address: ${user} is not a valid ethereum Address`);
    });
    it('should work with finding only', async () => {
      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getUserReservesIncentivesData: async () =>
            Promise.resolve(getUserIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const response = await instance.getUserReservesIncentivesDataHumanized({
        lendingPoolAddressProvider,
        user,
      });
      expect(spy).toHaveBeenCalled();
      expect(response).toEqual([
        {
          id: '137-0x0000000000000000000000000000000000000001-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aTokenIncentivesUserData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            userRewardsInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                userUnclaimedRewards: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                tokenIncentivesUserIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                priceFeedDecimals: 0,
                rewardTokenDecimals: 18,
              },
            ],
          },
          vTokenIncentivesUserData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            userRewardsInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                userUnclaimedRewards: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                tokenIncentivesUserIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                priceFeedDecimals: 0,
                rewardTokenDecimals: 18,
              },
            ],
          },
          sTokenIncentivesUserData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            userRewardsInformation: [],
          },
        },
      ]);
    });
  });

  describe('getIncentivesDataWithPrice', () => {
    const instance = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: 137,
    });
    const chainlinkFeedsRegistry = '0x0000000000000000000000000000000000000004';

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
        chainId: 137,
      });
      await expect(async () =>
        instance.getIncentivesDataWithPriceLegacy({
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrowError(
        'UiIncentiveDataProviderAddress must be an eth valid address',
      );
    });
    it('Expects to fail if lendingPoolAddressProvider not an eth address', async () => {
      const lendingPoolAddressProvider = 'asdf';
      await expect(async () =>
        instance.getIncentivesDataWithPriceLegacy({
          lendingPoolAddressProvider,
        }),
      ).rejects.toThrow(
        `Address: ${lendingPoolAddressProvider} is not a valid ethereum Address`,
      );
    });
    it('should work with no feed', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry,
        provider,
      });

      jest.mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());

      const spy = jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);

      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.eth,
      });

      expect(spy).toBeCalled();
      expect(clInstance.getPriceFeed).toBeCalled();
      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
    it('should work with one feed', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry,
        provider,
      });

      jest
        .mocked(clInstance)
        .getPriceFeed.mockReturnValueOnce(Promise.reject());

      jest.mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);

      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.eth,
      });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
    it('should work with all feeds', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry,
        provider: new providers.JsonRpcProvider(),
      });

      jest.mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);

      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.eth,
      });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
        },
      ]);
    });
    it('should work with all feeds and no quote', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry,
        provider: new providers.JsonRpcProvider(),
      });

      jest.mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );
      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
      });

      expect(clInstance.getPriceFeed).toBeCalled();

      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: '2',
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 1,
              },
            ],
          },
        },
      ]);
    });
    it('should work with no feed twice', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry,
        provider: new providers.JsonRpcProvider(),
      });

      jest.mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());
      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.eth,
      });
      const result2 = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.eth,
      });

      expect(clInstance.getPriceFeed).toBeCalled();

      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
      expect(result2).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
    it('should work with chainlinkRegistry address incorrect', async () => {
      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        chainlinkFeedsRegistry,
        quote: Denominations.usd,
      });

      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
    it('should work with no chainlinkRegistry address no quote ', async () => {
      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
      });

      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
    it('should work with no chainlinkregistry address and quote ', async () => {
      jest
        .spyOn(IUiIncentiveDataProviderV3__factory, 'connect')
        .mockReturnValue({
          getReservesIncentivesData: async () =>
            Promise.resolve(getReservesIncentivesDataMock),
        } as unknown as IUiIncentiveDataProviderV3);
      const result = await instance.getIncentivesDataWithPriceLegacy({
        lendingPoolAddressProvider,
        quote: Denominations.usd,
      });

      expect(result).toEqual([
        {
          id: '137-0xb04aaa2a73ff3d88950bdf19eb4ac029630a2367-0x0000000000000000000000000000000000000002',
          underlyingAsset:
            '0xb04Aaa2A73ff3D88950BdF19Eb4AC029630a2367'.toLowerCase(),
          aIncentiveData: {
            tokenAddress: '0x6d0eeb7b37BF26E182EB9a8631DCF79e4EF43DDd',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          vIncentiveData: {
            tokenAddress: '0xaD99ef885623E8520f631625b2675d6dAd3aaDC1',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
          sIncentiveData: {
            tokenAddress: '0xb2007801F8c9dB4241E12C81E9d83741d14d7227',
            incentiveControllerAddress:
              '0x5465485D7b15CaBc9196E73A0b1cc457262079e3',
            rewardsTokenInformation: [
              {
                rewardTokenSymbol: 'REW',
                rewardTokenAddress:
                  '0x1f689325CBdF44B24DBE2ecC2b1fFD4130861b4E',
                rewardOracleAddress:
                  '0xca8e9B5F9e36EbF74096223fc48810861b4FA642',
                emissionPerSecond: BigNumber.from({
                  _hex: '0x04464ecbc45ffe',
                  _isBigNumber: true,
                }).toString(),
                incentivesLastUpdateTimestamp: BigNumber.from({
                  _hex: '0x61a5167a',
                  _isBigNumber: true,
                }).toNumber(),
                tokenIncentivesIndex: BigNumber.from({
                  _hex: '0x00',
                  _isBigNumber: true,
                }).toString(),
                emissionEndTimestamp: BigNumber.from({
                  _hex: '0x638649fa',
                  _isBigNumber: true,
                }).toNumber(),
                rewardPriceFeed: BigNumber.from({
                  _hex: '0x05f5e100',
                  _isBigNumber: true,
                }).toString(),
                rewardTokenDecimals: 18,
                precision: 18,
                priceFeedDecimals: 0,
              },
            ],
          },
        },
      ]);
    });
  });
});

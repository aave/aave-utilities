import { providers } from 'ethers';
// import { mocked } from 'ts-jest/utils';
// import { ChainlinkFeedsRegistry } from '../cl-feed-registry/index';
// import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
// import {
//   getReservesIncentivesDataMock,
//   getUserIncentivesDataMock,
// } from './_mocks';
import { UiIncentiveDataProvider } from './index';
import { IUiIncentiveDataProviderV3 } from './typechain/IUiIncentiveDataProviderV3';
import { IUiIncentiveDataProviderV3__factory } from './typechain/IUiIncentiveDataProviderV3__factory';

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
    });
    it('should throw if uiIncentiveDataProvider is not a valid ethereum address', async () => {
      const instance = new UiIncentiveDataProvider({
        uiIncentiveDataProviderAddress: 'asdf',
        provider,
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

  // describe('getReservesIncentivesData - to get 100% in coverage :( pointless test', () => {
  //   it('should throw if lending pool address is not a valid ethereum address', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getReservesIncentivesData(mockInvalidEthereumAddress),
  //     ).rejects.toThrow('Lending pool address provider is not valid');
  //   });
  //   it('should not throw', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getReservesIncentivesData(mockValidEthereumAddress),
  //     ).resolves.not.toThrow();
  //   });
  // });

  // describe('getReservesIncentivesDataHumanized', () => {
  //   it('Should throw error if token address is wrong', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
  //     ).rejects.toThrow('Lending pool address provider is not valid');
  //   });
  // });

  // describe('getUserReservesIncentivesDataHumanized', () => {
  //   it('Should throw error if token address is wrong', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getUserReservesIncentivesDataHumanized(
  //         mockInvalidEthereumAddress,
  //         mockInvalidEthereumAddress,
  //       ),
  //     ).rejects.toThrow('Lending pool address provider is not valid');
  //   });
  //   it('should work with finding only', async () => {
  //     const instance = createValidInstance();
  //     const response = await instance.getUserReservesIncentivesDataHumanized(
  //       mockValidEthereumAddress,
  //       mockValidEthereumAddress,
  //     );

  //     expect(response).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aTokenIncentivesUserData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           tokenIncentivesUserIndex: '43565143328112327495233486',
  //           userUnclaimedRewards: '1637573428',
  //         },
  //         vTokenIncentivesUserData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           tokenIncentivesUserIndex: '43565143328112327495233486',
  //           userUnclaimedRewards: '1637573428',
  //         },
  //         sTokenIncentivesUserData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           tokenIncentivesUserIndex: '43565143328112327495233486',
  //           userUnclaimedRewards: '1637573428',
  //         },
  //       },
  //     ]);
  //   });
  // });

  // describe('getIncentivesDataWithPrice', () => {
  //   it('Should throw error if token address is wrong', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
  //     ).rejects.toThrow('Lending pool address provider is not valid');
  //   });
  //   it('should work with one feed', async () => {
  //     const clInstance = new ChainlinkFeedsRegistry({
  //       chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       provider: new providers.JsonRpcProvider(),
  //     });
  //     const instance = createValidInstance();

  //     mocked(clInstance).getPriceFeed.mockReturnValueOnce(Promise.reject());

  //     mocked(clInstance).getPriceFeed.mockReturnValue(
  //       Promise.resolve({
  //         answer: '2',
  //         updatedAt: 4,
  //         decimals: 1,
  //       }),
  //     );

  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //         quote: Denominations.eth,
  //       });

  //     expect(clInstance.getPriceFeed).toBeCalled();
  //     expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
  //       typeof 1,
  //     );
  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with all feeds', async () => {
  //     const clInstance = new ChainlinkFeedsRegistry({
  //       chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       provider: new providers.JsonRpcProvider(),
  //     });
  //     const instance = createValidInstance();

  //     mocked(clInstance).getPriceFeed.mockReturnValue(
  //       Promise.resolve({
  //         answer: '2',
  //         updatedAt: 4,
  //         decimals: 1,
  //       }),
  //     );

  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //         quote: Denominations.eth,
  //       });

  //     expect(clInstance.getPriceFeed).toBeCalled();
  //     expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
  //       typeof 1,
  //     );
  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with all feeds and no quote', async () => {
  //     const clInstance = new ChainlinkFeedsRegistry({
  //       chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       provider: new providers.JsonRpcProvider(),
  //     });
  //     const instance = createValidInstance();

  //     mocked(clInstance).getPriceFeed.mockReturnValue(
  //       Promise.resolve({
  //         answer: '2',
  //         updatedAt: 4,
  //         decimals: 1,
  //       }),
  //     );

  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       });

  //     expect(clInstance.getPriceFeed).toBeCalled();
  //     expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
  //       typeof 1,
  //     );
  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '2',
  //           priceFeedTimestamp: 4,
  //           priceFeedDecimals: 1,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with no feed', async () => {
  //     const clInstance = new ChainlinkFeedsRegistry({
  //       chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       provider: new providers.JsonRpcProvider(),
  //     });
  //     const instance = createValidInstance();

  //     mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());

  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //         quote: Denominations.eth,
  //       });

  //     expect(clInstance.getPriceFeed).toBeCalled();
  //     expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
  //       typeof 1,
  //     );
  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with no feed twice', async () => {
  //     const clInstance = new ChainlinkFeedsRegistry({
  //       chainlinkFeedsRegistry: mockValidEthereumAddress,
  //       provider: new providers.JsonRpcProvider(),
  //     });
  //     const instance = createValidInstance();

  //     mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());

  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //         quote: Denominations.eth,
  //       });
  //     const result2: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockValidEthereumAddress,
  //         quote: Denominations.eth,
  //       });

  //     expect(clInstance.getPriceFeed).toBeCalled();
  //     expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
  //       typeof 1,
  //     );
  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //     expect(result2).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with chainlinkRegistry address incorrect', async () => {
  //     const instance = createValidInstance();
  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         chainlinkFeedsRegistry: mockInvalidEthereumAddress,
  //         quote: Denominations.usd,
  //       });

  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with no chainlinkRegistry address no quote ', async () => {
  //     const instance = createValidInstance();
  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //       });

  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //   });
  //   it('should work with no chainlinkregistry address and quote ', async () => {
  //     const instance = createValidInstance();
  //     const result: ReserveIncentiveWithFeedsResponse[] =
  //       await instance.getIncentivesDataWithPrice({
  //         lendingPoolAddressProvider: mockValidEthereumAddress,
  //         quote: Denominations.usd,
  //       });

  //     expect(result).toEqual([
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //       {
  //         underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //         aIncentiveData: {
  //           tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '43565143328112327495233486',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         vIncentiveData: {
  //           tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
  //           precision: 18,
  //           rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
  //           incentiveControllerAddress:
  //             '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  //           rewardTokenDecimals: 18,
  //           emissionPerSecond: '1880787037037037',
  //           incentivesLastUpdateTimestamp: 1633175478,
  //           tokenIncentivesIndex: '57970476598005880594044681',
  //           emissionEndTimestamp: 1637573428,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //         sIncentiveData: {
  //           tokenAddress: '0x0000000000000000000000000000000000000000',
  //           precision: 0,
  //           rewardTokenAddress: '0x0000000000000000000000000000000000000000',
  //           incentiveControllerAddress:
  //             '0x0000000000000000000000000000000000000000',
  //           rewardTokenDecimals: 0,
  //           emissionPerSecond: '0',
  //           incentivesLastUpdateTimestamp: 0,
  //           tokenIncentivesIndex: '0',
  //           emissionEndTimestamp: 0,
  //           priceFeed: '0',
  //           priceFeedTimestamp: 0,
  //           priceFeedDecimals: 0,
  //         },
  //       },
  //     ]);
  //   });
  // });

  // describe('getUserReserves', () => {
  //   it('should throw if lending pool address is not a valid ethereum address', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getUserReservesIncentivesData(
  //         mockValidEthereumAddress,
  //         mockInvalidEthereumAddress,
  //       ),
  //     ).rejects.toThrow('Lending pool address provider is not valid');
  //   });
  //   it('should throw if user is not a valid ethereum address', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getUserReservesIncentivesData(
  //         mockInvalidEthereumAddress,
  //         mockValidEthereumAddress,
  //       ),
  //     ).rejects.toThrow('User address is not a valid ethereum address');
  //   });

  //   it('should not throw if user is a valid ethereum address', async () => {
  //     const instance = createValidInstance();
  //     await expect(
  //       instance.getUserReservesIncentivesData(
  //         mockValidEthereumAddress,
  //         mockValidEthereumAddress,
  //       ),
  //     ).resolves.not.toThrow();
  //   });
  // });
});

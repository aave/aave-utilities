import { BigNumber, providers } from 'ethers';
import { mocked } from 'ts-jest/utils';
import { IncentivesController } from '..';
import { ChainlinkFeedsRegistry } from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import {
  getReservesIncentivesDataMock,
  getUserIncentivesDataMock,
} from './_mocks';
import { ReserveIncentiveWithFeedsResponse } from './types/UiIncentiveDataProviderTypes';
import { UiIncentiveDataProvider } from './index';

jest.mock('../cl-feed-registry/index', () => {
  const clInstance = { getPriceFeed: jest.fn() };
  const cl = jest.fn(() => clInstance);
  return { ChainlinkFeedsRegistry: cl };
});

jest.mock('../incentive-controller', () => {
  const icInstance = {
    getAssetData: jest.fn().mockReturnValue({
      0: BigNumber.from('1'),
      1: BigNumber.from('2'),
      2: BigNumber.from('3'),
    }),
    getDistributionEnd: jest.fn().mockReturnValue(BigNumber.from('1')),
  };
  const ic = jest.fn(() => icInstance);
  return { IncentivesController: ic };
});

describe('UiIncentiveDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiIncentiveDataProvider({
      incentiveDataProviderAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    const mockGetReservesIncentivesData = jest.fn();
    const mockGetUserIncentivesData = jest.fn();

    mockGetReservesIncentivesData.mockResolvedValue(
      getReservesIncentivesDataMock,
    );

    mockGetUserIncentivesData.mockResolvedValue(getUserIncentivesDataMock);

    // @ts-expect-error readonly
    instance._contract = {
      getFullReservesIncentiveData: jest.fn(),
      getReservesIncentivesData: mockGetReservesIncentivesData,
      getUserReservesIncentivesData: mockGetUserIncentivesData,
    };

    return instance;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider({
            incentiveDataProviderAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });

    // it('should throw an error if the lendingPoolAddress is not valid', () => {
    //   expect(
    //     () =>
    //       new UiIncentiveDataProvider({
    //         incentiveDataProviderAddress: mockValidEthereumAddress,
    //         provider: new providers.JsonRpcProvider(),
    //       }),
    //   ).toThrowError('Lending pool address is not valid');
    // });
  });

  describe('getFullReservesIncentiveData', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });

    it('should not throw if user and lending pool address provider is a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
    });
  });

  describe('getReservesIncentivesData - to get 100% in coverage :( pointless test', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesData(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesData(mockValidEthereumAddress),
      ).resolves.not.toThrow();
    });
  });

  describe('getReservesIncentivesDataHumanized', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
  });

  describe('getUserReservesIncentivesDataHumanized', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesDataHumanized(
          mockInvalidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should work with finding only', async () => {
      const instance = createValidInstance();
      const response = await instance.getUserReservesIncentivesDataHumanized(
        mockValidEthereumAddress,
        mockValidEthereumAddress,
      );

      expect(response).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
          vTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
          sTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
        },
      ]);
    });
  });

  describe('getIncentivesDataWithPrice', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should work with one feed', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(clInstance).getPriceFeed.mockReturnValueOnce(Promise.reject());

      mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
      ]);
    });
    it('should work with all feeds', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
      ]);
    });
    it('should work with all feeds and no quote', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
      ]);
    });
    it('should work with no feed', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
    });
    it('should work with no feed twice', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(clInstance).getPriceFeed.mockReturnValue(Promise.reject());

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });
      const result2: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
      expect(result2).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
    });
    it('should work with chainlinkRegistry address incorrect', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockInvalidEthereumAddress,
          quote: Denominations.usd,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
    });
    it('should work with no chainlinkRegistry address no quote ', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
    });
    it('should work with no chainlinkregistry address and quote ', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const icInstance = new IncentivesController(
        new providers.JsonRpcProvider(),
      );
      const instance = createValidInstance();

      mocked(icInstance).getAssetData.mockReturnValueOnce(Promise.reject());

      mocked(clInstance).getPriceFeed.mockReturnValueOnce(Promise.reject());

      mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          chainlinkFeedsRegistry: mockValidEthereumAddress,
          quote: Denominations.eth,
        });

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            precision: 18,
            rewardTokenDecimals: 18,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,

            emissionEndTimestamp: 1,
            emissionPerSecond: '2',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            incentivesLastUpdateTimestamp: 3,

            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',

            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            tokenIncentivesIndex: '1',
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
          },
        },
      ]);
    });
    it('should work even if fei calls fail', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          quote: Denominations.usd,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
        {
          underlyingAsset: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
          aIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          vIncentiveData: {
            tokenAddress: '0xC2e10006AccAb7B45D9184FcF5b7EC7763f5BaAe',
            precision: 18,
            rewardTokenAddress: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
            incentiveControllerAddress:
              '0xDee5c1662bBfF8f80f7c572D8091BF251b3B0dAB',
            rewardTokenDecimals: 18,
            emissionPerSecond: '2',
            incentivesLastUpdateTimestamp: 3,
            tokenIncentivesIndex: '1',
            emissionEndTimestamp: 1,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
          sIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedTimestamp: 0,
            priceFeedDecimals: 0,
          },
        },
      ]);
    });
  });

  describe('getUserReserves', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
    });
  });
});

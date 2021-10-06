import { providers } from 'ethers';
import { mocked } from 'ts-jest/utils';
import { ChainlinkFeedsRegistry } from '../cl-feed-registry/index';
import { Denominations } from '../cl-feed-registry/types/ChainlinkFeedsRegistryTypes';
import { getReservesIncentivesDataMock } from './_mocks';
import { ReserveIncentiveWithFeedsResponse } from './types/UiIncentiveDataProviderTypes';
import { UiIncentiveDataProvider } from './index';

jest.mock('../cl-feed-registry/index', () => {
  const clInstance = { getPriceFeed: jest.fn() };
  const cl = jest.fn(() => clInstance);
  return { ChainlinkFeedsRegistry: cl };
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

    // TODO: more reasonable mock so we can do more reasonable tests
    mockGetReservesIncentivesData.mockResolvedValue(
      getReservesIncentivesDataMock,
    );

    // @ts-ignore
    instance._contract = {
      getFullReservesIncentiveData: jest.fn(),
      getReservesIncentivesData: mockGetReservesIncentivesData,
      getUserReservesIncentivesData: jest.fn(),
    };

    return instance;
  };

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
      let errored = false;
      try {
        await instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        );
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
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
      let errored = false;
      try {
        await instance.getReservesIncentivesData(mockValidEthereumAddress);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
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
  });

  describe('getIncentivesDataWithPrice', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should not throw', async () => {
      const clInstance = new ChainlinkFeedsRegistry({
        chainlinkFeedsRegistry: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      // eslint-disable-next-line @typescript-eslint/require-await
      mocked(clInstance).getPriceFeed.mockReturnValueOnce(Promise.reject());
      // eslint-disable-next-line @typescript-eslint/require-await
      mocked(clInstance).getPriceFeed.mockReturnValue(
        Promise.resolve({
          answer: '2',
          updatedAt: 4,
          decimals: 1,
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] = await instance.getIncentivesDataWithPrice(
        mockValidEthereumAddress,
        mockValidEthereumAddress,
        Denominations.eth,
      );

      expect(clInstance.getPriceFeed).toBeCalled();
      expect(typeof result[0].aIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
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
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
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
            priceFeed: '2',
            priceFeedTimestamp: 4,
            priceFeedDecimals: 1,
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
      let errored = false;
      try {
        await instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        );
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});

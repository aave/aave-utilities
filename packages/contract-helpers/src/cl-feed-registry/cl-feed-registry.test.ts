import { BigNumber, providers } from 'ethers';
import { ChainlinkFeedsRegistry, Denominations } from './index';

const mockInvalidEthereumAddress = '0x0';
const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

describe('ChainlinkFeedsRegistry', () => {
  describe('initialize', () => {
    it('Should throw error if contract address is wrong', async () => {
      expect(
        () =>
          new ChainlinkFeedsRegistry({
            provider: new providers.JsonRpcProvider(),
            chainlinkFeedsRegistry: mockInvalidEthereumAddress,
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should get instantiated correctly', () => {
      const registry = new ChainlinkFeedsRegistry({
        provider: new providers.JsonRpcProvider(),
        chainlinkFeedsRegistry: mockValidEthereumAddress,
      });
      expect(registry instanceof ChainlinkFeedsRegistry).toEqual(true);
    });
  });

  describe('decimals', () => {
    const registry = new ChainlinkFeedsRegistry({
      provider: new providers.JsonRpcProvider(),
      chainlinkFeedsRegistry: mockValidEthereumAddress,
    });

    // @ts-expect-error readonly
    registry._registryContract = {
      decimals: jest.fn().mockImplementation(() => 1),
    };

    it('Should throw error if token address is wrong', async () => {
      await expect(
        registry.decimals(mockInvalidEthereumAddress, Denominations.eth),
      ).rejects.toThrow('tokenAddress is not valid');
    });
    it('Should get the decimals', async () => {
      const decimals = await registry.decimals(
        mockValidEthereumAddress,
        Denominations.eth,
      );

      expect(decimals).toEqual(1);
    });
  });
  describe('latestRoundData', () => {
    const registry = new ChainlinkFeedsRegistry({
      provider: new providers.JsonRpcProvider(),
      chainlinkFeedsRegistry: mockValidEthereumAddress,
    });
    // @ts-expect-error readonly
    registry._registryContract = {
      latestRoundData: jest.fn().mockImplementation(() => ({
        0: BigNumber.from(1),
        1: BigNumber.from(1),
        2: BigNumber.from(1),
        3: BigNumber.from(1),
        4: BigNumber.from(1),
      })),
    };
    it('Should throw error if token address is wrong', async () => {
      await expect(
        registry.latestRoundData(mockInvalidEthereumAddress, Denominations.eth),
      ).rejects.toThrow('tokenAddress is not valid');
    });
    it('Should get the decimals', async () => {
      const latestAnswer = await registry.latestRoundData(
        mockValidEthereumAddress,
        Denominations.eth,
      );

      expect(latestAnswer).toEqual({
        0: BigNumber.from(1),
        1: BigNumber.from(1),
        2: BigNumber.from(1),
        3: BigNumber.from(1),
        4: BigNumber.from(1),
      });
    });
  });
  describe('getPriceFeed', () => {
    const registry = new ChainlinkFeedsRegistry({
      provider: new providers.JsonRpcProvider(),
      chainlinkFeedsRegistry: mockValidEthereumAddress,
    });
    // @ts-expect-error readonly
    registry._registryContract = {
      decimals: jest.fn().mockImplementation(() => 1),
      latestRoundData: jest.fn().mockImplementation(() => ({
        0: BigNumber.from(1),
        1: BigNumber.from(2),
        2: BigNumber.from(3),
        3: BigNumber.from(4),
        4: BigNumber.from(5),
      })),
    };
    it('Should throw error if token address is wrong', async () => {
      await expect(
        registry.getPriceFeed(mockInvalidEthereumAddress, Denominations.eth),
      ).rejects.toThrow('tokenAddress is not valid');
    });
    it('Should get the decimals', async () => {
      const priceFeed = await registry.getPriceFeed(
        mockValidEthereumAddress,
        Denominations.eth,
      );

      expect(priceFeed).toEqual({
        answer: '2',
        updatedAt: 4,
        decimals: 1,
      });
    });
  });
});

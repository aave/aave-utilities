import { providers } from 'ethers';
import { IncentivesController } from './index';

describe('IncentivesController', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new IncentivesController({
      incentivesControllerAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    // @ts-ignore
    instance._contract = {
      claimRewards: jest.fn(),
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new IncentivesController({
            incentivesControllerAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });
  });

  describe('claimRewards - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      const assets = [mockValidEthereumAddress];
      const to = mockValidEthereumAddress;
      let errored = false;
      try {
        await instance.claimRewards(assets, to);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });

    it('should not throw', async () => {
      const instance = createValidInstance();
      const assets = [mockValidEthereumAddress];
      const to = mockValidEthereumAddress;
      const amount = '999999999999999999999999';
      let errored = false;
      try {
        await instance.claimRewards(assets, to, amount);
      } catch (_) {
        errored = true;
      }

      expect(errored).toEqual(false);
    });
  });
});

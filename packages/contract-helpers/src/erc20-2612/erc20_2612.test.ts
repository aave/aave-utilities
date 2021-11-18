import { BigNumber, providers } from 'ethers';
import { IERC202612 } from './typechain/IERC202612';
import { IERC202612__factory } from './typechain/IERC202612__factory';
import { ERC20_2612Interface, ERC20_2612Service } from './index';

describe('ERC20_2612', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  describe('Initialize', () => {
    it('Expects to be initialized correctly', () => {
      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      expect(instance instanceof ERC20_2612Service).toEqual(true);
    });
  });
  describe('getNonce', () => {
    const token = '0x0000000000000000000000000000000000000001';
    const owner = '0x0000000000000000000000000000000000000002';

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to get Nonce from nonces method', async () => {
      const nonceSpy = jest
        .spyOn(IERC202612__factory, 'connect')
        .mockReturnValue({
          nonces: async () => Promise.resolve(BigNumber.from('1')),
        } as unknown as IERC202612);

      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      const nonce = await instance.getNonce({ token, owner });
      expect(nonce).toEqual(1);
      expect(nonceSpy).toHaveBeenCalled();
    });
    it('Expects to get nonce from _nonces method if nonces fails', async () => {
      const nonceSpy = jest
        .spyOn(IERC202612__factory, 'connect')
        .mockReturnValue({
          nonces: async () => Promise.reject(),
          _nonces: async () => Promise.resolve(BigNumber.from('1')),
        } as unknown as IERC202612);

      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      const nonce = await instance.getNonce({ token, owner });
      expect(nonce).toEqual(1);
      expect(nonceSpy).toHaveBeenCalledTimes(1);
    });
    it('Expects to get null nonce if nonces and _nonces fails', async () => {
      const nonceSpy = jest
        .spyOn(IERC202612__factory, 'connect')
        .mockReturnValue({
          nonces: async () => Promise.reject(),
          _nonces: async () => Promise.reject(),
        } as unknown as IERC202612);

      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      const nonce = await instance.getNonce({ token, owner });
      expect(nonce).toEqual(null);
      expect(nonceSpy).toHaveBeenCalledTimes(1);
    });
    it('Expects to fail if token is not eth address', async () => {
      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      const token = 'asdf';
      await expect(async () =>
        instance.getNonce({ token, owner }),
      ).rejects.toThrowError(
        new Error(`Address: ${token} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail if owner is not eth address', async () => {
      const instance: ERC20_2612Interface = new ERC20_2612Service(provider);
      const owner = 'asdf';
      await expect(async () =>
        instance.getNonce({ token, owner }),
      ).rejects.toThrowError(
        new Error(`Address: ${owner} is not a valid ethereum Address`),
      );
    });
  });
});

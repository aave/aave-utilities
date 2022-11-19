import { BigNumber, constants, providers } from 'ethers';
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

  describe('signERC20Approval', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const spender = '0x0000000000000000000000000000000000000008';
    const amount = '123456000000000000000000';
    const decimals = 18;
    const deadline = Math.round(Date.now() / 1000 + 3600).toString();
    jest.spyOn(provider, 'getTransactionCount').mockResolvedValue(1);
    jest.spyOn(provider, 'getNetwork').mockResolvedValue({
      name: 'mainnet',
      chainId: 1,
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the permission string to be returned when all params', async () => {
      const instance = new ERC20_2612Service(provider);

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));

      jest.spyOn(instance, 'getNonce').mockReturnValue(Promise.resolve(1));
      const signature: string = await instance.signERC20Approval({
        owner: user,
        token: reserve,
        spender,
        amount,
        deadline,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { primaryType, domain, message } = await JSON.parse(signature);
      expect(primaryType).toEqual('Permit');
      expect(domain.name).toEqual('mockToken');
      expect(domain.chainId).toEqual(1);

      expect(message.owner).toEqual(user);
      expect(message.spender).toEqual(spender);
      expect(message.value).toEqual(amount);
      expect(message.nonce).toEqual(1);
      expect(message.deadline).toEqual(deadline);
    });
    it('Expects the permission string to be returned when all params and amount -1', async () => {
      const instance = new ERC20_2612Service(provider);

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));

      jest.spyOn(instance, 'getNonce').mockReturnValue(Promise.resolve(1));

      const amount = '-1';
      const signature: string = await instance.signERC20Approval({
        owner: user,
        token: reserve,
        spender,
        amount,
        deadline,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { primaryType, domain, message } = await JSON.parse(signature);
      expect(primaryType).toEqual('Permit');
      expect(domain.name).toEqual('mockToken');
      expect(domain.chainId).toEqual(1);

      expect(message.owner).toEqual(user);
      expect(message.spender).toEqual(spender);
      expect(message.value).toEqual(constants.MaxUint256.toString());
      expect(message.nonce).toEqual(1);
      expect(message.deadline).toEqual(deadline);
    });
    it('Expects the permission string to be `` when no nonce', async () => {
      const instance = new ERC20_2612Service(provider);

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(false));
      jest.spyOn(instance, 'getNonce').mockReturnValue(Promise.resolve(null));

      const signature: string = await instance.signERC20Approval({
        owner: user,
        token: reserve,
        spender,
        amount,
        deadline,
      });

      expect(signature).toEqual('');
    });
    it('Expects the permission string to be `` when already approved', async () => {
      const instance = new ERC20_2612Service(provider);

      jest.spyOn(instance.erc20Service, 'getTokenData').mockReturnValue(
        Promise.resolve({
          name: 'mockToken',
          decimals,
          symbol: 'MT',
          address: '0x0000000000000000000000000000000000000006',
        }),
      );

      jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockReturnValue(Promise.resolve(true));

      const signature: string = await instance.signERC20Approval({
        owner: user,
        token: reserve,
        spender,
        amount,
        deadline,
      });

      expect(signature).toEqual('');
    });
    it('Expects to fail when user not eth address', async () => {
      const instance = new ERC20_2612Service(provider);

      const user = 'asdf';
      await expect(async () =>
        instance.signERC20Approval({
          owner: user,
          token: reserve,
          spender,
          amount,
          deadline,
        }),
      ).rejects.toThrowError(
        `Address: ${user} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when reserve not eth address', async () => {
      const instance = new ERC20_2612Service(provider);

      const reserve = 'asdf';
      await expect(async () =>
        instance.signERC20Approval({
          owner: user,
          token: reserve,
          spender,
          amount,
          deadline,
        }),
      ).rejects.toThrowError(
        `Address: ${reserve} is not a valid ethereum Address`,
      );
    });
    it('Expects to fail when amount not positive', async () => {
      const instance = new ERC20_2612Service(provider);

      const amount = '0';
      await expect(async () =>
        instance.signERC20Approval({
          owner: user,
          token: reserve,
          spender,
          amount,
          deadline,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
    it('Expects to fail when amount not number', async () => {
      const instance = new ERC20_2612Service(provider);

      const amount = 'asdf';
      await expect(async () =>
        instance.signERC20Approval({
          owner: user,
          token: reserve,
          spender,
          amount,
          deadline,
        }),
      ).rejects.toThrowError(`Amount: ${amount} needs to be greater than 0`);
    });
  });
});

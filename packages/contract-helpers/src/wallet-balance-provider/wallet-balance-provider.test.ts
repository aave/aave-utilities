import { providers } from 'ethers';
import { WalletBalanceProvider } from './index';

describe('WalletBalanceProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new WalletBalanceProvider({
      walletBalanceProviderAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    // @ts-expect-error readonly
    instance._contract = {
      balanceOf: jest.fn(),
      batchBalanceOf: jest.fn(),
      getUserWalletBalances: jest.fn(),
    };

    return instance;
  };

  describe('balanceOf', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.balanceOf(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw if token is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.balanceOf(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Token address is not a valid ethereum address');
    });

    it('should not throw if user and token are a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.balanceOf(mockValidEthereumAddress, mockValidEthereumAddress),
      ).resolves.not.toThrow();
    });
  });

  describe('batchBalanceOf', () => {
    it('should throw if one of the user addresses is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.batchBalanceOf(
          [mockInvalidEthereumAddress, mockValidEthereumAddress],
          [mockValidEthereumAddress],
        ),
      ).rejects.toThrow(
        'One of the user address is not a valid ethereum address',
      );
    });

    it('should throw if one of the token addresses is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.batchBalanceOf(
          [mockValidEthereumAddress],
          [mockInvalidEthereumAddress, mockValidEthereumAddress],
        ),
      ).rejects.toThrow(
        'One of the token address is not a valid ethereum address',
      );
    });

    it('should not throw if users and tokens are a all valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.batchBalanceOf(
          [mockValidEthereumAddress],
          [mockValidEthereumAddress],
        ),
      ).resolves.not.toThrow();
    });
  });

  describe('getUserWalletBalancesForLendingPoolProvider', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserWalletBalancesForLendingPoolProvider(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw if lendingPoolAddressProvider is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserWalletBalancesForLendingPoolProvider(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow(
        'Lending pool address provider is not a valid ethereum address',
      );
    });

    it('should not throw if user and lendingPoolAddressProvider are a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserWalletBalancesForLendingPoolProvider(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
    });
  });
});

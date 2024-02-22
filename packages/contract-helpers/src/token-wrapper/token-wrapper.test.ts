import { providers } from 'ethers';
import { TokenWrapperService } from './index';

describe('SavingsDaiTokenWrapperService', () => {
  const tokenWrapperAddress = '0x0000000000000000000000000000000000000001';
  const provider = new providers.JsonRpcProvider();
  describe('Initialization', () => {
    it('should initialize SavingsDaiTokenWrapperService', () => {
      expect(
        () => new TokenWrapperService(provider, tokenWrapperAddress),
      ).not.toThrow();
    });
    it('generates supply token tx', () => {
      const onBehalfOf = '0x0000000000000000000000000000000000000004';
      const tokenWrapperService = new TokenWrapperService(
        provider,
        tokenWrapperAddress,
      );
      const tx = tokenWrapperService.supplyToken(
        '10000000000000000000',
        onBehalfOf,
        '0',
      );
      expect(tx.to).toEqual(tokenWrapperAddress);
      expect(tx.from).toEqual(onBehalfOf);
      expect(tx.data).toEqual(
        '0x1461e2160000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000',
      );
    });
    it('generates supply with permit tx', () => {
      const onBehalfOf = '0x0000000000000000000000000000000000000004';
      const tokenWrapperService = new TokenWrapperService(
        provider,
        tokenWrapperAddress,
      );
      const tx = tokenWrapperService.supplyTokenWithPermit({
        amount: '10000000000000000000',
        onBehalfOf,
        referralCode: '0',
        deadline: '10000',
        signature:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      });
      expect(tx.to).toEqual(tokenWrapperAddress);
      expect(tx.from).toEqual(onBehalfOf);
      expect(tx.data).toEqual(
        '0x4f4663a10000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000001c532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );
    });
    it('generates withdraw token tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const tokenWrapperService = new TokenWrapperService(
        provider,
        tokenWrapperAddress,
      );
      const tx = tokenWrapperService.withdrawToken(
        '10000000000000000000',
        user,
      );
      expect(tx.to).toEqual(tokenWrapperAddress);
      expect(tx.from).toEqual(user);
      expect(tx.data).toEqual(
        '0xbe4b17720000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000000000000000000004',
      );
    });
    it('generates withdraw token with permit tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const tokenWrapperService = new TokenWrapperService(
        provider,
        tokenWrapperAddress,
      );
      const tx = tokenWrapperService.withdrawTokenWithPermit(
        '10000000000000000000',
        user,
        '10000',
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      );
      expect(tx.to).toEqual(tokenWrapperAddress);
      expect(tx.from).toEqual(user);
      expect(tx.data).toEqual(
        '0xe94875ca0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000001c532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );
    });
  });
  describe('get token preview', () => {
    it('should not throw for token in', async () => {
      const service = new TokenWrapperService(provider, tokenWrapperAddress);
      await expect(
        service.getTokenInForTokenOut('10000000000000000000'),
      ).rejects.toThrow();
    });
    it('should not throw for token out', async () => {
      const service = new TokenWrapperService(provider, tokenWrapperAddress);
      await expect(
        service.getTokenOutForTokenIn('10000000000000000000'),
      ).rejects.toThrow();
    });
  });
});

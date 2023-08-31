import { providers } from 'ethers';
import { SavingsDaiTokenWrapperService } from './index';

describe('SavingsDaiTokenWrapperService', () => {
  const savingsDaiTokenWrapperAddress =
    '0x0000000000000000000000000000000000000001';
  const provider = new providers.JsonRpcProvider();
  describe('Initialization', () => {
    it('should initialize SavingsDaiTokenWrapperService', () => {
      expect(
        () =>
          new SavingsDaiTokenWrapperService(
            provider,
            savingsDaiTokenWrapperAddress,
          ),
      ).not.toThrow();
    });
    it('generates token in for token out preview tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.getTokenInForTokenOut(
        '10000000000000000000',
        user,
      );
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.data).toEqual(
        '0xf823b07b0000000000000000000000000000000000000000000000008ac7230489e80000',
      );
    });
    it('generates token out for token in preview tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.getTokenOutForTokenIn(
        '10000000000000000000',
        user,
      );
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.data).toEqual(
        '0xfe6568500000000000000000000000000000000000000000000000008ac7230489e80000',
      );
    });
    it('generates supply token tx', () => {
      const onBehalfOf = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.supplyToken(
        '10000000000000000000',
        onBehalfOf,
        '0',
      );
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.from).toEqual(onBehalfOf);
      expect(tx.data).toEqual(
        '0x1461e2160000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000',
      );
    });
    it('generates supply with permit tx', () => {
      const onBehalfOf = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.supplyTokenWithPermit({
        amount: '10000000000000000000',
        onBehalfOf,
        referralCode: '0',
        deadline: '10000',
        signature:
          '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      });
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.from).toEqual(onBehalfOf);
      expect(tx.data).toEqual(
        '0x4f4663a10000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000001c532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );
    });
    it('generates withdraw token tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.withdrawToken(
        '10000000000000000000',
        user,
      );
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.from).toEqual(user);
      expect(tx.data).toEqual(
        '0xbe4b17720000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000000000000000000004',
      );
    });
    it('generates withdraw token with permit tx', () => {
      const user = '0x0000000000000000000000000000000000000004';
      const savingsDaiTokenWrapperService = new SavingsDaiTokenWrapperService(
        provider,
        savingsDaiTokenWrapperAddress,
      );
      const tx = savingsDaiTokenWrapperService.withdrawTokenWithPermit(
        '10000000000000000000',
        user,
        '10000',
        '0x532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb41c',
      );
      expect(tx.to).toEqual(savingsDaiTokenWrapperAddress);
      expect(tx.from).toEqual(user);
      expect(tx.data).toEqual(
        '0xe94875ca0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000001c532f8df4e2502bd869fb35e9301156f9b307380afdcc25cfbc87b2e939f16f7e47c326dc26eb918d327358797ee67ad7415d871ef7eaf0d4f6352d3ad021fbb4',
      );
    });
  });
});

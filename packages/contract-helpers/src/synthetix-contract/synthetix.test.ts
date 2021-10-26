import { BigNumber, providers } from 'ethers';
import { ISynthetix } from './typechain/ISynthetix';
import { ISynthetix__factory } from './typechain/ISynthetix__factory';
import { SynthetixService } from './index';

describe('Synthetix', () => {
  describe('Initialization', () => {
    it('Expects to initialize correctly', () => {
      const provider = new providers.JsonRpcProvider();
      expect(() => new SynthetixService(provider));
    });
  });
  describe('synthetixValidation', () => {
    const provider = new providers.JsonRpcProvider();
    const user = '0x0000000000000000000000000000000000000001';
    const reserve = '0x0000000000000000000000000000000000000002';
    const amount = '1000000000000000000';
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to return true if not mainnet network', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementation(async () => ({ name: 'matic', chainId: 137 }));
      const synth = new SynthetixService(provider);

      const valid = await synth.synthetixValidation({ user, reserve, amount });
      expect(valid).toEqual(true);
    });
    it('Expects to return true if not synthetix address on mainnet', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementation(async () => ({ name: 'mainnet', chainId: 1 }));
      const synth = new SynthetixService(provider);

      const valid = await synth.synthetixValidation({ user, reserve, amount });
      expect(valid).toEqual(true);
    });
    it('Expects to return true if synthetix and amount < synthetix transferable amount', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementation(async () => ({ name: 'mainnet', chainId: 1 }));
      const spy = jest.spyOn(ISynthetix__factory, 'connect').mockReturnValue({
        transferableSynthetix: async () =>
          Promise.resolve(BigNumber.from(amount)),
      } as unknown as ISynthetix);

      const synth = new SynthetixService(provider);
      const smallAmount = '1000000000';
      const synthAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
      const valid = await synth.synthetixValidation({
        user,
        reserve: synthAddress,
        amount: smallAmount,
      });

      expect(spy).toHaveBeenCalled();
      expect(valid).toEqual(true);
    });
    it('Expects to return true if synthetix and amount = synthetix transferable amount', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementation(async () => ({ name: 'mainnet', chainId: 1 }));
      const spy = jest.spyOn(ISynthetix__factory, 'connect').mockReturnValue({
        transferableSynthetix: async () =>
          Promise.resolve(BigNumber.from(amount)),
      } as unknown as ISynthetix);

      const synth = new SynthetixService(provider);
      const synthAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
      const valid = await synth.synthetixValidation({
        user,
        reserve: synthAddress,
        amount,
      });

      expect(spy).toHaveBeenCalled();
      expect(valid).toEqual(true);
    });
    it('Expects to return false if synthetix and amount > synthetix transferable amount', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementation(async () => ({ name: 'mainnet', chainId: 1 }));
      const spy = jest.spyOn(ISynthetix__factory, 'connect').mockReturnValue({
        transferableSynthetix: async () =>
          Promise.resolve(BigNumber.from('100000')),
      } as unknown as ISynthetix);

      const synth = new SynthetixService(provider);
      const synthAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
      const valid = await synth.synthetixValidation({
        user,
        reserve: synthAddress,
        amount,
      });

      expect(spy).toHaveBeenCalled();
      expect(valid).toEqual(false);
    });
  });
});

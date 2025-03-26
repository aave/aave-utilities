import { BigNumber, providers } from 'ethers';
import { estimateGas, estimateGasByNetwork } from './gasStation';
import { ChainId } from './types';

describe('gasStation', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  const tx = {};
  jest
    .spyOn(provider, 'estimateGas')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(100)));
  jest
    .spyOn(provider, 'getNetwork')
    .mockImplementation(async () =>
      Promise.resolve({ chainId: 1, name: 'mainnet' }),
    );
  describe('estimateGas', () => {
    it('Expects to use default surplus', async () => {
      const gas = await estimateGas(tx, provider);
      expect(gas).toEqual(BigNumber.from(130));
    });
    it('Expects to use specified surplus', async () => {
      const gas = await estimateGas(tx, provider, 10);
      expect(gas).toEqual(BigNumber.from(110));
    });
  });
  describe('estimateGasByNetwork', () => {
    it('Expects to use polygon surplus', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementationOnce(async () =>
          Promise.resolve({ chainId: 137, name: 'matic' }),
        );

      const gas = await estimateGasByNetwork(tx, provider);
      expect(gas).toEqual(BigNumber.from(160));
    });
    it('Expects to use default surplus', async () => {
      const gas = await estimateGasByNetwork(tx, provider);
      expect(gas).toEqual(BigNumber.from(130));
    });
    it('Expects to use specified surplus', async () => {
      const gas = await estimateGasByNetwork(tx, provider, 10);
      expect(gas).toEqual(BigNumber.from(110));
    });
    it('Expects to return 350000 for zksync when connected with contract address', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementationOnce(async () =>
          Promise.resolve({ chainId: ChainId.zksync, name: 'zksync' }),
        );

      jest
        .spyOn(provider, 'getCode')
        .mockImplementationOnce(async () => Promise.resolve('0x1234'));

      const gas = await estimateGasByNetwork({ from: '0x123abc' }, provider);
      expect(gas).toEqual(BigNumber.from(350000));
    });
    it('Expects to return default for zksync when connected with EOA', async () => {
      jest
        .spyOn(provider, 'getNetwork')
        .mockImplementationOnce(async () =>
          Promise.resolve({ chainId: ChainId.zksync, name: 'zksync' }),
        );

      jest
        .spyOn(provider, 'getCode')
        .mockImplementationOnce(async () => Promise.resolve('0x'));

      const gas = await estimateGasByNetwork({ from: '0x123abc' }, provider);
      expect(gas).toEqual(BigNumber.from(130));
    });
  });
});

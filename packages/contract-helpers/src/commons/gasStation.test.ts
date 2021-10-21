import { BigNumber, providers } from 'ethers';
import { estimateGas, estimateGasByNetwork } from './gasStation';

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
  });
});

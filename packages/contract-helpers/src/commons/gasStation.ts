import { BigNumber, providers } from 'ethers';
import { transactionType, ChainId } from './types';

const DEFAULT_SURPLUS = 30; // 30%
// polygon gas estimation is very off for some reason
const POLYGON_SURPLUS = 60; // 60%

export const estimateGas = async (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number,
): Promise<BigNumber> => {
  const estimatedGas = await provider.estimateGas(tx);
  return estimatedGas.add(
    estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100),
  );
};

export const estimateGasByNetwork = async (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number,
): Promise<BigNumber> => {
  const providerNework: providers.Network = await provider.getNetwork();
  if (providerNework.chainId === ChainId.zksync && tx.from) {
    /**
     *  Trying to estimate gas on zkSync when connected with a smart contract address
     *  will fail. In that case, we'll just return a default value for all transactions.
     *
     *  See here for more details: https://github.com/zkSync-Community-Hub/zksync-developers/discussions/144
     */
    const data = await provider.getCode(tx.from);
    if (data !== '0x') {
      return BigNumber.from(350000);
    }
  }

  const estimatedGas = await provider.estimateGas(tx);

  if (providerNework.chainId === ChainId.polygon) {
    return estimatedGas.add(estimatedGas.mul(POLYGON_SURPLUS).div(100));
  }

  return estimatedGas.add(
    estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100),
  );
};

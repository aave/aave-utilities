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
  chainId: number,
  provider: providers.Provider,
  gasSurplus?: number,
): Promise<BigNumber> => {
  const estimatedGas = await provider.estimateGas(tx);

  if (chainId === ChainId.polygon) {
    return estimatedGas.add(estimatedGas.mul(POLYGON_SURPLUS).div(100));
  }

  return estimatedGas.add(
    estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100),
  );
};

export const getGasPrice = async (
  provider: providers.Provider,
): Promise<BigNumber> => {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
};

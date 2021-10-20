import { BigNumber } from 'ethers';
import { transactionType, Configuration, Network } from './types';

const DEFAULT_SURPLUS = 30; // 30%
// polygon gas estimation is very off for some reason
const POLYGON_SURPLUS = 60; // 60%

export const estimateGas = async (
  tx: transactionType,
  config: Configuration,
  gasSurplus?: number,
): Promise<BigNumber> => {
  const estimatedGas = await config.provider.estimateGas(tx);
  return estimatedGas.add(
    estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100),
  );
};

export const estimateGasByNetwork = async (
  tx: transactionType,
  config: Configuration,
  gasSurplus?: number,
): Promise<BigNumber> => {
  const estimatedGas = await config.provider.estimateGas(tx);

  const { network } = config;
  if (network === Network.polygon) {
    return estimatedGas.add(estimatedGas.mul(POLYGON_SURPLUS).div(100));
  }

  return estimatedGas.add(
    estimatedGas.mul(gasSurplus ?? DEFAULT_SURPLUS).div(100),
  );
};

export const getGasPrice = async (
  config: Configuration,
): Promise<BigNumber> => {
  const gasPrice = await config.provider.getGasPrice();
  return gasPrice;
};

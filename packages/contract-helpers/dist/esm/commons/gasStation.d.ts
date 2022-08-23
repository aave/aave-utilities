import { BigNumber, providers } from 'ethers';
import { transactionType } from './types';
export declare const estimateGas: (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number | undefined,
) => Promise<BigNumber>;
export declare const estimateGasByNetwork: (
  tx: transactionType,
  provider: providers.Provider,
  gasSurplus?: number | undefined,
) => Promise<BigNumber>;
//# sourceMappingURL=gasStation.d.ts.map

import { Provider } from '@ethersproject/providers';
import { Contract, providers, Signer } from 'ethers';
import {
  tEthereumAddress,
  TransactionGenerationMethod,
  transactionType,
  GasResponse,
  EthereumTransactionTypeExtended,
} from './types';
export interface ContractsFactory {
  connect: (address: string, signerOrProvider: Signer | Provider) => Contract;
}
export default class BaseService<T extends Contract> {
  readonly contractInstances: Record<string, T>;
  readonly contractFactory: ContractsFactory;
  readonly provider: providers.Provider;
  constructor(provider: providers.Provider, contractFactory: ContractsFactory);
  getContractInstance: (address: tEthereumAddress) => T;
  readonly generateTxCallback: ({
    rawTxMethod,
    from,
    value,
    gasSurplus,
    action,
  }: TransactionGenerationMethod) => () => Promise<transactionType>;
  readonly generateTxPriceEstimation: (
    txs: EthereumTransactionTypeExtended[],
    txCallback: () => Promise<transactionType>,
    action?: string,
  ) => GasResponse;
}
//# sourceMappingURL=BaseService.d.ts.map

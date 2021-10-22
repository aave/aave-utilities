import { Provider } from '@ethersproject/providers';
import {
  BigNumber,
  Contract,
  PopulatedTransaction,
  providers,
  Signer,
} from 'ethers';
import { estimateGasByNetwork } from './gasStation';
import {
  tEthereumAddress,
  TransactionGenerationMethod,
  transactionType,
  GasResponse,
  ProtocolAction,
  EthereumTransactionTypeExtended,
  eEthereumTxType,
} from './types';
import { DEFAULT_NULL_VALUE_ON_TX, gasLimitRecommendations } from './utils';

export interface ContractsFactory {
  connect: (address: string, signerOrProvider: Signer | Provider) => Contract;
}

export default class BaseService<T extends Contract> {
  readonly contractInstances: Record<string, T>;

  readonly contractFactory: ContractsFactory;

  readonly provider: providers.Provider;

  constructor(provider: providers.Provider, contractFactory: ContractsFactory) {
    this.contractFactory = contractFactory;
    this.provider = provider;
    this.contractInstances = {};
  }

  public getContractInstance = (address: tEthereumAddress): T => {
    if (!this.contractInstances[address]) {
      this.contractInstances[address] = this.contractFactory.connect(
        address,
        this.provider,
      ) as T;
    }

    return this.contractInstances[address];
  };

  readonly generateTxCallback =
    ({
      rawTxMethod,
      from,
      value,
      gasSurplus,
      action,
    }: TransactionGenerationMethod): (() => Promise<transactionType>) =>
    async () => {
      const txRaw: PopulatedTransaction = await rawTxMethod();

      const tx: transactionType = {
        ...txRaw,
        from,
        value: value ?? DEFAULT_NULL_VALUE_ON_TX,
      };

      tx.gasLimit = await estimateGasByNetwork(tx, this.provider, gasSurplus);

      if (
        action &&
        gasLimitRecommendations[action] &&
        tx.gasLimit.lte(BigNumber.from(gasLimitRecommendations[action].limit))
      ) {
        tx.gasLimit = BigNumber.from(
          gasLimitRecommendations[action].recommended,
        );
      }

      return tx;
    };

  readonly generateTxPriceEstimation =
    (
      txs: EthereumTransactionTypeExtended[],
      txCallback: () => Promise<transactionType>,
      action: string = ProtocolAction.default,
    ): GasResponse =>
    async (force = false) => {
      try {
        const gasPrice = await this.provider.getGasPrice();
        const hasPendingApprovals = txs.find(
          tx => tx.txType === eEthereumTxType.ERC20_APPROVAL,
        );
        if (!hasPendingApprovals || force) {
          const { gasLimit, gasPrice: gasPriceProv }: transactionType =
            await txCallback();
          if (!gasLimit) {
            // If we don't recieve the correct gas we throw a error
            throw new Error('Transaction calculation error');
          }

          return {
            gasLimit: gasLimit.toString(),
            gasPrice: gasPriceProv
              ? gasPriceProv.toString()
              : gasPrice.toString(),
          };
        }

        return {
          gasLimit: gasLimitRecommendations[action].recommended,
          gasPrice: gasPrice.toString(),
        };
      } catch (error: unknown) {
        console.error(
          'Calculate error on calculate estimation gas price.',
          error,
        );
        return null;
      }
    };
}

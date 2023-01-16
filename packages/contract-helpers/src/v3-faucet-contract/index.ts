import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  LendingPoolMarketConfig,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import {
  mintAmountsPerToken,
  DEFAULT_NULL_VALUE_ON_TX,
  valueToWei,
} from '../commons/utils';
import { FaucetValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IERC20FaucetOwnable } from './typechain/IERC20FaucetOwnable';
import { IERC20FaucetOwnable__factory } from './typechain/IERC20FaucetOwnable__factory';

export type V3FaucetParamsType = {
  userAddress: tEthereumAddress;
  reserve: tEthereumAddress;
  tokenSymbol: string;
  owner?: tEthereumAddress;
};

export interface FaucetV2Interface {
  mint: (args: V3FaucetParamsType) => EthereumTransactionTypeExtended[];
}

export class V3FaucetService
  extends BaseService<IERC20FaucetOwnable>
  implements FaucetV2Interface
{
  readonly faucetAddress: string;

  readonly faucetConfig: LendingPoolMarketConfig | undefined;

  constructor(provider: providers.Provider, faucetAddress?: string) {
    super(provider, IERC20FaucetOwnable__factory);

    this.faucetAddress = faucetAddress ?? '';
  }

  /**
   * @dev This mint function will only work if the IERC20FaucetOwnable "isPermissioned()" boolean getter returns "false".
   * If the "isPermissioned" returns true, them only the owner can sign the function.
   */
  @FaucetValidator
  public mint(
    @isEthAddress('userAddress')
    @isEthAddress('reserve')
    { userAddress, reserve, tokenSymbol, owner }: V3FaucetParamsType,
  ): EthereumTransactionTypeExtended[] {
    const defaultAmount = valueToWei('1000', 18);
    const amount: string = mintAmountsPerToken[tokenSymbol]
      ? mintAmountsPerToken[tokenSymbol]
      : defaultAmount;

    const faucetV3Contract = this.getContractInstance(this.faucetAddress);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        faucetV3Contract.populateTransaction.mint(reserve, userAddress, amount),
      from: owner ?? userAddress,
      value: DEFAULT_NULL_VALUE_ON_TX,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.FAUCET_V2_MINT,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  public async isPermissioned(): Promise<boolean> {
    const faucetV3Contract = this.getContractInstance(this.faucetAddress);

    return faucetV3Contract.isPermissioned();
  }
}

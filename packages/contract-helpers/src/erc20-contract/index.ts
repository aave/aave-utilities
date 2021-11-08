import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  valueToWei,
  SUPER_BIG_ALLOWANCE_NUMBER,
} from '../commons/utils';
import { ERC20Validator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { IERC20Detailed } from './typechain/IERC20Detailed';
import { IERC20Detailed__factory } from './typechain/IERC20Detailed__factory';

export interface IERC20ServiceInterface {
  decimalsOf: (token: tEthereumAddress) => Promise<number>;
  getTokenData: (token: tEthereumAddress) => Promise<TokenMetadataType>;
  isApproved: (args: ApproveType) => Promise<boolean>;
  approve: (args: ApproveType) => EthereumTransactionTypeExtended;
}

export type ApproveType = {
  user: tEthereumAddress;
  token: tEthereumAddress;
  spender: tEthereumAddress;
  amount: string;
};

export type TokenMetadataType = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};
export class ERC20Service
  extends BaseService<IERC20Detailed>
  implements IERC20ServiceInterface
{
  readonly tokenDecimals: Record<string, number>;

  readonly tokenMetadata: Record<string, TokenMetadataType>;

  constructor(provider: providers.Provider) {
    super(provider, IERC20Detailed__factory);
    this.tokenDecimals = {};
    this.tokenMetadata = {};

    this.approve = this.approve.bind(this);
    this.isApproved = this.isApproved.bind(this);
    this.getTokenData = this.getTokenData.bind(this);
    this.decimalsOf = this.decimalsOf.bind(this);
  }

  @ERC20Validator
  public approve(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveAmount('amount')
    { user, token, spender, amount }: ApproveType,
  ): EthereumTransactionTypeExtended {
    const erc20Contract: IERC20Detailed = this.getContractInstance(token);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        erc20Contract.populateTransaction.approve(spender, amount),
      from: user,
    });

    return {
      tx: txCallback,
      txType: eEthereumTxType.ERC20_APPROVAL,
      gas: this.generateTxPriceEstimation([], txCallback),
    };
  }

  @ERC20Validator
  public async isApproved(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveOrMinusOneAmount('amount')
    { user, token, spender, amount }: ApproveType,
  ): Promise<boolean> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return true;
    const decimals = await this.decimalsOf(token);
    const erc20Contract: IERC20Detailed = this.getContractInstance(token);
    const allowance: BigNumber = await erc20Contract.allowance(user, spender);
    const amountBNWithDecimals: BigNumber =
      amount === '-1'
        ? BigNumber.from(SUPER_BIG_ALLOWANCE_NUMBER)
        : BigNumber.from(valueToWei(amount, decimals));
    return allowance.gte(amountBNWithDecimals);
  }

  @ERC20Validator
  public async decimalsOf(
    @isEthAddress() token: tEthereumAddress,
  ): Promise<number> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return 18;
    if (!this.tokenDecimals[token]) {
      const erc20Contract = this.getContractInstance(token);
      this.tokenDecimals[token] = await erc20Contract.decimals();
    }

    return this.tokenDecimals[token];
  }

  @ERC20Validator
  public async getTokenData(
    @isEthAddress() token: tEthereumAddress,
  ): Promise<TokenMetadataType> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        address: token,
      };
    }

    // Needed because MKR does not return string for symbol and Name
    if (
      token.toLowerCase() ===
      '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'.toLowerCase()
    ) {
      return {
        name: 'Maker',
        symbol: 'MKR',
        decimals: 18,
        address: token,
      };
    }

    if (!this.tokenMetadata[token]) {
      const { name: nameGetter, symbol: symbolGetter }: IERC20Detailed =
        this.getContractInstance(token);

      const [name, symbol, decimals]: [string, string, number] =
        await Promise.all([
          nameGetter(),
          symbolGetter(),
          this.decimalsOf(token),
        ]);

      this.tokenMetadata[token] = {
        name,
        symbol,
        decimals,
        address: token,
      };
    }

    return this.tokenMetadata[token];
  }
}

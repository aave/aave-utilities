import { BigNumber, ethers, PopulatedTransaction, providers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  valueToWei,
  SUPER_BIG_ALLOWANCE_NUMBER,
  MAX_UINT_AMOUNT,
  gasLimitRecommendations,
} from '../commons/utils';
import { ERC20Validator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import {
  IERC20Detailed,
  IERC20DetailedInterface,
} from './typechain/IERC20Detailed';
import { IERC20Detailed__factory } from './typechain/IERC20Detailed__factory';

export interface IERC20ServiceInterface {
  decimalsOf: (token: tEthereumAddress) => Promise<number>;
  getTokenData: (token: tEthereumAddress) => Promise<TokenMetadataType>;
  isApproved: (
    args: ApproveType & { nativeDecimals?: boolean },
  ) => Promise<boolean>;
  approvedAmount: (args: AllowanceRequest) => Promise<number>;
  approve: (args: ApproveType) => EthereumTransactionTypeExtended;
  approveTxData: (args: ApproveType) => PopulatedTransaction;
}

export type TokenOwner = {
  user: tEthereumAddress;
  token: tEthereumAddress;
};

export type AllowanceRequest = TokenOwner & {
  spender: tEthereumAddress;
};

export type ApproveType = AllowanceRequest & {
  amount: string;
};

export type SignedApproveType = ApproveType & {
  deadline?: string;
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

  readonly contractInterface: IERC20DetailedInterface;

  constructor(provider: providers.Provider) {
    super(provider, IERC20Detailed__factory);
    this.tokenDecimals = {};
    this.tokenMetadata = {};

    this.approve = this.approve.bind(this);
    this.approveTxData = this.approveTxData.bind(this);
    this.isApproved = this.isApproved.bind(this);
    this.getTokenData = this.getTokenData.bind(this);
    this.decimalsOf = this.decimalsOf.bind(this);
    this.contractInterface = IERC20Detailed__factory.createInterface();
  }

  /**
   * Generate approval tx data with legacy method, call tx() and gas() callbacks for tx data and gas estimation respectively
   * @param {string} user - Address to check allowance for
   * @param {string} token - Token which the user is spending
   * @param {string} spender - Address which is spending the tokens
   * @param {string} amount - Amount to approve
   * @returns {EthereumTransactionTypeExtended} legacy transaction response
   */
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

  /**
   * Generate approval tx data, ready to sign and submit to blockchain
   * @param {string} user - Address to check allowance for
   * @param {string} token - Token which the user is spending
   * @param {string} spender - Address which is spending the tokens
   * @param {string} amount - Amount to approve
   * @returns {PopulatedTransaction} Transaction response
   */
  @ERC20Validator
  public approveTxData(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveAmount('amount')
    { user, token, spender, amount }: ApproveType,
  ): PopulatedTransaction {
    const tx: PopulatedTransaction = {};
    const txData = this.contractInterface.encodeFunctionData('approve', [
      spender,
      amount,
    ]);

    tx.data = txData;
    tx.to = token;
    tx.from = user;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.approval].recommended,
    );

    return tx;
  }

  /**
   * Qeuries whether user has approved spender to transfer tokens up to the specific amount
   * @param {string} user - Address to check allowance for
   * @param {string} token - Token which the user is spending
   * @param {string} spender - Address which is spending the tokens
   * @param {string} amount - Amount of token to checkif spender has allowance for
   * @returns {boolean} true if user has approved spender contract for greater than passed amount, false otherwise
   */
  @ERC20Validator
  public async isApproved(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveOrMinusOneAmount('amount')
    {
      user,
      token,
      spender,
      amount,
      nativeDecimals,
    }: ApproveType & { nativeDecimals?: boolean },
  ): Promise<boolean> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return true;
    const decimals = await this.decimalsOf(token);
    const erc20Contract: IERC20Detailed = this.getContractInstance(token);
    const allowance: BigNumber = await erc20Contract.allowance(user, spender);
    const amountBNWithDecimals: BigNumber =
      amount === '-1'
        ? BigNumber.from(SUPER_BIG_ALLOWANCE_NUMBER)
        : BigNumber.from(
            valueToWei(
              nativeDecimals ? formatUnits(amount, decimals) : amount,
              decimals,
            ),
          );
    return allowance.gte(amountBNWithDecimals);
  }

  /**
   * Fetches the approval allowance of a user for a specific token and spender
   * @param {string} user - Address to check allowance for
   * @param {string} token - Token which the user is spending
   * @param {string} spender - Address which is spending the tokens
   * @returns {number} The user's approved allowance, in standard decimal units, -1 for max allowance
   */
  @ERC20Validator
  public async approvedAmount(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('spender')
    { user, token, spender }: AllowanceRequest,
  ): Promise<number> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return -1;
    const erc20Contract: IERC20Detailed = this.getContractInstance(token);
    const allowance: BigNumber = await erc20Contract.allowance(user, spender);
    if (allowance.toString() === MAX_UINT_AMOUNT) {
      return -1;
    }

    const decimals = await this.decimalsOf(token);
    return Number(ethers.utils.formatUnits(allowance, decimals));
  }

  /**
   * Fetches the decimals of an ERC20 token, used for formatting amounts
   * @param {string} token - ERC20 token address
   * @returns {number} Decimal units of token amounts
   */
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

  /**
   * Return basic details of an ERC20
   * @param {string} token - ERC20 token address
   * @returns {TokenMetadataType} ERC20 token metadata
   */
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

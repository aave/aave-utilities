import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  ProtocolAction,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { valueToWei } from '../commons/utils';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import { IAaveBiconomyForwarder } from './typechain/IAaveBiconomyForwarder';
import { IAaveBiconomyForwarder__factory } from './typechain/IAaveBiconomyForwarder__factory';

export interface IAaveBiconomyForwarderServiceInterface {
  depositToAave: (
    args: DepositType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdrawFromAave: (
    args: WithdrawType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export type DepositType = {
  user: tEthereumAddress;
  asset: tEthereumAddress;
  amount: string;
  onBehalfOf: tEthereumAddress;
  referralCode: string;
};

export type WithdrawType = {
  user: tEthereumAddress;
  asset: tEthereumAddress;
  amount: string;
  to: tEthereumAddress;
};

export class AaveBiconomyForwarderService
  extends BaseService<IAaveBiconomyForwarder>
  implements IAaveBiconomyForwarderServiceInterface
{
  readonly AaveBiconomyAddress: string;

  readonly erc20Service: IERC20ServiceInterface;

  readonly synthetixService: SynthetixInterface;

  constructor(
    provider: providers.Provider,
    AaveBiconomyAddress: tEthereumAddress,
  ) {
    super(provider, IAaveBiconomyForwarder__factory);
    this.AaveBiconomyAddress = AaveBiconomyAddress;
    this.erc20Service = new ERC20Service(provider);
    this.synthetixService = new SynthetixService(provider);
  }

  public async depositToAave(
    @isEthAddress('user')
    @isEthAddress('asset')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, asset, amount, onBehalfOf, referralCode }: DepositType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(asset);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);

    const approved = await isApproved({
      token: asset,
      user,
      spender: this.AaveBiconomyAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: asset,
        spender: this.AaveBiconomyAddress,
        amount,
      });
      txs.push(approveTx);
    }

    const BiconomyForwarderContract: IAaveBiconomyForwarder =
      this.getContractInstance(this.AaveBiconomyAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        BiconomyForwarderContract.populateTransaction.depositToAave(
          asset,
          convertedAmount,
          onBehalfOf ?? user,
          referralCode ?? '0',
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.supply,
      ),
    });
    return txs;
  }

  public async withdrawFromAave(
    @isEthAddress('user')
    @isEthAddress('asset')
    @isPositiveAmount('amount')
    @isEthAddress('to')
    { user, asset, amount, to }: WithdrawType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const reserveDecimals: number = await decimalsOf(asset);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);

    const BiconomyForwarderContract: IAaveBiconomyForwarder =
      this.getContractInstance(this.AaveBiconomyAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        BiconomyForwarderContract.populateTransaction.withdrawFromAave(
          asset,
          convertedAmount,
          to ?? user,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.withdraw,
        ),
      },
    ];
  }
}

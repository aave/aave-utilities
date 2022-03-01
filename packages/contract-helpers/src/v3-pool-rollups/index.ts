import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { getTxValue } from '../commons/utils';
import {
  LPBorrowParamsType,
  LPSupplyParamsType,
  LPLiquidationCall,
  LPRepayParamsType,
  LPRepayWithATokensType,
  LPSetUsageAsCollateral,
  LPSupplyWithPermitType,
  LPSwapBorrowRateMode,
  LPWithdrawParamsType,
} from '../v3-pool-contract/lendingPoolTypes';
import { IL2Pool } from './typechain/IL2Pool';
import { IL2Pool__factory } from './typechain/IL2Pool__factory';
import { L2Encoder } from './typechain/L2Encoder';
import { L2Encoder__factory } from './typechain/L2Encoder__factory';

export interface L2PoolInterface {
  supply: (
    args: LPSupplyParamsType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  // supplyWithPermit: (
  //   args: LPSupplyWithPermitType,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
  // withdraw: (
  //   args: LPWithdrawParamsType,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
  // borrow: (
  //   args: LPBorrowParamsType,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
  // repay: (
  //   args: LPRepayParamsType,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
  // swapBorrowRateMode: (
  //   args: LPSwapBorrowRateMode,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => EthereumTransactionTypeExtended[];
  // setUserUseReserveAsCollateral: (
  //   args: LPSetUsageAsCollateral,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => EthereumTransactionTypeExtended[];
  // repayWithATokens: (
  //   args: LPRepayWithATokensType,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
  // liquidationCall: (
  //   args: LPLiquidationCall,
  //   txs: EthereumTransactionTypeExtended[],
  // ) => Promise<EthereumTransactionTypeExtended[]>;
}

export type L2PoolConfigType = {
  l2PoolAddress?: string;
  encoderAddress?: string;
};
export class L2Pool extends BaseService<IL2Pool> implements L2PoolInterface {
  readonly l2PoolAddress: string;
  readonly encoderAddress: string;

  public encoderContract: L2Encoder;

  constructor(provider: providers.Provider, l2PoolConfig?: L2PoolConfigType) {
    super(provider, IL2Pool__factory);

    const { l2PoolAddress, encoderAddress } = l2PoolConfig ?? {};

    this.l2PoolAddress = l2PoolAddress ?? '';
    this.encoderAddress = encoderAddress ?? '';
  }

  public async supply(
    { user, reserve, amount, referralCode }: LPSupplyParamsType,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string = await encoder.encodeSupplyParams(
      reserve,
      amount,
      referralCode ?? 0,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.supply(encodedParams),
      from: user,
      value: getTxValue(reserve, amount),
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

  private getEncoder(): L2Encoder {
    if (!this.encoderContract && this.encoderAddress !== '') {
      this.encoderContract = L2Encoder__factory.connect(
        this.encoderAddress,
        this.provider,
      );
    }

    return this.encoderContract;
  }
}

import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { getTxValue } from '../commons/utils';
import { L2PValidator } from '../commons/validators/methodValidators';
import { isDeadline32Bytes } from '../commons/validators/paramValidators';
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
  LPRepayWithPermitParamsType,
} from './poolTypes';
import { IL2Pool } from './typechain/IL2Pool';
import { IL2Pool__factory } from './typechain/IL2Pool__factory';
import { L2Encoder } from './typechain/L2Encoder';
import { L2Encoder__factory } from './typechain/L2Encoder__factory';

export interface L2PoolInterface {
  encoderContract: L2Encoder;
  supply: (
    args: LPSupplyParamsType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  supplyWithPermit: (
    args: LPSupplyWithPermitType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdraw: (
    args: LPWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  borrow: (
    args: LPBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repay: (
    args: LPRepayParamsType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithPermit: (
    args: LPRepayWithPermitParamsType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithATokens: (
    args: LPRepayWithATokensType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode: (
    args: LPSwapBorrowRateMode,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  setUserUseReserveAsCollateral: (
    args: LPSetUsageAsCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  liquidationCall: (
    args: LPLiquidationCall,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  getEncoder: () => L2Encoder;
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

  @L2PValidator
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

  @L2PValidator
  public async supplyWithPermit(
    @isDeadline32Bytes('deadline')
    {
      user,
      reserve,
      amount,
      deadline,
      referralCode,
      permitR,
      permitS,
      permitV,
    }: LPSupplyWithPermitType,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string[] = await encoder.encodeSupplyWithPermitParams(
      reserve,
      amount,
      referralCode ?? 0,
      deadline,
      permitV,
      permitR,
      permitS,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.supplyWithPermit(
          encodedParams[0],
          permitR,
          permitS,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  @L2PValidator
  public async withdraw({
    user,
    reserve,
    amount,
  }: LPWithdrawParamsType): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string = await encoder.encodeWithdrawParams(
      reserve,
      amount,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.withdraw(encodedParams),
      from: user,
      action: ProtocolAction.withdraw,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.supply,
        ),
      },
    ];
  }

  @L2PValidator
  public async borrow({
    user,
    reserve,
    amount,
    numericRateMode,
    referralCode,
  }: LPBorrowParamsType): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string = await encoder.encodeBorrowParams(
      reserve,
      amount,
      numericRateMode,
      referralCode ?? 0,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.borrow(encodedParams),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @L2PValidator
  public async repay(
    { reserve, user, amount, numericRateMode }: LPRepayParamsType,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();
    const encodedParams: string = await encoder.encodeRepayParams(
      reserve,
      amount,
      numericRateMode,
    );
    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.repay(encodedParams),
      from: user,
      value: getTxValue(reserve, amount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.repay,
      ),
    });

    return txs;
  }

  @L2PValidator
  public async repayWithPermit(
    @isDeadline32Bytes('deadline')
    {
      user,
      reserve,
      amount,
      numericRateMode,
      permitR,
      permitS,
      permitV,
      deadline,
    }: LPRepayWithPermitParamsType,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string[] = await encoder.encodeRepayWithPermitParams(
      reserve,
      amount,
      numericRateMode,
      deadline,
      permitV,
      permitR,
      permitS,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.repayWithPermit(
          encodedParams[0],
          permitR,
          permitS,
        ),
      from: user,
      value: getTxValue(reserve, amount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.repay,
      ),
    });

    return txs;
  }

  @L2PValidator
  public async repayWithATokens(
    { reserve, user, amount, numericRateMode }: LPRepayParamsType,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();
    const encodedParams: string = await encoder.encodeRepayWithATokensParams(
      reserve,
      amount,
      numericRateMode,
    );
    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.repayWithATokens(encodedParams),
      from: user,
      value: getTxValue(reserve, amount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.repay,
      ),
    });

    return txs;
  }

  @L2PValidator
  public async swapBorrowRateMode({
    reserve,
    numericRateMode,
    user,
  }: LPSwapBorrowRateMode): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string = await encoder.encodeSwapBorrowRateMode(
      reserve,
      numericRateMode,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.swapBorrowRateMode(encodedParams),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @L2PValidator
  public async setUserUseReserveAsCollateral({
    reserve,
    usageAsCollateral,
    user,
  }: LPSetUsageAsCollateral): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string =
      await encoder.encodeSetUserUseReserveAsCollateral(
        reserve,
        usageAsCollateral,
      );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.setUserUseReserveAsCollateral(
          encodedParams,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @L2PValidator
  public async liquidationCall(
    {
      liquidator,
      liquidatedUser,
      debtReserve,
      collateralReserve,
      debtToCover,
      getAToken,
    }: LPLiquidationCall,
    txs: EthereumTransactionTypeExtended[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const encoder = this.getEncoder();

    const encodedParams: string[] = await encoder.encodeLiquidationCall(
      collateralReserve,
      debtReserve,
      liquidatedUser,
      debtToCover,
      getAToken ?? false,
    );

    const l2PoolContract: IL2Pool = this.getContractInstance(
      this.l2PoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        l2PoolContract.populateTransaction.liquidationCall(
          encodedParams[0],
          encodedParams[1],
        ),
      from: liquidator,
      value: getTxValue(debtReserve, debtToCover),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        [],
        txCallback,
        ProtocolAction.liquidationCall,
      ),
    });

    return txs;
  }

  public getEncoder(): L2Encoder {
    if (!this.encoderContract && this.encoderAddress !== '') {
      this.encoderContract = L2Encoder__factory.connect(
        this.encoderAddress,
        this.provider,
      );
    }

    return this.encoderContract;
  }
}

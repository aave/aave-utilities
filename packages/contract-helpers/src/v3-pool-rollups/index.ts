import { BigNumber, PopulatedTransaction, providers, Signature } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, getTxValue } from '../commons/utils';
import { L2PValidator } from '../commons/validators/methodValidators';
import { isDeadline32Bytes } from '../commons/validators/paramValidators';
import { LPSupplyParamsType } from '../v3-pool-contract/lendingPoolTypes';
import { IPoolInterface } from '../v3-pool-contract/typechain/IPool';
import { IPool__factory } from '../v3-pool-contract/typechain/IPool__factory';
import {
  LPBorrowParamsType,
  LPLiquidationCall,
  LPRepayParamsType,
  LPRepayWithATokensType,
  LPSetUsageAsCollateral,
  LPSupplyWithPermitType,
  LPSwapBorrowRateMode,
  LPWithdrawParamsType,
  LPRepayWithPermitParamsType,
} from './poolTypes';
import { IL2Pool, IL2PoolInterface } from './typechain/IL2Pool';
import { IL2Pool__factory } from './typechain/IL2Pool__factory';
import { L2Encoder, L2EncoderInterface } from './typechain/L2Encoder';
import { L2Encoder__factory } from './typechain/L2Encoder__factory';

export interface L2PoolInterface {
  encoderContract: L2Encoder;
  supply: (
    args: LPSupplyParamsType,
    txs: EthereumTransactionTypeExtended[],
  ) => Promise<EthereumTransactionTypeExtended[]>;
  generateSupplyTxData: (args: LPSupplyParamsType) => PopulatedTransaction;
  generateBorrowTxData: (args: LPBorrowParamsType) => PopulatedTransaction;
  generateEncodedSupplyTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;
  generateEncodedBorrowTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;
  generateSupplyWithPermitTxData: (
    args: LPSupplyWithPermitType,
  ) => PopulatedTransaction;
  generateEncodedSupplyWithPermitTxData: (args: {
    encodedTxData: string;
    user: string;
    signature: string;
  }) => PopulatedTransaction;
  generateEncodedRepayTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;
  generateEncodedRepayWithPermitTxData: (args: {
    encodedTxData: string;
    user: string;
    signature: string;
  }) => PopulatedTransaction;
  generateEncodedRepayWithATokensTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;
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
  readonly l2PoolContractInstance: IL2PoolInterface;
  readonly poolContractInstance: IPoolInterface;

  public encoderContract: L2Encoder;
  public encoderInterface: L2EncoderInterface;

  generateSupplyTxData: (args: LPSupplyParamsType) => PopulatedTransaction;

  generateBorrowTxData: (args: LPBorrowParamsType) => PopulatedTransaction;

  generateSupplyWithPermitTxData: (
    args: LPSupplyWithPermitType,
  ) => PopulatedTransaction;

  generateEncodedSupplyTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;

  generateEncodedBorrowTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;

  generateEncodedSupplyWithPermitTxData: (args: {
    encodedTxData: string;
    user: string;
    signature: string;
  }) => PopulatedTransaction;

  generateEncodedRepayTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;

  generateEncodedRepayWithPermitTxData: (args: {
    encodedTxData: string;
    user: string;
    signature: string;
  }) => PopulatedTransaction;

  generateEncodedRepayWithATokensTxData: (args: {
    encodedTxData: string;
    user: string;
  }) => PopulatedTransaction;

  constructor(provider: providers.Provider, l2PoolConfig?: L2PoolConfigType) {
    super(provider, IL2Pool__factory);

    const { l2PoolAddress, encoderAddress } = l2PoolConfig ?? {};

    this.l2PoolAddress = l2PoolAddress ?? '';
    this.encoderAddress = encoderAddress ?? '';
    this.encoderInterface = L2Encoder__factory.createInterface();
    this.l2PoolContractInstance = IL2Pool__factory.createInterface();
    this.poolContractInstance = IPool__factory.createInterface();

    this.generateSupplyTxData = ({
      user,
      reserve,
      onBehalfOf,
      amount,
      referralCode,
    }: LPSupplyParamsType) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.poolContractInstance.encodeFunctionData('supply', [
        reserve,
        amount,
        onBehalfOf ?? user,
        referralCode ?? '0',
      ]);

      actionTx.to = this.l2PoolAddress;
      actionTx.from = user;
      actionTx.data = txData;
      return actionTx;
    };

    this.generateBorrowTxData = ({
      user,
      reserve,
      amount,
      numericRateMode,
      referralCode,
      onBehalfOf,
    }: LPBorrowParamsType) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.poolContractInstance.encodeFunctionData('borrow', [
        reserve,
        amount,
        numericRateMode,
        referralCode ?? '0',
        onBehalfOf ?? user,
      ]);

      actionTx.to = this.l2PoolAddress;
      actionTx.from = user;
      actionTx.data = txData;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.borrow].limit,
      );
      return actionTx;
    };

    this.generateSupplyWithPermitTxData = ({
      user,
      reserve,
      amount,
      onBehalfOf,
      referralCode,
      deadline,
      permitR,
      permitS,
      permitV,
    }: LPSupplyWithPermitType) => {
      const actionTx: PopulatedTransaction = {};

      const txData = this.poolContractInstance.encodeFunctionData(
        'supplyWithPermit',
        [
          reserve,
          amount,
          onBehalfOf ?? user,
          referralCode ?? '0',
          deadline,
          permitV,
          permitR,
          permitS,
        ],
      );

      actionTx.to = this.l2PoolAddress;
      actionTx.from = user;
      actionTx.data = txData;
      return actionTx;
    };

    this.generateEncodedSupplyTxData = ({
      encodedTxData,
      user,
    }: {
      encodedTxData: string;
      user: string;
    }) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.l2PoolContractInstance.encodeFunctionData('supply', [
        encodedTxData,
      ]);

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.supply].limit,
      );
      return actionTx;
    };

    this.generateEncodedBorrowTxData = ({
      encodedTxData,
      user,
    }: {
      encodedTxData: string;
      user: string;
    }) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.l2PoolContractInstance.encodeFunctionData('borrow', [
        encodedTxData,
      ]);

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.borrow].limit,
      );
      return actionTx;
    };

    this.generateEncodedSupplyWithPermitTxData = ({
      encodedTxData,
      signature,
      user,
    }: {
      encodedTxData: string;
      signature: string;
      user: string;
    }) => {
      const actionTx: PopulatedTransaction = {};
      const decomposedSignature: Signature = splitSignature(signature);
      const txData = this.l2PoolContractInstance.encodeFunctionData(
        'supplyWithPermit',
        [encodedTxData, decomposedSignature.r, decomposedSignature.s],
      );

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.supplyWithPermit].limit,
      );
      return actionTx;
    };

    this.generateEncodedRepayTxData = ({ encodedTxData, user }) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.l2PoolContractInstance.encodeFunctionData('repay', [
        encodedTxData,
      ]);

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.repay].limit,
      );
      return actionTx;
    };

    this.generateEncodedRepayWithPermitTxData = ({
      encodedTxData,
      user,
      signature,
    }) => {
      const actionTx: PopulatedTransaction = {};
      const decomposedSignature: Signature = splitSignature(signature);
      const txData = this.l2PoolContractInstance.encodeFunctionData(
        'repayWithPermit',
        [encodedTxData, decomposedSignature.r, decomposedSignature.s],
      );

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.repayWithPermit].limit,
      );
      return actionTx;
    };

    this.generateEncodedRepayWithATokensTxData = ({ encodedTxData, user }) => {
      const actionTx: PopulatedTransaction = {};
      const txData = this.l2PoolContractInstance.encodeFunctionData(
        'repayWithATokens',
        [encodedTxData],
      );

      actionTx.to = this.l2PoolAddress;
      actionTx.data = txData;
      actionTx.from = user;
      actionTx.gasLimit = BigNumber.from(
        gasLimitRecommendations[ProtocolAction.repayWithATokens].limit,
      );
      return actionTx;
    };
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

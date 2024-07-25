/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import type { TypedEventFilter, TypedEvent, TypedListener } from './common';

interface IUiPoolDataProviderV3Interface extends ethers.utils.Interface {
  functions: {
    'getReservesData(address)': FunctionFragment;
    'getReservesList(address)': FunctionFragment;
    'getUserReservesData(address,address)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'getReservesData',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getReservesList',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserReservesData',
    values: [string, string],
  ): string;

  decodeFunctionResult(
    functionFragment: 'getReservesData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getReservesList',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getUserReservesData',
    data: BytesLike,
  ): Result;

  events: {};
}

export class IUiPoolDataProviderV3 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IUiPoolDataProviderV3Interface;

  functions: {
    getReservesData(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        ([
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          number,
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          BigNumber,
          BigNumber,
          number,
          BigNumber,
          BigNumber,
          number,
          number,
          number,
          string,
          string,
          boolean,
          boolean,
          BigNumber,
        ] & {
          underlyingAsset: string;
          name: string;
          symbol: string;
          decimals: BigNumber;
          baseLTVasCollateral: BigNumber;
          reserveLiquidationThreshold: BigNumber;
          reserveLiquidationBonus: BigNumber;
          reserveFactor: BigNumber;
          usageAsCollateralEnabled: boolean;
          borrowingEnabled: boolean;
          stableBorrowRateEnabled: boolean;
          isActive: boolean;
          isFrozen: boolean;
          liquidityIndex: BigNumber;
          variableBorrowIndex: BigNumber;
          liquidityRate: BigNumber;
          variableBorrowRate: BigNumber;
          stableBorrowRate: BigNumber;
          lastUpdateTimestamp: number;
          aTokenAddress: string;
          stableDebtTokenAddress: string;
          variableDebtTokenAddress: string;
          interestRateStrategyAddress: string;
          availableLiquidity: BigNumber;
          totalPrincipalStableDebt: BigNumber;
          averageStableRate: BigNumber;
          stableDebtLastUpdateTimestamp: BigNumber;
          totalScaledVariableDebt: BigNumber;
          priceInMarketReferenceCurrency: BigNumber;
          priceOracle: string;
          variableRateSlope1: BigNumber;
          variableRateSlope2: BigNumber;
          stableRateSlope1: BigNumber;
          stableRateSlope2: BigNumber;
          baseStableBorrowRate: BigNumber;
          baseVariableBorrowRate: BigNumber;
          optimalUsageRatio: BigNumber;
          isPaused: boolean;
          isSiloedBorrowing: boolean;
          accruedToTreasury: BigNumber;
          unbacked: BigNumber;
          isolationModeTotalDebt: BigNumber;
          flashLoanEnabled: boolean;
          debtCeiling: BigNumber;
          debtCeilingDecimals: BigNumber;
          eModeCategoryId: number;
          borrowCap: BigNumber;
          supplyCap: BigNumber;
          eModeLtv: number;
          eModeLiquidationThreshold: number;
          eModeLiquidationBonus: number;
          eModePriceSource: string;
          eModeLabel: string;
          borrowableInIsolation: boolean;
          virtualAccActive: boolean;
          virtualUnderlyingBalance: BigNumber;
        })[],
        [BigNumber, BigNumber, BigNumber, number] & {
          marketReferenceCurrencyUnit: BigNumber;
          marketReferenceCurrencyPriceInUsd: BigNumber;
          networkBaseTokenPriceInUsd: BigNumber;
          networkBaseTokenPriceDecimals: number;
        },
      ]
    >;

    getReservesList(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<[string[]]>;

    getUserReservesData(
      provider: string,
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        ([
          string,
          BigNumber,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          underlyingAsset: string;
          scaledATokenBalance: BigNumber;
          usageAsCollateralEnabledOnUser: boolean;
          stableBorrowRate: BigNumber;
          scaledVariableDebt: BigNumber;
          principalStableDebt: BigNumber;
          stableBorrowLastUpdateTimestamp: BigNumber;
        })[],
        number,
      ]
    >;
  };

  getReservesData(
    provider: string,
    overrides?: CallOverrides,
  ): Promise<
    [
      ([
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        string,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        BigNumber,
        BigNumber,
        number,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        string,
        string,
        boolean,
        boolean | undefined,
        BigNumber | undefined,
      ] & {
        underlyingAsset: string;
        name: string;
        symbol: string;
        decimals: BigNumber;
        baseLTVasCollateral: BigNumber;
        reserveLiquidationThreshold: BigNumber;
        reserveLiquidationBonus: BigNumber;
        reserveFactor: BigNumber;
        usageAsCollateralEnabled: boolean;
        borrowingEnabled: boolean;
        stableBorrowRateEnabled: boolean;
        isActive: boolean;
        isFrozen: boolean;
        liquidityIndex: BigNumber;
        variableBorrowIndex: BigNumber;
        liquidityRate: BigNumber;
        variableBorrowRate: BigNumber;
        stableBorrowRate: BigNumber;
        lastUpdateTimestamp: number;
        aTokenAddress: string;
        stableDebtTokenAddress: string;
        variableDebtTokenAddress: string;
        interestRateStrategyAddress: string;
        availableLiquidity: BigNumber;
        totalPrincipalStableDebt: BigNumber;
        averageStableRate: BigNumber;
        stableDebtLastUpdateTimestamp: BigNumber;
        totalScaledVariableDebt: BigNumber;
        priceInMarketReferenceCurrency: BigNumber;
        priceOracle: string;
        variableRateSlope1: BigNumber;
        variableRateSlope2: BigNumber;
        stableRateSlope1: BigNumber;
        stableRateSlope2: BigNumber;
        baseStableBorrowRate: BigNumber;
        baseVariableBorrowRate: BigNumber;
        optimalUsageRatio: BigNumber;
        isPaused: boolean;
        isSiloedBorrowing: boolean;
        accruedToTreasury: BigNumber;
        unbacked: BigNumber;
        isolationModeTotalDebt: BigNumber;
        flashLoanEnabled: boolean;
        debtCeiling: BigNumber;
        debtCeilingDecimals: BigNumber;
        eModeCategoryId: number;
        borrowCap: BigNumber;
        supplyCap: BigNumber;
        eModeLtv: number;
        eModeLiquidationThreshold: number;
        eModeLiquidationBonus: number;
        eModePriceSource: string;
        eModeLabel: string;
        borrowableInIsolation: boolean;
        virtualAccActive: boolean | undefined;
        virtualUnderlyingBalance: BigNumber | undefined;
      })[],
      [BigNumber, BigNumber, BigNumber, number] & {
        marketReferenceCurrencyUnit: BigNumber;
        marketReferenceCurrencyPriceInUsd: BigNumber;
        networkBaseTokenPriceInUsd: BigNumber;
        networkBaseTokenPriceDecimals: number;
      },
    ]
  >;

  getReservesList(
    provider: string,
    overrides?: CallOverrides,
  ): Promise<string[]>;

  getUserReservesData(
    provider: string,
    user: string,
    overrides?: CallOverrides,
  ): Promise<
    [
      ([
        string,
        BigNumber,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
      ] & {
        underlyingAsset: string;
        scaledATokenBalance: BigNumber;
        usageAsCollateralEnabledOnUser: boolean;
        stableBorrowRate: BigNumber;
        scaledVariableDebt: BigNumber;
        principalStableDebt: BigNumber;
        stableBorrowLastUpdateTimestamp: BigNumber;
      })[],
      number,
    ]
  >;

  callStatic: {
    getReservesData(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        ([
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          number,
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          boolean,
          BigNumber,
          BigNumber,
          number,
          BigNumber,
          BigNumber,
          number,
          number,
          number,
          string,
          string,
          boolean,
          boolean,
          BigNumber,
        ] & {
          underlyingAsset: string;
          name: string;
          symbol: string;
          decimals: BigNumber;
          baseLTVasCollateral: BigNumber;
          reserveLiquidationThreshold: BigNumber;
          reserveLiquidationBonus: BigNumber;
          reserveFactor: BigNumber;
          usageAsCollateralEnabled: boolean;
          borrowingEnabled: boolean;
          stableBorrowRateEnabled: boolean;
          isActive: boolean;
          isFrozen: boolean;
          liquidityIndex: BigNumber;
          variableBorrowIndex: BigNumber;
          liquidityRate: BigNumber;
          variableBorrowRate: BigNumber;
          stableBorrowRate: BigNumber;
          lastUpdateTimestamp: number;
          aTokenAddress: string;
          stableDebtTokenAddress: string;
          variableDebtTokenAddress: string;
          interestRateStrategyAddress: string;
          availableLiquidity: BigNumber;
          totalPrincipalStableDebt: BigNumber;
          averageStableRate: BigNumber;
          stableDebtLastUpdateTimestamp: BigNumber;
          totalScaledVariableDebt: BigNumber;
          priceInMarketReferenceCurrency: BigNumber;
          priceOracle: string;
          variableRateSlope1: BigNumber;
          variableRateSlope2: BigNumber;
          stableRateSlope1: BigNumber;
          stableRateSlope2: BigNumber;
          baseStableBorrowRate: BigNumber;
          baseVariableBorrowRate: BigNumber;
          optimalUsageRatio: BigNumber;
          isPaused: boolean;
          isSiloedBorrowing: boolean;
          accruedToTreasury: BigNumber;
          unbacked: BigNumber;
          isolationModeTotalDebt: BigNumber;
          flashLoanEnabled: boolean;
          debtCeiling: BigNumber;
          debtCeilingDecimals: BigNumber;
          eModeCategoryId: number;
          borrowCap: BigNumber;
          supplyCap: BigNumber;
          eModeLtv: number;
          eModeLiquidationThreshold: number;
          eModeLiquidationBonus: number;
          eModePriceSource: string;
          eModeLabel: string;
          borrowableInIsolation: boolean;
          virtualAccActive: boolean;
          virtualUnderlyingBalance: BigNumber;
        })[],
        [BigNumber, BigNumber, BigNumber, number] & {
          marketReferenceCurrencyUnit: BigNumber;
          marketReferenceCurrencyPriceInUsd: BigNumber;
          networkBaseTokenPriceInUsd: BigNumber;
          networkBaseTokenPriceDecimals: number;
        },
      ]
    >;

    getReservesList(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<string[]>;

    getUserReservesData(
      provider: string,
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        ([
          string,
          BigNumber,
          boolean,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          underlyingAsset: string;
          scaledATokenBalance: BigNumber;
          usageAsCollateralEnabledOnUser: boolean;
          stableBorrowRate: BigNumber;
          scaledVariableDebt: BigNumber;
          principalStableDebt: BigNumber;
          stableBorrowLastUpdateTimestamp: BigNumber;
        })[],
        number,
      ]
    >;
  };

  filters: {};

  estimateGas: {
    getReservesData(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getReservesList(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserReservesData(
      provider: string,
      user: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getReservesData(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getReservesList(
      provider: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserReservesData(
      provider: string,
      user: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}

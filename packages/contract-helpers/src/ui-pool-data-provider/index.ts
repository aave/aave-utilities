import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { UiPoolDataProvider as UiPoolDataProviderContract } from './typechain/UiPoolDataProvider';
import { UiPoolDataProviderFactory } from './typechain/UiPoolDataProviderFactory';
import {
  ReservesData,
  UserReserveData,
  PoolBaseCurrencyHumanized,
  ReserveDataHumanized,
  ReservesDataHumanized,
  UserReserveDataHumanized,
} from './types/UiPoolDataProviderTypes';

export * from './types/UiPoolDataProviderTypes';

export interface UiPoolDataProviderContext {
  uiPoolDataProviderAddress: string;
  provider: providers.Provider;
}

export interface UiPoolDataProviderInterface {
  getReservesList: (lendingPoolAddressProvider: string) => Promise<string[]>;
  getReservesData: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReservesData>;
  getUserReservesData: (
    lendingPoolAddressProvider: string,
    user: string,
  ) => Promise<UserReserveData[]>;
  getReservesHumanized: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReservesDataHumanized>;
  getUserReservesHumanized: (
    lendingPoolAddressProvider: string,
    user: string,
  ) => Promise<UserReserveDataHumanized[]>;
}

export class UiPoolDataProvider implements UiPoolDataProviderInterface {
  private readonly _contract: UiPoolDataProviderContract;

  /**
   * Constructor
   * @param context The ui pool data provider context
   */
  public constructor(context: UiPoolDataProviderContext) {
    if (!isAddress(context.uiPoolDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    this._contract = UiPoolDataProviderFactory.connect(
      context.uiPoolDataProviderAddress,
      context.provider,
    );
  }

  /**
   * Get the underlying asset address for each lending pool reserve
   */
  public async getReservesList(
    lendingPoolAddressProvider: string,
  ): Promise<string[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address is not valid');
    }

    return this._contract.getReservesList(lendingPoolAddressProvider);
  }

  /**
   * Get data for each lending pool reserve
   */
  public async getReservesData(
    lendingPoolAddressProvider: string,
  ): Promise<ReservesData> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address is not valid');
    }

    return this._contract.getReservesData(lendingPoolAddressProvider);
  }

  /**
   * Get data for each user reserve on the lending pool
   */
  public async getUserReservesData(
    lendingPoolAddressProvider: string,
    user: string,
  ): Promise<UserReserveData[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address is not valid');
    }

    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesData(lendingPoolAddressProvider, user);
  }

  public async getReservesHumanized(
    lendingPoolAddressProvider: string,
  ): Promise<ReservesDataHumanized> {
    const {
      0: reservesRaw,
      1: poolBaseCurrencyRaw,
    }: ReservesData = await this.getReservesData(lendingPoolAddressProvider);

    const reservesData: ReserveDataHumanized[] = reservesRaw.map(
      reserveRaw => ({
        id: (
          reserveRaw.underlyingAsset + lendingPoolAddressProvider
        ).toLowerCase(),
        underlyingAsset: reserveRaw.underlyingAsset.toLowerCase(),
        name: reserveRaw.name,
        symbol: reserveRaw.symbol,
        decimals: reserveRaw.decimals.toNumber(),
        baseLTVasCollateral: reserveRaw.baseLTVasCollateral.toString(),
        reserveLiquidationThreshold: reserveRaw.reserveLiquidationThreshold.toString(),
        reserveLiquidationBonus: reserveRaw.reserveLiquidationBonus.toString(),
        reserveFactor: reserveRaw.reserveFactor.toString(),
        usageAsCollateralEnabled: reserveRaw.usageAsCollateralEnabled,
        borrowingEnabled: reserveRaw.borrowingEnabled,
        stableBorrowRateEnabled: reserveRaw.stableBorrowRateEnabled,
        isActive: reserveRaw.isActive,
        isFrozen: reserveRaw.isFrozen,
        liquidityIndex: reserveRaw.liquidityIndex.toString(),
        variableBorrowIndex: reserveRaw.variableBorrowIndex.toString(),
        liquidityRate: reserveRaw.liquidityRate.toString(),
        variableBorrowRate: reserveRaw.variableBorrowRate.toString(),
        stableBorrowRate: reserveRaw.stableBorrowRate.toString(),
        lastUpdateTimestamp: reserveRaw.lastUpdateTimestamp,
        aTokenAddress: reserveRaw.aTokenAddress.toString(),
        stableDebtTokenAddress: reserveRaw.stableDebtTokenAddress.toString(),
        variableDebtTokenAddress: reserveRaw.variableDebtTokenAddress.toString(),
        interestRateStrategyAddress: reserveRaw.interestRateStrategyAddress.toString(),
        availableLiquidity: reserveRaw.availableLiquidity.toString(),
        totalPrincipalStableDebt: reserveRaw.totalPrincipalStableDebt.toString(),
        averageStableRate: reserveRaw.averageStableRate.toString(),
        stableDebtLastUpdateTimestamp: reserveRaw.stableDebtLastUpdateTimestamp.toNumber(),
        totalScaledVariableDebt: reserveRaw.totalScaledVariableDebt.toString(),
        priceInMarketReferenceCurrency: reserveRaw.priceInMarketReferenceCurrency.toString(),
        variableRateSlope1: reserveRaw.variableRateSlope1.toString(),
        variableRateSlope2: reserveRaw.variableRateSlope2.toString(),
        stableRateSlope1: reserveRaw.stableRateSlope1.toString(),
        stableRateSlope2: reserveRaw.stableRateSlope2.toString(),
      }),
    );

    const baseCurrencyData: PoolBaseCurrencyHumanized = {
      baseCurrencyDecimals: poolBaseCurrencyRaw.baseCurrencyDecimals.toNumber(),
      baseCurrencyPriceInUsd: poolBaseCurrencyRaw.baseCurrencyPriceInUsd.toString(),
      networkBaseTokenPriceInUsd: poolBaseCurrencyRaw.networkBaseTokenPriceInUsd.toString(),
      networkBaseTokenDecimals: poolBaseCurrencyRaw.networkBaseTokenDecimals,
    };

    return {
      reservesData,
      baseCurrencyData,
    };
  }

  public async getUserReservesHumanized(
    lendingPoolAddressProvider: string,
    user: string,
  ): Promise<UserReserveDataHumanized[]> {
    const userReservesRaw: UserReserveData[] = await this.getUserReservesData(
      lendingPoolAddressProvider,
      user,
    );

    return userReservesRaw.map((userReserveRaw: UserReserveData) => ({
      underlyingAsset: userReserveRaw.underlyingAsset.toLowerCase(),
      scaledATokenBalance: userReserveRaw.scaledATokenBalance.toString(),
      usageAsCollateralEnabledOnUser:
        userReserveRaw.usageAsCollateralEnabledOnUser,
      stableBorrowRate: userReserveRaw.stableBorrowRate.toString(),
      scaledVariableDebt: userReserveRaw.scaledVariableDebt.toString(),
      principalStableDebt: userReserveRaw.principalStableDebt.toString(),
      stableBorrowLastUpdateTimestamp: userReserveRaw.stableBorrowLastUpdateTimestamp.toNumber(),
    }));
  }
}

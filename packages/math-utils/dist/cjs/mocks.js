"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIncentiveMock = exports.ReserveIncentiveMock = exports.UserReserveMock = exports.ReserveMock = void 0;
const tslib_1 = require("tslib");
const bignumber_js_1 = (0, tslib_1.__importDefault)(require("bignumber.js"));
const ray_math_1 = require("./ray.math");
class ReserveMock {
    constructor(config = { decimals: 18 }) {
        this.config = config;
        this.reserve = {
            id: '0x0',
            symbol: 'TEST',
            name: 'TEST',
            decimals: config.decimals,
            underlyingAsset: '0x0',
            usageAsCollateralEnabled: true,
            eModeCategoryId: 1,
            reserveFactor: '0',
            baseLTVasCollateral: '5000',
            averageStableRate: '0',
            stableDebtLastUpdateTimestamp: 1,
            liquidityIndex: ray_math_1.RAY.toString(),
            reserveLiquidationThreshold: '6000',
            reserveLiquidationBonus: '0',
            variableBorrowIndex: ray_math_1.RAY.toString(),
            variableBorrowRate: ray_math_1.RAY.multipliedBy(3).toString(),
            availableLiquidity: '0',
            stableBorrowRate: ray_math_1.RAY.multipliedBy(2).toString(),
            liquidityRate: ray_math_1.RAY.multipliedBy(1).toString(),
            totalPrincipalStableDebt: '0',
            totalScaledVariableDebt: '0',
            lastUpdateTimestamp: 1,
            borrowCap: '0',
            supplyCap: '0',
            debtCeiling: '0',
            debtCeilingDecimals: 2,
            isolationModeTotalDebt: '',
            eModeLtv: 6000,
            eModeLiquidationThreshold: 7000,
            eModeLiquidationBonus: 0,
            unbacked: '0',
        };
    }
    addLiquidity(amount) {
        this.reserve.availableLiquidity = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.availableLiquidity)
            .toString();
        return this;
    }
    addVariableDebt(amount) {
        this.reserve.totalScaledVariableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.totalScaledVariableDebt)
            .toString();
        return this;
    }
    addStableDebt(amount) {
        this.reserve.totalPrincipalStableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.totalPrincipalStableDebt)
            .toString();
        return this;
    }
    addUnbacked(amount) {
        this.reserve.unbacked = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .toString();
        return this;
    }
}
exports.ReserveMock = ReserveMock;
class UserReserveMock {
    constructor(config = { decimals: 18 }) {
        this.config = config;
        this.userReserve = {
            underlyingAsset: '0x0000000000000000000000000000000000000000',
            scaledATokenBalance: '0',
            usageAsCollateralEnabledOnUser: true,
            stableBorrowRate: ray_math_1.RAY.multipliedBy(2).toString(),
            scaledVariableDebt: '0',
            principalStableDebt: '0',
            stableBorrowLastUpdateTimestamp: 1,
        };
        const reserveMock = new ReserveMock({ decimals: config.decimals });
        this.reserve = Object.assign(Object.assign({}, reserveMock.reserve), { underlyingAsset: '0x0000000000000000000000000000000000000000', id: '0x0', symbol: 'TEST', name: 'TEST', decimals: config.decimals, usageAsCollateralEnabled: true, eModeCategoryId: 1, formattedBaseLTVasCollateral: '0.5', liquidityIndex: ray_math_1.RAY.toString(), formattedReserveLiquidationThreshold: '0.6', formattedReserveLiquidationBonus: '0', variableBorrowIndex: ray_math_1.RAY.toString(), variableBorrowRate: ray_math_1.RAY.multipliedBy(3).toString(), formattedAvailableLiquidity: '0', liquidityRate: ray_math_1.RAY.multipliedBy(1).toString(), totalPrincipalStableDebt: '0', totalScaledVariableDebt: '0', lastUpdateTimestamp: 1, debtCeiling: '0', debtCeilingDecimals: 2, isolationModeTotalDebt: '', formattedEModeLtv: '0.6', formattedEModeLiquidationThreshold: '0.7', formattedEModeLiquidationBonus: '0', priceInUSD: '10', totalLiquidityUSD: '0', availableLiquidityUSD: '0', totalDebtUSD: '0', totalVariableDebtUSD: '0', totalStableDebtUSD: '0', borrowCapUSD: '0', supplyCapUSD: '0', unbackedUSD: '0', priceInMarketReferenceCurrency: (10 ** 19).toString(), formattedPriceInMarketReferenceCurrency: '10', unborrowedLiquidity: '0', supplyAPY: '0', supplyAPR: '0', variableBorrowAPY: '0', variableBorrowAPR: '0', stableBorrowAPY: '0', stableBorrowAPR: '0', borrowUsageRatio: '0', supplyUsageRatio: '0', totalStableDebt: '0', totalVariableDebt: '0', totalDebt: '0', totalLiquidity: '0', debtCeilingUSD: '0', availableDebtCeilingUSD: '0', isolationModeTotalDebtUSD: '0', isIsolated: true });
    }
    supply(amount) {
        this.userReserve.scaledATokenBalance = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.userReserve.scaledATokenBalance)
            .toString();
        this.reserve.availableLiquidity = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.availableLiquidity)
            .toString();
        return this;
    }
    variableBorrow(amount) {
        this.userReserve.scaledVariableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.userReserve.scaledVariableDebt)
            .toString();
        this.reserve.totalScaledVariableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.totalScaledVariableDebt)
            .toString();
        return this;
    }
    stableBorrow(amount) {
        this.userReserve.principalStableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.userReserve.principalStableDebt)
            .toString();
        this.reserve.totalPrincipalStableDebt = new bignumber_js_1.default(amount)
            .shiftedBy(this.config.decimals)
            .plus(this.reserve.totalPrincipalStableDebt)
            .toString();
        return this;
    }
}
exports.UserReserveMock = UserReserveMock;
class ReserveIncentiveMock {
    constructor() {
        this.reserveIncentive = {
            underlyingAsset: '0x0000000000000000000000000000000000000000',
            aIncentiveData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                rewardsTokenInformation: [
                    {
                        rewardTokenSymbol: 'Test',
                        emissionPerSecond: (10 ** 18).toString(),
                        incentivesLastUpdateTimestamp: 1,
                        tokenIncentivesIndex: ray_math_1.RAY.toString(),
                        emissionEndTimestamp: 2,
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        precision: 18,
                        rewardPriceFeed: (10 ** 9).toString(),
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0000000000000000000000000000000000000000',
                    },
                ],
            },
            vIncentiveData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                rewardsTokenInformation: [
                    {
                        rewardTokenSymbol: 'Test',
                        emissionPerSecond: (10 ** 18).toString(),
                        incentivesLastUpdateTimestamp: 1,
                        tokenIncentivesIndex: ray_math_1.RAY.toString(),
                        emissionEndTimestamp: 2,
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        precision: 18,
                        rewardPriceFeed: (10 ** 9).toString(),
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0000000000000000000000000000000000000000',
                    },
                ],
            },
            sIncentiveData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                rewardsTokenInformation: [
                    {
                        rewardTokenSymbol: 'Test',
                        emissionPerSecond: '0',
                        incentivesLastUpdateTimestamp: 1,
                        tokenIncentivesIndex: '0',
                        emissionEndTimestamp: 2,
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        precision: 18,
                        rewardPriceFeed: '0',
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0000000000000000000000000000000000000000',
                    },
                ],
            },
        };
    }
}
exports.ReserveIncentiveMock = ReserveIncentiveMock;
class UserIncentiveMock {
    constructor() {
        this.userIncentive = {
            underlyingAsset: '0x0000000000000000000000000000000000000000',
            aTokenIncentivesUserData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                userRewardsInformation: [
                    {
                        tokenIncentivesUserIndex: '0',
                        userUnclaimedRewards: '1',
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        rewardPriceFeed: (10 ** 19).toString(),
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0',
                        rewardTokenSymbol: 'Test',
                    },
                ],
            },
            vTokenIncentivesUserData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                userRewardsInformation: [
                    {
                        tokenIncentivesUserIndex: '0',
                        userUnclaimedRewards: '1',
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        rewardPriceFeed: (10 ** 19).toString(),
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0',
                        rewardTokenSymbol: 'Test',
                    },
                ],
            },
            sTokenIncentivesUserData: {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                incentiveControllerAddress: '0x0000000000000000000000000000000000000000',
                userRewardsInformation: [
                    {
                        tokenIncentivesUserIndex: '0',
                        userUnclaimedRewards: '1',
                        rewardTokenAddress: '0x0000000000000000000000000000000000000000',
                        rewardTokenDecimals: 18,
                        rewardPriceFeed: (10 ** 19).toString(),
                        priceFeedDecimals: 8,
                        rewardOracleAddress: '0x0',
                        rewardTokenSymbol: 'Test',
                    },
                ],
            },
        };
    }
}
exports.UserIncentiveMock = UserIncentiveMock;
//# sourceMappingURL=mocks.js.map
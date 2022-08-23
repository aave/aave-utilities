"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackeUiDataProviderValidator = exports.GovDelegationValidator = exports.GovValidator = exports.GovHelperValidator = exports.WETHValidator = exports.FaucetValidator = exports.SignStakingValidator = exports.StakingValidator = exports.RepayWithCollateralValidator = exports.LiquiditySwapValidator = exports.ERC20Validator = exports.SynthetixValidator = exports.DebtTokenValidator = exports.IncentivesValidator = exports.UiIncentiveDataProviderValidator = exports.LPValidatorV3 = exports.L2PValidator = exports.LPValidator = exports.LPSwapCollateralValidatorV3 = exports.LPRepayWithCollateralValidatorV3 = exports.LPSwapCollateralValidator = exports.LPRepayWithCollateralValidator = exports.LPFlashLiquidationValidatorV3 = exports.LPFlashLiquidationValidator = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
const ethers_1 = require("ethers");
const validations_1 = require("./validations");
function LPFlashLiquidationValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.lendingPoolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.flashLiquidationAddress)) {
            console.error(`[LPFlahsLiquidationValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPFlashLiquidationValidator = LPFlashLiquidationValidator;
function LPFlashLiquidationValidatorV3(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.poolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.flashLiquidationAddress)) {
            console.error(`[LPFlahsLiquidationValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPFlashLiquidationValidatorV3 = LPFlashLiquidationValidatorV3;
function LPRepayWithCollateralValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.lendingPoolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.repayWithCollateralAddress)) {
            console.error(`[LPRepayWithCollateralValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPRepayWithCollateralValidator = LPRepayWithCollateralValidator;
function LPSwapCollateralValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.lendingPoolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.swapCollateralAddress)) {
            console.error(`[LPSwapCollateralValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPSwapCollateralValidator = LPSwapCollateralValidator;
function LPRepayWithCollateralValidatorV3(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.poolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.repayWithCollateralAddress)) {
            console.error(`[LPRepayWithCollateralValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPRepayWithCollateralValidatorV3 = LPRepayWithCollateralValidatorV3;
function LPSwapCollateralValidatorV3(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.poolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.swapCollateralAddress)) {
            console.error(`[LPSwapCollateralValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPSwapCollateralValidatorV3 = LPSwapCollateralValidatorV3;
function LPValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.lendingPoolAddress)) {
            console.error(`[LendingPoolValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPValidator = LPValidator;
function L2PValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.l2PoolAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.encoderAddress)) {
            console.error(
            // @ts-expect-error todo: check why this ignore is needed
            `[L2PoolValidator] You need to pass valid addresses: l2pool: ${this.l2PoolAddress} encoder: ${this.encoderAddress}`);
            return [];
        }
        // isEthAddressValidator(target, propertyName, arguments);
        (0, validations_1.isDeadline32BytesValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.L2PValidator = L2PValidator;
function LPValidatorV3(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.poolAddress)) {
            console.error(`[PoolValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LPValidatorV3 = LPValidatorV3;
function UiIncentiveDataProviderValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.uiIncentiveDataProviderAddress)) {
            console.error(`[UiIncentiveDataProviderValidator] You need to pass valid addresses`);
            throw new Error('UiIncentiveDataProviderAddress must be an eth valid address');
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.UiIncentiveDataProviderValidator = UiIncentiveDataProviderValidator;
// export function LTAMigratorValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const LEND_TO_AAVE_MIGRATOR =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.migratorConfig?.LEND_TO_AAVE_MIGRATOR || '';
//     if (!utils.isAddress(LEND_TO_AAVE_MIGRATOR)) {
//       console.error(`[MigratorValidator] You need to pass valid addresses`);
//       return [];
//     }
//     isEthAddressValidator(target, propertyName, arguments);
//     amountGtThan0Validator(target, propertyName, arguments);
//     return method?.apply(this, arguments);
//   };
// }
function IncentivesValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.isEthAddressArrayValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.IncentivesValidator = IncentivesValidator;
function DebtTokenValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.DebtTokenValidator = DebtTokenValidator;
function SynthetixValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.SynthetixValidator = SynthetixValidator;
function ERC20Validator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.ERC20Validator = ERC20Validator;
function LiquiditySwapValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.liquiditySwapAdapterAddress)) {
            console.error(`[LiquiditySwapValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.LiquiditySwapValidator = LiquiditySwapValidator;
function RepayWithCollateralValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.repayWithCollateralAddress)) {
            console.error(`[RepayWithCollateralValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.RepayWithCollateralValidator = RepayWithCollateralValidator;
function StakingValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.stakingContractAddress)) {
            console.error(`[StakingValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.StakingValidator = StakingValidator;
function SignStakingValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.stakingContractAddress) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.stakingHelperContractAddress)) {
            console.error(`[StakingValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.SignStakingValidator = SignStakingValidator;
function FaucetValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.faucetAddress)) {
            console.error(`[FaucetValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.FaucetValidator = FaucetValidator;
function WETHValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        // @ts-expect-error todo: check why this ignore is needed
        if (!ethers_1.utils.isAddress(this.wethGatewayAddress)) {
            console.error(`[WethGatewayValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0OrMinus1)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.WETHValidator = WETHValidator;
function GovHelperValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.aaveGovernanceV2Address) ||
            // @ts-expect-error todo: check why this ignore is needed
            !ethers_1.utils.isAddress(this.aaveGovernanceV2HelperAddress)) {
            console.error(`[GovernanceValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        (0, validations_1.isEthAddressArrayValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.GovHelperValidator = GovHelperValidator;
function GovValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        if (
        // @ts-expect-error todo: check why this ignore is needed
        !ethers_1.utils.isAddress(this.aaveGovernanceV2Address)) {
            console.error(`[GovernanceValidator] You need to pass valid addresses`);
            return [];
        }
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.GovValidator = GovValidator;
function GovDelegationValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        (0, validations_1.isEthAddressOrEnsValidator)(target, propertyName, arguments);
        (0, validations_1.amountGtThan0Validator)(target, propertyName, arguments);
        (0, validations_1.amount0OrPositiveValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.GovDelegationValidator = GovDelegationValidator;
function StackeUiDataProviderValidator(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function () {
        (0, validations_1.isEthAddressValidator)(target, propertyName, arguments);
        return method.apply(this, arguments);
    };
}
exports.StackeUiDataProviderValidator = StackeUiDataProviderValidator;
//# sourceMappingURL=methodValidators.js.map
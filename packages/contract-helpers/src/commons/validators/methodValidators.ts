/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { utils } from 'ethers';
import {
  // amount0OrPositiveValidator,
  // amountGtThan0OrMinus1,
  // amountGtThan0Validator,
  isEthAddressArrayValidatorNotEmpty,
  // isEthAddressOrEnsValidator,
  isEthAddressValidator,
  // optionalValidator,
} from './validations';

// export function LPFlashLiquidationValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const { LENDING_POOL, FLASH_LIQUIDATION_ADAPTER } =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.lendingPoolConfig || {};

//     if (
//       !utils.isAddress(LENDING_POOL) ||
//       !FLASH_LIQUIDATION_ADAPTER ||
//       !utils.isAddress(FLASH_LIQUIDATION_ADAPTER)
//     ) {
//       console.error(
//         `[LPFlahsLiquidationValidator] You need to pass valid addresses`,
//       );
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function LPRepayWithCollateralValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const { LENDING_POOL, REPAY_WITH_COLLATERAL_ADAPTER } =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.lendingPoolConfig || {};

//     if (
//       !utils.isAddress(LENDING_POOL) ||
//       !REPAY_WITH_COLLATERAL_ADAPTER ||
//       !utils.isAddress(REPAY_WITH_COLLATERAL_ADAPTER)
//     ) {
//       console.error(
//         `[LPRepayWithCollateralValidator] You need to pass valid addresses`,
//       );
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function LPSwapCollateralValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const { LENDING_POOL, SWAP_COLLATERAL_ADAPTER } =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.lendingPoolConfig || {};

//     if (
//       !utils.isAddress(LENDING_POOL) ||
//       !SWAP_COLLATERAL_ADAPTER ||
//       !utils.isAddress(SWAP_COLLATERAL_ADAPTER)
//     ) {
//       console.error(
//         `[LPSwapCollateralValidator] You need to pass valid addresses`,
//       );
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function LPValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     // @ts-expect-error todo: check why this ignore is needed
//     const { LENDING_POOL } = this.lendingPoolConfig || {};

//     if (!utils.isAddress(LENDING_POOL)) {
//       console.error(`[LendingPoolValidator] You need to pass valid addresses`);
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

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

export function IncentivesValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);

    isEthAddressArrayValidatorNotEmpty(target, propertyName, arguments);

    return method?.apply(this, arguments);
  };
}

// export function LiquiditySwapValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const SWAP_COLLATERAL_ADAPTER =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.swapCollateralConfig.SWAP_COLLATERAL_ADAPTER || '';

//     if (!utils.isAddress(SWAP_COLLATERAL_ADAPTER)) {
//       console.error(
//         `[LiquiditySwapValidator] You need to pass valid addresses`,
//       );
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function RepayWithCollateralValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const REPAY_WITH_COLLATERAL_ADAPTER =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.repayWithCollateralConfig?.REPAY_WITH_COLLATERAL_ADAPTER || '';

//     if (!utils.isAddress(REPAY_WITH_COLLATERAL_ADAPTER)) {
//       console.error(
//         `[RepayWithCollateralValidator] You need to pass valid addresses`,
//       );
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function StakingValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     // No need to check if addresses exist for network
//     // because this is checked at initialization and type checking of config

//     // @ts-expect-error todo: check why this ignore is needed
//     const { TOKEN_STAKING, STAKING_REWARD_TOKEN } = this.stakingConfig || {};

//     // Check if addresses are valid.
//     if (
//       !utils.isAddress(TOKEN_STAKING) ||
//       !utils.isAddress(STAKING_REWARD_TOKEN)
//     ) {
//       console.error(`[StakingValidator] You need to pass valid addresses`);
//       return [];
//     }

//     const isParamOptional = optionalValidator(target, propertyName, arguments);

//     isEthAddressValidator(target, propertyName, arguments, isParamOptional);

//     amountGtThan0Validator(target, propertyName, arguments, isParamOptional);

//     return method?.apply(this, arguments);
//   };
// }

// export function SignStakingValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     // No need to check if addresses exist for network
//     // because this is checked at initialization and type checking of config

//     const { TOKEN_STAKING, STAKING_REWARD_TOKEN, STAKING_HELPER } =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.stakingConfig || {};

//     // Check if addresses are valid.
//     if (
//       !utils.isAddress(TOKEN_STAKING) ||
//       !utils.isAddress(STAKING_REWARD_TOKEN) ||
//       !STAKING_HELPER ||
//       !utils.isAddress(TOKEN_STAKING)
//     ) {
//       console.error(`[StakingValidator] You need to pass valid addresses`);
//       return [];
//     }

//     const isParamOptional = optionalValidator(target, propertyName, arguments);

//     isEthAddressValidator(target, propertyName, arguments, isParamOptional);

//     amountGtThan0Validator(target, propertyName, arguments, isParamOptional);

//     return method?.apply(this, arguments);
//   };
// }

// export function FaucetValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     // @ts-expect-error todo: check why this ignore is needed
//     const FAUCET = this.faucetConfig?.FAUCET;

//     if (!FAUCET || (FAUCET && !utils.isAddress(FAUCET))) {
//       console.error(`[FaucetValidator] You need to pass valid addresses`);
//       return [];
//     }

//     const isParamOptional = optionalValidator(target, propertyName, arguments);

//     isEthAddressValidator(target, propertyName, arguments, isParamOptional);

//     amountGtThan0Validator(target, propertyName, arguments, isParamOptional);

//     return method?.apply(this, arguments);
//   };
// }

// export function WETHValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     // @ts-expect-error todo: check why this ignore is needed
//     const WETH_GATEWAY = this.wethGatewayConfig?.WETH_GATEWAY || '';

//     if (!utils.isAddress(WETH_GATEWAY)) {
//       console.error(`[WethGatewayValidator] You need to pass valid addresses`);
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     amountGtThan0OrMinus1(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function GovValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const {
//       AAVE_GOVERNANCE_V2,
//       AAVE_GOVERNANCE_V2_HELPER,
//       AAVE_GOVERNANCE_V2_EXECUTOR_SHORT,
//       AAVE_GOVERNANCE_V2_EXECUTOR_LONG,
//       // @ts-expect-error todo: check why this ignore is needed
//     } = this.governanceConfig || {};

//     if (
//       !utils.isAddress(AAVE_GOVERNANCE_V2) ||
//       !utils.isAddress(AAVE_GOVERNANCE_V2_HELPER) ||
//       !utils.isAddress(AAVE_GOVERNANCE_V2_EXECUTOR_SHORT) ||
//       !utils.isAddress(AAVE_GOVERNANCE_V2_EXECUTOR_LONG)
//     ) {
//       console.error(`[GovernanceValidator] You need to pass valid addresses`);
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amount0OrPositiveValidator(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

// export function GovDelegationValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     isEthAddressValidator(target, propertyName, arguments);
//     isEthAddressOrEnsValidator(target, propertyName, arguments);
//     amountGtThan0Validator(target, propertyName, arguments);
//     amount0OrPositiveValidator(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

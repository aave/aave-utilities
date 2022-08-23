import { BigNumberish, BytesLike } from 'ethers';
import { tEthereumAddress } from '../commons/types';
export declare type LPSupplyParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  referralCode?: string;
};
export declare type LPWithdrawParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
};
export declare type LPBorrowParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
  referralCode?: string;
};
export declare type LPRepayParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
};
export declare type LPSupplyWithPermitType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  deadline: BigNumberish;
  permitV: BigNumberish;
  permitR: BytesLike;
  permitS: BytesLike;
  referralCode?: string;
};
export declare type LPRepayWithPermitParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
  deadline: BigNumberish;
  permitV: BigNumberish;
  permitR: BytesLike;
  permitS: BytesLike;
};
export declare type LPRepayWithATokensType = {
  user: string;
  reserve: string;
  amount: string;
  numericRateMode: number;
};
export declare type LPSwapBorrowRateMode = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  numericRateMode: number;
};
export declare type LPSetUsageAsCollateral = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  usageAsCollateral: boolean;
};
export declare type LPLiquidationCall = {
  liquidator: tEthereumAddress;
  liquidatedUser: tEthereumAddress;
  debtReserve: tEthereumAddress;
  collateralReserve: tEthereumAddress;
  debtToCover: string;
  getAToken?: boolean;
};
//# sourceMappingURL=poolTypes.d.ts.map

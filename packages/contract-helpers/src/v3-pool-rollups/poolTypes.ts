import { BigNumberish, BytesLike } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type LPSupplyParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  referralCode?: string;
};

export type LPWithdrawParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
};

export type LPBorrowParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
  referralCode?: string;
  onBehalfOf?: string;
};

export type LPRepayParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
  onBehalfOf?: string;
};

export type LPSupplyWithPermitType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  deadline: BigNumberish;
  permitV: BigNumberish;
  permitR: BytesLike;
  permitS: BytesLike;
  referralCode?: string;
  onBehalfOf?: string;
};

export type LPRepayWithPermitParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  numericRateMode: number;
  deadline: BigNumberish;
  permitV: BigNumberish;
  permitR: BytesLike;
  permitS: BytesLike;
  onBehalfOf?: string;
};

export type LPRepayWithATokensType = {
  user: string;
  reserve: string;
  amount: string;
  numericRateMode: number;
};

export type LPSwapBorrowRateMode = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  numericRateMode: number;
};

export type LPSetUsageAsCollateral = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  usageAsCollateral: boolean;
};

export type LPLiquidationCall = {
  liquidator: tEthereumAddress;
  liquidatedUser: tEthereumAddress;
  debtReserve: tEthereumAddress;
  collateralReserve: tEthereumAddress;
  debtToCover: string;
  getAToken?: boolean;
};

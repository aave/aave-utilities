import { SignatureLike } from '@ethersproject/bytes';
import { BigNumberish, BytesLike } from 'ethers';
import {
  tEthereumAddress,
  InterestRate,
  PermitSignature,
} from '../commons/types';
import { IMigrationHelper } from '../v3-migration-contract/typechain';

export type LPSupplyParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  onBehalfOf?: tEthereumAddress;
  referralCode?: string;
  useOptimizedPath?: boolean;
};

export type LPWithdrawParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  onBehalfOf?: tEthereumAddress;
  aTokenAddress?: tEthereumAddress;
  useOptimizedPath?: boolean;
};

export type LPBorrowParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  interestRateMode: InterestRate;
  debtTokenAddress?: tEthereumAddress;
  onBehalfOf?: tEthereumAddress;
  referralCode?: string;
  useOptimizedPath?: boolean;
};

export type LPRepayParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: tEthereumAddress;
  useOptimizedPath?: boolean;
};

export type LPSwapBorrowRateMode = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  interestRateMode: InterestRate;
  useOptimizedPath?: boolean;
};

export type LPSetUsageAsCollateral = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  usageAsCollateral: boolean;
  useOptimizedPath?: boolean;
};
export type LPLiquidationCall = {
  liquidator: tEthereumAddress;
  liquidatedUser: tEthereumAddress;
  debtReserve: tEthereumAddress;
  collateralReserve: tEthereumAddress;
  purchaseAmount: string;
  getAToken?: boolean;
  liquidateAll?: boolean;
  useOptimizedPath?: boolean;
};

export type LPSwapCollateral = {
  user: tEthereumAddress;
  flash?: boolean;
  fromAsset: tEthereumAddress; // List of addresses of the underlying asset to be swap from
  fromAToken: tEthereumAddress;
  toAsset: tEthereumAddress; // List of the addresses of the reserve to be swapped to and deposited
  fromAmount: string; // List of amounts to be swapped. If the amount exceeds the balance, the total balance is used for the swap
  minToAmount: string;
  permitSignature?: PermitSignature;
  swapAll: boolean;
  referralCode?: string;
  augustus: tEthereumAddress;
  swapCallData: BytesLike;
};

export type LPParaswapRepayWithCollateral = {
  user: tEthereumAddress;
  fromAsset: tEthereumAddress;
  fromAToken: tEthereumAddress;
  assetToRepay: tEthereumAddress; // List of addresses of the underlying asset to be swap from
  repayWithAmount: string;
  repayAmount: string; // List of amounts to be swapped. If the amount exceeds the balance, the total balance is used for the swap
  permitSignature?: PermitSignature;
  repayAllDebt?: boolean;
  rateMode: InterestRate;
  referralCode?: string;
  flash?: boolean;
  swapAndRepayCallData: BytesLike;
  augustus: tEthereumAddress;
};

export type LPFlashLoan = {
  user: tEthereumAddress;
  receiver: tEthereumAddress;
  assets: tEthereumAddress[];
  amounts: string[];
  modes: InterestRate[];
  onBehalfOf?: tEthereumAddress;
  referralCode?: string;
};

export type LPFlashLiquidation = {
  user: tEthereumAddress;
  collateralAsset: tEthereumAddress;
  borrowedAsset: tEthereumAddress;
  debtTokenCover: string;
  liquidateAll: boolean;
  initiator: tEthereumAddress;
  useEthPath?: boolean;
};

export type LPSupplyWithPermitType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  onBehalfOf?: tEthereumAddress;
  amount: string;
  signature: SignatureLike;
  referralCode?: string;
  useOptimizedPath?: boolean;
  deadline: string;
};

export type LPRepayWithPermitParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: tEthereumAddress;
  signature: SignatureLike;
  useOptimizedPath?: boolean;
  deadline: string;
};

export type LPSignERC20ApprovalType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  deadline: string;
};

export type LPSetUserEModeType = {
  user: string;
  categoryId: number;
};

export type LPRepayWithATokensType = {
  user: string;
  reserve: string;
  amount: string;
  rateMode: InterestRate;
  useOptimizedPath?: boolean;
};

export type BorrowedPositionType = {
  address: string;
  amount: string;
  rateMode: number;
};

export type LPV3MigrationParamsType = {
  migrator: string;
  borrowedAssets: string[];
  borrowedAmounts: BigNumberish[];
  interestRatesModes: number[];
  user: string;
  suppliedPositions: string[];
  borrowedPositions: BorrowedPositionType[];
  permits: IMigrationHelper.PermitInputStruct[];
};

import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  tEthereumAddress,
} from '../commons/types';
import { ERC20_2612Interface } from '../erc20-2612';
import { IERC20ServiceInterface } from '../erc20-contract';
import { LiquiditySwapAdapterInterface } from '../paraswap-liquiditySwapAdapter-contract';
import { ParaswapRepayWithCollateralInterface } from '../paraswap-repayWithCollateralAdapter-contract';
import { SynthetixInterface } from '../synthetix-contract';
import { L2PoolInterface } from '../v3-pool-rollups';
import { WETHGatewayInterface } from '../wethgateway-contract';
import {
  LPBorrowParamsType,
  LPSupplyParamsType,
  LPFlashLiquidation,
  LPLiquidationCall,
  LPParaswapRepayWithCollateral,
  LPRepayParamsType,
  LPRepayWithATokensType,
  LPRepayWithPermitParamsType,
  LPSetUsageAsCollateral,
  LPSetUserEModeType,
  LPSignERC20ApprovalType,
  LPSupplyWithPermitType,
  LPSwapBorrowRateMode,
  LPSwapCollateral,
  LPWithdrawParamsType,
} from './lendingPoolTypes';
import { IPool } from './typechain/IPool';
export interface PoolInterface {
  deposit: (
    args: LPSupplyParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  supply: (
    args: LPSupplyParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  signERC20Approval: (args: LPSignERC20ApprovalType) => Promise<string>;
  supplyWithPermit: (
    args: LPSupplyWithPermitType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdraw: (
    args: LPWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  borrow: (
    args: LPBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repay: (
    args: LPRepayParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithPermit: (
    args: LPRepayWithPermitParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode: (
    args: LPSwapBorrowRateMode,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  setUsageAsCollateral: (
    args: LPSetUsageAsCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapCollateral: (
    args: LPSwapCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  flashLiquidation: (
    args: LPFlashLiquidation,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithATokens: (
    args: LPRepayWithATokensType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  liquidationCall: (
    args: LPLiquidationCall,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  setUserEMode: (args: LPSetUserEModeType) => EthereumTransactionTypeExtended[];
  paraswapRepayWithCollateral(
    args: LPParaswapRepayWithCollateral,
  ): Promise<EthereumTransactionTypeExtended[]>;
}
export declare type LendingPoolMarketConfigV3 = {
  POOL: tEthereumAddress;
  WETH_GATEWAY?: tEthereumAddress;
  FLASH_LIQUIDATION_ADAPTER?: tEthereumAddress;
  REPAY_WITH_COLLATERAL_ADAPTER?: tEthereumAddress;
  SWAP_COLLATERAL_ADAPTER?: tEthereumAddress;
  L2_ENCODER?: tEthereumAddress;
  L2_POOL?: tEthereumAddress;
};
export declare class Pool extends BaseService<IPool> implements PoolInterface {
  readonly erc20Service: IERC20ServiceInterface;
  readonly poolAddress: string;
  readonly synthetixService: SynthetixInterface;
  readonly wethGatewayService: WETHGatewayInterface;
  readonly liquiditySwapAdapterService: LiquiditySwapAdapterInterface;
  readonly paraswapRepayWithCollateralAdapterService: ParaswapRepayWithCollateralInterface;
  readonly erc20_2612Service: ERC20_2612Interface;
  readonly flashLiquidationAddress: string;
  readonly swapCollateralAddress: string;
  readonly repayWithCollateralAddress: string;
  readonly l2EncoderAddress: string;
  readonly l2PoolAddress: string;
  readonly l2PoolService: L2PoolInterface;
  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfigV3,
  );
  deposit({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
  }: LPSupplyParamsType): Promise<EthereumTransactionTypeExtended[]>;
  supply({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
    useOptimizedPath,
  }: LPSupplyParamsType): Promise<EthereumTransactionTypeExtended[]>;
  signERC20Approval({
    user,
    reserve,
    amount,
    deadline,
  }: LPSignERC20ApprovalType): Promise<string>;
  supplyWithPermit({
    user,
    reserve,
    onBehalfOf,
    amount,
    referralCode,
    signature,
    useOptimizedPath,
    deadline,
  }: LPSupplyWithPermitType): Promise<EthereumTransactionTypeExtended[]>;
  withdraw({
    user,
    reserve,
    amount,
    onBehalfOf,
    aTokenAddress,
    useOptimizedPath,
  }: LPWithdrawParamsType): Promise<EthereumTransactionTypeExtended[]>;
  borrow({
    user,
    reserve,
    amount,
    interestRateMode,
    debtTokenAddress,
    onBehalfOf,
    referralCode,
    useOptimizedPath,
  }: LPBorrowParamsType): Promise<EthereumTransactionTypeExtended[]>;
  repay({
    user,
    reserve,
    amount,
    interestRateMode,
    onBehalfOf,
    useOptimizedPath,
  }: LPRepayParamsType): Promise<EthereumTransactionTypeExtended[]>;
  repayWithPermit({
    user,
    reserve,
    amount,
    interestRateMode,
    onBehalfOf,
    signature,
    useOptimizedPath,
    deadline,
  }: LPRepayWithPermitParamsType): Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode({
    user,
    reserve,
    interestRateMode,
    useOptimizedPath,
  }: LPSwapBorrowRateMode): Promise<EthereumTransactionTypeExtended[]>;
  setUsageAsCollateral({
    user,
    reserve,
    usageAsCollateral,
    useOptimizedPath,
  }: LPSetUsageAsCollateral): Promise<EthereumTransactionTypeExtended[]>;
  liquidationCall({
    liquidator,
    liquidatedUser,
    debtReserve,
    collateralReserve,
    purchaseAmount,
    getAToken,
    liquidateAll,
    useOptimizedPath,
  }: LPLiquidationCall): Promise<EthereumTransactionTypeExtended[]>;
  swapCollateral({
    user,
    flash,
    fromAsset,
    fromAToken,
    toAsset,
    fromAmount,
    minToAmount,
    permitSignature,
    swapAll,
    referralCode,
    augustus,
    swapCallData,
  }: LPSwapCollateral): Promise<EthereumTransactionTypeExtended[]>;
  paraswapRepayWithCollateral({
    user,
    fromAsset,
    fromAToken,
    assetToRepay,
    repayWithAmount,
    repayAmount,
    permitSignature,
    repayAllDebt,
    rateMode,
    referralCode,
    flash,
    swapAndRepayCallData,
    augustus,
  }: LPParaswapRepayWithCollateral): Promise<EthereumTransactionTypeExtended[]>;
  flashLiquidation({
    user,
    collateralAsset,
    borrowedAsset,
    debtTokenCover,
    liquidateAll,
    initiator,
    useEthPath,
  }: LPFlashLiquidation): Promise<EthereumTransactionTypeExtended[]>;
  repayWithATokens({
    user,
    amount,
    reserve,
    rateMode,
    useOptimizedPath,
  }: LPRepayWithATokensType): Promise<EthereumTransactionTypeExtended[]>;
  setUserEMode({
    user,
    categoryId,
  }: LPSetUserEModeType): EthereumTransactionTypeExtended[];
}
//# sourceMappingURL=index.d.ts.map

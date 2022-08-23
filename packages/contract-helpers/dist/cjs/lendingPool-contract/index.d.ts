import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  EthereumTransactionTypeExtended,
  LendingPoolMarketConfig,
} from '../commons/types';
import { IERC20ServiceInterface } from '../erc20-contract';
import { LiquiditySwapAdapterInterface } from '../paraswap-liquiditySwapAdapter-contract';
import { ParaswapRepayWithCollateralInterface } from '../paraswap-repayWithCollateralAdapter-contract';
import { RepayWithCollateralAdapterInterface } from '../repayWithCollateralAdapter-contract';
import { SynthetixInterface } from '../synthetix-contract';
import { WETHGatewayInterface } from '../wethgateway-contract';
import {
  LPBorrowParamsType,
  LPDepositParamsType,
  LPLiquidationCall,
  LPRepayParamsType,
  LPRepayWithCollateral,
  LPSetUsageAsCollateral,
  LPSwapBorrowRateMode,
  LPSwapCollateral,
  LPWithdrawParamsType,
  LPFlashLiquidation,
  LPParaswapRepayWithCollateral,
} from './lendingPoolTypes';
import { ILendingPool } from './typechain/ILendingPool';
export interface LendingPoolInterface {
  deposit: (
    args: LPDepositParamsType,
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
  swapBorrowRateMode: (
    args: LPSwapBorrowRateMode,
  ) => EthereumTransactionTypeExtended[];
  setUsageAsCollateral: (
    args: LPSetUsageAsCollateral,
  ) => EthereumTransactionTypeExtended[];
  liquidationCall: (
    args: LPLiquidationCall,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapCollateral: (
    args: LPSwapCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repayWithCollateral: (
    args: LPRepayWithCollateral,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  flashLiquidation(
    args: LPFlashLiquidation,
  ): Promise<EthereumTransactionTypeExtended[]>;
  paraswapRepayWithCollateral(
    args: LPParaswapRepayWithCollateral,
  ): Promise<EthereumTransactionTypeExtended[]>;
}
export declare class LendingPool
  extends BaseService<ILendingPool>
  implements LendingPoolInterface
{
  readonly erc20Service: IERC20ServiceInterface;
  readonly lendingPoolAddress: string;
  readonly synthetixService: SynthetixInterface;
  readonly wethGatewayService: WETHGatewayInterface;
  readonly liquiditySwapAdapterService: LiquiditySwapAdapterInterface;
  readonly repayWithCollateralAdapterService: RepayWithCollateralAdapterInterface;
  readonly flashLiquidationAddress: string;
  readonly swapCollateralAddress: string;
  readonly repayWithCollateralAddress: string;
  readonly paraswapRepayWithCollateralAdapterService: ParaswapRepayWithCollateralInterface;
  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfig,
  );
  deposit({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
  }: LPDepositParamsType): Promise<EthereumTransactionTypeExtended[]>;
  withdraw({
    user,
    reserve,
    amount,
    onBehalfOf,
    aTokenAddress,
  }: LPWithdrawParamsType): Promise<EthereumTransactionTypeExtended[]>;
  borrow({
    user,
    reserve,
    amount,
    interestRateMode,
    debtTokenAddress,
    onBehalfOf,
    referralCode,
  }: LPBorrowParamsType): Promise<EthereumTransactionTypeExtended[]>;
  repay({
    user,
    reserve,
    amount,
    interestRateMode,
    onBehalfOf,
  }: LPRepayParamsType): Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode({
    user,
    reserve,
    interestRateMode,
  }: LPSwapBorrowRateMode): EthereumTransactionTypeExtended[];
  setUsageAsCollateral({
    user,
    reserve,
    usageAsCollateral,
  }: LPSetUsageAsCollateral): EthereumTransactionTypeExtended[];
  liquidationCall({
    liquidator,
    liquidatedUser,
    debtReserve,
    collateralReserve,
    purchaseAmount,
    getAToken,
    liquidateAll,
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
    onBehalfOf,
    referralCode,
    augustus,
    swapCallData,
  }: LPSwapCollateral): Promise<EthereumTransactionTypeExtended[]>;
  repayWithCollateral({
    user,
    fromAsset,
    fromAToken,
    assetToRepay,
    repayWithAmount,
    repayAmount,
    permitSignature,
    repayAllDebt,
    rateMode,
    onBehalfOf,
    referralCode,
    flash,
    useEthPath,
  }: LPRepayWithCollateral): Promise<EthereumTransactionTypeExtended[]>;
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
    onBehalfOf,
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
}
//# sourceMappingURL=index.d.ts.map

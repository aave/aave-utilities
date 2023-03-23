import { providers, PopulatedTransaction } from 'ethers';
import BaseService from '../commons/BaseService';
import { LendingPoolMarketConfig } from '../commons/types';
import { API_ETH_MOCK_ADDRESS } from '../commons/utils';
import {
  ApproveType,
  ERC20Service,
  IERC20ServiceInterface,
} from '../erc20-contract';
import { LPDepositParamsType } from '../lendingPool-contract/lendingPoolTypes';
import {
  ILendingPool,
  ILendingPoolInterface,
} from '../lendingPool-contract/typechain/ILendingPool';
import { ILendingPool__factory } from '../lendingPool-contract/typechain/ILendingPool__factory';
import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';

export type LPDepositParamsBundleType = LPDepositParamsType & {
  skipApprovalChecks?: boolean;
  skipGasEstimation?: boolean;
};

export type DepositTxBuilder = {
  generateApprovalTxData: ({
    user,
    token,
    spender,
    amount,
  }: ApproveType) => PopulatedTransaction;
  generateTxData: ({
    user,
    reserve,
    amount,
    onBehalfOf,
    referralCode,
  }: LPDepositParamsType) => PopulatedTransaction;
};

export interface LendingPoolBundleInterface {
  supplyTxBuilder: DepositTxBuilder;
}

export class LendingPoolBundle
  extends BaseService<ILendingPool>
  implements LendingPoolBundleInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly lendingPoolAddress: string;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  readonly contractInterface: ILendingPoolInterface;

  supplyTxBuilder: DepositTxBuilder;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfig,
  ) {
    super(provider, ILendingPool__factory);

    const { LENDING_POOL, WETH_GATEWAY } = lendingPoolConfig ?? {};

    this.lendingPoolAddress = LENDING_POOL ?? '';

    // initialize services
    this.erc20Service = new ERC20Service(provider);
    this.synthetixService = new SynthetixService(provider);
    this.wethGatewayService = new WETHGatewayService(
      provider,
      this.erc20Service,
      WETH_GATEWAY,
    );

    this.contractInterface = ILendingPool__factory.createInterface();

    // Initialize supplyTxBuilder
    this.supplyTxBuilder = {
      generateApprovalTxData: (props: ApproveType): PopulatedTransaction => {
        return this.erc20Service.approveTxData(props);
      },
      generateTxData: ({
        user,
        reserve,
        amount,
        onBehalfOf,
        referralCode,
      }: LPDepositParamsType): PopulatedTransaction => {
        let actionTx: PopulatedTransaction = {};
        if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
          actionTx = this.wethGatewayService.generateDepositEthTxData({
            lendingPool: this.lendingPoolAddress,
            user,
            amount,
            onBehalfOf,
            referralCode,
          });
        } else {
          const txData = this.contractInterface.encodeFunctionData('deposit', [
            reserve,
            amount,
            onBehalfOf ?? user,
            referralCode ?? '0',
          ]);
          actionTx.to = this.lendingPoolAddress;
          actionTx.from = user;
          actionTx.data = txData;
        }

        return actionTx;
      },
    };
  }
}

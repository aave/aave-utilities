import BigNumber from 'bignumber.js';
import { constants, providers, utils } from 'ethers';
import {
  BaseDebtToken,
  BaseDebtTokenInterface,
} from '../baseDebtToken-contract';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { V3MigratorValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { ERC20Service } from '../erc20-contract';
import { Pool } from '../v3-pool-contract';
import { IMigrationHelper } from './typechain/IMigrationHelper';
import { IMigrationHelper__factory } from './typechain/IMigrationHelper__factory';
import {
  MigrationDelegationApproval,
  V3MigrationHelperSignedCreditDelegationPermit,
  V3MigrationHelperSignedPermit,
  V3MigrationType,
  MigrationSupplyAsset,
  V3GetMigrationSupplyType,
} from './v3MigrationTypes';

export interface V3MigrationHelperInterface {
  migrate: (
    params: V3MigrationType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class V3MigrationHelperService
  extends BaseService<IMigrationHelper>
  implements V3MigrationHelperInterface
{
  readonly baseDebtTokenService: BaseDebtTokenInterface;
  readonly provider: providers.Provider;
  readonly MIGRATOR_ADDRESS: tEthereumAddress;
  readonly erc20Service: ERC20Service;
  readonly pool: Pool;
  constructor(
    provider: providers.Provider,
    MIGRATOR_ADDRESS: tEthereumAddress,
    pool: Pool,
  ) {
    super(provider, IMigrationHelper__factory);
    this.MIGRATOR_ADDRESS = MIGRATOR_ADDRESS;
    this.erc20Service = new ERC20Service(provider);
    this.baseDebtTokenService = new BaseDebtToken(provider, this.erc20Service);
    this.pool = pool;
  }

  @V3MigratorValidator
  public async getMigrationSupply(
    @isEthAddress('asset') { asset, amount }: V3GetMigrationSupplyType,
  ) {
    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    return migrator.getMigrationSupply(asset, amount);
  }

  @V3MigratorValidator
  public async migrate(
    @isEthAddress('user')
    {
      supplyAssets,
      user,
      repayAssets,
      signedSupplyPermits,
      signedCreditDelegationPermits,
      creditDelegationApprovals,
    }: V3MigrationType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let txs: EthereumTransactionTypeExtended[] = [];
    let permits: IMigrationHelper.PermitInputStruct[] = [];

    if (signedSupplyPermits && signedSupplyPermits.length > 0) {
      permits = this.splitSignedPermits(signedSupplyPermits);
    } else {
      txs = await this.approveSupplyAssets(user, supplyAssets);
    }

    let creditDelegationPermits: IMigrationHelper.CreditDelegationInputStruct[] =
      [];
    if (
      signedCreditDelegationPermits &&
      signedCreditDelegationPermits.length > 0
    ) {
      creditDelegationPermits = this.splitSignedCreditDelegationPermits(
        signedCreditDelegationPermits,
      );
    } else {
      const delegationApprovals = await this.approveDelegationTokens(
        user,
        creditDelegationApprovals,
      );
      txs.push(...delegationApprovals);
    }

    const assetsToMigrate = supplyAssets.map(
      supplyAsset => supplyAsset.underlyingAsset,
    );
    const assetsToRepay = repayAssets.map(repayAsset => {
      return {
        asset: repayAsset.underlyingAsset,
        rateMode: repayAsset.rateMode === InterestRate.Stable ? 1 : 2,
      };
    });

    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        migrator.populateTransaction.migrate(
          assetsToMigrate,
          assetsToRepay,
          permits,
          creditDelegationPermits,
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.V3_MIGRATION_ACTION,
      gas: this.generateTxPriceEstimation(
        permits.length > 0 ? [] : txs,
        txCallback,
        ProtocolAction.migrateV3,
      ),
    });

    return txs;
  }

  private async approveDelegationTokens(
    user: string,
    assets: MigrationDelegationApproval[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const assetsApproved = await Promise.all(
      assets.map(async ({ amount, debtTokenAddress }) => {
        return this.baseDebtTokenService.isDelegationApproved({
          debtTokenAddress,
          allowanceGiver: user,
          allowanceReceiver: this.MIGRATOR_ADDRESS,
          amount,
          nativeDecimals: true,
        });
      }),
    );
    return assetsApproved
      .map((approved, index) => {
        if (approved) {
          return;
        }

        const asset = assets[index];
        const originalAmount = new BigNumber(asset.amount);
        const tenPercent = originalAmount.dividedBy(10);
        const amountPlusBuffer = originalAmount.plus(tenPercent).toFixed(0);

        return this.baseDebtTokenService.approveDelegation({
          user,
          delegatee: this.MIGRATOR_ADDRESS,
          debtTokenAddress: asset.debtTokenAddress,
          amount: amountPlusBuffer,
        });
      })
      .filter((tx): tx is EthereumTransactionTypeExtended => Boolean(tx));
  }

  private async approveSupplyAssets(
    user: string,
    assets: MigrationSupplyAsset[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const assetsApproved = await Promise.all(
      assets.map(async ({ amount, aToken }) => {
        return this.erc20Service.isApproved({
          amount,
          spender: this.MIGRATOR_ADDRESS,
          token: aToken,
          user,
          nativeDecimals: true,
        });
      }),
    );
    return assetsApproved
      .map((approved, index) => {
        if (approved) {
          return;
        }

        const asset = assets[index];
        return this.erc20Service.approve({
          user,
          token: asset.aToken,
          spender: this.MIGRATOR_ADDRESS,
          amount: constants.MaxUint256.toString(),
        });
      })
      .filter((tx): tx is EthereumTransactionTypeExtended => Boolean(tx));
  }

  private splitSignedPermits(signedPermits: V3MigrationHelperSignedPermit[]) {
    return signedPermits.map((permit): IMigrationHelper.PermitInputStruct => {
      const { aToken, deadline, value, signedPermit } = permit;
      const signature = utils.splitSignature(signedPermit);
      return {
        aToken,
        deadline,
        value,
        v: signature.v,
        r: signature.r,
        s: signature.s,
      };
    });
  }

  private splitSignedCreditDelegationPermits(
    signedPermits: V3MigrationHelperSignedCreditDelegationPermit[],
  ) {
    return signedPermits.map(
      (permit): IMigrationHelper.CreditDelegationInputStruct => {
        const { debtToken, deadline, value, signedPermit } = permit;
        const signature = utils.splitSignature(signedPermit);
        return {
          debtToken,
          deadline,
          value,
          v: signature.v,
          r: signature.r,
          s: signature.s,
        };
      },
    );
  }
}

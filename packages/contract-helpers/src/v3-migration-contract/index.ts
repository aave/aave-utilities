import { constants, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { valueToWei } from '../commons/utils';
import { V3MigratorValidator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { ERC20Service } from '../erc20-contract';
import { Pool } from '../v3-pool-contract';
import { MigrationHelper__factory, MigrationHelper } from './typechain';
import { IMigrationHelper } from './typechain/MigrationHelper';
import {
  V3MigrateWithBorrowType,
  V3MigrationHelperSignedPermit,
  V3MigrationNoBorrowType,
  V3MigrationNoBorrowWithPermitsType,
  V3SupplyAsset,
} from './v3MigrationTypes';

export interface V3MigrationHelperInterface {
  migrateNoBorrowWithPermits: (
    params: V3MigrationNoBorrowWithPermitsType,
  ) => EthereumTransactionTypeExtended[];
  migrateNoBorrow: (
    params: V3MigrationNoBorrowType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  migrateWithBorrow: (
    params: V3MigrateWithBorrowType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class V3MigrationHelperService
  extends BaseService<MigrationHelper>
  implements V3MigrationHelperInterface
{
  readonly provider: providers.Provider;
  readonly MIGRATOR_ADDRESS: tEthereumAddress;
  readonly erc20Service: ERC20Service;
  readonly pool: Pool;
  constructor(
    provider: providers.Provider,
    MIGRATOR_ADDRESS: tEthereumAddress,
    pool: Pool,
  ) {
    super(provider, MigrationHelper__factory);
    this.MIGRATOR_ADDRESS = MIGRATOR_ADDRESS;
    this.erc20Service = new ERC20Service(provider);
    this.pool = pool;
  }

  @V3MigratorValidator
  public async migrateNoBorrow(
    // @isEthAddressArray('assets') how to check for assets name
    @isEthAddress('user')
    { assets, user }: V3MigrationNoBorrowType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs = await this.approveSupplyAssets(user, assets);

    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    const assetsAddresses = assets.map(asset => asset.underlyingAsset);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        migrator.populateTransaction.migrationNoBorrow(
          user,
          assetsAddresses,
          [],
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.V3_MIGRATION_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.migrateV3,
      ),
    });

    return txs;
  }

  @V3MigratorValidator
  public async migrateWithBorrow(
    @isEthAddress('user')
    {
      user,
      borrowedPositions,
      suppliedPositions,
      signedPermits,
    }: V3MigrateWithBorrowType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    let txs: EthereumTransactionTypeExtended[] = [];
    const permits = this.splitSignedPermits(signedPermits);
    if (signedPermits.length === 0) {
      txs = await this.approveSupplyAssets(user, suppliedPositions);
    }

    const mappedBorrowPositions = await Promise.all(
      borrowedPositions.map(async ({ interestRate, amount, ...borrow }) => {
        const { decimals } = await this.erc20Service.getTokenData(
          borrow.address,
        );
        const convertedAmount = valueToWei(amount, decimals);
        return {
          ...borrow,
          rateMode: interestRate === InterestRate.Variable ? 2 : 1,
          amount: convertedAmount,
        };
      }),
    );

    const borrowedAssets = mappedBorrowPositions.map(borrow => borrow.address);
    const borrowedAmounts = mappedBorrowPositions.map(borrow => borrow.amount);
    const interestRatesModes = mappedBorrowPositions.map(() => 2);
    const suppliedPositionsAddresses = suppliedPositions.map(
      suppply => suppply.underlyingAsset,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        this.pool.migrateV3({
          migrator: this.MIGRATOR_ADDRESS,
          borrowedAssets,
          borrowedAmounts,
          interestRatesModes,
          user,
          suppliedPositions: suppliedPositionsAddresses,
          borrowedPositions: mappedBorrowPositions,
          permits,
        }),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.V3_MIGRATION_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.migrateV3,
      ),
    });

    return txs;
  }

  @V3MigratorValidator
  public migrateNoBorrowWithPermits(
    @isEthAddress('user')
    { user, assets, signedPermits }: V3MigrationNoBorrowWithPermitsType,
  ): EthereumTransactionTypeExtended[] {
    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    const permits = this.splitSignedPermits(signedPermits);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        migrator.populateTransaction.migrationNoBorrow(user, assets, permits),
      from: user,
    });
    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.V3_MIGRATION_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.migrateV3,
        ),
      },
    ];
  }

  private async approveSupplyAssets(
    user: string,
    assets: V3SupplyAsset[],
  ): Promise<EthereumTransactionTypeExtended[]> {
    const assetsApproved = await Promise.all(
      assets.map(async ({ amount, aToken }) => {
        return this.erc20Service.isApproved({
          amount,
          spender: this.MIGRATOR_ADDRESS,
          token: aToken,
          user,
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
}

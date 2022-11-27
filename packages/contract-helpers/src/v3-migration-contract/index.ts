import { constants, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { ERC20Service } from '../erc20-contract';
import { MigrationHelper__factory, MigrationHelper } from './typechain';
import { IMigrationHelper } from './typechain/MigrationHelper';
import {
  V3MigrationNoBorrowType,
  V3MigrationNoBorrowWithPermitsType,
} from './v3MigrationTypes';

export interface V3MigrationHelperInterface {
  migrateNoBorrowWithPermits: (
    params: V3MigrationNoBorrowWithPermitsType,
  ) => EthereumTransactionTypeExtended[];
  migrateNoBorrow: (
    params: V3MigrationNoBorrowType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  testDeployment: () => Promise<string>;
}

export class V3MigrationHelperService
  extends BaseService<MigrationHelper>
  implements V3MigrationHelperInterface
{
  readonly provider: providers.Provider;
  readonly MIGRATOR_ADDRESS: tEthereumAddress;
  readonly erc20Service: ERC20Service;
  constructor(
    provider: providers.Provider,
    MIGRATOR_ADDRESS: tEthereumAddress,
  ) {
    super(provider, MigrationHelper__factory);
    this.MIGRATOR_ADDRESS = MIGRATOR_ADDRESS;
    this.erc20Service = new ERC20Service(provider);
  }

  public async testDeployment(): Promise<string> {
    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    // eslint-disable-next-line new-cap
    return migrator.V2_POOL();
  }

  public async migrateNoBorrow({ assets, user }: V3MigrationNoBorrowType) {
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

    const txs = assetsApproved
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

    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    const assetsAddresses = assets.map(asset => asset.aToken);
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
      gas: this.generateTxPriceEstimation([], txCallback),
    });

    return txs;
  }

  public migrateNoBorrowWithPermits({
    user,
    assets,
    signedPermits,
  }: V3MigrationNoBorrowWithPermitsType) {
    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    // migrator.populateTransaction.migrationNoBorrow
    const permits = signedPermits.map(
      (permit): IMigrationHelper.PermitInputStruct => {
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
      },
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        migrator.populateTransaction.migrationNoBorrow(user, assets, permits),
      from: user,
    });
    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.V3_MIGRATION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}

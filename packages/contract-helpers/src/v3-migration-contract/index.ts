import { SignatureLike } from '@ethersproject/bytes';
import { BigNumberish, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { MigrationHelper__factory, MigrationHelper } from './typechain';
import { IMigrationHelper } from './typechain/MigrationHelper';

export type V3MigrationHelperSignedPermit = {
  deadline: BigNumberish;
  aToken: tEthereumAddress;
  value: BigNumberish;
  signedPermit: SignatureLike;
};

export interface V3MigrationHelperInterface {
  migrateNoBorrowWithPermits: (params: {
    user: tEthereumAddress;
    assets: tEthereumAddress[];
    deadline: BigNumberish;
    signedPermits: V3MigrationHelperSignedPermit[];
  }) => EthereumTransactionTypeExtended[];
  testDeployment: () => Promise<string>;
}

export class V3MigrationHelperService
  extends BaseService<MigrationHelper>
  implements V3MigrationHelperInterface
{
  readonly provider: providers.Provider;
  readonly MIGRATOR_ADDRESS: tEthereumAddress;
  constructor(
    provider: providers.Provider,
    MIGRATOR_ADDRESS: tEthereumAddress,
  ) {
    super(provider, MigrationHelper__factory);
    this.MIGRATOR_ADDRESS = MIGRATOR_ADDRESS;
  }

  public async testDeployment(): Promise<string> {
    const migrator = this.getContractInstance(this.MIGRATOR_ADDRESS);
    // eslint-disable-next-line new-cap
    return migrator.V2_POOL();
  }

  public migrateNoBorrowWithPermits({
    user,
    assets,
    signedPermits,
  }: {
    user: tEthereumAddress;
    assets: tEthereumAddress[];
    signedPermits: V3MigrationHelperSignedPermit[];
  }) {
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

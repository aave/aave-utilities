import { SignatureLike } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction, Signature, utils } from 'ethers';
import { ProtocolAction } from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { StkABPTMigratorInterface } from './typechain/StkABPTMigrator';
import { StkABPTMigrator__factory } from './typechain/StkABPTMigrator__factory';

export class StkABPTMigratorService {
  readonly contractInterface: StkABPTMigratorInterface;

  constructor(readonly contractAddress: string) {
    this.contractInterface = StkABPTMigrator__factory.createInterface();
  }

  public migrate(
    user: string,
    amount: string,
    tokenOutAmountsMin: string[],
    poolOutAmountMin: string,
  ) {
    const tx: PopulatedTransaction = {
      data: this.contractInterface.encodeFunctionData('migrateStkABPT', [
        amount,
        tokenOutAmountsMin,
        poolOutAmountMin,
      ]),
      to: this.contractAddress,
      from: user,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.default].recommended, // TODO
      ),
    };

    return tx;
  }

  public migrateWithPermit({
    user,
    amount,
    tokenOutAmountsMin,
    poolOutAmountMin,
    signature,
    deadline,
  }: {
    user: string;
    amount: string;
    tokenOutAmountsMin: string[];
    poolOutAmountMin: string;
    signature: SignatureLike;
    deadline: string;
  }) {
    const { v, r, s }: Signature = utils.splitSignature(signature);
    const tx: PopulatedTransaction = {
      data: this.contractInterface.encodeFunctionData(
        'migrateStkABPTWithPermit',
        [amount, deadline, v, r, s, tokenOutAmountsMin, poolOutAmountMin],
      ),
      to: this.contractAddress,
      from: user,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.default].recommended, // TODO
      ),
    };

    return tx;
  }
}

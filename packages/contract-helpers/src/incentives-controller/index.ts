/* eslint-disable @typescript-eslint/require-await */
import { BigNumber, ContractTransaction, providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { IAaveIncentivesController as IncentivesControllerContract } from './typechain/IAaveIncentivesController';
import { IAaveIncentivesControllerFactory as IncentivesControllerFactory } from './typechain/IAaveIncentivesControllerFactory';

const MaxUint256: BigNumber = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export interface IncentivesControllerContext {
  incentivesControllerAddress: string;
  provider: providers.Provider;
}

export class IncentivesController {
  private readonly _contract: IncentivesControllerContract;

  /**
   * Constructor
   * @param context The ui pool data provider context
   */
  public constructor(context: IncentivesControllerContext) {
    if (!isAddress(context.incentivesControllerAddress)) {
      throw new Error('contract address is not valid');
    }

    this._contract = IncentivesControllerFactory.connect(
      context.incentivesControllerAddress,
      context.provider,
    );
  }

  /**
   *
   * @param assets Array of tokens accumulating incentives (aToken and debtToken addresses)
   * @param to Receiving address
   * @param amount Amount to claim, will claim max if amount > claimable
   * @returns ethers ContractTransaction
   */
  public async claimRewards(
    assets: string[],
    to: string,
    amount?: string,
  ): Promise<ContractTransaction> {
    const claimAmount = amount ? amount : MaxUint256.toString();
    return this._contract.claimRewards(assets, claimAmount, to);
  }
}

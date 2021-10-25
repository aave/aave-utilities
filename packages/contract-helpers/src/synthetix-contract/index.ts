import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { ChainId } from '../commons/types';
import { ISynthetix } from './typechain/ISynthetix';
import { ISynthetix__factory } from './typechain/ISynthetix__factory';

export const synthetixProxyByChainId: Record<number, string> = {
  [ChainId.mainnet]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
};

export interface SynthetixInterface {
  synthetixValidation: (
    userAddress: string,
    reserve: string,
    amount: string, // wei
  ) => Promise<boolean>;
}

export default class SynthetixService
  extends BaseService<ISynthetix>
  implements SynthetixInterface
{
  constructor(provider: providers.Provider) {
    super(provider, ISynthetix__factory);
  }

  public synthetixValidation = async (
    userAddress: string,
    reserve: string,
    amount: string, // wei
  ): Promise<boolean> => {
    const { chainId } = await this.provider.getNetwork();
    if (
      reserve.toUpperCase() === synthetixProxyByChainId[chainId].toUpperCase()
    ) {
      return this.isSnxTransferable(userAddress, amount);
    }

    return true;
  };

  readonly isSnxTransferable = async (
    userAddress: string,
    amount: string, // wei
  ): Promise<boolean> => {
    const { chainId } = await this.provider.getNetwork();
    const synthContract = this.getContractInstance(
      synthetixProxyByChainId[chainId],
    );

    const transferableAmount: BigNumber =
      await synthContract.transferableSynthetix(userAddress);
    return BigNumber.from(amount).lte(transferableAmount);
  };
}

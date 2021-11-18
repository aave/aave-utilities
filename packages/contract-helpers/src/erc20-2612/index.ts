import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import { ERC20Validator } from '../commons/validators/methodValidators';
import { isEthAddress } from '../commons/validators/paramValidators';
import { IERC202612 } from './typechain/IERC202612';
import { IERC202612__factory } from './typechain/IERC202612__factory';

export type GetNonceType = { token: string; owner: string };

export interface ERC20_2612Interface {
  getNonce: (args: GetNonceType) => Promise<number | null>;
}

export class ERC20_2612Service
  extends BaseService<IERC202612>
  implements ERC20_2612Interface
{
  constructor(provider: providers.Provider) {
    super(provider, IERC202612__factory);

    this.getNonce = this.getNonce.bind(this);
  }

  @ERC20Validator
  public async getNonce(
    @isEthAddress('token')
    @isEthAddress('owner')
    { token, owner }: GetNonceType,
  ): Promise<number | null> {
    const tokenContract = this.getContractInstance(token);
    let nonce: BigNumber;
    try {
      nonce = await tokenContract.nonces(owner);
      return nonce.toNumber();
    } catch (_: unknown) {
      // Skip console log here since other nonce method can also work
    }

    try {
      nonce = await tokenContract._nonces(owner);
      return nonce.toNumber();
    } catch (_: unknown) {
      console.log(`Token ${token} does not implement nonces or _nonces method`);
    }

    return null;
  }
}

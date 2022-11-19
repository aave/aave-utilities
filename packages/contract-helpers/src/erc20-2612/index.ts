import { BigNumber, providers, constants } from 'ethers';
import BaseService from '../commons/BaseService';
import { tEthereumAddress } from '../commons/types';
import { ERC20Validator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { IERC202612 } from './typechain/IERC202612';
import { IERC202612__factory } from './typechain/IERC202612__factory';

export type GetNonceType = { token: string; owner: string };
export type SignERC20ApprovalType = {
  owner: tEthereumAddress;
  token: tEthereumAddress;
  spender: tEthereumAddress;
  amount: string;
  deadline: string;
};

export interface ERC20_2612Interface {
  getNonce: (args: GetNonceType) => Promise<number | null>;
  signERC20Approval: (args: SignERC20ApprovalType) => Promise<string>;
}

export class ERC20_2612Service
  extends BaseService<IERC202612>
  implements ERC20_2612Interface
{
  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider) {
    super(provider, IERC202612__factory);
    this.erc20Service = new ERC20Service(provider);
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

  // Sign permit supply
  @ERC20Validator
  public async signERC20Approval(
    @isEthAddress('owner')
    @isEthAddress('token')
    @isEthAddress('spender')
    @isPositiveOrMinusOneAmount('amount')
    { owner, token, spender, amount, deadline }: SignERC20ApprovalType,
  ): Promise<string> {
    const { chainId } = await this.provider.getNetwork();
    const { getTokenData } = this.erc20Service;

    const { name } = await getTokenData(token);

    const nonce = await this.getNonce({
      token,
      owner,
    });

    if (nonce === null) {
      return '';
    }

    const typeData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Permit',
      domain: {
        name,
        version: '1',
        chainId,
        verifyingContract: token,
      },
      message: {
        owner,
        spender,
        value: amount === '-1' ? constants.MaxUint256.toString() : amount,
        nonce,
        deadline,
      },
    };
    return JSON.stringify(typeData);
  }
}

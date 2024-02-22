import { Signature, SignatureLike, splitSignature } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  BaseTokenWrapper,
  BaseTokenWrapperInterface,
  IBaseTokenWrapper,
} from './typechain/TokenWrapper';
import { BaseTokenWrapper__factory } from './typechain/TokenWrapper_factory';

interface SupplyTokenWithPermitParams {
  amount: string;
  onBehalfOf: string;
  referralCode: string;
  deadline: string;
  signature: SignatureLike;
}

export interface TokenWrapperServiceInterface {
  getTokenInForTokenOut: (amount: string) => Promise<BigNumber>;
  getTokenOutForTokenIn: (amount: string) => Promise<BigNumber>;
  supplyToken: (
    amount: string,
    onBehalfOf: string,
    referralCode: string,
  ) => PopulatedTransaction;
  supplyTokenWithPermit: ({
    amount,
    onBehalfOf,
    referralCode,
    deadline,
    signature,
  }: SupplyTokenWithPermitParams) => PopulatedTransaction;
  withdrawToken: (amount: string, user: string) => PopulatedTransaction;
  withdrawTokenWithPermit: (
    amount: string,
    user: string,
    deadline: string,
    signature: SignatureLike,
  ) => PopulatedTransaction;
}

export class TokenWrapperService
  extends BaseService<BaseTokenWrapper>
  implements TokenWrapperServiceInterface
{
  readonly tokenWrapperAddress: string;
  readonly contractInterface: BaseTokenWrapperInterface;

  private readonly _contract: BaseTokenWrapper;

  constructor(provider: providers.Provider, tokenWrapperAddress: string) {
    super(provider, BaseTokenWrapper__factory);
    this.tokenWrapperAddress = tokenWrapperAddress;
    this.contractInterface = BaseTokenWrapper__factory.createInterface();
    this._contract = BaseTokenWrapper__factory.connect(
      tokenWrapperAddress,
      provider,
    );
  }

  public async getTokenInForTokenOut(amount: string): Promise<BigNumber> {
    return this._contract.getTokenInForTokenOut(amount);
  }

  public async getTokenOutForTokenIn(amount: string): Promise<BigNumber> {
    return this._contract.getTokenOutForTokenIn(amount);
  }

  public supplyToken(
    amount: string,
    onBehalfOf: string,
    referralCode: string,
  ): PopulatedTransaction {
    const data = this.contractInterface.encodeFunctionData('supplyToken', [
      amount,
      onBehalfOf,
      referralCode,
    ]);

    return {
      to: this.tokenWrapperAddress,
      from: onBehalfOf,
      data,
    };
  }

  public supplyTokenWithPermit({
    amount,
    onBehalfOf,
    referralCode,
    deadline,
    signature,
  }: SupplyTokenWithPermitParams): PopulatedTransaction {
    const sig: Signature = splitSignature(signature);

    const permitStruct: IBaseTokenWrapper.PermitSignatureStruct = {
      deadline,
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };

    const data = this.contractInterface.encodeFunctionData(
      'supplyTokenWithPermit',
      [amount, onBehalfOf, referralCode, permitStruct],
    );

    return {
      to: this.tokenWrapperAddress,
      from: onBehalfOf,
      data,
    };
  }

  public withdrawToken(amount: string, user: string): PopulatedTransaction {
    const data = this.contractInterface.encodeFunctionData('withdrawToken', [
      amount,
      user,
    ]);

    return {
      to: this.tokenWrapperAddress,
      from: user,
      data,
    };
  }

  public withdrawTokenWithPermit(
    amount: string,
    user: string,
    deadline: string,
    signature: SignatureLike,
  ): PopulatedTransaction {
    const sig: Signature = splitSignature(signature);

    const permitStruct: IBaseTokenWrapper.PermitSignatureStruct = {
      deadline,
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };

    const data = this.contractInterface.encodeFunctionData(
      'withdrawTokenWithPermit',
      [amount, user, permitStruct],
    );

    return {
      to: this.tokenWrapperAddress,
      from: user,
      data,
    };
  }
}

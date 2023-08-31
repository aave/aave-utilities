import { Signature, SignatureLike, splitSignature } from '@ethersproject/bytes';
import { PopulatedTransaction, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  BaseTokenWrapper,
  SavingsDaiTokenWrapper,
  SavingsDaiTokenWrapperInterface,
} from './typechain/SavingsDaiTokenWrapper';
import { SavingsDaiTokenWrapper__factory } from './typechain/SavingsDaiTokenWrapper_factory';

interface SupplyTokenWithPermitParams {
  amount: string;
  onBehalfOf: string;
  referralCode: string;
  deadline: string;
  signature: SignatureLike;
}

export interface SavingsDaiTokenWrapperServiceInterface {
  getTokenInForTokenOut: (amount: string, user: string) => PopulatedTransaction;
  getTokenOutForTokenIn: (amount: string, user: string) => PopulatedTransaction;
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

export class SavingsDaiTokenWrapperService
  extends BaseService<SavingsDaiTokenWrapper>
  implements SavingsDaiTokenWrapperServiceInterface
{
  readonly savingsDaiTokenWrapperAddress: string;
  readonly contractInterface: SavingsDaiTokenWrapperInterface;

  constructor(
    provider: providers.Provider,
    savingsDaiTokenWrapperAddress: string,
  ) {
    super(provider, SavingsDaiTokenWrapper__factory);
    this.savingsDaiTokenWrapperAddress = savingsDaiTokenWrapperAddress;
    this.contractInterface = SavingsDaiTokenWrapper__factory.createInterface();

    this.getTokenInForTokenOut = this.getTokenInForTokenOut.bind(this);
    this.getTokenOutForTokenIn = this.getTokenOutForTokenIn.bind(this);
    this.supplyToken = this.supplyToken.bind(this);
    this.supplyTokenWithPermit = this.supplyTokenWithPermit.bind(this);
    this.withdrawToken = this.withdrawToken.bind(this);
    this.withdrawTokenWithPermit = this.withdrawTokenWithPermit.bind(this);
  }

  public getTokenInForTokenOut(
    amount: string,
    user: string,
  ): PopulatedTransaction {
    const data = this.contractInterface.encodeFunctionData(
      'getTokenInForTokenOut',
      [amount],
    );

    return {
      to: this.savingsDaiTokenWrapperAddress,
      from: user,
      data,
    };
  }

  public getTokenOutForTokenIn(amount: string, user: string) {
    const data = this.contractInterface.encodeFunctionData(
      'getTokenOutForTokenIn',
      [amount],
    );

    return {
      to: this.savingsDaiTokenWrapperAddress,
      from: user,
      data,
    };
  }

  public supplyToken(amount: string, onBehalfOf: string, referralCode: string) {
    const data = this.contractInterface.encodeFunctionData('supplyToken', [
      amount,
      onBehalfOf,
      referralCode,
    ]);

    return {
      to: this.savingsDaiTokenWrapperAddress,
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
  }: SupplyTokenWithPermitParams) {
    const sig: Signature = splitSignature(signature);

    const permitStruct: BaseTokenWrapper.PermitSignatureStruct = {
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
      to: this.savingsDaiTokenWrapperAddress,
      from: onBehalfOf,
      data,
    };
  }

  public withdrawToken(amount: string, user: string) {
    const data = this.contractInterface.encodeFunctionData('withdrawToken', [
      amount,
      user,
    ]);

    return {
      to: this.savingsDaiTokenWrapperAddress,
      from: user,
      data,
    };
  }

  public withdrawTokenWithPermit(
    amount: string,
    user: string,
    deadline: string,
    signature: SignatureLike,
  ) {
    const sig: Signature = splitSignature(signature);

    const permitStruct: BaseTokenWrapper.PermitSignatureStruct = {
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
      to: this.savingsDaiTokenWrapperAddress,
      from: user,
      data,
    };
  }
}

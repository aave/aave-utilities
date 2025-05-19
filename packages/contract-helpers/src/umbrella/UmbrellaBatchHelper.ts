import { SignatureLike, splitSignature } from '@ethersproject/bytes';
import { BigNumber } from 'ethers';

import { DefinedPopulatedTransaction, ProtocolAction } from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { UmbrellaBatchHelperInterface } from './typechain/UmbrellaBatchHelper';
import { UmbrellaBatchHelper__factory } from './typechain/UmbrellaBatchHelper__factory';

interface BatchHelperBaseParams {
  sender: string;
  stakeToken: string;
  amount: string;
  edgeToken: string;
}

interface BatchHelperPermitParams {
  deadline: string;
  permit: SignatureLike;
}

type UmbrellaBatchHelperDepositParams = BatchHelperBaseParams;

type UmbrellaBatchHelperDepositWithPermitParams = BatchHelperBaseParams &
  BatchHelperPermitParams;

type UmbrellaBatchHelperRedeemParams = BatchHelperBaseParams;

type UmbrellaBatchHelperRedeemWithPermitParams = BatchHelperBaseParams &
  BatchHelperPermitParams;

export class UmbrellaBatchHelperService {
  private readonly interface: UmbrellaBatchHelperInterface;

  constructor(private readonly umbrellaBatchHelperAddress: string) {
    this.interface = UmbrellaBatchHelper__factory.createInterface();
  }

  deposit({
    sender,
    stakeToken,
    amount,
    edgeToken,
  }: UmbrellaBatchHelperDepositParams) {
    const txData = this.interface.encodeFunctionData('deposit', [
      {
        edgeToken,
        stakeToken,
        value: amount,
      },
    ]);
    const data = txData;
    const from = sender;
    const to = this.umbrellaBatchHelperAddress;
    const gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
        .recommended,
    );
    const tx: DefinedPopulatedTransaction = {
      data,
      from,
      to,
      gasLimit,
    };
    return tx;
  }

  depositWithPermit({
    sender,
    edgeToken,
    stakeToken,
    amount,
    deadline,
    permit,
  }: UmbrellaBatchHelperDepositWithPermitParams) {
    const signature = splitSignature(permit);
    const permitTxData = this.interface.encodeFunctionData('permit', [
      {
        token: edgeToken,
        value: amount,
        deadline,
        v: signature.v,
        r: signature.r,
        s: signature.s,
      },
    ]);
    const { data: depositTxData } = this.deposit({
      sender,
      stakeToken,
      amount,
      edgeToken,
    });
    const txData = this.interface.encodeFunctionData('multicall', [
      [permitTxData, depositTxData],
    ]);
    const data = txData;
    const from = sender;
    const to = this.umbrellaBatchHelperAddress;
    const gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
        .recommended,
    );
    const tx: DefinedPopulatedTransaction = {
      data,
      from,
      to,
      gasLimit,
    };
    return tx;
  }

  redeem({
    sender,
    stakeToken,
    amount,
    edgeToken,
  }: UmbrellaBatchHelperRedeemParams) {
    const txData = this.interface.encodeFunctionData('redeem', [
      {
        edgeToken,
        stakeToken,
        value: amount,
      },
    ]);
    const data = txData;
    const from = sender;
    const to = this.umbrellaBatchHelperAddress;
    const gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
        .recommended,
    );
    const tx: DefinedPopulatedTransaction = {
      data,
      from,
      to,
      gasLimit,
    };
    return tx;
  }

  redeemWithPermit({
    sender,
    edgeToken,
    stakeToken,
    amount,
    deadline,
    permit,
  }: UmbrellaBatchHelperRedeemWithPermitParams) {
    const signature = splitSignature(permit);
    const permitTxData = this.interface.encodeFunctionData('permit', [
      {
        token: edgeToken,
        value: amount,
        deadline,
        v: signature.v,
        r: signature.r,
        s: signature.s,
      },
    ]);
    const { data: redeemTxData } = this.redeem({
      sender,
      stakeToken,
      amount,
      edgeToken,
    });
    const txData = this.interface.encodeFunctionData('multicall', [
      [permitTxData, redeemTxData],
    ]);
    const data = txData;
    const from = sender;
    const to = this.umbrellaBatchHelperAddress;
    const gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
        .recommended,
    );
    const tx: DefinedPopulatedTransaction = {
      data,
      from,
      to,
      gasLimit,
    };
    return tx;
  }
}

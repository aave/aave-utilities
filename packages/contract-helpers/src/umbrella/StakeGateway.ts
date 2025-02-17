import { SignatureLike, splitSignature } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction } from 'ethers';

import { ProtocolAction } from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { StakeGatewayInterface } from './typechain/StakeGateway';
import { StakeGateway__factory } from './typechain/StakeGateway__factory';

interface StakeGatewayStakeParams {
  sender: string;
  stakeToken: string;
  amount: string;
}

interface StakeGatewayStakeWithPermitParams {
  sender: string;
  stakeToken: string;
  amount: string;
  deadline: string;
  permit: SignatureLike;
}

interface StakeGatewayStakeATokensParams {
  sender: string;
  stakeToken: string;
  amount: string;
}

interface StakeGatewayStakeATokensWithPermitParams {
  sender: string;
  stakeToken: string;
  amount: string;
  deadline: string;
  permit: SignatureLike;
}

interface StakeGatewayStakeNativeTokensParams {
  sender: string;
  stakeToken: string;
  amount: string;
}

interface StakeGatewayRedeemParams {
  sender: string;
  stakeToken: string;
  amount: string;
}

interface StakeGatewayRedeemATokensParams {
  sender: string;
  stakeToken: string;
  amount: string;
}

export class StakeGatewayService {
  private readonly interface: StakeGatewayInterface;

  constructor(private readonly stakeGatewayAddress: string) {
    this.interface = StakeGateway__factory.createInterface();
  }

  stake({ sender, stakeToken, amount }: StakeGatewayStakeParams) {
    const tx: PopulatedTransaction = {};
    const txData = this.interface.encodeFunctionData('stake', [
      stakeToken,
      amount,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeGatewayAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStake]
        .recommended,
    );
    return tx;
  }

  stakeWithPermit({
    sender,
    stakeToken,
    amount,
    deadline,
    permit,
  }: StakeGatewayStakeWithPermitParams) {
    const tx: PopulatedTransaction = {};
    const signature = splitSignature(permit);
    const txData = this.interface.encodeFunctionData('stakeWithPermit', [
      stakeToken,
      amount,
      deadline,
      signature.v,
      signature.r,
      signature.s,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeGatewayAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[
        ProtocolAction.umbrellaStakeGatewayStakeWithPermit
      ].recommended,
    );
    return tx;
  }

  stakeATokens({ sender, stakeToken, amount }: StakeGatewayStakeATokensParams) {
    const tx: PopulatedTransaction = {};
    const txData = this.interface.encodeFunctionData('stakeATokens', [
      stakeToken,
      amount,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeGatewayAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayStakeATokens]
        .recommended,
    );
    return tx;
  }

  stakeATokensWithPermit({
    sender,
    stakeToken,
    amount,
    deadline,
    permit,
  }: StakeGatewayStakeATokensWithPermitParams) {
    const tx: PopulatedTransaction = {};
    const signature = splitSignature(permit);
    const txData = this.interface.encodeFunctionData('stakeATokensWithPermit', [
      stakeToken,
      amount,
      deadline,
      signature.v,
      signature.r,
      signature.s,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeGatewayAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[
        ProtocolAction.umbrellaStakeGatewayStakeATokensWithPermit
      ].recommended,
    );
    return tx;
  }

  stakeNativeTokens({
    sender,
    stakeToken,
    amount,
  }: StakeGatewayStakeNativeTokensParams) {
    const tx: PopulatedTransaction = {};
    const txData = this.interface.encodeFunctionData('stakeNativeTokens', [
      stakeToken,
    ]);
    tx.value = BigNumber.from(amount);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeGatewayAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[
        ProtocolAction.umbrellaStakeGatewayStakeNativeTokens
      ].recommended,
    );
    return tx;
  }

  redeem({ sender, stakeToken, amount }: StakeGatewayRedeemParams) {
    const txData = this.interface.encodeFunctionData('redeem', [
      stakeToken,
      amount,
    ]);
    return {
      data: txData,
      from: sender,
      to: this.stakeGatewayAddress,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[ProtocolAction.umbrellaStakeGatewayRedeem]
          .recommended,
      ),
    };
  }

  redeemATokens({
    sender,
    stakeToken,
    amount,
  }: StakeGatewayRedeemATokensParams) {
    const txData = this.interface.encodeFunctionData('redeemATokens', [
      stakeToken,
      amount,
    ]);
    return {
      data: txData,
      from: sender,
      to: this.stakeGatewayAddress,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayRedeemATokens
        ].recommended,
      ),
    };
  }

  redeemNativeTokens({ sender, stakeToken, amount }: StakeGatewayRedeemParams) {
    const txData = this.interface.encodeFunctionData('redeemNativeTokens', [
      stakeToken,
      amount,
    ]);
    return {
      data: txData,
      from: sender,
      to: this.stakeGatewayAddress,
      gasLimit: BigNumber.from(
        gasLimitRecommendations[
          ProtocolAction.umbrellaStakeGatewayRedeemNativeTokens
        ].recommended,
      ),
    };
  }
}

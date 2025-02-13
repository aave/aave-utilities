import { SignatureLike, splitSignature } from '@ethersproject/bytes';
import { BigNumber, PopulatedTransaction } from 'ethers';

import { ProtocolAction } from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { IERC4626StakeTokenInterface } from './typechain/StakeToken';
import { IERC4626StakeToken__factory } from './typechain/StakeToken__factory';

interface StakeTokenCooldownParams {
  sender: string;
}

interface StakeTokenDepositParams {
  amount: string;
  sender: string;
}

interface StakeTokenDepositWithPermitParams {
  amount: string;
  deadline: string;
  permit: SignatureLike;
  sender: string;
}

interface StakeTokenRedeemParams {
  amount: string;
  sender: string;
}

export class StakeTokenService {
  private readonly interface: IERC4626StakeTokenInterface;

  constructor(private readonly stakeTokenAddress: string) {
    this.interface = IERC4626StakeToken__factory.createInterface();
  }

  cooldown({ sender }: StakeTokenCooldownParams) {
    const tx: PopulatedTransaction = {};
    const txData = this.interface.encodeFunctionData('cooldown');
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeTokenAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenCooldown]
        .recommended,
    );
    return tx;
  }

  deposit({ amount, sender }: StakeTokenDepositParams) {
    const tx: PopulatedTransaction = {};
    const receiver = sender;
    const txData = this.interface.encodeFunctionData('deposit', [
      amount,
      receiver,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeTokenAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenDeposit]
        .recommended,
    );
    return tx;
  }

  depositWithPermit({
    amount,
    deadline,
    permit,
    sender,
  }: StakeTokenDepositWithPermitParams) {
    const tx: PopulatedTransaction = {};
    const signature = splitSignature(permit);
    const receiver = sender;
    const txData = this.interface.encodeFunctionData('depositWithPermit', [
      amount,
      receiver,
      deadline,
      { v: signature.v, r: signature.r, s: signature.s },
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeTokenAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[
        ProtocolAction.umbrellaStakeTokenDepositWithPermit
      ].recommended,
    );
    return tx;
  }

  redeem({ amount, sender }: StakeTokenRedeemParams) {
    const tx: PopulatedTransaction = {};
    const receiver = sender;
    const owner = sender;
    const txData = this.interface.encodeFunctionData('redeem', [
      amount,
      receiver,
      owner,
    ]);
    tx.data = txData;
    tx.from = sender;
    tx.to = this.stakeTokenAddress;
    tx.gasLimit = BigNumber.from(
      gasLimitRecommendations[ProtocolAction.umbrellaStakeTokenRedeem]
        .recommended,
    );
    return tx;
  }
}

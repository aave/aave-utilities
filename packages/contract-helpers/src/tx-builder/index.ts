import { Signature, SignatureLike, splitSignature } from '@ethersproject/bytes';
import { PopulatedTransaction, providers, utils } from 'ethers';
import BaseService from '../commons/BaseService';
import { tEthereumAddress } from '../commons/types';
import {
  ApproveType,
  ERC20Service,
  IERC20ServiceInterface,
  TokenOwner,
} from '../erc20-contract';
import {
  ActionStruct,
  TxBuilder,
  TxBuilderInterface,
} from './typechain/TxBuilder';
import { TxBuilder__factory } from './typechain/TxBuilder__factory';

export interface TxBuilderServiceInterface {
  txDataBuilder: TxDataBuilder;
}

export type SignedCreditDelegationParams = {
  user: tEthereumAddress;
  target: tEthereumAddress;
  token: tEthereumAddress;
  interestRateMode: 1 | 2;
  delegationAmount: string;
  deadline: string;
  signature: string;
};

export type TxDataBuilder = {
  getApprovedAmount: ({ user, token }: TokenOwner) => Promise<ApproveType>;
  generateSignedCreditDelegationTx: (
    params: SignedCreditDelegationParams,
  ) => PopulatedTransaction;
  encodeActions: (actions: Action[]) => string;
  generateTxData: (
    user: tEthereumAddress,
    actions: Action[],
  ) => PopulatedTransaction;
};

export type TransferAction = {
  type: 'Transfer';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
};

export type TransferWithPermitAction = {
  type: 'TransferWithPermit';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
  signature: SignatureLike;
  deadline: string;
};

export type SupplyAction = {
  type: 'Supply';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
};

export type CreditDelegationWithSig = {
  type: 'CreditDelegationWithSig';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  interestRateMode: 1 | 2;
  delegationAmount: string;
  signature: SignatureLike;
  deadline: string;
};

export type BorrowAction = {
  type: 'Borrow';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
  interestRateMode: 1 | 2;
};

export type Action =
  | TransferAction
  | TransferWithPermitAction
  | SupplyAction
  | BorrowAction
  | CreditDelegationWithSig;

export function isCreditDelegationWithSig(
  action: Action,
): action is CreditDelegationWithSig {
  return action.type === 'CreditDelegationWithSig';
}

export function isTransferWithPermit(
  action: Action,
): action is TransferWithPermitAction {
  return action.type === 'TransferWithPermit';
}

function isTransferIn(action: Action): action is TransferAction {
  return action.type === 'Transfer';
}

function isSupply(action: Action): action is SupplyAction {
  return action.type === 'Supply';
}

function isBorrow(action: Action): action is BorrowAction {
  return action.type === 'Borrow';
}

export class TxBuilderService
  extends BaseService<TxBuilder>
  implements TxBuilderServiceInterface
{
  readonly TX_BUILDER_ADDRESS: tEthereumAddress;
  readonly erc20Service: IERC20ServiceInterface;
  readonly contractInterface: TxBuilderInterface;

  txDataBuilder: TxDataBuilder;

  constructor(
    provider: providers.Provider,
    TX_BUILDER_ADDRESS: tEthereumAddress,
  ) {
    super(provider, TxBuilder__factory);
    this.TX_BUILDER_ADDRESS = TX_BUILDER_ADDRESS;
    this.erc20Service = new ERC20Service(provider);
    this.contractInterface = TxBuilder__factory.createInterface();

    this.txDataBuilder = {
      generateSignedCreditDelegationTx: ({
        user,
        target,
        token,
        interestRateMode,
        delegationAmount,
        deadline,
        signature,
      }) => {
        const decomposedSignature: Signature = splitSignature(signature);
        const populatedTx: PopulatedTransaction = {};
        const fragment = this.contractInterface.getFunction('executeActions');
        const txData = utils.defaultAbiCoder.encode(
          [fragment.inputs[0]],
          [
            {
              target,
              data: utils.defaultAbiCoder.encode(
                [
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint8',
                  'bytes32',
                  'bytes32',
                ],
                [
                  token,
                  interestRateMode,
                  delegationAmount,
                  deadline,
                  decomposedSignature.v,
                  decomposedSignature.r,
                  decomposedSignature.s,
                ],
              ),
            },
          ],
        );

        populatedTx.data = txData;
        populatedTx.from = user;
        populatedTx.to = this.TX_BUILDER_ADDRESS;

        return populatedTx;
      },
      getApprovedAmount: async (props: TokenOwner): Promise<ApproveType> => {
        const spender = this.TX_BUILDER_ADDRESS;
        const amount = await this.erc20Service.approvedAmount({
          ...props,
          spender,
        });
        return {
          ...props,
          spender,
          amount: amount.toString(),
        };
      },
      encodeActions: (actions: Action[]) => {
        const actionStructs: ActionStruct[] = [];
        for (const action of actions) {
          if (isTransferIn(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [action.reserveAddress, action.amount],
              ),
            });
          } else if (isTransferWithPermit(action)) {
            const { v, r, s } = splitSignature(action.signature);
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                [
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint8',
                  'bytes32',
                  'bytes32',
                ],
                [
                  action.reserveAddress,
                  action.amount,
                  action.amount,
                  action.deadline,
                  v,
                  r,
                  s,
                ],
              ),
            });
          } else if (isSupply(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [action.reserveAddress, action.amount],
              ),
            });
          } else if (isBorrow(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256', 'uint256'],
                [action.reserveAddress, action.amount, action.interestRateMode],
              ),
            });
          } else if (isCreditDelegationWithSig(action)) {
            const { v, r, s } = splitSignature(action.signature);
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                [
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint8',
                  'bytes32',
                  'bytes32',
                ],
                [
                  action.reserveAddress,
                  action.interestRateMode,
                  action.delegationAmount,
                  action.deadline,
                  v,
                  r,
                  s,
                ],
              ),
            });
          }
        }

        const fragment = this.contractInterface.getFunction('executeActions');
        return utils.defaultAbiCoder.encode(
          [fragment.inputs[0]],
          [actionStructs.reverse()],
        );
      },
      generateTxData: (user: tEthereumAddress, actions: Action[]) => {
        const actionTx: PopulatedTransaction = {};

        const actionStructs: ActionStruct[] = [];
        for (const action of actions) {
          if (isTransferIn(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [action.reserveAddress, action.amount],
              ),
            });
          } else if (isSupply(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256'],
                [action.reserveAddress, action.amount],
              ),
            });
          } else if (isBorrow(action)) {
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                ['address', 'uint256', 'uint256'],
                [action.reserveAddress, action.amount, action.interestRateMode],
              ),
            });
          } else if (isCreditDelegationWithSig(action)) {
            const { v, r, s } = splitSignature(action.signature);
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                [
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint8',
                  'bytes32',
                  'bytes32',
                ],
                [
                  action.reserveAddress,
                  action.interestRateMode,
                  action.delegationAmount,
                  action.deadline,
                  v,
                  r,
                  s,
                ],
              ),
            });
          } else if (isTransferWithPermit(action)) {
            const { v, r, s } = splitSignature(action.signature);
            actionStructs.push({
              target: action.target,
              data: utils.defaultAbiCoder.encode(
                [
                  'address',
                  'uint256',
                  'uint256',
                  'uint256',
                  'uint8',
                  'bytes32',
                  'bytes32',
                ],
                [
                  action.reserveAddress,
                  action.amount,
                  action.amount,
                  action.deadline,
                  v,
                  r,
                  s,
                ],
              ),
            });
          }
        }

        const txData = this.contractInterface.encodeFunctionData(
          'executeActions',
          [actionStructs.reverse()],
        );

        actionTx.to = this.TX_BUILDER_ADDRESS;
        actionTx.from = user;
        actionTx.data = txData;

        return actionTx;
      },
    };
  }
}

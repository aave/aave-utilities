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

export type TxDataBuilder = {
  getApprovedAmount: ({ user, token }: TokenOwner) => Promise<ApproveType>;
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

export type SupplyAction = {
  type: 'Supply';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
};

export type BorrowAction = {
  type: 'Borrow';
  target: tEthereumAddress;
  reserveAddress: tEthereumAddress;
  amount: string;
  interestRateMode: 1 | 2;
};

export type Action = TransferAction | SupplyAction | BorrowAction;

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
          }
        }

        const fragment = this.contractInterface.getFunction('executeActions');
        return utils.defaultAbiCoder.encode(
          [fragment.inputs[0]],
          [actionStructs.reverse()],
        );
        // const foo = actionStructs.reverse().map(a => {
        // return utils.defaultAbiCoder.encode(
        //   ['address', 'bytes'],
        //   [a.target, a.data],
        //   );
        // });

        // return utils.defaultAbiCoder.encode(['bytes'], [foo]);
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

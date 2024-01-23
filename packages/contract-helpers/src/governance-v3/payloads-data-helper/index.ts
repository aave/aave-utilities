import { providers } from 'ethers';
import { AccessLevel } from '../governance-data-helper';
import { PayloadsControllerDataHelper } from '../typechain/PayloadsControllerDataHelper';
import { PayloadsControllerDataHelper__factory } from '../typechain/factories/PayloadsControllerDataHelper__factory';

export enum PayloadState {
  None,
  Created,
  Queued,
  Executed,
  Cancelled,
  Expired,
}

export type ExecutionAction = {
  target: string;
  withDelegateCall: boolean;
  accessLevel: AccessLevel;
  value: string;
  signature: string;
  callData: string;
};

export type Payload = {
  id: string;
  creator: string;
  maximumAccessLevelRequired: AccessLevel;
  state: PayloadState;
  createdAt: number;
  queuedAt: number;
  executedAt: number;
  cancelledAt: number;
  expirationTime: number;
  delay: number;
  gracePeriod: number;
  actions: ExecutionAction[];
};
export class PayloadsDataHelperService {
  private readonly _contract: PayloadsControllerDataHelper;

  constructor(
    payloadsHelperContracAddress: string,
    provider: providers.Provider,
  ) {
    this._contract = PayloadsControllerDataHelper__factory.connect(
      payloadsHelperContracAddress,
      provider,
    );
  }

  public async getPayloadsData(
    payloadsControllerAddress: string,
    payloadsIds: number[],
  ): Promise<Payload[]> {
    const data = await this._contract.getPayloadsData(
      payloadsControllerAddress,
      payloadsIds,
    );

    const payloads = data.map<Payload>(payload => {
      return {
        id: payload.id.toString(),
        creator: payload.data.creator,
        maximumAccessLevelRequired: payload.data.maximumAccessLevelRequired,
        state: payload.data.state,
        createdAt: payload.data.createdAt,
        queuedAt: payload.data.queuedAt,
        executedAt: payload.data.executedAt,
        cancelledAt: payload.data.cancelledAt,
        expirationTime: payload.data.expirationTime,
        delay: payload.data.delay,
        gracePeriod: payload.data.gracePeriod,
        actions: payload.data.actions.map<ExecutionAction>(action => {
          return {
            target: action.target,
            withDelegateCall: action.withDelegateCall,
            accessLevel: action.accessLevel,
            value: action.value.toString(),
            signature: action.signature,
            callData: action.callData,
          };
        }),
      };
    });

    return payloads;
  }
}

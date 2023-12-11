export enum AccessLevel {
  /** Do not use */
  None,
  /** listing assets, changes of assets params, updates of the protocol etc */
  Short_Executor,
  /** payloads controller updates */
  Long_Executor,
}

export enum ProposalV3State {
  /** proposal does not exist */
  Null,
  /** created, waiting for a cooldown to initiate the balances snapshot */
  Created,
  /** balances snapshot set, voting in progress */
  Active,
  /** voting results submitted, but proposal is under grace period when guardian can cancel it */
  Queued,
  /** results sent to the execution chain(s) */
  Executed,
  /** voting was not successful */
  Failed,
  /** got cancelled by guardian, or because proposition power of creator dropped below allowed minimum */
  Cancelled,
  Expired,
}

import BaseTxBuilder from '../commons/BaseTxBuilder';
import { IncentivesControllerInterface } from './IncentiveController';

export interface IncentiveTxInterface {}

export default class IncentiveTx
  extends BaseTxBuilder
  implements IncentiveTxInterface
{
  readonly incentiveTxBuilders: Record<string, IncentiveTxInterface>;

  public constructor(context: Context, config?: IncentiveConfig) {
    super(context);
  }
}

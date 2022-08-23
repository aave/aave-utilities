import { providers } from 'ethers';
import {
  GeneralStakeUIData,
  GeneralStakeUIDataHumanized,
  GetUserStakeUIData,
  GetUserStakeUIDataHumanized,
} from './types';
export * from './types';
export interface UiStakeDataProviderInterface {
  getUserStakeUIData: (params: { user: string }) => Promise<GetUserStakeUIData>;
  getGeneralStakeUIData: () => Promise<GeneralStakeUIData>;
  getUserStakeUIDataHumanized: (params: {
    user: string;
  }) => Promise<GetUserStakeUIDataHumanized>;
  getGeneralStakeUIDataHumanized: () => Promise<GeneralStakeUIDataHumanized>;
}
export declare type UiStakeDataProviderContext = {
  uiStakeDataProvider: string;
  provider: providers.Provider;
};
export declare class UiStakeDataProvider
  implements UiStakeDataProviderInterface
{
  private readonly _contract;
  constructor(context: UiStakeDataProviderContext);
  getUserStakeUIData({ user }: { user: string }): Promise<GetUserStakeUIData>;
  getUserStakeUIDataHumanized({
    user,
  }: {
    user: string;
  }): Promise<GetUserStakeUIDataHumanized>;
  getGeneralStakeUIData(): Promise<GeneralStakeUIData>;
  getGeneralStakeUIDataHumanized(): Promise<GeneralStakeUIDataHumanized>;
}
//# sourceMappingURL=index.d.ts.map

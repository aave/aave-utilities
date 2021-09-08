import { FormatReserveRequest } from './index';

export const formatReserveRequestWMATIC: FormatReserveRequest = {
  reserve: {
    decimals: 18,
    reserveFactor: '2000',
    baseLTVasCollateral: '5000',
    averageStableRate: '0',
    stableDebtLastUpdateTimestamp: 0,
    liquidityIndex: '1009201148274304211064576980',
    reserveLiquidationThreshold: '6500',
    reserveLiquidationBonus: '11000',
    variableBorrowIndex: '1027399683250350049378945640',
    variableBorrowRate: '33413387371057651815368820',
    availableLiquidity: '150629528254290021063240208',
    stableBorrowRate: '97733410530082359736241173',
    liquidityRate: '5741765771700111307817774',
    totalPrincipalStableDebt: '0',
    totalScaledVariableDebt: '40102377650818088556713088',
    lastUpdateTimestamp: 1629706026,
  },
  currentTimestamp: 1329706026,
};

export const formatReserveRequestDAI: FormatReserveRequest = {
  reserve: {
    decimals: 18,
    baseLTVasCollateral: '7500',
    reserveLiquidationThreshold: '8000',
    reserveLiquidationBonus: '10500',
    reserveFactor: '1000',
    liquidityIndex: '1000164447379610590574518134',
    variableBorrowIndex: '1000232854433711209646283880',
    liquidityRate: '26776200735312093055313462',
    variableBorrowRate: '38568743388028395681971229',
    stableBorrowRate: '109284371694014197840985614',
    lastUpdateTimestamp: 1606992400,
    availableLiquidity: '43133641118657852003256',
    totalPrincipalStableDebt: '1000000000000000000',
    averageStableRate: '109284236984257451326752610',
    stableDebtLastUpdateTimestamp: 1606992400,
    totalScaledVariableDebt: '145496831599325217573288',
  },
  currentTimestamp: 1329706026,
};

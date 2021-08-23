import BigNumber from 'bignumber.js'
import { calculateIncentivesAPY } from './calculate-incentives-apy'
import { formatReserveRequestWMATIC } from './reserve.mocks'

describe('calculateIncentivesAPY', () => {
  it('calculates incentives APY', () => {
    const result = calculateIncentivesAPY({
      emissionPerSecond:
        formatReserveRequestWMATIC.reserve.depositIncentivesEmissionPerSecond,
      rewardTokenPriceInEth: '317233277449070',
      tokenTotalSupply: new BigNumber('1000000003465380422'),
      tokenPriceInEth: '1634050000000000',
    })

    expect(result.toFixed()).toEqual('0.00000000000121427125')
  })

  it('calculates incentives APY', () => {
    const result = calculateIncentivesAPY({
      emissionPerSecond:
        formatReserveRequestWMATIC.reserve
          .variableDebtIncentivesEmissionPerSecond,
      rewardTokenPriceInEth: '317233277449070',
      tokenTotalSupply: new BigNumber('145530711359639107416907'),
      tokenPriceInEth: '1634050000000000',
    })

    expect(result.toFixed()).toEqual('0.00000000000000000093')
  })

  it('calculates incentives APY', () => {
    const result = calculateIncentivesAPY({
      emissionPerSecond: '0',
      rewardTokenPriceInEth: '317233277449070',
      tokenTotalSupply: new BigNumber('43135641118664782764100'),
      tokenPriceInEth: '1634050000000000',
    })

    expect(result.toFixed()).toEqual('0')
  })
})

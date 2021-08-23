import BigNumber from 'bignumber.js'
import * as calculateCompoundedInterest from './calculate-compounded-interest'
import { calculateReserveDebt } from './calculate-reserve-debt'
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks'

describe('calculateReserveDebt', () => {
  describe('WMATIC', () => {
    it('should calculate reserve debt', () => {
      const result = calculateReserveDebt(
        {
          totalScaledVariableDebt:
            formatReserveRequestWMATIC.reserve.totalScaledVariableDebt,
          variableBorrowIndex:
            formatReserveRequestWMATIC.reserve.variableBorrowIndex,
          totalPrincipalStableDebt:
            formatReserveRequestWMATIC.reserve.totalPrincipalStableDebt,
          variableBorrowRate:
            formatReserveRequestWMATIC.reserve.variableBorrowRate,
          lastUpdateTimestamp:
            formatReserveRequestWMATIC.reserve.lastUpdateTimestamp,
          averageStableRate:
            formatReserveRequestWMATIC.reserve.averageStableRate,
          stableDebtLastUpdateTimestamp:
            formatReserveRequestWMATIC.reserve.stableDebtLastUpdateTimestamp,
        },
        formatReserveRequestWMATIC.currentTimestamp,
      )

      expect(result).toEqual({
        totalDebt: new BigNumber('0'),
        totalStableDebt: new BigNumber('0'),
        totalVariableDebt: new BigNumber('30186360792775159242526245'),
      })
    })
  })

  describe('DAI', () => {
    it('should calculate reserve debt', () => {
      const result = calculateReserveDebt(
        {
          totalScaledVariableDebt:
            formatReserveRequestDAI.reserve.totalScaledVariableDebt,
          variableBorrowIndex:
            formatReserveRequestDAI.reserve.variableBorrowIndex,
          totalPrincipalStableDebt:
            formatReserveRequestDAI.reserve.totalPrincipalStableDebt,
          variableBorrowRate:
            formatReserveRequestDAI.reserve.variableBorrowRate,
          lastUpdateTimestamp:
            formatReserveRequestDAI.reserve.lastUpdateTimestamp,
          averageStableRate: formatReserveRequestDAI.reserve.averageStableRate,
          stableDebtLastUpdateTimestamp:
            formatReserveRequestDAI.reserve.stableDebtLastUpdateTimestamp,
        },
        formatReserveRequestWMATIC.currentTimestamp,
      )

      expect(result).toEqual({
        totalDebt: new BigNumber('1001528596565357176'),
        totalStableDebt: new BigNumber('500764298282678588'),
        totalVariableDebt: new BigNumber('104546224138225704941867'),
      })
    })
  })

  it('should call calculateCompoundedInterest twice', () => {
    const spy = jest.spyOn(
      calculateCompoundedInterest,
      'calculateCompoundedInterest',
    )
    calculateReserveDebt(
      {
        totalScaledVariableDebt:
          formatReserveRequestDAI.reserve.totalScaledVariableDebt,
        variableBorrowIndex:
          formatReserveRequestDAI.reserve.variableBorrowIndex,
        totalPrincipalStableDebt:
          formatReserveRequestDAI.reserve.totalPrincipalStableDebt,
        variableBorrowRate: formatReserveRequestDAI.reserve.variableBorrowRate,
        lastUpdateTimestamp:
          formatReserveRequestDAI.reserve.lastUpdateTimestamp,
        averageStableRate: formatReserveRequestDAI.reserve.averageStableRate,
        stableDebtLastUpdateTimestamp:
          formatReserveRequestDAI.reserve.stableDebtLastUpdateTimestamp,
      },
      formatReserveRequestWMATIC.currentTimestamp,
    )

    expect(spy).toHaveBeenCalledTimes(2)
  })
})

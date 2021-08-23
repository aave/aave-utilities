import BigNumber from 'bignumber.js'
import * as calReserveAPYs from './calculate-apy'
import * as calReserveDebt from './calculate-reserve-debt'
import { FormatReserveRequest, formatReserves } from './index'
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks'

describe('formatReserves', () => {
  afterEach(() => {
    // Clear spys each test can then test what it needs to without context of other tests
    jest.clearAllMocks()
  })

  describe('WMATIC', () => {
    let request: FormatReserveRequest

    beforeEach(() => {
      // clone it
      request = JSON.parse(JSON.stringify(formatReserveRequestWMATIC))
    })

    it('should call calculateReserveDebt with reserve and currentTimestamp if defined', () => {
      const spy = jest.spyOn(calReserveDebt, 'calculateReserveDebt')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        request.reserve,
        request.currentTimestamp,
      )
    })

    it('should call calculateReserveDebt with reserve and undefined', () => {
      request.currentTimestamp = undefined
      const spy = jest.spyOn(calReserveDebt, 'calculateReserveDebt')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(request.reserve, undefined)
    })

    it('should call calculateAPYs', () => {
      const spy = jest.spyOn(calReserveAPYs, 'calculateAPYs')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)

      expect(spy).toHaveBeenCalledWith({
        emissionEndTimestamp: request.emissionEndTimestamp,
        currentTimestamp: request.currentTimestamp,
        depositIncentivesEmissionPerSecond:
          request.reserve.depositIncentivesEmissionPerSecond,
        stableDebtIncentivesEmissionPerSecond:
          request.reserve.stableDebtIncentivesEmissionPerSecond,
        variableDebtIncentivesEmissionPerSecond:
          request.reserve.variableDebtIncentivesEmissionPerSecond,
        totalLiquidity: new BigNumber('150629528254290021063240208'),
        rewardTokenPriceEth: request.rewardTokenPriceEth,
        priceInEth: request.reserve.price.priceInEth,
        totalVariableDebt: new BigNumber('30186360792775159242526245'),
        totalStableDebt: new BigNumber(0),
      })
    })

    it('should return the correct response', () => {
      const result = formatReserves(request)
      expect(result).toEqual({
        availableLiquidity: '150629528254290021063240208',
        baseLTVasCollateral: '0.5',
        depositIncentivesAPY: '0.00000000000000000004',
        liquidityIndex: '1.00920114827430421106',
        liquidityRate: '0.00574176577170011131',
        price: { priceInEth: '0.00049803565744206' },
        reserveFactor: '0.2',
        reserveLiquidationBonus: '11000',
        reserveLiquidationThreshold: '0.65',
        stableBorrowRate: '0.09773341053008235974',
        stableDebtIncentivesAPY: '0',
        totalDebt: '0',
        totalLiquidity: '150629528254290021063240208',
        totalPrincipalStableDebt: '0',
        totalScaledVariableDebt: '40102377.650818088556713088',
        totalStableDebt: '30186360.792775159242526245',
        totalVariableDebt: '30186360.792775159242526245',
        utilizationRate: '0',
        variableBorrowIndex: '1.02739968325035004938',
        variableBorrowRate: '0.03341338737105765182',
        variableDebtIncentivesAPY: '0.00000000000000000002',
      })
    })

    it('should increase over time', () => {
      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1
      const first = formatReserves(request)

      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1
      const second = formatReserves(request)

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true)
    })
  })

  describe('DAI', () => {
    let request: FormatReserveRequest

    beforeEach(() => {
      // clone it
      request = JSON.parse(JSON.stringify(formatReserveRequestDAI))
    })

    it('should call calculateReserveDebt with reserve and currentTimestamp if defined', () => {
      const spy = jest.spyOn(calReserveDebt, 'calculateReserveDebt')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        request.reserve,
        request.currentTimestamp,
      )
    })

    it('should call calculateReserveDebt with reserve and undefined', () => {
      request.currentTimestamp = undefined
      const spy = jest.spyOn(calReserveDebt, 'calculateReserveDebt')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(request.reserve, undefined)
    })

    it('should call calculateAPYs', () => {
      const spy = jest.spyOn(calReserveAPYs, 'calculateAPYs')
      formatReserves(request)

      expect(spy).toHaveBeenCalledTimes(1)

      expect(spy).toHaveBeenCalledWith({
        emissionEndTimestamp: request.emissionEndTimestamp,
        currentTimestamp: request.currentTimestamp,
        depositIncentivesEmissionPerSecond:
          request.reserve.depositIncentivesEmissionPerSecond,
        stableDebtIncentivesEmissionPerSecond:
          request.reserve.stableDebtIncentivesEmissionPerSecond,
        variableDebtIncentivesEmissionPerSecond:
          request.reserve.variableDebtIncentivesEmissionPerSecond,
        totalLiquidity: new BigNumber('60450747218905341166529115358'),
        rewardTokenPriceEth: request.rewardTokenPriceEth,
        priceInEth: request.reserve.price.priceInEth,
        totalVariableDebt: new BigNumber('209641165163710133518030674226800'),
        totalStableDebt: new BigNumber('30225352042632111254338556051'),
      })
    })

    it('should return the correct response', () => {
      const result = formatReserves(request)
      expect(result).toEqual({
        availableLiquidity: '43133641118657852003256',
        baseLTVasCollateral: '0.75',
        depositIncentivesAPY: '0',
        liquidityIndex: '1.00016444737961059057',
        liquidityRate: '0.02677620073531209306',
        price: { priceInEth: '0.00163405' },
        reserveFactor: '0.1',
        reserveLiquidationBonus: '10500',
        reserveLiquidationThreshold: '0.8',
        stableBorrowRate: '0.10928437169401419784',
        stableDebtIncentivesAPY: '0',
        totalDebt: '60450704085264222508677112102',
        totalLiquidity: '60450747218905341166529115358',
        totalPrincipalStableDebt: '1',
        totalScaledVariableDebt: '145496.831599325217573288',
        totalStableDebt: '209641165163710.1335180306742268',
        totalVariableDebt: '209641165163710.1335180306742268',
        utilizationRate: '0',
        variableBorrowIndex: '1.00023285443371120965',
        variableBorrowRate: '0.03856874338802839568',
        variableDebtIncentivesAPY: '0',
      })
    })

    it('should increase over time', () => {
      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1
      const first = formatReserves(request)

      request.currentTimestamp = request.reserve.lastUpdateTimestamp + 1
      const second = formatReserves(request)

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true)
    })
  })
})

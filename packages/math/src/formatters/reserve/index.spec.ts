import BigNumber from 'bignumber.js'
import * as calReserveAPYs from './calculate-apy'
import * as calReserveDebt from './calculate-reserve-debt'
import { FormatReserveRequest, formatReserves } from './index'

describe('formatReserves', () => {
  afterEach(() => {
    // Clear spys each test can then test what it needs to without context of other tests
    jest.clearAllMocks()
  })

  describe('WMATIC', () => {
    let request: FormatReserveRequest

    beforeEach(() => {
      // Reset back to good request
      request = {
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
          price: {
            priceInEth: '498035657442060',
          },
          depositIncentivesEmissionPerSecond: '198333333333333000',
          variableDebtIncentivesEmissionPerSecond: '22037037037037000',
          stableDebtIncentivesEmissionPerSecond: '0',
        },
        currentTimestamp: 1629708576057,
        rewardTokenPriceEth: '498035657442060',
        emissionEndTimestamp: 1649851200,
      }
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
        totalVariableDebt: new BigNumber('29694984770103338741527703152408139'),
        totalStableDebt: new BigNumber(0),
      })
    })

    it('should return the correct response', () => {
      const result = formatReserves(request)
      expect(result).toEqual({
        availableLiquidity: '150629528254290021063240208',
        baseLTVasCollateral: '0.5',
        depositIncentivesAPY: '0',
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
        totalStableDebt: '29694984770103338.741527703152408139',
        totalVariableDebt: '29694984770103338.741527703152408139',
        utilizationRate: '0',
        variableBorrowIndex: '1.02739968325035004938',
        variableBorrowRate: '0.03341338737105765182',
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

  describe('DAI', () => {
    let request: FormatReserveRequest

    beforeEach(() => {
      // Reset back to good request
      request = {
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
          price: { priceInEth: '1634050000000000' },
          depositIncentivesEmissionPerSecond: '0',
          variableDebtIncentivesEmissionPerSecond: '0',
          stableDebtIncentivesEmissionPerSecond: '0',
        },
        currentTimestamp: 1629708576057,
        rewardTokenPriceEth: '317233277449070',
        emissionEndTimestamp: 1649851200,
      }
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

import BigNumber from 'bignumber.js'

export type BigNumberValue = string | number | BigNumber

export const BigNumberZeroDecimal = BigNumber.clone({
	DECIMAL_PLACES: 0,
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
})

export function valueToBigNumber(amount: BigNumberValue): BigNumber {
	return new BigNumber(amount)
}

export function valueToZDBigNumber(amount: BigNumberValue): BigNumber {
	return new BigNumberZeroDecimal(amount)
}

const bn10 = new BigNumber(10)

const bn10PowLookup: { [key: number]: BigNumber } = {}

/**
 * It's a performance optimized version of 10 ** x, which essentially memoizes previously used pows and resolves them as lookup.
 * @param decimals
 * @returns 10 ** decimals
 */
export function pow10(decimals: number): BigNumber {
	if (!bn10PowLookup[decimals]) bn10PowLookup[decimals] = bn10.pow(decimals)
	return bn10PowLookup[decimals]
}

export function normalize(n: BigNumberValue, decimals: number): string {
	return normalizeBN(n, decimals).toString(10)
}

export function normalizeBN(n: BigNumberValue, decimals: number): BigNumber {
	return valueToBigNumber(n).dividedBy(pow10(decimals))
}

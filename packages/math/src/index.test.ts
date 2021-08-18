import core, { foo } from '.'

// eslint-disable-next-line @typescript-eslint/no-var-requires
import cjs = require('.')

describe('core', () => {
	describe('default export', function() {
		it('is a function named "core"', () => {
			expect(typeof core).toBe('function')
			expect(core.name).toBe('core')
		})

		it('returns 42', () => {
			expect(core()).toBe(42)
		})
	})

	describe('CommonJS export', () => {
		it('is the same as the default export', () => {
			expect(cjs).toBe(core)
			expect(cjs.foo).toBe(foo)
		})
	})

	describe('foo', () => {
		it('returns "bar"', () => {
			expect(foo()).toBe('bar')
		})
	})
})

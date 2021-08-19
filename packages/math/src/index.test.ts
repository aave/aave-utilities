import { core, foo } from './index'

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

	describe('foo', () => {
		it('returns "bar"', () => {
			expect(foo()).toBe('bar')
		})
	})
})

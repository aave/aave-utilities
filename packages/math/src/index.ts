export default function core() {
	return 42
}

export function foo() {
	return 'bar'
}

// For CommonJS default export support
module.exports = Object.assign(exports.default, exports)

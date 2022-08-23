"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserReserve = void 0;
const bignumber_1 = require("../../bignumber");
const constants_1 = require("../../constants");
const ray_math_1 = require("../../ray.math");
function formatUserReserve({ reserve: _reserve, marketReferenceCurrencyDecimals, }) {
    const { userReserve } = _reserve;
    const { reserve } = userReserve;
    const reserveDecimals = reserve.decimals;
    const normalizeWithReserve = (n) => (0, bignumber_1.normalize)(n, reserve.decimals);
    const exactStableBorrowRate = (0, ray_math_1.rayPow)((0, bignumber_1.valueToZDBigNumber)(userReserve.stableBorrowRate)
        .dividedBy(constants_1.SECONDS_PER_YEAR)
        .plus(ray_math_1.RAY), constants_1.SECONDS_PER_YEAR).minus(ray_math_1.RAY);
    return Object.assign(Object.assign({}, userReserve), { underlyingBalance: (0, bignumber_1.normalize)(_reserve.underlyingBalance, reserveDecimals), underlyingBalanceMarketReferenceCurrency: (0, bignumber_1.normalize)(_reserve.underlyingBalanceMarketReferenceCurrency, marketReferenceCurrencyDecimals), underlyingBalanceUSD: _reserve.underlyingBalanceUSD.toString(), stableBorrows: normalizeWithReserve(_reserve.stableBorrows), stableBorrowsMarketReferenceCurrency: (0, bignumber_1.normalize)(_reserve.stableBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals), stableBorrowsUSD: _reserve.stableBorrowsUSD.toString(), variableBorrows: normalizeWithReserve(_reserve.variableBorrows), variableBorrowsMarketReferenceCurrency: (0, bignumber_1.normalize)(_reserve.variableBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals), variableBorrowsUSD: _reserve.variableBorrowsUSD.toString(), totalBorrows: normalizeWithReserve(_reserve.totalBorrows), totalBorrowsMarketReferenceCurrency: (0, bignumber_1.normalize)(_reserve.totalBorrowsMarketReferenceCurrency, marketReferenceCurrencyDecimals), totalBorrowsUSD: _reserve.totalBorrowsUSD.toString(), stableBorrowAPR: (0, bignumber_1.normalize)(userReserve.stableBorrowRate, constants_1.RAY_DECIMALS), stableBorrowAPY: (0, bignumber_1.normalize)(exactStableBorrowRate, constants_1.RAY_DECIMALS) });
}
exports.formatUserReserve = formatUserReserve;
//# sourceMappingURL=format-user-reserve.js.map
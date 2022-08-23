"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LTV_PRECISION = exports.RAY_DECIMALS = exports.WEI_DECIMALS = exports.USD_DECIMALS = exports.SECONDS_PER_YEAR = void 0;
const bignumber_1 = require("./bignumber");
exports.SECONDS_PER_YEAR = (0, bignumber_1.valueToBigNumber)('31536000');
exports.USD_DECIMALS = 8;
exports.WEI_DECIMALS = 18;
exports.RAY_DECIMALS = 27;
exports.LTV_PRECISION = 4;
//# sourceMappingURL=constants.js.map
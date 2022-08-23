"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateIncentiveAPR = void 0;
const bignumber_1 = require("../../bignumber");
const constants_1 = require("../../constants");
// Calculate the APR for an incentive emission
function calculateIncentiveAPR({ emissionPerSecond, rewardTokenPriceInMarketReferenceCurrency, priceInMarketReferenceCurrency, totalTokenSupply, decimals, }) {
    const emissionPerSecondNormalized = (0, bignumber_1.normalizeBN)(emissionPerSecond, constants_1.WEI_DECIMALS).multipliedBy(rewardTokenPriceInMarketReferenceCurrency);
    if (emissionPerSecondNormalized.eq(0)) {
        return '0';
    }
    const emissionPerYear = emissionPerSecondNormalized.multipliedBy(constants_1.SECONDS_PER_YEAR);
    const totalSupplyNormalized = (0, bignumber_1.valueToBigNumber)((0, bignumber_1.normalize)(totalTokenSupply, decimals)).multipliedBy(priceInMarketReferenceCurrency);
    return emissionPerYear.dividedBy(totalSupplyNormalized).toFixed();
}
exports.calculateIncentiveAPR = calculateIncentiveAPR;
//# sourceMappingURL=calculate-incentive-apr.js.map
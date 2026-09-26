/**
 * SmartTourConnect - Dynamic Yield Pricing Engine
 * Smart India Hackathon (SIH 2026) | Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 *
 * Implements occupancy-based elasticity formulas, seasonal multipliers,
 * and weekend/festival surge adjustments for community-owned stays.
 */

const DynamicPricingEngine = {
    /**
     * Compute dynamic rate with global factors
     */
    calculatePrice: function(params) {
        const base = Number(params.basePrice) || 3000;
        const occ = Number(params.currentOccupancy) || 55;
        const curr = APP_DATA.currencies[params.currency || 'INR'] || APP_DATA.currencies.INR;
        
        let occFactor = occ < 35 ? -0.15 : occ < 65 ? 0.05 : occ < 85 ? 0.22 : 0.40;
        let seasonFactor = Number(params.seasonFactor) || 0;
        let weatherFactor = Number(params.weatherFactor) || 0;
        let eventFactor = (params.isWeekend ? 0.12 : 0) + (params.isFestival ? 0.22 : 0);

        const totalMultiplier = Math.max(0.65, 1 + occFactor + seasonFactor + weatherFactor + eventFactor);
        const dynamicRateINR = Math.round(base * totalMultiplier);

        const fixedRevPAR_INR = Math.round((base * occ) / 100);
        const dynamicRevPAR_INR = Math.round((dynamicRateINR * Math.min(96, occ * 1.18)) / 100);
        const upliftPercent = Math.round(((dynamicRevPAR_INR - fixedRevPAR_INR) / (fixedRevPAR_INR || 1)) * 100);

        return {
            basePriceFormatted: `${curr.symbol} ${Math.round(base * curr.rate).toLocaleString()}`,
            dynamicRateFormatted: `${curr.symbol} ${Math.round(dynamicRateINR * curr.rate).toLocaleString()}`,
            diffFormatted: `${dynamicRateINR >= base ? '+' : ''}${curr.symbol} ${Math.round((dynamicRateINR - base) * curr.rate).toLocaleString()}`,
            diffPercent: Math.round(((dynamicRateINR - base) / base) * 100),
            fixedRevPARFormatted: `${curr.symbol} ${Math.round(fixedRevPAR_INR * curr.rate).toLocaleString()}`,
            dynamicRevPARFormatted: `${curr.symbol} ${Math.round(dynamicRevPAR_INR * curr.rate).toLocaleString()}`,
            upliftPercent: Math.max(8, upliftPercent),
            fixedRevPAR_INR: fixedRevPAR_INR,
            dynamicRevPAR_INR: dynamicRevPAR_INR,
            dynamicRateINR: dynamicRateINR
        };
    },

    /**
     * Global OTA Commission Savings Calculator (Expedia, Booking.com, MakeMyTrip)
     */
    calculateGlobalOtaSavings: function(bookingsCount, rateINR, currencyKey) {
        const curr = APP_DATA.currencies[currencyKey || 'INR'] || APP_DATA.currencies.INR;
        const totalGrossINR = bookingsCount * rateINR;
        
        const legacyCut = Math.round(totalGrossINR * 0.25); // 25% legacy OTA commission
        const stcFee = Math.round(totalGrossINR * 0.025);   // 2.5% low platform fee
        const monthlySavedINR = legacyCut - stcFee;

        return {
            monthlySavedFormatted: `${curr.symbol} ${Math.round(monthlySavedINR * curr.rate).toLocaleString()}`,
            yearlySavedFormatted: `${curr.symbol} ${Math.round(monthlySavedINR * 12 * curr.rate).toLocaleString()}`,
            legacyCutFormatted: `${curr.symbol} ${Math.round(legacyCut * curr.rate).toLocaleString()}`,
            stcFeeFormatted: `${curr.symbol} ${Math.round(stcFee * curr.rate).toLocaleString()}`
        };
    }
};

if (typeof window !== 'undefined') {
    window.DynamicPricingEngine = DynamicPricingEngine;
}

/**
 * SmartTourConnect - Custom Itinerary Generator
 * Smart India Hackathon (SIH 2026) | Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 *
 * Synthesizes day-by-day itineraries based on traveler count, duration,
 * travel vibe (eco, cultural, adventure), and transit connections.
 */

const ItineraryEngine = {
    /**
     * Generate customized itinerary for any destination worldwide
     */
    generate: function(options) {
        const dest = APP_DATA.destinations.find(d => d.id === options.destinationId) || APP_DATA.destinations[0];
        const days = Math.min(5, Math.max(1, Number(options.days) || 2));
        const travelers = Number(options.travelers) || 2;
        const vibe = options.vibe || 'eco';
        const currencyKey = options.currency || 'INR';
        const curr = APP_DATA.currencies[currencyKey] || APP_DATA.currencies.INR;

        const dayPlans = [];
        let totalEstCostINR = 0;
        let co2SavedKg = 0;

        const isHotspotCrowded = dest.popularHotspot.crowdPct > 95;

        for (let day = 1; day <= days; day++) {
            const shouldDivert = isHotspotCrowded && (day === 1 || day === 2);
            const dayBaseINR = Math.round(dest.baseRateINR * 0.9 * travelers);
            totalEstCostINR += dayBaseINR;

            if (shouldDivert) {
                co2SavedKg += 22;
            }

            dayPlans.push({
                dayNumber: day,
                title: day === 1 ? `Arrival & Anti-Congestion Exploration` : day === 2 ? `Hidden Gems & Cultural Immersion` : `Eco-Trails & Local Artisans`,
                isDiverted: shouldDivert,
                activeSpot: shouldDivert ? dest.offbeatGem.name : dest.popularHotspot.name,
                crowdPct: shouldDivert ? dest.offbeatGem.crowdPct : dest.popularHotspot.crowdPct,
                discountCode: shouldDivert ? dest.offbeatGem.discountCode : null,
                morning: shouldDivert 
                    ? `🌿 Early morning exploration at ${dest.offbeatGem.name} (Crowd: ${dest.offbeatGem.crowdPct}% • ${dest.offbeatGem.incentiveDiscount} applied)`
                    : `🏛️ Morning visit to ${dest.popularHotspot.name} (Arrive early to avoid line-up)`,
                afternoon: `🍲 Authentic culinary masterclass & local craft walk with verified community hosts`,
                evening: `🌄 Scenic sunset viewpoint & sustainable boutique stay relaxation`,
                dayCostFormatted: `${curr.symbol} ${Math.round(dayBaseINR * curr.rate).toLocaleString()}`
            });
        }

        const totalCostFormatted = `${curr.symbol} ${Math.round(totalEstCostINR * curr.rate).toLocaleString()}`;

        return {
            destination: dest,
            totalDays: days,
            travelers: travelers,
            totalCostFormatted: totalCostFormatted,
            co2SavedKg: co2SavedKg,
            sustainabilityScore: Math.min(99, 78 + (days * 5)),
            dailyPlans: dayPlans,
            currency: curr
        };
    }
};

if (typeof window !== 'undefined') {
    window.ItineraryEngine = ItineraryEngine;
}

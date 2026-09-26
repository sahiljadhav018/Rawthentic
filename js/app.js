/**
 * SmartTourConnect - Frontend Controller & Navigation Router
 * Smart India Hackathon (SIH 2026) | Problem Statement: SIH26204
 * Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 *
 * Architecture Notes:
 * - Mobile-first responsive UI with bottom navigation dock
 * - Event delegation for high-performance DOM manipulation
 * - State management for multi-currency conversion (INR, USD, EUR)
 */

let activeContinent = 'All';
let activeCurrency = 'INR';
let selectedDestinationId = 'in_western_ghats';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCurrencySwitcher();
    populateDestinationSelect();
    renderContinentFilters();
    renderDestinationsGrid();
    renderHotelsGrid();
    renderMarketplaceGrid();
    initHotelierSliders();
    initAuthorityData();

    // Default itinerary generation
    triggerItineraryGeneration();
});

// Dual Navigation (Desktop Header + Mobile Bottom Navigation Bar)
function initNavigation() {
    // Select all nav buttons (both desktop and mobile)
    const navButtons = document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            switchGlobalTab(target);
        });
    });
}

function switchGlobalTab(target) {
    // 1. Update Desktop Tab Buttons
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
        if (b.dataset.target === target) {
            b.className = 'nav-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-blue-600 text-white shadow-lg';
        } else {
            b.className = 'nav-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition text-gray-400 hover:text-gray-200';
        }
    });

    // 2. Update Mobile Bottom Tab Buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(b => {
        if (b.dataset.target === target) {
            b.classList.remove('text-gray-400');
            b.classList.add('text-blue-500', 'font-black');
            b.querySelector('.mobile-indicator')?.classList.remove('hidden');
        } else {
            b.classList.remove('text-blue-500', 'font-black');
            b.classList.add('text-gray-400');
            b.querySelector('.mobile-indicator')?.classList.add('hidden');
        }
    });

    // 3. Switch View Pane
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    const activePane = document.getElementById(`tab-${target}`);
    if (activePane) {
        activePane.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (target === 'hotelier') updateHotelierYield();
}

// Currency Switcher
function initCurrencySwitcher() {
    const selects = [document.getElementById('currency-selector'), document.getElementById('mobile-currency-selector')];
    selects.forEach(select => {
        if (!select) return;
        select.addEventListener('change', (e) => {
            activeCurrency = e.target.value;
            // Sync all currency select elements
            selects.forEach(s => { if (s) s.value = activeCurrency; });
            renderDestinationsGrid();
            renderHotelsGrid();
            triggerItineraryGeneration();
            updateHotelierYield();
            renderMarketplaceGrid();
        });
    });
}

// Populate Destination Dropdown with all global places
function populateDestinationSelect() {
    const select = document.getElementById('planner-destination');
    if (!select) return;

    select.innerHTML = '';
    APP_DATA.destinations.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.innerText = `${d.name} (${d.country})`;
        if (d.id === selectedDestinationId) opt.selected = true;
        select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
        selectedDestinationId = e.target.value;
        triggerItineraryGeneration();
    });
}

// Continent Filter Pills
function renderContinentFilters() {
    const container = document.getElementById('continent-filters');
    if (!container) return;

    container.innerHTML = APP_DATA.continents.map(c => `
        <button onclick="setContinent('${c}')" class="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeContinent === c ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800/80 text-gray-400 hover:text-white border border-slate-700'
        }">
            ${c}
        </button>
    `).join('');
}

function setContinent(c) {
    activeContinent = c;
    renderContinentFilters();
    renderDestinationsGrid();
}

// Filter Destinations & Render Grid
function renderDestinationsGrid() {
    const container = document.getElementById('destinations-grid');
    const searchInput = document.getElementById('destination-search');
    const searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();

    if (!container) return;

    const curr = APP_DATA.currencies[activeCurrency];
    const filtered = APP_DATA.destinations.filter(d => {
        const matchContinent = activeContinent === 'All' || d.continent === activeContinent;
        const matchSearch = d.name.toLowerCase().includes(searchQuery) || 
                            d.country.toLowerCase().includes(searchQuery) ||
                            d.tags.some(t => t.toLowerCase().includes(searchQuery));
        return matchContinent && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-xs text-gray-400">No destinations found matching "${searchQuery}". Try selecting "All" continents.</div>`;
        return;
    }

    container.innerHTML = filtered.map(d => {
        const priceFormatted = `${curr.symbol} ${Math.round(d.baseRateINR * curr.rate).toLocaleString()}`;
        const isHotspotRed = d.popularHotspot.crowdPct > 95;

        return `
            <div class="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between">
                <div class="relative h-44 sm:h-48 overflow-hidden">
                    <img src="${d.coverImage}" class="w-full h-full object-cover" alt="${d.name}">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div class="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900/80 text-white border border-white/10 backdrop-blur-md">
                            ${d.country}
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/80 text-white backdrop-blur-md">
                            ${d.continent}
                        </span>
                    </div>
                    <div class="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 class="font-black text-white text-sm sm:text-base leading-tight">${d.name}</h3>
                        <p class="text-[11px] text-gray-300">From ${priceFormatted} / day</p>
                    </div>
                </div>

                <div class="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <!-- Crowd Telemetry Indicator -->
                    <div class="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between text-[11px]">
                            <span class="text-gray-400">Hotspot:</span>
                            <span class="flex items-center gap-1 font-bold ${isHotspotRed ? 'text-rose-400' : 'text-emerald-400'}">
                                <span class="${isHotspotRed ? 'live-dot-red' : 'live-dot-green'}"></span>
                                ${d.popularHotspot.crowdPct}% Full
                            </span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div class="${isHotspotRed ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full" style="width: ${Math.min(100, d.popularHotspot.crowdPct)}%"></div>
                        </div>
                        <p class="text-[10px] text-gray-400 line-clamp-1">
                            Offbeat: <strong class="text-emerald-400">${d.offbeatGem.name}</strong> (${d.offbeatGem.incentiveDiscount})
                        </p>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="selectDestinationAndPlan('${d.id}')" class="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition">
                            ✨ AI Plan
                        </button>
                        <button onclick="claimVoucherModal('${d.name}', '${d.offbeatGem.name}', '${d.offbeatGem.discountCode}', '${d.offbeatGem.incentiveDiscount}')" class="px-3 py-2.5 bg-slate-800 active:scale-95 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition">
                            🎟️ Voucher
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectDestinationAndPlan(destId) {
    selectedDestinationId = destId;
    const select = document.getElementById('planner-destination');
    if (select) select.value = destId;
    triggerItineraryGeneration();

    const plannerEl = document.getElementById('planner-section');
    if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth' });
}

// Trigger AI Itinerary Generation
function triggerItineraryGeneration() {
    const daysSelect = document.getElementById('planner-days');
    const vibeSelect = document.getElementById('planner-vibe');

    const result = ItineraryEngine.generate({
        destinationId: selectedDestinationId,
        days: daysSelect ? daysSelect.value : 2,
        vibe: vibeSelect ? vibeSelect.value : 'eco',
        currency: activeCurrency,
        travelers: 2
    });

    renderItineraryView(result);
}

function renderItineraryView(plan) {
    const container = document.getElementById('itinerary-display-container');
    if (!container) return;

    let html = `
        <div class="luxury-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-700 shadow-xl space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            AI Personalized Route
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Eco-Score: ${plan.sustainabilityScore}/100
                        </span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-black text-white mt-1.5">${plan.destination.name}</h3>
                    <p class="text-[11px] text-gray-400">${plan.destination.country} • ${plan.totalDays} Days Route for 2 Travelers</p>
                </div>
                <div class="sm:text-right bg-slate-900/60 p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-800">
                    <p class="text-[11px] text-gray-400">Total Estimated Trip Cost</p>
                    <p class="text-2xl sm:text-3xl font-black text-gradient">${plan.totalCostFormatted}</p>
                    <p class="text-[10px] text-emerald-400 font-medium">🌱 ${plan.co2SavedKg}kg CO₂ emissions avoided</p>
                </div>
            </div>

            <!-- Day Cards: Mobile Vertical Stack, Desktop Grid -->
            <div class="grid grid-cols-1 md:grid-cols-${plan.dailyPlans.length} gap-3 sm:gap-4">
    `;

    plan.dailyPlans.forEach(day => {
        html += `
            <div class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border ${day.isDiverted ? 'border-amber-500/40 bg-amber-500/10' : 'border-slate-700/80 bg-slate-800/60'} space-y-2.5">
                <div class="flex items-center justify-between">
                    <span class="font-extrabold text-xs sm:text-sm text-white">Day ${day.dayNumber}</span>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded ${day.isDiverted ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-700 text-gray-300'}">
                        ${day.dayCostFormatted}
                    </span>
                </div>
                
                ${day.isDiverted ? `
                    <div class="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[10px] sm:text-[11px] text-amber-200">
                        ⚡ <strong>Overtourism Bypass:</strong> Routed to <strong>${day.activeSpot}</strong> with code <code class="bg-amber-400/30 font-bold px-1 rounded">${day.discountCode}</code>!
                    </div>
                ` : ''}

                <div class="text-[11px] space-y-1.5 text-gray-300">
                    <p class="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"><strong class="text-blue-400">Morning:</strong> ${day.morning}</p>
                    <p class="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"><strong class="text-indigo-400">Afternoon:</strong> ${day.afternoon}</p>
                    <p class="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"><strong class="text-purple-400">Evening:</strong> ${day.evening}</p>
                </div>
            </div>
        `;
    });

    html += `
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-700/80">
                <p class="text-[11px] text-gray-400 text-center sm:text-left">
                    Includes verified local homestay, guide, and low-congestion transit pass.
                </p>
                <button onclick="openBookingModal('${plan.destination.name} All-In-One Pass', '${plan.totalCostFormatted}')" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 text-white text-xs font-black rounded-xl shadow-lg transition">
                    🎟️ Book & Get Mobile QR Pass
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Hotels Grid
function renderHotelsGrid() {
    const container = document.getElementById('global-hotels-grid');
    if (!container) return;

    const curr = APP_DATA.currencies[activeCurrency];

    container.innerHTML = APP_DATA.hotels.map(h => {
        const price = `${curr.symbol} ${Math.round(h.basePriceINR * curr.rate).toLocaleString()}`;
        const saved = `${curr.symbol} ${Math.round(h.commissionSavedMonthlyINR * curr.rate).toLocaleString()}`;

        return `
            <div class="luxury-card rounded-2xl overflow-hidden">
                <div class="h-40 relative">
                    <img src="${h.image}" class="w-full h-full object-cover" alt="${h.name}">
                    <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-amber-400 backdrop-blur-md">
                        ★ ${h.rating}
                    </span>
                </div>
                <div class="p-3.5 space-y-2">
                    <h4 class="font-bold text-white text-sm line-clamp-1">${h.name}</h4>
                    <p class="text-[11px] text-gray-400">📍 ${h.location}</p>
                    <p class="text-[10px] text-emerald-400 font-semibold">Saved ${saved}/mo direct booking</p>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span class="text-xs sm:text-sm font-black text-white">${price} <span class="text-[10px] font-normal text-gray-400">/ night</span></span>
                        <button onclick="openBookingModal('${h.name}', '${price}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">
                            Direct Book
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Marketplace Grid
function renderMarketplaceGrid() {
    const container = document.getElementById('global-marketplace-grid');
    if (!container) return;

    const curr = APP_DATA.currencies[activeCurrency];

    container.innerHTML = APP_DATA.guidesAndArtisans.map(g => {
        const rate = `${curr.symbol} ${Math.round(g.hourlyRateINR * curr.rate).toLocaleString()}`;

        return `
            <div class="luxury-card rounded-2xl p-4 space-y-3">
                <div class="flex items-center gap-3">
                    <img src="${g.avatar}" class="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md" alt="${g.name}">
                    <div>
                        <span class="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ${g.badge}
                        </span>
                        <h4 class="font-bold text-white text-sm mt-0.5">${g.name}</h4>
                        <p class="text-[11px] text-blue-400 line-clamp-1">${g.title}</p>
                    </div>
                </div>
                <p class="text-[11px] text-gray-300 line-clamp-2">${g.experience}</p>
                <div class="text-[10px] text-gray-400">
                    <p>📍 ${g.location}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span class="text-xs sm:text-sm font-black text-white">${rate} <span class="text-[10px] font-normal text-gray-400">/ session</span></span>
                    <button onclick="openBookingModal('${g.name} Cultural Session', '${rate}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition">
                        Connect
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Hotelier Sliders
function initHotelierSliders() {
    const baseInput = document.getElementById('yield-base-rate');
    const occSlider = document.getElementById('yield-occupancy-slider');
    const seasonSelect = document.getElementById('yield-season');
    const weatherSelect = document.getElementById('yield-weather');
    const weekendCheck = document.getElementById('yield-weekend');
    const festivalCheck = document.getElementById('yield-festival');

    [baseInput, occSlider, seasonSelect, weatherSelect, weekendCheck, festivalCheck].forEach(el => {
        if (el) {
            el.addEventListener('input', updateHotelierYield);
            el.addEventListener('change', updateHotelierYield);
        }
    });

    updateHotelierYield();
}

function updateHotelierYield() {
    const baseInput = document.getElementById('yield-base-rate');
    const occSlider = document.getElementById('yield-occupancy-slider');
    const occLabel = document.getElementById('yield-occupancy-label');
    const seasonSelect = document.getElementById('yield-season');
    const weatherSelect = document.getElementById('yield-weather');
    const weekendCheck = document.getElementById('yield-weekend');
    const festivalCheck = document.getElementById('yield-festival');

    if (!baseInput || !occSlider) return;

    occLabel.innerText = `${occSlider.value}%`;

    const result = DynamicPricingEngine.calculatePrice({
        basePrice: baseInput.value,
        currentOccupancy: occSlider.value,
        seasonFactor: seasonSelect ? seasonSelect.value : 0,
        weatherFactor: weatherSelect ? weatherSelect.value : 0,
        isWeekend: weekendCheck ? weekendCheck.checked : false,
        isFestival: festivalCheck ? festivalCheck.checked : false,
        currency: activeCurrency
    });

    document.getElementById('yield-recommended-rate').innerText = result.dynamicRateFormatted;
    document.getElementById('yield-rate-diff').innerText = `${result.diffFormatted} (${result.diffPercent >= 0 ? '+' : ''}${result.diffPercent}%)`;
    document.getElementById('yield-fixed-revpar').innerText = result.fixedRevPARFormatted;
    document.getElementById('yield-dynamic-revpar').innerText = result.dynamicRevPARFormatted;
    document.getElementById('yield-uplift-badge').innerText = `+${result.upliftPercent}% RevPAR Gain`;

    const maxVal = Math.max(result.fixedRevPAR_INR, result.dynamicRevPAR_INR, 4000);
    document.getElementById('bar-yield-fixed').style.width = `${Math.round((result.fixedRevPAR_INR / maxVal) * 100)}%`;
    document.getElementById('bar-yield-dynamic').style.width = `${Math.round((result.dynamicRevPAR_INR / maxVal) * 100)}%`;

    const otaResult = DynamicPricingEngine.calculateGlobalOtaSavings(45, result.dynamicRateINR, activeCurrency);
    document.getElementById('ota-monthly-savings').innerText = otaResult.monthlySavedFormatted;
    document.getElementById('ota-yearly-savings').innerText = otaResult.yearlySavedFormatted;
    document.getElementById('ota-legacy-cut').innerText = otaResult.legacyCutFormatted;
    document.getElementById('ota-stc-fee').innerText = otaResult.stcFeeFormatted;
}

// Tourism Authority Data
function initAuthorityData() {
    const m = APP_DATA.globalMetrics;
    const curr = APP_DATA.currencies[activeCurrency];

    document.getElementById('global-active-travelers').innerText = m.activeTravelersWorldwide.toLocaleString();
    document.getElementById('global-diverted-count').innerText = `${m.divertedToOffbeat.toLocaleString()} (27.5%)`;
    document.getElementById('global-co2-saved').innerText = `${m.co2SavedMetricTons} MT`;
    document.getElementById('global-local-injected').innerText = `${curr.symbol} ${Math.round(m.localCommunityInjectedINR * curr.rate).toLocaleString()}`;
}

// Modals
function openBookingModal(itemTitle, priceFormatted) {
    const modal = document.getElementById('global-booking-modal');
    if (!modal) return;

    document.getElementById('modal-item-title').innerText = itemTitle;
    document.getElementById('modal-item-price').innerText = priceFormatted;
    const passId = `STC-GLO-${Math.floor(100000 + Math.random() * 900000)}`;
    document.getElementById('modal-pass-id').innerText = passId;

    modal.classList.remove('hidden');
}

function claimVoucherModal(destName, spotName, code, discount) {
    alert(`🎉 Voucher Claimed! You get ${discount} for ${spotName} in ${destName}. Use coupon ${code} during checkout.`);
    selectDestinationAndPlan(APP_DATA.destinations.find(d => d.name === destName)?.id || selectedDestinationId);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

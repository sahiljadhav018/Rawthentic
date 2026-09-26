/**
 * SmartTourConnect - Seed Data & Static Catalog
 * Smart India Hackathon (SIH 2026) | Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 */

const GLOBAL_APP_DATA = {
    appName: "Smart Tour Connect Global",
    tagline: "Global AI-Powered Sustainable Tourism, Dynamic Yield & Crowd Grid",
    version: "3.0.0",

    currencies: {
        INR: { symbol: "₹", rate: 1, name: "Indian Rupee" },
        USD: { symbol: "$", rate: 0.012, name: "US Dollar" },
        EUR: { symbol: "€", rate: 0.011, name: "Euro" },
        GBP: { symbol: "£", rate: 0.0095, name: "British Pound" },
        JPY: { symbol: "¥", rate: 1.85, name: "Japanese Yen" }
    },

    continents: ["All", "India", "Europe", "Asia-Pacific", "Americas", "Middle East"],

    // Worldwide Curated Destinations
    destinations: [
        // ================= INDIA =================
        {
            id: "in_western_ghats",
            name: "Western Ghats & Sahyadri",
            country: "India",
            continent: "India",
            currency: "INR",
            baseRateINR: 2400,
            coverImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&auto=format&fit=crop&q=80",
            tags: ["Eco-Trek", "Monsoon Trails", "UNESCO Heritage"],
            popularHotspot: {
                name: "Mahabaleshwar & Lonavala Viewpoints",
                currentFootfall: 2200,
                maxCapacity: 1800,
                crowdPct: 122,
                status: "overcrowded",
                waitTime: "45 mins"
            },
            offbeatGem: {
                name: "Kaas Plateau Flower Valley & Andharban Trail",
                crowdPct: 31,
                status: "optimal",
                incentiveDiscount: "20% OFF",
                discountCode: "KAAS_ECO20",
                description: "Serene endemic biodiversity plateau with zero tourist traffic and pristine cloud forests."
            }
        },
        {
            id: "in_kashmir",
            name: "Kashmir Valley & High Meadows",
            country: "India",
            continent: "India",
            currency: "INR",
            baseRateINR: 3500,
            coverImage: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80",
            tags: ["Snow Peaks", "Lakes", "Handicrafts"],
            popularHotspot: {
                name: "Gulmarg Gondola & Dal Lake Center",
                currentFootfall: 4500,
                maxCapacity: 3200,
                crowdPct: 140,
                status: "overcrowded",
                waitTime: "90 mins"
            },
            offbeatGem: {
                name: "Doodhpathri & Gurez Valley",
                crowdPct: 24,
                status: "optimal",
                incentiveDiscount: "25% OFF",
                discountCode: "GUREZ_MAGIC25",
                description: "Untouched pine valleys, glacial milk streams, and warm shepherd hospitality."
            }
        },
        {
            id: "in_goa",
            name: "Goa Coastal & River Hinterlands",
            country: "India",
            continent: "India",
            currency: "INR",
            baseRateINR: 3200,
            coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
            tags: ["Beaches", "Spice Plantations", "Heritage"],
            popularHotspot: {
                name: "Baga & Calangute Beach Strip",
                currentFootfall: 6800,
                maxCapacity: 4500,
                crowdPct: 151,
                status: "overcrowded",
                waitTime: "60 mins"
            },
            offbeatGem: {
                name: "Cola Lagoon & Divar Island",
                crowdPct: 28,
                status: "optimal",
                incentiveDiscount: "20% OFF",
                discountCode: "COLA_BLUE20",
                description: "Hidden freshwater lagoon nestled inside palm cliffs with quiet kayaking."
            }
        },
        {
            id: "in_rajasthan",
            name: "Rajasthan Royal Circuits & Thar",
            country: "India",
            continent: "India",
            currency: "INR",
            baseRateINR: 4000,
            coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
            tags: ["Palaces", "Desert Safari", "Folk Crafts"],
            popularHotspot: {
                name: "Jaipur Amer Fort & Hawa Mahal",
                currentFootfall: 5100,
                maxCapacity: 3800,
                crowdPct: 134,
                status: "overcrowded",
                waitTime: "50 mins"
            },
            offbeatGem: {
                name: "Bundi Stepwells & Shekhawati Frescoes",
                crowdPct: 22,
                status: "optimal",
                incentiveDiscount: "20% OFF",
                discountCode: "BUNDI_HERITAGE20",
                description: "Open-air art galleries, ancient blue streets, and peaceful fortress lookouts."
            }
        },

        // ================= EUROPE =================
        {
            id: "eu_paris",
            name: "Paris & French Countryside",
            country: "France",
            continent: "Europe",
            currency: "EUR",
            baseRateINR: 9500,
            coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
            tags: ["Art & Museums", "Culinary", "Architecture"],
            popularHotspot: {
                name: "Louvre Museum & Eiffel Esplanade",
                currentFootfall: 14200,
                maxCapacity: 10000,
                crowdPct: 142,
                status: "overcrowded",
                waitTime: "110 mins"
            },
            offbeatGem: {
                name: "Giverny Impressionist Gardens & Provins Medieval Town",
                crowdPct: 35,
                status: "optimal",
                incentiveDiscount: "15% OFF",
                discountCode: "GIVERNY_ART15",
                description: "Monet's water lilies, artisan cider mills, and peaceful cobblestone bastides."
            }
        },
        {
            id: "eu_swiss_alps",
            name: "Swiss Alps & Alpine Lakes",
            country: "Switzerland",
            continent: "Europe",
            currency: "EUR",
            baseRateINR: 14000,
            coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
            tags: ["Glaciers", "Alpine Hiking", "Eco-Trains"],
            popularHotspot: {
                name: "Jungfraujoch Top of Europe",
                currentFootfall: 3800,
                maxCapacity: 2800,
                crowdPct: 135,
                status: "overcrowded",
                waitTime: "75 mins"
            },
            offbeatGem: {
                name: "Appenzell Alpine Pastures & Lake Oeschinen",
                crowdPct: 29,
                status: "optimal",
                incentiveDiscount: "18% OFF",
                discountCode: "SWISS_PEACE18",
                description: "Crystal mountain tarns, traditional artisan cheese chalets, and zero line-ups."
            }
        },
        {
            id: "eu_rome",
            name: "Rome & Italian Countryside",
            country: "Italy",
            continent: "Europe",
            currency: "EUR",
            baseRateINR: 8800,
            coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
            tags: ["Ancient Ruins", "Gastronomy", "Renaissance"],
            popularHotspot: {
                name: "Colosseum & Trevi Fountain",
                currentFootfall: 16500,
                maxCapacity: 11000,
                crowdPct: 150,
                status: "overcrowded",
                waitTime: "120 mins"
            },
            offbeatGem: {
                name: "Civita di Bagnoregio & Umbrian Olive Groves",
                crowdPct: 26,
                status: "optimal",
                incentiveDiscount: "22% OFF",
                discountCode: "UMBRIA_ESCAPE22",
                description: "The dying cliff village, medieval olive presses, and serene Etruscan canyons."
            }
        },

        // ================= ASIA-PACIFIC =================
        {
            id: "asia_kyoto",
            name: "Kyoto & Kansai Historic Trail",
            country: "Japan",
            continent: "Asia-Pacific",
            currency: "JPY",
            baseRateINR: 8200,
            coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
            tags: ["Zen Temples", "Tea Ceremonies", "Bamboo Groves"],
            popularHotspot: {
                name: "Fushimi Inari & Arashiyama Bamboo Path",
                currentFootfall: 11800,
                maxCapacity: 8000,
                crowdPct: 147,
                status: "overcrowded",
                waitTime: "65 mins"
            },
            offbeatGem: {
                name: "Uji Green Tea Valley & Ohara Rural Temples",
                crowdPct: 32,
                status: "optimal",
                incentiveDiscount: "20% OFF",
                discountCode: "UJI_ZEN20",
                description: "Authentic matcha farm workshops, moss garden temples, and whispering cedars."
            }
        },
        {
            id: "asia_bali",
            name: "Bali & Nusa Archipelago",
            country: "Indonesia",
            continent: "Asia-Pacific",
            currency: "USD",
            baseRateINR: 4200,
            coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
            tags: ["Rice Terraces", "Volcano Treks", "Eco-Villas"],
            popularHotspot: {
                name: "Kuta & Canggu Beach Hubs",
                currentFootfall: 9200,
                maxCapacity: 6500,
                crowdPct: 141,
                status: "overcrowded",
                waitTime: "50 mins"
            },
            offbeatGem: {
                name: "Sidemen Valley & Munduk Waterfalls",
                crowdPct: 27,
                status: "optimal",
                incentiveDiscount: "25% OFF",
                discountCode: "BALI_PURE25",
                description: "Endless emerald rice paddies framed by Mount Agung with zero scooter traffic."
            }
        },

        // ================= MIDDLE EAST =================
        {
            id: "me_dubai",
            name: "Dubai & Arabian Desert Reserves",
            country: "UAE",
            continent: "Middle East",
            currency: "USD",
            baseRateINR: 9800,
            coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
            tags: ["Skyline", "Desert Conservation", "Luxury"],
            popularHotspot: {
                name: "Burj Khalifa & Dubai Mall Promenade",
                currentFootfall: 18000,
                maxCapacity: 12500,
                crowdPct: 144,
                status: "overcrowded",
                waitTime: "80 mins"
            },
            offbeatGem: {
                name: "Hatta Mountain Dam & Al Qudra Wildlife Lakes",
                crowdPct: 34,
                status: "optimal",
                incentiveDiscount: "15% OFF",
                discountCode: "HATTA_ECO15",
                description: "Turquoise mountain reservoir kayaking, desert gazelle viewing, and star camps."
            }
        },

        // ================= AMERICAS =================
        {
            id: "am_banff",
            name: "Banff & Canadian Rocky Mountains",
            country: "Canada",
            continent: "Americas",
            currency: "USD",
            baseRateINR: 11500,
            coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
            tags: ["Glacial Lakes", "Wildlife", "Canoeing"],
            popularHotspot: {
                name: "Lake Louise Shoreline & Moraine Lake",
                currentFootfall: 6200,
                maxCapacity: 4200,
                crowdPct: 147,
                status: "overcrowded",
                waitTime: "90 mins"
            },
            offbeatGem: {
                name: "Kananaskis Country & Emerald Lake Yoho",
                crowdPct: 30,
                status: "optimal",
                incentiveDiscount: "20% OFF",
                discountCode: "ROCKIES_CALM20",
                description: "Untamed glacial majesty, grizzly corridors, and peaceful wooden canoeing docks."
            }
        },
        {
            id: "am_cusco",
            name: "Cusco & Sacred Valley",
            country: "Peru",
            continent: "Americas",
            currency: "USD",
            baseRateINR: 5200,
            coverImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
            tags: ["Inca Ruins", "Andean Textiles", "High Altitude"],
            popularHotspot: {
                name: "Machu Picchu Main Citadel",
                currentFootfall: 4800,
                maxCapacity: 3500,
                crowdPct: 137,
                status: "overcrowded",
                waitTime: "85 mins"
            },
            offbeatGem: {
                name: "Choquequirao & Maras Salt Mines",
                crowdPct: 19,
                status: "optimal",
                incentiveDiscount: "25% OFF",
                discountCode: "INCA_LOST25",
                description: "The sister city to Machu Picchu, accessible via authentic trek with zero crowds."
            }
        }
    ],

    // Global SMB Hotels & Eco-Stays
    hotels: [
        {
            id: "hotel_1",
            name: "Sahyadri Heritage Homestay",
            location: "Kaas Plateau, India",
            continent: "India",
            basePriceINR: 2200,
            rating: 4.95,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
            amenities: ["Organic Farm Meals", "Campfire", "Solar Powered", "Local Trek Guide"],
            commissionSavedMonthlyINR: 42000
        },
        {
            id: "hotel_2",
            name: "Le Manoir des Impressionnistes",
            location: "Giverny, France",
            continent: "Europe",
            basePriceINR: 9200,
            rating: 4.92,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
            amenities: ["French Breakfast", "Cider Orchard View", "Bicycle Rental"],
            commissionSavedMonthlyINR: 145000
        },
        {
            id: "hotel_3",
            name: "Kyoto Uji Tea Chalet Ryokan",
            location: "Uji, Kyoto, Japan",
            continent: "Asia-Pacific",
            basePriceINR: 8400,
            rating: 4.98,
            image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80",
            amenities: ["Private Onsen", "Matcha Tasting", "Traditional Tatami"],
            commissionSavedMonthlyINR: 120000
        },
        {
            id: "hotel_4",
            name: "Swiss Alpine Chalet Oeschinen",
            location: "Kandersteg, Switzerland",
            continent: "Europe",
            basePriceINR: 13500,
            rating: 4.88,
            image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=600&auto=format&fit=crop&q=80",
            amenities: ["Panoramic Mountain View", "Fondue Kitchen", "Trailhead Access"],
            commissionSavedMonthlyINR: 185000
        },
        {
            id: "hotel_5",
            name: "Sidemen Bamboo Eco Sanctuary",
            location: "Sidemen Valley, Bali",
            continent: "Asia-Pacific",
            basePriceINR: 4500,
            rating: 4.94,
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
            amenities: ["Natural Spring Pool", "Mount Agung Vista", "Yoga Pavilion"],
            commissionSavedMonthlyINR: 65000
        }
    ],

    // Global Verified Artisans & Cultural Guides
    guidesAndArtisans: [
        {
            id: "guide_in",
            name: "Aniket Deshmukh",
            title: "Sahyadri Forts & Maratha Historian",
            location: "Maharashtra, India",
            languages: "Marathi, Hindi, English",
            hourlyRateINR: 350,
            badge: "Govt. Certified Guide",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
            experience: "Maratha military architecture & untouched canyon treks."
        },
        {
            id: "artisan_in",
            name: "Radhabai More",
            title: "GI-Certified Warli Folk Artist",
            location: "Western Ghats, India",
            languages: "Marathi, Hindi",
            hourlyRateINR: 400,
            badge: "GI Tag Master Artisan",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
            experience: "Authentic indigenous rice-paste mud canvas painting workshop."
        },
        {
            id: "guide_jp",
            name: "Master Kenji Takahashi",
            title: "16th-Gen Uji Tea Master",
            location: "Kyoto, Japan",
            languages: "Japanese, English",
            hourlyRateINR: 1800,
            badge: "Cultural Heritage Living Asset",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
            experience: "Ceremonial tea leaf harvesting & Zen meditation."
        },
        {
            id: "guide_fr",
            name: "Claire Bonnet",
            title: "Giverny Impressionism Historian",
            location: "Normandy, France",
            languages: "French, English, Spanish",
            hourlyRateINR: 1600,
            badge: "National Heritage Guide",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
            experience: "Botanical garden oil-painting walks & artisanal cheese tours."
        }
    ],

    // Global Tourism Authority Real-Time Telemetry
    globalMetrics: {
        activeTravelersWorldwide: 248900,
        divertedToOffbeat: 68400, // 27.5% crowd rebalanced!
        co2SavedMetricTons: 412.8,
        localCommunityInjectedINR: 48900000
    }
};

if (typeof window !== 'undefined') {
    window.APP_DATA = GLOBAL_APP_DATA;
}

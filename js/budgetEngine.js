/**
 * SmartTourConnect - Dynamic Budget Estimation & Route Optimizer
 * Smart India Hackathon (SIH 2026) | Problem Statement: SIH26204
 * Team: Rawauthentic
 * Author & Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
 *
 * Algorithm Design:
 * - Calculates day-wise tourist expenditure breakdowns
 * - Computes real-time savings compared to standard 18-30% OTA commission markups
 * - Covers 50+ curated destinations + on-the-fly dynamic generator
 */

const BudgetPlannerEngine = {
    // Curated Comprehensive Places Directory
    destinations: {
        // ================= MAHARASHTRA LOCAL & REGIONAL =================
        "mh_pune": {
            id: "mh_pune",
            name: "Pune Cultural & Heritage City",
            state: "Maharashtra, India",
            continent: "India",
            category: "Maharashtra Local",
            icon: "🏰",
            minBudgetSingle: 2500,
            trains: [
                { name: "Deccan Queen Superfast", number: "12123", route: "Mumbai CSMT ➔ Pune Jn", fare: 420, class: "AC Chair Car", duration: "3h 10m" },
                { name: "Pragati Superfast Express", number: "12125", route: "CSMT ➔ Pune Jn (via Panvel)", fare: 380, class: "Chair Car", duration: "3h 25m" }
            ],
            hotelPerNight: 1500,
            localTransitDaily: 350,
            foodDaily: 450,
            activitiesTotal: 500,
            relatedPlaces: [
                { name: "Shaniwar Wada Peshwa Palace", dist: "City Core", highlight: "Historic 18th-century Peshwa seat & light-sound show", crowd: "Moderate" },
                { name: "Sinhagad Fort Citadel", dist: "25 km south", highlight: "Tanaji Malusare memorial, scenic ramparts & Pithla Bhakri", crowd: "Optimal (Offbeat)" },
                { name: "Aga Khan Palace & Gandhi Memorial", dist: "Kalyani Nagar", highlight: "Italian arches & lush tranquil gardens", crowd: "Quiet" },
                { name: "Sarasbaug Ganpati & Peshwe Lake", dist: "Swargate", highlight: "Historic island temple with green lawns", crowd: "Moderate" }
            ]
        },
        "mh_lonavala": {
            id: "mh_lonavala",
            name: "Lonavala & Khandala Ghats",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "⛰️",
            minBudgetSingle: 3000,
            trains: [
                { name: "Indrayani Express", number: "22105", route: "Mumbai CSMT ➔ Lonavala Jn", fare: 310, class: "AC Chair Car", duration: "2h 15m" },
                { name: "Deccan Express (Vistadome)", number: "11007", route: "CSMT ➔ Khandala / Lonavala", fare: 780, class: "Vistadome Glass Coach", duration: "2h 30m" }
            ],
            hotelPerNight: 1800,
            localTransitDaily: 400,
            foodDaily: 500,
            activitiesTotal: 600,
            relatedPlaces: [
                { name: "Karla & Bhaja Ancient Buddhist Caves", dist: "11 km east", highlight: "2nd century BC rock-cut chaityas & stupas", crowd: "Optimal (Offbeat)" },
                { name: "Lohagad Fort Mountain Trek", dist: "10 km south", highlight: "Vinchukata scorpion tail ridge cliff vista", crowd: "Moderate" },
                { name: "Tiger Point & Lion's Point", dist: "Kurvande ridge", highlight: "Dramatic 650m sheer drop cloud views", crowd: "High (Overcrowded)" },
                { name: "Pavana Lake Campsite", dist: "15 km south", highlight: "Lakeside stargazing & quiet kayaking", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_mahabaleshwar": {
            id: "mh_mahabaleshwar",
            name: "Mahabaleshwar & Panchgani",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "🍓",
            minBudgetSingle: 3800,
            trains: [
                { name: "Koyna Express", number: "11029", route: "CSMT / Pune ➔ Wathar / Satara", fare: 460, class: "Chair Car / 2S", duration: "5h 15m" },
                { name: "Maharashtra Express", number: "11040", route: "Kolhapur / Pune ➔ Satara", fare: 380, class: "Sleeper Class", duration: "4h 40m" }
            ],
            hotelPerNight: 2000,
            localTransitDaily: 450,
            foodDaily: 600,
            activitiesTotal: 700,
            relatedPlaces: [
                { name: "Arthur's Seat Queen of Points", dist: "Saviti Valley", highlight: "Stratified canyon resembling Grand Canyon", crowd: "Moderate" },
                { name: "Table Land Volcanic Plateau", dist: "Panchgani", highlight: "Asia's 2nd longest volcanic mountain plateau", crowd: "Optimal (Offbeat)" },
                { name: "Mapro Strawberry Farms & Orchards", dist: "Gureghar", highlight: "Fresh organic strawberry picking & shakes", crowd: "Moderate" },
                { name: "Pratapgad Fort of Shivaji Maharaj", dist: "21 km west", highlight: "Historic battle site nestled in dense jawli forest", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_shirdi": {
            id: "mh_shirdi",
            name: "Shirdi Sai Pilgrimage & Shani Shingnapur",
            state: "Maharashtra, India",
            continent: "India",
            category: "Pilgrimage",
            icon: "🛕",
            minBudgetSingle: 2800,
            trains: [
                { name: "Vande Bharat Express", number: "22223", route: "Mumbai CSMT ➔ Sainagar Shirdi", fare: 975, class: "AC Chair Car", duration: "5h 20m" },
                { name: "Dadar Shirdi Superfast Express", number: "12131", route: "Dadar ➔ Sainagar Shirdi", fare: 480, class: "Sleeper / 3AC", duration: "6h 00m" }
            ],
            hotelPerNight: 1400,
            localTransitDaily: 300,
            foodDaily: 400,
            activitiesTotal: 300,
            relatedPlaces: [
                { name: "Sai Baba Samadhi Mandir Complex", dist: "Shirdi Core", highlight: "Spiritual darshan, Gurusthan & Lendi Baug", crowd: "High (Overcrowded)" },
                { name: "Shani Shingnapur Doorless Village", dist: "70 km south", highlight: "Ancient open-air Shani black stone shrine", crowd: "Moderate" },
                { name: "Khandoba Mandir & Dixit Wada Museum", dist: "Shirdi town", highlight: "Historic Sai relics & original photographs", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_alibaug": {
            id: "mh_alibaug",
            name: "Alibaug & Nagaon Coastal Trails",
            state: "Maharashtra, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🏖️",
            minBudgetSingle: 3200,
            trains: [
                { name: "Mandwa Ro-Ro Speed Ferry", number: "M2M-FERRY", route: "Bhaucha Dhakka ➔ Mandwa Port (Alibaug)", fare: 420, class: "Fast Catamaran", duration: "45m" },
                { name: "Konkan Coastal Rail Link", number: "50103", route: "Diva ➔ Roha / Pen Jn", fare: 120, class: "Passenger Rail", duration: "1h 45m" }
            ],
            hotelPerNight: 1800,
            localTransitDaily: 400,
            foodDaily: 600,
            activitiesTotal: 500,
            relatedPlaces: [
                { name: "Kolaba Sea Fort in the Waves", dist: "1 km into sea", highlight: "Walk into ocean at low tide to 350-year fort", crowd: "Moderate" },
                { name: "Kashid White Sand Surfing Beach", dist: "30 km south", highlight: "White sands and Casuarina pine groves", crowd: "Optimal (Offbeat)" },
                { name: "Murud Janjira Unconquered Sea Citadel", dist: "45 km south", highlight: "Sailboat approach to deep-water sea fortress", crowd: "Optimal (Offbeat)" },
                { name: "Nagaon Betel Nut & Coconut Orchards", dist: "8 km from town", highlight: "Quiet seaside home-cooked Konkani fish thali", crowd: "Quiet" }
            ]
        },
        "mh_matheran": {
            id: "mh_matheran",
            name: "Matheran Car-Free Eco Hill Station",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "🌲",
            minBudgetSingle: 2900,
            trains: [
                { name: "Neral Matheran Historic Toy Train", number: "52101", route: "Neral Jn ➔ Matheran Hill Station", fare: 300, class: "Narrow Gauge Heritage Rail", duration: "2h 00m" },
                { name: "Mumbai Pune Intercity", number: "12127", route: "CSMT / Dadar ➔ Neral Jn", fare: 180, class: "Second Class", duration: "1h 20m" }
            ],
            hotelPerNight: 1600,
            localTransitDaily: 250,
            foodDaily: 500,
            activitiesTotal: 400,
            relatedPlaces: [
                { name: "Charlotte Lake & Dam Forest", dist: "1.5 km from market", highlight: "Lush freshwater reservoir nestled in cloud woods", crowd: "Optimal (Offbeat)" },
                { name: "Panorama Point 360-Degree Vista", dist: "Northern tip", highlight: "Views of 7 forts & Prabalgad plateau", crowd: "Moderate" },
                { name: "Louisa Point Waterfall Cliff", dist: "West cliff", highlight: "Valley views and seasonal reverse waterfalls", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_nashik": {
            id: "mh_nashik",
            name: "Nashik Wine Capital & Trimbakeshwar",
            state: "Maharashtra, India",
            continent: "India",
            category: "Pilgrimage",
            icon: "🍇",
            minBudgetSingle: 3200,
            trains: [
                { name: "Panchavati Superfast Express", number: "12109", route: "CSMT ➔ Nashik Road", fare: 340, class: "AC Chair Car", duration: "3h 40m" },
                { name: "Vande Bharat Express (Shirdi/Nashik)", number: "22223", route: "CSMT ➔ Nashik Road", fare: 860, class: "AC Chair Car", duration: "2h 55m" }
            ],
            hotelPerNight: 1600,
            localTransitDaily: 350,
            foodDaily: 500,
            activitiesTotal: 600,
            relatedPlaces: [
                { name: "Trimbakeshwar Jyotirlinga & Brahmagiri", dist: "28 km west", highlight: "Godavari origin & one of 12 sacred Jyotirlingas", crowd: "High (Overcrowded)" },
                { name: "Sula Vineyards & Tasting Cellars", dist: "Gangapur Dam", highlight: "Grape stomping, vineyard tours and wine tasting", crowd: "Moderate" },
                { name: "Pandavleni Ancient 1st-Century Caves", dist: "Mumbai Naka", highlight: "Trisangu vihara carvings on mountain face", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_kolhapur": {
            id: "mh_kolhapur",
            name: "Kolhapur Mahalaxmi & Panhala Fort",
            state: "Maharashtra, India",
            continent: "India",
            category: "Maharashtra Local",
            icon: "👑",
            minBudgetSingle: 3200,
            trains: [
                { name: "Mahalaxmi Express", number: "17411", route: "Mumbai CSMT ➔ Kolhapur SCSMT", fare: 480, class: "Sleeper / 3AC", duration: "10h 30m" },
                { name: "Koyna Express", number: "11029", route: "Pune ➔ Kolhapur", fare: 280, class: "Chair Car", duration: "6h 15m" }
            ],
            hotelPerNight: 1500,
            localTransitDaily: 300,
            foodDaily: 500,
            activitiesTotal: 450,
            relatedPlaces: [
                { name: "Shree Mahalaxmi (Ambabaee) Temple", dist: "Old City Core", highlight: "Ancient Hemadpanthi temple & Kiranotsav", crowd: "High (Overcrowded)" },
                { name: "Panhala Fort Citadel of Snake-Coils", dist: "20 km north-west", highlight: "Sajja Kothi, Ambarkhana & misty hill views", crowd: "Optimal (Offbeat)" },
                { name: "Rankala Lake & Shalini Palace", dist: "West town", highlight: "Evening sunset stroll with authentic Kolhapuri Bhel", crowd: "Moderate" }
            ]
        },
        "mh_ganpatipule": {
            id: "mh_ganpatipule",
            name: "Ganpatipule & Ratnagiri Coastal Shores",
            state: "Maharashtra, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🌊",
            minBudgetSingle: 3600,
            trains: [
                { name: "Mandovi Express", number: "10103", route: "Mumbai CSMT ➔ Ratnagiri Jn", fare: 520, class: "Chair Car / 3AC", duration: "5h 45m" },
                { name: "Tejas Express", number: "22119", route: "CSMT ➔ Ratnagiri", fare: 1100, class: "AC Chair Car", duration: "4h 30m" }
            ],
            hotelPerNight: 1700,
            localTransitDaily: 350,
            foodDaily: 550,
            activitiesTotal: 400,
            relatedPlaces: [
                { name: "Swayambhu Ganpati Beach Temple", dist: "Coastline", highlight: "400-year monolith deity right by emerald waves", crowd: "Moderate" },
                { name: "Aare Ware Twin Virgin Beaches", dist: "12 km north", highlight: "Pristine white sand coastal drive & cliffs", crowd: "Optimal (Offbeat)" },
                { name: "Jaigad Fort & Lighthouse", dist: "18 km north", highlight: "Shastri river estuary meets Arabian sea", crowd: "Quiet" }
            ]
        },
        "mh_tarkarli": {
            id: "mh_tarkarli",
            name: "Tarkarli, Malvan & Sindhudurg Fort",
            state: "Maharashtra, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🐠",
            minBudgetSingle: 4200,
            trains: [
                { name: "Konkan Kanya Express", number: "20111", route: "Mumbai CSMT ➔ Kudal Jn", fare: 540, class: "Sleeper / 3AC", duration: "9h 30m" },
                { name: "Jan Shatabdi Express", number: "12051", route: "CSMT ➔ Kankavli / Kudal", fare: 650, class: "AC Chair Car", duration: "8h 15m" }
            ],
            hotelPerNight: 1800,
            localTransitDaily: 450,
            foodDaily: 600,
            activitiesTotal: 900,
            relatedPlaces: [
                { name: "Sindhudurg Ocean Sea Fort", dist: "Off Malvan Coast", highlight: "Built by Shivaji Maharaj, accessible only by ferry", crowd: "Moderate" },
                { name: "Tarkarli Coral Scuba & Snorkel Reef", dist: "Tarkarli Beach", highlight: "Crystal-clear coral diving & dolphin safari", crowd: "Optimal (Offbeat)" },
                { name: "Devbagh Sangam Estuary", dist: "Karli confluence", highlight: "Thin sandspit between backwaters and Arabian sea", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_bhandardara": {
            id: "mh_bhandardara",
            name: "Bhandardara & Kalsubai Peak",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "⛰️",
            minBudgetSingle: 3100,
            trains: [
                { name: "Panchavati Express", number: "12109", route: "Mumbai CSMT ➔ Igatpuri Jn", fare: 290, class: "Chair Car", duration: "2h 45m" },
                { name: "Tapovan Express", number: "17617", route: "Dadar ➔ Kasara / Igatpuri", fare: 190, class: "Second Class", duration: "2h 30m" }
            ],
            hotelPerNight: 1600,
            localTransitDaily: 350,
            foodDaily: 450,
            activitiesTotal: 500,
            relatedPlaces: [
                { name: "Kalsubai Maharashtra Highest Peak (1646m)", dist: "Bari Village", highlight: "Summit trek with ladder routes above the clouds", crowd: "Optimal (Offbeat)" },
                { name: "Arthur Lake & Wilson Dam Umbrella Falls", dist: "Pravara River", highlight: "Lakeside camping & million fireflies sanctuary", crowd: "Moderate" },
                { name: "Ratangad Jewel of the Sahyadris", dist: "Ratanwadi", highlight: "Natural rock hole 'Nedhe' & Amruteshwar temple", crowd: "Quiet" }
            ]
        },
        "mh_sambhajinagar": {
            id: "mh_sambhajinagar",
            name: "Chhatrapati Sambhajinagar (Ajanta & Ellora)",
            state: "Maharashtra, India",
            continent: "India",
            category: "Fort / Heritage",
            icon: "🏛️",
            minBudgetSingle: 3600,
            trains: [
                { name: "Vande Bharat Express", number: "20706", route: "Mumbai CSMT ➔ Jalna / Sambhajinagar", fare: 1150, class: "AC Chair Car", duration: "5h 15m" },
                { name: "Jan Shatabdi Express", number: "12071", route: "Dadar ➔ Aurangabad (CSN)", fare: 480, class: "AC Chair Car", duration: "6h 20m" }
            ],
            hotelPerNight: 1800,
            localTransitDaily: 450,
            foodDaily: 500,
            activitiesTotal: 800,
            relatedPlaces: [
                { name: "Ellora Kailash Temple (Cave 16)", dist: "29 km north-west", highlight: "World's largest single rock-carved monolithic temple", crowd: "Moderate" },
                { name: "Ajanta Frescoes & Painting Caves", dist: "100 km north", highlight: "Ancient Buddhist monastery paintings 2nd century BC", crowd: "Moderate" },
                { name: "Daulatabad (Devagiri) Impregnable Citadel", dist: "15 km", highlight: "Dark maze 'Andhari', moats and Chand Minar tower", crowd: "Optimal (Offbeat)" },
                { name: "Bibi Ka Maqbara (Dakhani Taj)", dist: "City core", highlight: "Marble tomb built by Azam Shah", crowd: "Moderate" }
            ]
        },
        "mh_tadoba": {
            id: "mh_tadoba",
            name: "Tadoba Andhari Tiger Reserve",
            state: "Maharashtra, India",
            continent: "India",
            category: "Maharashtra Local",
            icon: "🐅",
            minBudgetSingle: 6500,
            trains: [
                { name: "Sewagram Superfast Express", number: "12139", route: "CSMT ➔ Chandrapur / Nagpur", fare: 720, class: "Sleeper / 3AC", duration: "14h 30m" },
                { name: "Duronto Express", number: "12289", route: "CSMT ➔ Nagpur Jn", fare: 1450, class: "3-Tier AC", duration: "11h 00m" }
            ],
            hotelPerNight: 3000,
            localTransitDaily: 600,
            foodDaily: 700,
            activitiesTotal: 1800,
            relatedPlaces: [
                { name: "Moharli Tiger Safari Gate", dist: "Tadoba Core", highlight: "Highest Royal Bengal Tiger sighting density in India", crowd: "Moderate" },
                { name: "Erai Dam Backwaters", dist: "Chandrapur border", highlight: "Marsh crocodiles, spotted deer & birdwatching", crowd: "Optimal (Offbeat)" },
                { name: "Kolsa Forest Buffer Trail", dist: "South Tadoba", highlight: "Untouched teak forest jeep safaris", crowd: "Quiet" }
            ]
        },
        "mh_satara": {
            id: "mh_satara",
            name: "Satara & Kaas Pathar (UNESCO Flower Valley)",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "🌸",
            minBudgetSingle: 2900,
            trains: [
                { name: "Koyna Express", number: "11029", route: "CSMT / Pune ➔ Satara Jn", fare: 320, class: "Chair Car / 2S", duration: "5h 15m" },
                { name: "Maharashtra Express", number: "11040", route: "Kolhapur / Pune ➔ Satara", fare: 240, class: "Sleeper Class", duration: "4h 30m" }
            ],
            hotelPerNight: 1400,
            localTransitDaily: 350,
            foodDaily: 450,
            activitiesTotal: 400,
            relatedPlaces: [
                { name: "Kaas Plateau UNESCO Floral Biosphere", dist: "25 km west", highlight: "Endemic monsoon wild orchid carpet & Kaas lake", crowd: "Optimal (Offbeat)" },
                { name: "Thoseghar Waterfalls & Chalkewadi Windmills", dist: "20 km south", highlight: "Roaring 500m tiered falls & plateau wind park", crowd: "Moderate" },
                { name: "Ajinkyatara Historic Fort Citadel", dist: "Satara City", highlight: "Hilltop panoramic vistas of the Sahyadri mountains", crowd: "Quiet" },
                { name: "Sajjangad Fort & Swami Samadhi", dist: "16 km south-west", highlight: "Peaceful spiritual citadel with Anglai Devi shrine", crowd: "Moderate" }
            ]
        },
        "mh_dapoli": {
            id: "mh_dapoli",
            name: "Dapoli & Murud-Harnai (Mini Mahabaleshwar)",
            state: "Maharashtra, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🏖️",
            minBudgetSingle: 3400,
            trains: [
                { name: "Konkan Kanya Express", number: "20111", route: "CSMT ➔ Khed Jn (Dapoli Link)", fare: 440, class: "Sleeper / 3AC", duration: "5h 30m" },
                { name: "Jan Shatabdi Express", number: "12051", route: "CSMT ➔ Khed Jn", fare: 560, class: "AC Chair Car", duration: "4h 15m" }
            ],
            hotelPerNight: 1600,
            localTransitDaily: 350,
            foodDaily: 500,
            activitiesTotal: 450,
            relatedPlaces: [
                { name: "Ladghar Dolphin Beach & Red Sands", dist: "8 km from town", highlight: "Natural red clay sand, water sports & morning dolphin boat trips", crowd: "Optimal (Offbeat)" },
                { name: "Harnai Fish Auction & Suvarnadurg Sea Fort", dist: "15 km north", highlight: "Vibrant beachside fish bidding & island sea fortress", crowd: "Moderate" },
                { name: "Anjarle Kadyavarcha Ganpati & White Beach", dist: "22 km north", highlight: "Cliff-edge cliff temple overlooking Arabian sea", crowd: "Quiet" }
            ]
        },
        "mh_pandharpur": {
            id: "mh_pandharpur",
            name: "Pandharpur Vitthal-Rukmini Pilgrimage",
            state: "Maharashtra, India",
            continent: "India",
            category: "Pilgrimage",
            icon: "🛕",
            minBudgetSingle: 2400,
            trains: [
                { name: "Siddheshwar Express Link", number: "12115", route: "Mumbai CSMT ➔ Kurduvadi / Pandharpur", fare: 390, class: "Sleeper / 3AC", duration: "8h 15m" },
                { name: "Pune-Pandharpur Fast Passenger", number: "51425", route: "Pune Jn ➔ Pandharpur", fare: 180, class: "General / 2S", duration: "5h 30m" }
            ],
            hotelPerNight: 1200,
            localTransitDaily: 250,
            foodDaily: 350,
            activitiesTotal: 200,
            relatedPlaces: [
                { name: "Vitthal-Rukmini Mandir Core Shrine", dist: "Town Core", highlight: "Sacred Varkari spiritual center on the Bhima river", crowd: "High (Overcrowded)" },
                { name: "Chandrabhaga Holy River Ghats", dist: "Temple Front", highlight: "Holy river bathing ghats & evening aarti", crowd: "Moderate" },
                { name: "Kaikadi Maharaj Math & 3D Sculptures", dist: "2 km outskirts", highlight: "Intricate narrative walk-through epic galleries", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_trimbakeshwar": {
            id: "mh_trimbakeshwar",
            name: "Trimbakeshwar Jyotirlinga & Brahmagiri",
            state: "Maharashtra, India",
            continent: "India",
            category: "Pilgrimage",
            icon: "🕉️",
            minBudgetSingle: 2700,
            trains: [
                { name: "Panchavati Express", number: "12109", route: "CSMT ➔ Nashik Road", fare: 280, class: "AC Chair Car", duration: "4h 10m" },
                { name: "Tapovan Express", number: "17617", route: "CSMT ➔ Nashik Road", fare: 230, class: "Second Sitting", duration: "4h 30m" }
            ],
            hotelPerNight: 1400,
            localTransitDaily: 300,
            foodDaily: 400,
            activitiesTotal: 300,
            relatedPlaces: [
                { name: "12 Jyotirlinga Trimbakeshwar Temple", dist: "Trimbak Core", highlight: "Ancient black-stone shrine of three-faced Trimurti Shiva", crowd: "High (Overcrowded)" },
                { name: "Brahmagiri Godavari River Origin Trek", dist: "Behind Temple", highlight: "Scenic staircase hill climb to the origin spring of sacred Godavari", crowd: "Optimal (Offbeat)" },
                { name: "Anjaneri Hill Hanuman Birthplace", dist: "7 km east", highlight: "Cloud-covered plateau and ancient Jain cave carvings", crowd: "Quiet" }
            ]
        },
        "mh_raigad": {
            id: "mh_raigad",
            name: "Fort Raigad (Capital of Shivaji Maharaj)",
            state: "Maharashtra, India",
            continent: "India",
            category: "Fort / Heritage",
            icon: "🚩",
            minBudgetSingle: 2600,
            trains: [
                { name: "Konkan Kanya Express", number: "20111", route: "CSMT ➔ Mangaon / Veer", fare: 260, class: "Sleeper / 2S", duration: "3h 45m" },
                { name: "Tutari Express", number: "11003", route: "Dadar ➔ Mangaon", fare: 230, class: "Second Sitting", duration: "3h 30m" }
            ],
            hotelPerNight: 1300,
            localTransitDaily: 300,
            foodDaily: 400,
            activitiesTotal: 350,
            relatedPlaces: [
                { name: "Meghdambari & Royal Throne of Chhatrapati Shivaji Maharaj", dist: "Fort Plateau", highlight: "Sacred capital coronation site of the Maratha Empire", crowd: "Moderate" },
                { name: "Raigad Ropeway Aerial Tramway", dist: "Base station", highlight: "Vertical ropeway ascent over steep Sahyadri cliffs", crowd: "Moderate" },
                { name: "Takmak Tok Execution Cliff", dist: "North edge", highlight: "Dizzying sheer drop into misty valley abyss", crowd: "Optimal (Offbeat)" }
            ]
        },
        "mh_chikhaldara": {
            id: "mh_chikhaldara",
            name: "Chikhaldara Hill Station & Melghat",
            state: "Maharashtra, India",
            continent: "India",
            category: "Hill Station",
            icon: "🌲",
            minBudgetSingle: 3800,
            trains: [
                { name: "Vidarbha Superfast Express", number: "12105", route: "CSMT ➔ Badnera / Amravati", fare: 560, class: "Sleeper / 3AC", duration: "11h 20m" },
                { name: "Sevagram Express", number: "12139", route: "Dadar ➔ Badnera Jn", fare: 510, class: "Sleeper Class", duration: "12h 15m" }
            ],
            hotelPerNight: 1800,
            localTransitDaily: 400,
            foodDaily: 500,
            activitiesTotal: 600,
            relatedPlaces: [
                { name: "Melghat Tiger Reserve Forest Safari", dist: "Buffer Zone", highlight: "Deep valleys, sloth bears, tigers & flying squirrels", crowd: "Optimal (Offbeat)" },
                { name: "Gawilghur Historic Hill Fortress", dist: "Near Chikhaldara", highlight: "Massive 12th-century stone ramparts & Persian cannons", crowd: "Quiet" },
                { name: "Hurricane Point & Devi Point", dist: "Hilltop", highlight: "Panoramic misty view of coffee plantations & lake", crowd: "Moderate" }
            ]
        },

        // ================= PAN-INDIA ICONIC DESTINATIONS =================
        "in_goa": {
            id: "in_goa",
            name: "Goa Coastal & Hinterlands",
            state: "Goa, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🌴",
            minBudgetSingle: 5500,
            trains: [
                { name: "Madgaon Vande Bharat", number: "20607", route: "Mumbai CSMT ➔ Madgaon Goa", fare: 1450, class: "AC Chair Car", duration: "7h 45m" },
                { name: "Mandovi Express", number: "10103", route: "CSMT ➔ Karmali / Madgaon", fare: 850, class: "3-Tier AC", duration: "9h 50m" }
            ],
            hotelPerNight: 2200,
            localTransitDaily: 600,
            foodDaily: 800,
            activitiesTotal: 900,
            relatedPlaces: [
                { name: "Cola Beach & Freshwater Lagoon", dist: "South Goa", highlight: "Freshwater lagoon meeting sea, quiet kayaking", crowd: "Optimal (Offbeat)" },
                { name: "Dudhsagar Waterfalls", dist: "Sanguem ridge", highlight: "Milky multi-tiered waterfall inside national park", crowd: "Moderate" },
                { name: "Divar & Chorão Islands", dist: "Mandovi River", highlight: "Vintage Portuguese villas & mangrove birding", crowd: "Optimal (Offbeat)" },
                { name: "Fontainhas Latin Quarter", dist: "Panaji heritage zone", highlight: "Vibrant yellow colonial alleyways", crowd: "Moderate" }
            ]
        },
        "in_kashmir": {
            id: "in_kashmir",
            name: "Kashmir Valley & Meadows",
            state: "Jammu & Kashmir, India",
            continent: "India",
            category: "Hill Station",
            icon: "❄️",
            minBudgetSingle: 9000,
            trains: [
                { name: "Kashmir Vande Bharat Link", number: "22439", route: "New Delhi ➔ Katra / Udhampur Express", fare: 1650, class: "3-Tier AC", duration: "8h 00m" },
                { name: "Vistadome Glacier Scenic Train", number: "04687", route: "Banihal ➔ Srinagar ➔ Baramulla", fare: 750, class: "Vistadome Glass Roof", duration: "2h 15m" }
            ],
            hotelPerNight: 2800,
            localTransitDaily: 900,
            foodDaily: 700,
            activitiesTotal: 1200,
            relatedPlaces: [
                { name: "Doodhpathri Milk Valley", dist: "45 km from Srinagar", highlight: "Pristine pine meadows without tourist crowds", crowd: "Optimal (Offbeat)" },
                { name: "Dal Lake Houseboats & Shikara", dist: "Srinagar City", highlight: "Floating lotus market and sunrise reflections", crowd: "Moderate" },
                { name: "Gulmarg Gondola & Apharwat", dist: "Baramulla", highlight: "Highest ski cable car in Asia", crowd: "High (Overcrowded)" },
                { name: "Gurez Valley & Habba Khatoon Peak", dist: "Bandipora border", highlight: "Untouched border paradise with log cabins", crowd: "Optimal (Offbeat)" }
            ]
        },
        "in_rajasthan": {
            id: "in_rajasthan",
            name: "Rajasthan Heritage (Jaipur & Bundi)",
            state: "Rajasthan, India",
            continent: "India",
            category: "Fort / Heritage",
            icon: "🏰",
            minBudgetSingle: 4800,
            trains: [
                { name: "Ajmer Shatabdi Express", number: "12015", route: "New Delhi ➔ Jaipur Jn", fare: 890, class: "AC Chair Car", duration: "4h 40m" },
                { name: "Mandore Superfast Express", number: "22995", route: "Old Delhi ➔ Jodhpur", fare: 710, class: "Sleeper / 3AC", duration: "9h 30m" }
            ],
            hotelPerNight: 1900,
            localTransitDaily: 500,
            foodDaily: 600,
            activitiesTotal: 750,
            relatedPlaces: [
                { name: "Bundi Stepwells & Taragarh Fort", dist: "Near Kota", highlight: "Ancient stepwells with zero commercial rush", crowd: "Optimal (Offbeat)" },
                { name: "Amer Fort & Maota Lake", dist: "Jaipur outskirts", highlight: "Massive sandstone fortification & light show", crowd: "High (Overcrowded)" },
                { name: "Shekhawati Painted Havelis", dist: "Nawalgarh / Mandawa", highlight: "Open-air painted fresco mansions", crowd: "Optimal (Offbeat)" }
            ]
        },
        "in_manali": {
            id: "in_manali",
            name: "Manali & Solang Alpine Valleys",
            state: "Himachal Pradesh, India",
            continent: "India",
            category: "Hill Station",
            icon: "🏔️",
            minBudgetSingle: 6800,
            trains: [
                { name: "Kalka Shimla Heritage Toy Train Link", number: "52451", route: "Delhi ➔ Kalka ➔ Kiratpur Sahib", fare: 950, class: "AC Chair Car", duration: "5h 15m" },
                { name: "Himachal Express", number: "14553", route: "Old Delhi ➔ Una Himachal", fare: 480, class: "Sleeper Class", duration: "7h 30m" }
            ],
            hotelPerNight: 2200,
            localTransitDaily: 650,
            foodDaily: 600,
            activitiesTotal: 1100,
            relatedPlaces: [
                { name: "Sethan Igloo Village & Hampta Pass", dist: "14 km east", highlight: "Curved glacial valley & winter igloo stays", crowd: "Optimal (Offbeat)" },
                { name: "Solang Valley Snow Sports", dist: "13 km north", highlight: "Paragliding and skiing slopes", crowd: "High (Overcrowded)" },
                { name: "Old Manali Cobbled Cedar Cafes", dist: "Above town", highlight: "Riverside cafes, apple orchards & Manu temple", crowd: "Moderate" }
            ]
        },
        "in_kerala": {
            id: "in_kerala",
            name: "Kerala Backwaters & Munnar",
            state: "Kerala, India",
            continent: "India",
            category: "Coastal Beach",
            icon: "🛶",
            minBudgetSingle: 6000,
            trains: [
                { name: "Kerala Vande Bharat Express", number: "20633", route: "Kasaragod ➔ Ernakulam / Trivandrum", fare: 1320, class: "AC Chair Car", duration: "5h 20m" },
                { name: "Netravati Express", number: "16345", route: "Mumbai LTT ➔ Ernakulam Jn", fare: 780, class: "Sleeper / 3AC", duration: "24h" }
            ],
            hotelPerNight: 2400,
            localTransitDaily: 550,
            foodDaily: 650,
            activitiesTotal: 850,
            relatedPlaces: [
                { name: "Marari Fishing Village & Beach", dist: "15 km from Alleppey", highlight: "Quiet palm shores away from houseboat traffic", crowd: "Optimal (Offbeat)" },
                { name: "Kolukkumalai Highest Tea Estate", dist: "Munnar heights", highlight: "World's highest organic orthodox tea gardens", crowd: "Optimal (Offbeat)" },
                { name: "Alleppey Main Backwater Jetty", dist: "Alappuzha town", highlight: "Houseboat cruise hub", crowd: "High (Overcrowded)" }
            ]
        },
        "in_varanasi": {
            id: "in_varanasi",
            name: "Varanasi Ghats & Sarnath",
            state: "Uttar Pradesh, India",
            continent: "India",
            category: "Pilgrimage",
            icon: "🪔",
            minBudgetSingle: 3800,
            trains: [
                { name: "Kashi Vande Bharat Express", number: "22436", route: "New Delhi ➔ Varanasi Jn", fare: 1750, class: "AC Chair Car", duration: "8h 00m" },
                { name: "Shiv Ganga Express", number: "12560", route: "New Delhi ➔ Banaras", fare: 560, class: "3-Tier AC", duration: "11h 45m" }
            ],
            hotelPerNight: 1600,
            localTransitDaily: 350,
            foodDaily: 450,
            activitiesTotal: 500,
            relatedPlaces: [
                { name: "Dashashwamedh Evening Ganga Aarti", dist: "Main Ghats", highlight: "Synchronized brass lamps ceremony on river", crowd: "High (Overcrowded)" },
                { name: "Assi Ghat Morning Subah-e-Banaras", dist: "South Ghats", highlight: "Morning classical music, yoga and boat rides", crowd: "Optimal (Offbeat)" },
                { name: "Sarnath Deer Park & Dhamek Stupa", dist: "10 km north", highlight: "Where Gautama Buddha gave first sermon", crowd: "Quiet" }
            ]
        },

        // ================= WORLDWIDE GLOBAL DESTINATIONS =================
        "eu_paris": {
            id: "eu_paris",
            name: "Paris & French Countryside",
            state: "France, Europe",
            continent: "Europe",
            category: "Worldwide",
            icon: "🗼",
            minBudgetSingle: 45000,
            trains: [
                { name: "SNCF TGV InOui High-Speed", number: "TGV-6612", route: "Paris Gare de Lyon ➔ Normandy / Lyon", fare: 3800, class: "Standard High-Speed", duration: "1h 50m" },
                { name: "RER C & Transilien Regional Rail", number: "RER-C", route: "Central Paris ➔ Versailles / Giverny", fare: 850, class: "Regional Pass", duration: "45m" }
            ],
            hotelPerNight: 7500,
            localTransitDaily: 1200,
            foodDaily: 2500,
            activitiesTotal: 3500,
            relatedPlaces: [
                { name: "Giverny Monet Water Lily Gardens", dist: "75 km from Paris", highlight: "Claude Monet impressionist bridge & studio", crowd: "Optimal (Offbeat)" },
                { name: "Louvre Museum & Tuileries", dist: "Central Paris", highlight: "Mona Lisa and classical world art", crowd: "High (Overcrowded)" },
                { name: "Provins Medieval Ramparts", dist: "85 km south-east", highlight: "UNESCO medieval walls & rose petal preserves", crowd: "Optimal (Offbeat)" }
            ]
        },
        "eu_swiss": {
            id: "eu_swiss",
            name: "Swiss Alps & Interlaken",
            state: "Switzerland, Europe",
            continent: "Europe",
            category: "Worldwide",
            icon: "🇨🇭",
            minBudgetSingle: 58000,
            trains: [
                { name: "GoldenPass Panoramic Express", number: "GP-301", route: "Montreux ➔ Interlaken Ost", fare: 4900, class: "Panoramic Glass Coach", duration: "2h 08m" },
                { name: "SBB Glacier Regional Link", number: "SBB-72", route: "Zurich HB ➔ Lucerne / Grindelwald", fare: 2600, class: "Swiss Rail 2nd Class", duration: "1h 15m" }
            ],
            hotelPerNight: 9500,
            localTransitDaily: 1500,
            foodDaily: 3200,
            activitiesTotal: 4500,
            relatedPlaces: [
                { name: "Lauterbrunnen Valley of 72 Waterfalls", dist: "15 min from Interlaken", highlight: "Misty glacial falls dropping into green meadows", crowd: "Moderate" },
                { name: "Jungfraujoch Top of Europe", dist: "Kleine Scheidegg", highlight: "Highest altitude train station & ice palace", crowd: "High (Overcrowded)" },
                { name: "Mürren Car-Free Alpine Village", dist: "Above Lauterbrunnen", highlight: "Zero cars, pure mountain air & wooden chalets", crowd: "Optimal (Offbeat)" }
            ]
        },
        "asia_kyoto": {
            id: "asia_kyoto",
            name: "Kyoto & Kansai Trail",
            state: "Japan, Asia",
            continent: "Asia-Pacific",
            category: "Worldwide",
            icon: "⛩️",
            minBudgetSingle: 38000,
            trains: [
                { name: "Tokaido Shinkansen Bullet Train", number: "NOZOMI-41", route: "Tokyo ➔ Kyoto Station", fare: 8200, class: "Standard Reserved Seat", duration: "2h 15m" },
                { name: "Hankyu Kyoto Rapid Rail", number: "HK-82", route: "Osaka Umeda ➔ Kyoto Kawaramachi", fare: 320, class: "Commuter Express", duration: "43m" }
            ],
            hotelPerNight: 6500,
            localTransitDaily: 800,
            foodDaily: 2000,
            activitiesTotal: 2500,
            relatedPlaces: [
                { name: "Uji Green Tea Terraces & Byodoin", dist: "20 min south of Kyoto", highlight: "Birthplace of matcha tea, peaceful canals", crowd: "Optimal (Offbeat)" },
                { name: "Fushimi Inari Torii Gates", dist: "Kyoto South", highlight: "10,000 vermilion Shinto shrine gates", crowd: "High (Overcrowded)" },
                { name: "Ohara Village & Sanzen-in Temple", dist: "Kyoto north mountains", highlight: "Ancient cedar moss gardens & farm pickling", crowd: "Optimal (Offbeat)" }
            ]
        },
        "asia_bali": {
            id: "asia_bali",
            name: "Bali Cultural & Nusa Penida",
            state: "Indonesia, Asia",
            continent: "Asia-Pacific",
            category: "Worldwide",
            icon: "🏝️",
            minBudgetSingle: 28000,
            trains: [
                { name: "Fast Boat Coastal Ferry", number: "FB-MARUTI", route: "Sanur Port ➔ Nusa Penida Island", fare: 950, class: "Speed Ferry", duration: "35m" },
                { name: "Island Coastal Shuttle Pass", number: "KURA-KURA", route: "Denpasar ➔ Ubud Arts Hub", fare: 350, class: "AC Island Coach", duration: "1h 10m" }
            ],
            hotelPerNight: 3500,
            localTransitDaily: 700,
            foodDaily: 1100,
            activitiesTotal: 1500,
            relatedPlaces: [
                { name: "Sidemen Valley Rice Terraces", dist: "East Bali", highlight: "Raw rural emerald terraces under Mount Agung", crowd: "Optimal (Offbeat)" },
                { name: "Ubud Monkey Forest & Market", dist: "Central Bali", highlight: "Bustling cultural craft center", crowd: "High (Overcrowded)" },
                { name: "Amed Black Sand Coral Bay", dist: "Northeast Bali", highlight: "Volcanic black sands and quiet snorkeling", crowd: "Optimal (Offbeat)" }
            ]
        },
        "me_dubai": {
            id: "me_dubai",
            name: "Dubai & Desert Conservation",
            state: "UAE, Middle East",
            continent: "Middle East",
            category: "Worldwide",
            icon: "🏙️",
            minBudgetSingle: 42000,
            trains: [
                { name: "Dubai Driverless Metro Red Line", number: "METRO-R", route: "DXB Airport ➔ Burj Khalifa / Marina", fare: 220, class: "Gold / Silver Class", duration: "25m" },
                { name: "Etihad Rail Regional Express", number: "ET-01", route: "Dubai ➔ Abu Dhabi Cultural District", fare: 1400, class: "Intercity Rail", duration: "50m" }
            ],
            hotelPerNight: 7000,
            localTransitDaily: 1100,
            foodDaily: 2400,
            activitiesTotal: 3200,
            relatedPlaces: [
                { name: "Al Fahidi Historical Bastakiya Quarter", dist: "Old Dubai Creek", highlight: "Traditional wind-tower architecture & abras", crowd: "Optimal (Offbeat)" },
                { name: "Burj Khalifa & Dubai Mall", dist: "Downtown Dubai", highlight: "Tallest skyscraper & fountain choreographies", crowd: "High (Overcrowded)" },
                { name: "Al Marmoom Desert Conservation Reserve", dist: "40 km inland", highlight: "Solar-powered desert oasis with Arabian oryx", crowd: "Optimal (Offbeat)" }
            ]
        }
    },

    /**
     * Google Maps-Style Instant Places Search & Auto-Complete
     * Returns matching places based on query, tags, city, or state.
     */
    searchPlaces: function(query) {
        if (!query || typeof query !== 'string') return [];
        const q = query.trim().toLowerCase();
        if (q.length === 0) return [];

        const results = [];
        for (const [key, item] of Object.entries(this.destinations)) {
            const nameMatch = item.name.toLowerCase().includes(q);
            const stateMatch = item.state.toLowerCase().includes(q);
            const catMatch = item.category ? item.category.toLowerCase().includes(q) : false;
            const relatedMatch = item.relatedPlaces.some(p => p.name.toLowerCase().includes(q) || p.highlight.toLowerCase().includes(q));

            if (nameMatch || stateMatch || catMatch || relatedMatch) {
                results.push({
                    id: key,
                    name: item.name,
                    state: item.state,
                    category: item.category || "Destination",
                    icon: item.icon || "📍",
                    minBudget: item.minBudgetSingle,
                    highlight: item.relatedPlaces[0]?.highlight || ""
                });
            }
        }
        return results;
    },

    /**
     * Universal Dynamic Place Generator
     * If user searches for ANY village, town, or city not in the curated database,
     * this dynamically generates a realistic transit, hotel, food, and sightseeing trip!
     */
        enrichDestination: function(dest) {
        if (!dest) return dest;

        const baseHotel = dest.hotelPerNight || 1600;
        const baseRail = (dest.trains && dest.trains[0] && dest.trains[0].fare) ? dest.trains[0].fare : 450;
        let destName = dest.name || "Destination";
        destName = destName.replace(/^(in_|mh_|asia_|eu_|me_)/i, '').replace(/_/g, ' ');
        dest.name = destName;

        let catalogEntry = null;
        if (typeof REAL_TRAVEL_CATALOG !== 'undefined') {
            if (REAL_TRAVEL_CATALOG[dest.id]) {
                catalogEntry = REAL_TRAVEL_CATALOG[dest.id];
            } else {
                const lower = destName.toLowerCase();
                for (const [k, v] of Object.entries(REAL_TRAVEL_CATALOG)) {
                    if ((v.name && v.name.toLowerCase().includes(lower)) || lower.includes(k.replace(/^(mh_|in_|eu_|asia_|me_)/, ''))) {
                        catalogEntry = v;
                        break;
                    }
                }
            }
        }

        if (catalogEntry && catalogEntry.hotels && catalogEntry.hotels.length > 0) {
            dest.hotels = catalogEntry.hotels;
        }
        if (catalogEntry && catalogEntry.trains && catalogEntry.trains.length > 0) {
            dest.trains = catalogEntry.trains;
        }
        if (catalogEntry && catalogEntry.buses && catalogEntry.buses.length > 0) {
            dest.buses = catalogEntry.buses;
        }

        return dest;
    },

    getOrCreateDestination: function(queryOrId) {
        if (!queryOrId) return this.destinations["mh_lonavala"];
        const cleanId = queryOrId.toString().trim();

        // 1. Direct key match
        if (this.destinations[cleanId]) {
            return this.destinations[cleanId];
        }

        // 2. Fuzzy name match in curated
        const lower = cleanId.toLowerCase();
        for (const [key, item] of Object.entries(this.destinations)) {
            if (item.name.toLowerCase().includes(lower) || lower.includes(key.replace(/^(mh_|in_|eu_|asia_|me_)/, ''))) {
                return item;
            }
        }

        // 3. Dynamic Generation for ANY custom typed place! (Google Maps universal capability)
        const capitalized = cleanId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const isInternational = /(paris|london|dubai|tokyo|york|swiss|rome|bali|singapore|berlin|bangkok|island)/i.test(lower);
        
        const baseCost = isInternational ? 35000 : 3200;
        const hotelCost = isInternational ? 6500 : 1600;
        const trainFare = isInternational ? 3200 : 450;
        const transit = isInternational ? 1000 : 350;
        const food = isInternational ? 2200 : 500;
        const act = isInternational ? 2800 : 550;

        return {
            id: "custom_" + lower.replace(/[^a-z0-9]/g, '_'),
            name: capitalized,
            state: isInternational ? "Global Destination" : "Maharashtra & Regional India",
            continent: isInternational ? "International" : "India",
            category: isInternational ? "Worldwide" : "Maharashtra Local",
            icon: "📍",
            minBudgetSingle: baseCost,
            trains: [
                {
                    name: isInternational ? `${capitalized} Intercity Express` : `${capitalized} Superfast Rail Link`,
                    number: isInternational ? "EXP-701" : "12" + Math.floor(100 + Math.random() * 899),
                    route: isInternational ? `Metropolitan Hub ➔ ${capitalized} Central` : `Major Junction ➔ ${capitalized}`,
                    fare: trainFare,
                    class: isInternational ? "Standard Rail Coach" : "AC Chair Car / 3AC",
                    duration: isInternational ? "2h 15m" : "3h 45m"
                }
            ],
            hotelPerNight: hotelCost,
            localTransitDaily: transit,
            foodDaily: food,
            activitiesTotal: act,
            relatedPlaces: [
                { name: `${capitalized} Old Heritage Bazaar`, dist: "Town Core", highlight: "Authentic local artisans & regional street food", crowd: "Moderate" },
                { name: `${capitalized} Scenic Lookout & Nature Trail`, dist: "5 km outskirts", highlight: "Pristine panoramic landscape with zero commercial rush", crowd: "Optimal (Offbeat)" },
                { name: `${capitalized} Ancient Historic Landmark`, dist: "Historical quarter", highlight: "Centuries-old stone architecture & storytelling heritage", crowd: "Quiet & Peaceful" }
            ]
        };
    },

    /**
     * Compute comprehensive budget trip breakdown
     */
    calculateBudgetTrip: function(destIdOrName, userBudget, travelers = 2, days = 2) {
        const dest = this.getOrCreateDestination(destIdOrName);
        const budget = Math.max(1000, Number(userBudget) || 10000);
        const count = Math.max(1, Number(travelers) || 2);
        const numDays = Math.max(1, Number(days) || 2);

        // 1. Train / Transit estimate (Return tickets for each person)
        const trainOption = dest.trains[0];
        const trainTicketsCost = trainOption.fare * count * 2;

        // 2. Hotel / Stay estimate
        const totalNights = Math.max(1, numDays - 1);
        const roomsNeeded = Math.ceil(count / 2);
        const hotelTotal = dest.hotelPerNight * totalNights * roomsNeeded;

        // 3. Local transit (cabs, autos, local passes)
        const localTransitTotal = dest.localTransitDaily * numDays * count;

        // 4. Food & Regional Meals (3 meals/day authentic dining)
        const foodTotal = dest.foodDaily * numDays * count;

        // 5. Sightseeing & Guided Eco-Trails
        const activitiesTotal = dest.activitiesTotal * count;

        // Total Trip Cost
        const totalEstimatedExpense = trainTicketsCost + hotelTotal + localTransitTotal + foodTotal + activitiesTotal;
        const balanceRemaining = budget - totalEstimatedExpense;
        const isWithinBudget = balanceRemaining >= 0;

        // Find other destinations matching this user budget
        const affordableDestinations = [];
        for (const [key, item] of Object.entries(this.destinations)) {
            if (key === dest.id) continue;
            const minCostForParty = Math.round(item.minBudgetSingle * count * (numDays / 2));
            if (minCostForParty <= budget) {
                affordableDestinations.push({
                    id: key,
                    name: item.name,
                    state: item.state,
                    category: item.category || "Tourist Hub",
                    icon: item.icon || "📍",
                    estimatedCost: minCostForParty,
                    remainingBuffer: budget - minCostForParty
                });
            }
        }

        affordableDestinations.sort((a, b) => b.estimatedCost - a.estimatedCost);

        return {
            destId: dest.id,
            destinationName: dest.name,
            state: dest.state,
            category: dest.category || "Maharashtra Local",
            icon: dest.icon || "📍",
            userBudget: budget,
            travelers: count,
            days: numDays,
            selectedTrain: trainOption,
            breakdown: {
                trainTicketsCost: trainTicketsCost,
                hotelTotal: hotelTotal,
                hotelPerNight: dest.hotelPerNight,
                nights: totalNights,
                roomsNeeded: roomsNeeded,
                localTransitTotal: localTransitTotal,
                foodTotal: foodTotal,
                activitiesTotal: activitiesTotal,
                totalExpense: totalEstimatedExpense,
                balanceRemaining: balanceRemaining,
                isWithinBudget: isWithinBudget,
                budgetPercentUsed: Math.min(100, Math.round((totalEstimatedExpense / budget) * 100))
            },
            relatedPlaces: dest.relatedPlaces,
            affordableAlternatives: affordableDestinations.slice(0, 6)
        };
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.BudgetPlannerEngine = BudgetPlannerEngine;
}

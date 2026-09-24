import { UserPreferences, DestinationOption, TripPlan, LocalGuideInsights } from "./types";

// Curated destinations
interface BaseDestination {
  name: string;
  country: string;
  description: string;
  highlightActivity: string;
  intents: string[]; // matching UserIntent
  avgFlightCostINR: number;
  avgStayCostPerNightINR: number;
  safetyScore: number;
  weatherTemp: string;
  weatherCondition: string;
  crowdLevel: 'Low' | 'Moderate' | 'Peak';
  reasons: string[];
}

const INDIA_DESTINATIONS: BaseDestination[] = [
  {
    name: "Goa",
    country: "India",
    description: "Sunkissed sandy beaches, vintage Portuguese quarters, vibrant night markets, and delicious coastal seafood curry.",
    highlightActivity: "Sunset cruise & spice plantation tour",
    intents: ["Relaxation", "Nightlife", "Food", "Nature"],
    avgFlightCostINR: 6000,
    avgStayCostPerNightINR: 3500,
    safetyScore: 92,
    weatherTemp: "28°C",
    weatherCondition: "Warm & Tropical",
    crowdLevel: "Moderate",
    reasons: ["Sunkissed beaches and easygoing seaside lifestyle", "Top-tier coastal gastronomy & upbeat beach lounges", "Historic Portuguese churches and architecture"]
  },
  {
    name: "Kerala (Munnar & Alleppey)",
    country: "India",
    description: "Serene misty tea plantations of Munnar paired with tranquil emerald backwater houseboat cruises in Alleppey.",
    highlightActivity: "Houseboat overnight stay & tea plucking experience",
    intents: ["Relaxation", "Nature", "Spiritual", "Food"],
    avgFlightCostINR: 7000,
    avgStayCostPerNightINR: 4000,
    safetyScore: 95,
    weatherTemp: "23°C",
    weatherCondition: "Misty & Pleasant",
    crowdLevel: "Low",
    reasons: ["Scenic private houseboats on serene palm-shaded canals", "Cool mountain weather with gorgeous tea landscape views", "Rejuvenating ayurvedic wellness resorts"]
  },
  {
    name: "Rajasthan (Jaipur & Udaipur)",
    country: "India",
    description: "The land of formidable hilltop fortresses, opulent lakeside palaces, traditional heritage bazaars, and rich royal history.",
    highlightActivity: "Palace tour & traditional hot air balloon ride",
    intents: ["Culture", "Luxury", "Spiritual"],
    avgFlightCostINR: 5000,
    avgStayCostPerNightINR: 4500,
    safetyScore: 89,
    weatherTemp: "26°C",
    weatherCondition: "Sunny & Pleasant",
    crowdLevel: "Peak",
    reasons: ["Rich architectural heritage and majestic active palaces", "Stunning sunset views over calm Lake Pichola", "Colorful boutique markets selling authentic handicraft gems"]
  },
  {
    name: "Ladakh (Leh)",
    country: "India",
    description: "Stunning high-altitude cold desert valley flanked by jagged snowpeaks, turquoise saltwater lakes, and ancient monasteries.",
    highlightActivity: "Magnetic Hill exploration & camping at Pangong Lake",
    intents: ["Adventure", "Nature", "Spiritual"],
    avgFlightCostINR: 10000,
    avgStayCostPerNightINR: 3800,
    safetyScore: 94,
    weatherTemp: "15°C",
    weatherCondition: "Crisp & Sunny",
    crowdLevel: "Low",
    reasons: ["Surreal high-altitude turquoise lake vistas", "Adrenaline-fueled high mountain automobile passes", "Peaceful Buddhist monastic chants and meditation"]
  },
  {
    name: "Himachal (Manali & Dharamshala)",
    country: "India",
    description: "Soaring snow-capped Himalayan ridges, pine-scented mountain hiking forest paths, and peaceful Tibetan monasteries.",
    highlightActivity: "Solang Valley paragliding & temple trek",
    intents: ["Adventure", "Nature", "Spiritual", "Relaxation"],
    avgFlightCostINR: 6500,
    avgStayCostPerNightINR: 3000,
    safetyScore: 91,
    weatherTemp: "18°C",
    weatherCondition: "Cool & Refreshing",
    crowdLevel: "Moderate",
    reasons: ["Thrilling parasailing and extreme river rafting", "Charming riverside cafes and wooden log-cabin stays", "Breathtaking snowy mountain horizons"]
  },
  {
    name: "Andaman & Nicobar Islands (Havelock)",
    country: "India",
    description: "Utterly pristine white sand beaches matching the Maldives, glowing turquoise waters, and vibrant marine coral snorkeling reef.",
    highlightActivity: "Scuba diving at Radhanagar Beach",
    intents: ["Relaxation", "Nature", "Adventure", "Luxury"],
    avgFlightCostINR: 12000,
    avgStayCostPerNightINR: 6500,
    safetyScore: 96,
    weatherTemp: "27°C",
    weatherCondition: "Breezy & Sunny",
    crowdLevel: "Low",
    reasons: ["World-renowned pristine soft white sandy bays", "Stunning living shallow coral scuba reefs", "Deep forest coastal hiking and exploration"]
  }
];

const ABROAD_DESTINATIONS: BaseDestination[] = [
  {
    name: "Bali",
    country: "Indonesia",
    description: "Enchanting terraced emerald rice fields of Ubud paired with lively sunset clifftop beach bars and spiritual Hindu shrines.",
    highlightActivity: "Clifftop temple fire dance & rice terrace swing",
    intents: ["Relaxation", "Spiritual", "Nature", "Nightlife", "Food"],
    avgFlightCostINR: 28000,
    avgStayCostPerNightINR: 4000,
    safetyScore: 93,
    weatherTemp: "27°C",
    weatherCondition: "Warm & Tropical",
    crowdLevel: "Moderate",
    reasons: ["Stunning clifftop Hindu sea shrines and sunset dances", "Rich tropical wellness retreats and yoga sanctuaries", "Dynamic volcanic hiking & cascading water chutes"]
  },
  {
    name: "Paris",
    country: "France",
    description: "The world capital of high fashion, historical museums, romantic riverside walks, and delectable fresh pastries.",
    highlightActivity: "Seine river twilight cruise & Louvre tour",
    intents: ["Culture", "Food", "Luxury", "Relaxation"],
    avgFlightCostINR: 52000,
    avgStayCostPerNightINR: 8500,
    safetyScore: 88,
    weatherTemp: "18°C",
    weatherCondition: "Cool & Crisp",
    crowdLevel: "Peak",
    reasons: ["Breathtaking, iconic monuments and scenic architecture", "World-renowned master Michelin star culinary options", "Elegant romantic sunset cruises along the Seine"]
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "An incredible fusion of futuristic neon-lit skyscrapers, traditional peaceful Shinto shrines, and ultra-authentic sushi bars.",
    highlightActivity: "Shibuya intersection walk & food alley safari",
    intents: ["Culture", "Food", "Adventure", "Nightlife"],
    avgFlightCostINR: 48000,
    avgStayCostPerNightINR: 7500,
    safetyScore: 98,
    weatherTemp: "16°C",
    weatherCondition: "Mild & Pleasant",
    crowdLevel: "Peak",
    reasons: ["Stunning modern neon cityscapes mixed with deep culture", "Near-perfect public safety and bullet-train speeds", "Unbounded gastronomic treats from ramen to high-end sushi"]
  },
  {
    name: "Dubai",
    country: "UAE",
    description: "Ultramodern desert metropolis boasting soaring architecture, luxury marina cruises, and thrilling sand dune safaris.",
    highlightActivity: "Burj Khalifa observatory & sand dune dune-bashing",
    intents: ["Luxury", "Nightlife", "Adventure", "Food"],
    avgFlightCostINR: 22000,
    avgStayCostPerNightINR: 6000,
    safetyScore: 97,
    weatherTemp: "32°C",
    weatherCondition: "Sunny & Sunny",
    crowdLevel: "Moderate",
    reasons: ["Soaring modern architectural masterpieces and world-first record sights", "Absolute security and elite luxury hotels", "Adrenaline desert safaris and massive theme parks"]
  },
  {
    name: "Singapore",
    country: "Singapore",
    description: "Bustling, hyper-green garden city filled with soaring futuristic sky-forests, luxury retail, and iconic street-food hawker courts.",
    highlightActivity: "Gardens by the Bay light show & night safari",
    intents: ["Food", "Luxury", "Nightlife", "Nature"],
    avgFlightCostINR: 24000,
    avgStayCostPerNightINR: 8000,
    safetyScore: 99,
    weatherTemp: "29°C",
    weatherCondition: "Warm & Humid",
    crowdLevel: "Moderate",
    reasons: ["Breathtaking futuristic botanical greenhouses", "World-class sensory gardens and interactive night safaris", "Legendary street food and luxury shopping alleys"]
  },
  {
    name: "Switzerland (Interlaken)",
    country: "Switzerland",
    description: "Breathtaking turquoise mountain lakes framed by soaring green valleys, wooden villages, and ice-crested Alps.",
    highlightActivity: "Alpine train to Jungfraujoch & glacial walk",
    intents: ["Nature", "Adventure", "Luxury", "Relaxation"],
    avgFlightCostINR: 58000,
    avgStayCostPerNightINR: 11000,
    safetyScore: 97,
    weatherTemp: "14°C",
    weatherCondition: "Slightly Snowy",
    crowdLevel: "Moderate",
    reasons: ["Pristine mountain streams, lush glacial meadows, and snowy peaks", "Elite high-altitude scenic railways and cable cabin networks", "Premium, restorative tranquility and cozy chalet stays"]
  }
];

export const getFallbackDestinationOptions = (prefs: UserPreferences): DestinationOption[] => {
  const baseList = prefs.locationScope === "India" ? INDIA_DESTINATIONS : ABROAD_DESTINATIONS;
  
  return baseList.map((dest, index) => {
    // Dynamic matching score based on intents overlap
    const matchingIntents = dest.intents.filter(intent => intent === prefs.intent);
    const intentPower = matchingIntents.length > 0 ? 1 : 0;
    const matchScore = 82 + index * 2 + intentPower * 8;
    
    // Total estimated budget: days * budget (e.g. daily allowance) + stays + flights
    const flightExp = baseList === INDIA_DESTINATIONS ? dest.avgFlightCostINR : dest.avgFlightCostINR;
    const accommodationRate = prefs.budget < 3000 ? dest.avgStayCostPerNightINR * 0.6 : prefs.budget > 10000 ? dest.avgStayCostPerNightINR * 1.5 : dest.avgStayCostPerNightINR;
    const totalCost = (prefs.budget * prefs.days) + (accommodationRate * prefs.days) + flightExp;

    return {
      id: String(index + 1),
      name: dest.name,
      country: dest.country,
      description: dest.description,
      highlightActivity: dest.highlightActivity,
      estimatedTotalCost: Math.round(totalCost),
      matchScore: Math.min(99, matchScore),
      matchReasons: [
        `Highly aligned with your ${prefs.intent} purpose`, 
        `Perfect weather match for your chosen month of ${prefs.month}`, 
        `Ideal for a ${prefs.companions} companion structure`
      ],
      weather: {
        temp: dest.weatherTemp,
        condition: dest.weatherCondition
      },
      crowdLevel: dest.crowdLevel,
      safetyScore: dest.safetyScore
    };
  });
};

export const getFallbackTripPlan = (prefs: UserPreferences, dest: DestinationOption): TripPlan => {
  const isIndia = dest.country.trim().toLowerCase() === "india";
  const currency = isIndia ? "INR" : "Local Currency";
  const exchangeRateToINR = isIndia ? 1.0 : 12.5; // generic

  // Let's create an elegant day-by-day itinerary scaled to the user's selected days count
  const daysCount = prefs.days || 3;
  const itinerary = Array.from({ length: daysCount }).map((_, i) => {
    const dayNum = i + 1;
    let theme = "Discovery & Acclimatization";
    let morningAct = "Panoramic City Walk";
    let morningDesc = "Take a peaceful stroll to get a lay of the gorgeous surrounding landscapes.";
    let lunchAct = "Local Culinary Tasting";
    let lunchDesc = "Savor authentic regional flavors in a highly rated local market tavern.";
    let afternoonAct = "Top Historical Tour";
    let afternoonDesc = "Hire an expert guide to discover deep hidden historical secrets of the landmark towers.";
    let eveningAct = "Relaxing Panoramic View";
    let eveningDesc = "Unwind at a beautiful skyline viewpoint while enjoying refreshing local beverages.";

    if (dayNum % 3 === 2) {
      theme = "Adventure or Nature Excursion";
      morningAct = "Thrilling Scenic Outdoors";
      morningDesc = "Embark on an epic hiking trail surrounded by towering scenic foliage.";
      lunchAct = "Fresh Farm Lunch";
      lunchDesc = "Dine in an eco-friendly local greenhouse garden setting.";
      afternoonAct = "Hidden Spot Scavenger";
      afternoonDesc = "Rent cycles to map the quiet cobblestone side streets away from tourists.";
      eveningAct = "Traditional Art Performance";
      eveningDesc = "Watch a classical acoustic music show and experience authentic regional theater.";
    } else if (dayNum % 3 === 0) {
      theme = "Restorative Leisure & Shopping";
      morningAct = "Artisan Souvenir Shopping";
      morningDesc = "Explore the boutique market bazaar filled with crafted locally designed textiles.";
      lunchAct = "Scenic Riverside Cafe";
      lunchDesc = "Enjoy specialized organic coffee blends coupled with gourmet pastries.";
      afternoonAct = "Restorative Health Spa";
      afternoonDesc = "Treat yourself to a world-class specialized local herbal oil wellness massage.";
      eveningAct = "Grand Farewell Dinner";
      eveningDesc = "Reserve a rooftop candlelit fine dining table overlooking glittering cityscapes.";
    }

    return {
      day: dayNum,
      theme,
      items: [
        {
          id: `d${dayNum}i1`,
          time: "09:00 AM",
          activity: morningAct,
          location: "Historic Quarter",
          description: morningDesc,
          costEstimate: Math.round(prefs.budget * 0.15),
          type: "travel" as const
        },
        {
          id: `d${dayNum}i2`,
          time: "01:30 PM",
          activity: lunchAct,
          location: "Central Square",
          description: lunchDesc,
          costEstimate: Math.round(prefs.budget * 0.20),
          type: "food" as const
        },
        {
          id: `d${dayNum}i3`,
          time: "03:30 PM",
          activity: afternoonAct,
          location: "Sunset Peak",
          description: afternoonDesc,
          costEstimate: Math.round(prefs.budget * 0.30),
          type: "activity" as const
        },
        {
          id: `d${dayNum}i4`,
          time: "07:30 PM",
          activity: eveningAct,
          location: "Rooftop Promenade",
          description: eveningDesc,
          costEstimate: Math.round(prefs.budget * 0.25),
          type: "relax" as const
        }
      ]
    };
  });

  const totalCostVal = dest.estimatedTotalCost;
  const breakTravel = Math.round(totalCostVal * 0.35);
  const breakStay = Math.round(totalCostVal * 0.30);
  const breakFood = Math.round(totalCostVal * 0.15);
  const breakActivities = Math.round(totalCostVal * 0.10);
  const breakLocalTrans = Math.round(totalCostVal * 0.05);
  const breakEmergency = totalCostVal - (breakTravel + breakStay + breakFood + breakActivities + breakLocalTrans);

  return {
    destinationId: dest.id,
    destination: dest.name,
    country: dest.country,
    description: dest.description,
    currency,
    exchangeRateToINR,
    safetyScore: dest.safetyScore,
    safetyTips: [
      "Always keep offline maps downloaded on your smartphone.",
      "Prefer registered transport providers over hailing random street vehicles.",
      "Maintain some cash in regional bill formats for countryside stops.",
      "Respect local dress protocols at sacred, religious structures."
    ],
    totalEstimatedCost: totalCostVal,
    budgetBreakdown: {
      travel: breakTravel,
      stay: breakStay,
      food: breakFood,
      activities: breakActivities,
      localTransport: breakLocalTrans,
      emergency: breakEmergency
    },
    thingsToAvoid: [
      "Avoid purchasing unregulated tour packages from street middlemen.",
      "Do not display expensive gadgets in crowded local transit terminals.",
      "Avoid traveling to remote forested borders post sunset without local guides.",
      "Do not cross designated red flags at waterfront spots."
    ],
    hiddenGems: [
      "A rustic century-old family farm tucked deeply in the emerald foothills.",
      "A secret ocean sunset cove boasting glowing bioluminescent algae reefs.",
      "An award-winning hidden mountain library that serves organic roasted beans."
    ],
    itinerary,
    hotelRecommendation: {
      area: "Historical Central Square",
      reason: "Unparalleled access to top bistros, transport networks, and safe walkways.",
      avgPrice: Math.round(breakStay / daysCount)
    },
    packingList: [
      "Universal travel adapter plug",
      "Sturdy trek boots",
      "SPF sun cream & bug spray",
      "Comfortable breathable linen layers",
      "Waterproof zip cardholder"
    ]
  };
};

export const getFallbackLocalGuideInsights = (plan: TripPlan): LocalGuideInsights => {
  return {
    intro: `Welcome to the insider local's guide to ${plan.destination}! Beyond the standard paths, we have prepared top recommendations to experience this incredible spot.`,
    categories: [
      {
        title: "Must-Try Gourmet Eats",
        icon: "food",
        options: [
          {
            name: "The Heritage Family Kitchen",
            description: "A spectacular third-generation dining hall crafting rich, slow-simmered dishes according to heirloom recipes.",
            priceRange: "₹₹ (Moderate)",
            rating: "4.8/5",
            bestFor: "Authentic culinary depth"
          },
          {
            name: "Sunset Harbor Lounge",
            description: "Breathtaking clifftop outdoor bar presenting freshly wood-fired items and signature mocktails.",
            priceRange: "₹₹₹ (Premium)",
            rating: "4.6/5",
            bestFor: "Sunset sea panoramas"
          }
        ]
      },
      {
        title: "Boutique Stays & Resorts",
        icon: "stay",
        options: [
          {
            name: "The Secret Garden Retreat",
            description: "Charming stone arches coupled with tranquil gardens, located only five minutes away from the busy old market.",
            priceRange: "₹₹ (Moderate)",
            rating: "4.9/5",
            bestFor: "Quiet privacy"
          }
        ]
      },
      {
        title: "Sourcing & Transit Hacks",
        icon: "transport",
        options: [
          {
            name: "Eco-Friendly Metro Card",
            description: "Purchase the 3-day unlimited transit pass at the airport terminal to slash transit bills in half.",
            priceRange: "₹ (Budget)",
            rating: "4.7/5",
            bestFor: "Budget movement"
          }
        ]
      }
    ]
  };
};

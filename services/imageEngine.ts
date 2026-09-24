// Intelligent Destination & Vibe Image Engine - Wanderlust AI
// High-fidelity curated photography mapping with deterministic caching and search fallbacks.

const CURATED_DESTINATIONS: Record<string, string[]> = {
  "paris": [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80", // Eiffel Tower
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80", // Seine River
    "https://images.unsplash.com/photo-1492138786289-d35ea60b1b09?auto=format&fit=crop&w=1200&q=80"  // Louvre Louvre museum
  ],
  "bali": [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", // Bali Rice terraces
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80", // Balinese Temple
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80"  // Jungle luxury pool
  ],
  "tokyo": [
    "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80", // Shibuya crossings
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80", // Tokyo Tower
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"  // Neon night streets
  ],
  "switzerland": [
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80", // Alps lake
    "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=1200&q=80", // Mountain railway Swiss
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"  // Matterhorn snowy peaks
  ],
  "maldives": [
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80", // Luxury villas pool
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80", // Turquoise lagoon beach
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80"  // Hammock palms Maldives
  ],
  "goa": [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80", // Goa Sunset Beach
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", // Palms shoreline
    "https://images.unsplash.com/photo-1587922415610-d790400f91a9?auto=format&fit=crop&w=1200&q=80"  // Beach bar shacks
  ],
  "ladakh": [
    "https://images.unsplash.com/photo-1596120206411-bd56a8cf1031?auto=format&fit=crop&w=1200&q=80", // Pangong Lake Ladakh
    "https://images.unsplash.com/photo-1620054236968-fd25d4817d2a?auto=format&fit=crop&w=1200&q=80", // Leh mountains roads
    "https://images.unsplash.com/photo-1616428410217-0639d6796c80?auto=format&fit=crop&w=1200&q=80"  // Himalaya mountain monastery
  ],
  "kerala": [
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80", // Houseboat backwaters Kerala
    "https://images.unsplash.com/photo-1593693411515-c202e974eb05?auto=format&fit=crop&w=1200&q=80", // Munnar tea estates
    "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&w=1200&q=80"  // Palm sunset cliff
  ],
  "jaipur": [
    "https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1200&q=80", // Hawa Mahal pink palace
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", // Amer Fort royal palace
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"  // Jaipur beautiful doors
  ],
  "agra": [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80", // Beautiful Taj Mahal Close-up
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80", // Taj Mahal sunrise mirroring
    "https://images.unsplash.com/photo-1585501033713-cef9a7275267?auto=format&fit=crop&w=1200&q=80"  // Agra Fort
  ],
  "london": [
    "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=1200&q=80", // London Big Ben Elizabeth Tower
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80"  // Tower Bridge evening
  ],
  "new york": [
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80", // New York Times square night
    "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80"  // Brooklyn bridge skyline
  ],
  "rome": [
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80", // Colosseum exterior rome
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"  // Vatican view
  ],
  "barcelona": [
    "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=1200&q=80", // Sagrada Familia Spain
    "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80"  // Park Guell colorful structures
  ],
  "sydney": [
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80", // Sydney Opera House beach
    "https://images.unsplash.com/photo-1524820197278-540916411e20?auto=format&fit=crop&w=1200&q=80"  // Sydney harbor bridge bridge aerial
  ],
  "singapore": [
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80", // Marina bay skyline
    "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80"  // Singapore gardens by the bay supertrees
  ],
  "dubai": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", // Burj Khalifa dubai
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80"  // Dubai marina luxury yachts
  ],
  "bangkok": [
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80", // Thai temple palace
    "https://images.unsplash.com/photo-1563492065561-36dac3194a0c?auto=format&fit=crop&w=1200&q=80"  // Bangkok city traffic lights
  ],
  "mumbai": [
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80", // Gateway of India Mumbai
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80"  // Marine drive mumbai sunset
  ],
  "delhi": [
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80", // Humayun Tomb landmark delhi
    "https://images.unsplash.com/photo-1598977123418-45f04b615105?auto=format&fit=crop&w=1200&q=80"  // Qutube Minar delhi heritage
  ],
  "shrinagar": [
    "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=1200&q=80", // Kashmir Dal Lake shikara
    "https://images.unsplash.com/photo-1620556276228-56eb0b86bfeb?auto=format&fit=crop&w=1200&q=80"  // Gulmarg snowy heights cablecar
  ],
  "ooty": [
    "https://images.unsplash.com/photo-1589136775550-189338a9aa4c?auto=format&fit=crop&w=1200&q=80", // Ooty tea field mountains
    "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=1200&q=80"  // Nilgiri mountain forest road
  ],
  "hampi": [
    "https://images.unsplash.com/photo-1600100397608-f010e5218dc3?auto=format&fit=crop&w=1200&q=80", // Stone chariot chariot temple Hampi
    "https://images.unsplash.com/photo-1600100397576-02e20ddafde5?auto=format&fit=crop&w=1200&q=80"  // Serene rocks morning Hampi ruins
  ],
  "manali": [
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80", // Manali snowy bridge winter
    "https://images.unsplash.com/photo-1617387399813-f43e1d7cf9d5?auto=format&fit=crop&w=1200&q=80"  // Solang valley greenery mountains
  ]
};

const CURATED_VIBES: Record<string, string[]> = {
  "relaxation": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85", // Breathtaking white sand beach with leaning coconut palms at sunset
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85", // Deep turquoise infinity pool merging with tranquil tropical forest sky
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=85"  // Premium hammock strung between palms over a crystal-clear lagoon
  ],
  "adventure": [
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85", // Person standing on epic mountain cliff edge overlooking a dramatic valley
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85", // Majestic snow-capped jagged mountain peaks under cinematic sky
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=85"  // Red kayak cutting through deep glacial lake surrounded by massive dark mountains
  ],
  "culture": [
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85", // Gorgeous traditional Pagoda temple surrounded by autumn maples in Kyoto
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=85", // Classic historic European stone alleyway with hanging flower arrangements
    "https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1000&q=85"  // Historic arches and spectacular heritage palaces of Rajasthan
  ],
  "food": [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85", // Exquisite high-contrast culinary layout of gourmet wood-fired pizza and pasta
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85", // Highly photogenic gourmet plating in a dark luxury restaurant setting
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"  // Lively street food chef crafting authentic steaming street noodles in Asia
  ],
  "spiritual": [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85", // Majestic Golden Temple of Amritsar basking in serenity over its sacred pool
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=85", // Spectacular Wat Arun temple pagoda spires in Bangkok sunrise
    "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1000&q=85", // Legendary Bali Lempuyang temple Gates of Heaven overlooking mountains
    "https://images.unsplash.com/photo-1528360983277-13d9b152c6d4?auto=format&fit=crop&w=1000&q=85"  // Mystical ancient Japanese pagoda temple rising amidst soft forest morning mist
  ],
  "nightlife": [
    "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&w=1000&q=85", // Premium rooftop bar lounge overlooking neon illuminated skyscraper skylines
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=85", // Atmospheric cocktail bar with glowing liquor bottles and mood lighting
    "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=1000&q=85"  // Breathtaking concert stage with sharp lasers and high energy crowds
  ],
  "luxury": [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85", // Grand ultra-luxury hotel courtyard estate illuminated at twilight
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85", // Pristine water villas of Maldives stretching out over turquoise lagoon
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85"  // Highly exclusive cliffside infinity pool lounge overlooking mountain views
  ],
  "nature": [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85", // Beautiful bright sun beams piercing through deep sequoia trees forest
    "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=1000&q=85", // Powerful emerald waterfall cascading down spectacular deep green canyon cliffs
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=85"  // Enigmatic misty green hill fields fading into thick mountain fog at dawn
  ]
};

// Generates a stable hash code for any string
function getStringHash(str: string): number {
  let hash = 0;
  const cleaned = str.toLowerCase().trim();
  for (let i = 0; i < cleaned.length; i++) {
    hash = cleaned.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Searches the curated lists or creates a perfect query-targeted Unsplash Source URL.
 * Designed to guarantee beautifully balanced, real, and distinct photographs.
 * 
 * @param type Section type: 'destination', 'vibe', or 'attraction'
 * @param query Main query name (e.g. "Paris", "Eiffel Tower", "Culture")
 * @param subQuery Sub-query detail (e.g. "France", "landmark")
 * @param size Optional width x height constraint (defaults to 1200x800)
 */
export function getSmartImage(
  type: 'destination' | 'vibe' | 'attraction',
  query: string,
  subQuery?: string,
  size: string = '1200x800'
): string {
  if (!query) {
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
  }

  const cleanQuery = query.toLowerCase().trim();
  const indexSeed = getStringHash(query + (subQuery || ''));

  // 1. Direct Curated Vibes Search
  if (type === 'vibe' && CURATED_VIBES[cleanQuery]) {
    const list = CURATED_VIBES[cleanQuery];
    return list[indexSeed % list.length];
  }

  // 2. Direct Curated Destination Search (with subQuery matching)
  for (const name of Object.keys(CURATED_DESTINATIONS)) {
    if (cleanQuery.includes(name) || name.includes(cleanQuery)) {
      const list = CURATED_DESTINATIONS[name];
      return list[indexSeed % list.length];
    }
  }

  // 3. Fallback Dynamic Construction based on Unsplash's feature selection engine
  const searchKeywords = [query];
  if (subQuery) {
    searchKeywords.push(subQuery);
  }
  if (type === 'attraction' && !cleanQuery.includes('landmark') && !cleanQuery.includes('attraction')) {
    searchKeywords.push('landmark travel');
  }

  // Formulate keywords and clean them to prevent URL injection/breakage
  const joinedKeywords = searchKeywords
    .join(' ')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, ',');

  // Uses Unsplash's featured collection routing which automatically resolves to professional shoots
  return `https://images.unsplash.com/featured/${size}/?${encodeURIComponent(joinedKeywords)}`;
}

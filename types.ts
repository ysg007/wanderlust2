export enum UserIntent {
  Relaxation = 'Relaxation',
  Adventure = 'Adventure',
  Culture = 'Culture',
  Food = 'Food',
  Spiritual = 'Spiritual',
  Nightlife = 'Nightlife',
  Luxury = 'Luxury',
  Nature = 'Nature'
}

export enum CompanionType {
  Solo = 'Solo',
  Couple = 'Couple',
  Family = 'Family',
  Group = 'Group'
}

export enum LocationScope {
  India = 'India',
  Abroad = 'Abroad'
}

export enum TravelMonth {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}

export enum TransportPreference {
  Flight = 'Flight',
  Train = 'Train',
  Bus = 'Bus',
  RoadTrip = 'Road Trip',
  NoPreference = 'No Preference'
}

export enum AccommodationPreference {
  Budget = 'Budget Stay',
  MidRange = 'Mid-range Hotel',
  Luxury = 'Luxury Stay',
  Hostel = 'Hostel',
  Homestay = 'Homestay',
  Wellness = 'Wellness Retreat',
  Resort = 'Resort'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserPreferences {
  intent: UserIntent;
  days: number;
  budget: number; // Daily budget in INR
  companions: CompanionType;
  locationScope: LocationScope;
  month: TravelMonth;
  transport?: TransportPreference;
  accommodation?: AccommodationPreference;
}

export interface MatchReason {
  label: string;
  isPositive: boolean;
}

export interface DestinationOption {
  id: string;
  name: string;
  country: string;
  description?: string;
  highlightActivity: string;
  estimatedTotalCost: number; 
  imageUrl?: string;
  matchScore: number; // 0-100
  matchReasons: string[]; // "Perfect for Solo Spiritual Travel", etc.
  weather: {
    temp: string;
    condition: string;
  };
  crowdLevel: 'Low' | 'Moderate' | 'Peak';
  safetyScore: number;
}

export interface BudgetBreakdown {
  travel: number;
  stay: number;
  food: number;
  activities: number;
  localTransport: number;
  emergency: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  description: string;
  costEstimate: number; 
  type: 'food' | 'activity' | 'relax' | 'travel';
}

export interface DayPlan {
  day: number;
  theme: string;
  items: ItineraryItem[];
}

export interface TripPlan {
  destinationId: string;
  destination: string;
  country: string;
  description: string;
  currency: string; 
  exchangeRateToINR: number; 
  safetyScore: number; 
  safetyTips: string[];
  totalEstimatedCost: number; 
  budgetBreakdown: BudgetBreakdown;
  thingsToAvoid: string[];
  hiddenGems: string[];
  itinerary: DayPlan[];
  hotelRecommendation: {
    area: string;
    reason: string;
    avgPrice: number; 
  };
  packingList: string[];
  sourceUrls?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isMapResult?: boolean;
  mapChunks?: Array<{
    maps?: {
      uri?: string;
      title?: string;
      placeAnswerSources?: any;
    }
  }>;
}

// --- Local Guide Types ---
export interface LocalGuideOption {
  name: string;
  description: string;
  priceRange: string; // e.g. "$", "$$$"
  rating: string; // e.g. "4.5/5"
  bestFor: string;
}

export interface LocalGuideCategory {
  title: string;
  icon: 'food' | 'stay' | 'activity' | 'transport' | 'secret';
  options: LocalGuideOption[];
}

export interface LocalGuideInsights {
  intro: string; // Short summary
  categories: LocalGuideCategory[];
}

export interface GenerateContentResponse {
  text?: string;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    groundingMetadata?: {
      groundingChunks?: any[];
    };
  }>;
}
import React, { useState } from 'react';
import { UserIntent, CompanionType, UserPreferences, LocationScope, TravelMonth, TransportPreference, AccommodationPreference } from '../types';
import { Compass, Users, DollarSign, Calendar, ArrowRight, Check, Sparkles, Heart, Baby, Tent, Clock, Wallet, Calculator, Plane, Train, Bus, Map, Bed, Home, Hotel, ShieldCheck } from 'lucide-react';
import { getSmartImage } from '../services/imageEngine';

const VIBE_TAGLINES: Record<UserIntent, string> = {
  [UserIntent.Relaxation]: "Unwind, breathe, and find your calm",
  [UserIntent.Adventure]: "Push limits, explore wild terrains",
  [UserIntent.Luxury]: "Indulge in absolute, premium comfort",
  [UserIntent.Culture]: "Deep dive into history and heritage",
  [UserIntent.Nightlife]: "Neon streets and high energy tempos",
  [UserIntent.Nature]: "Connect with spectacular mountains & lakes",
  [UserIntent.Food]: "Savor authentic culinary masterpieces",
  [UserIntent.Spiritual]: "Discover peace and sacred spaces"
};

const getStepTitle = (stepNum: number) => {
  switch (stepNum) {
    case 1: return "Scope";
    case 2: return "Vibe";
    case 3: return "Companions";
    case 4: return "Season";
    case 5: return "Styles";
    case 6: return "Budget";
    default: return "";
  }
};

const getSeasonColors = (month: TravelMonth) => {
  switch (month) {
    case TravelMonth.December:
    case TravelMonth.January:
    case TravelMonth.February:
      return { 
        name: 'Winter', 
        glow: 'shadow-[0_0_50px_rgba(56,189,248,0.15)] border-sky-500/20 bg-sky-950/20',
        accent: 'text-cyan-400',
        border: 'border-[#0ea5e9]',
        shadow: 'rgba(14, 165, 233, 0.4)',
        bgSpotlight: 'rgba(56, 189, 248, 0.15)'
      };
    case TravelMonth.March:
    case TravelMonth.April:
      return { 
        name: 'Spring', 
        glow: 'shadow-[0_0_50px_rgba(244,63,94,0.15)] border-rose-500/20 bg-rose-950/20',
        accent: 'text-rose-400',
        border: 'border-[#f43f5e]',
        shadow: 'rgba(244, 63, 94, 0.4)',
        bgSpotlight: 'rgba(244, 63, 94, 0.15)'
      };
    case TravelMonth.May:
    case TravelMonth.June:
      return { 
        name: 'Summer', 
        glow: 'shadow-[0_0_50px_rgba(245,158,11,0.15)] border-amber-500/20 bg-amber-950/20',
        accent: 'text-amber-400',
        border: 'border-[#f59e0b]',
        shadow: 'rgba(245, 158, 11, 0.4)',
        bgSpotlight: 'rgba(245, 158, 11, 0.15)'
      };
    case TravelMonth.July:
    case TravelMonth.August:
      return { 
        name: 'Monsoon', 
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.15)] border-emerald-500/20 bg-emerald-950/20',
        accent: 'text-emerald-400',
        border: 'border-[#10b981]',
        shadow: 'rgba(16, 185, 129, 0.4)',
        bgSpotlight: 'rgba(16, 185, 129, 0.15)'
      };
    case TravelMonth.September:
    case TravelMonth.October:
    case TravelMonth.November:
      return { 
        name: 'Autumn', 
        glow: 'shadow-[0_0_50px_rgba(249,115,22,0.15)] border-orange-500/20 bg-orange-950/20',
        accent: 'text-orange-400',
        border: 'border-[#f97316]',
        shadow: 'rgba(249, 115, 22, 0.4)',
        bgSpotlight: 'rgba(249, 115, 22, 0.15)'
      };
    default:
      return {
        name: 'Spring',
        glow: 'shadow-[0_0_50px_rgba(244,63,94,0.15)] border-rose-500/20 bg-rose-950/20',
        accent: 'text-rose-400',
        border: 'border-[#f43f5e]',
        shadow: 'rgba(244, 63, 94, 0.4)',
        bgSpotlight: 'rgba(244, 63, 94, 0.15)'
      };
  }
};

const SEASONAL_DATA: Record<string, Record<TravelMonth, {
  season: string;
  subtitle: string;
  tags: string[];
  images: {
    default: string;
    leisure: string;
    active: string;
    heritage: string;
    culinary: string;
  };
}>> = {
  india: {
    [TravelMonth.January]: {
      season: "Winter",
      subtitle: "Kashmir heavy snowfalls and cozy winter bonfires",
      tags: ["Gulmarg Skiing", "Misty Taj Mahal", "Cozy Stays"],
      images: {
        default: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.February]: {
      season: "Winter",
      subtitle: "Comfortable desert dunes and royal palaces sunset breeze",
      tags: ["Jaisalmer Dune Safari", "Jaipur Royal", "Thar Caravan"],
      images: {
        default: "https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.March]: {
      season: "Spring",
      subtitle: "Celebrate होली at the heritage streets with vibrant spring blossoms",
      tags: ["Holi in Jaipur", "Ganga Haridwar", "Spring Valleys"],
      images: {
        default: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1610116306796-6ebd3051c3d8?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.April]: {
      season: "Spring",
      subtitle: "Vast blooming tulip corridors and lovely fresh valleys",
      tags: ["Srinagar Tulip Walk", "Munnar Tea Yards", "Ooty Gardens"],
      images: {
        default: "https://images.unsplash.com/photo-1538097304804-41180671f0d9?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.May]: {
      season: "Summer",
      subtitle: "High snow passes, rocky roads and cooling mountain lakes",
      tags: ["Ladakh Road Pass", "Rohtang Snowy", "Shimla Retreat"],
      images: {
        default: "https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.June]: {
      season: "Summer",
      subtitle: "Early monsoon drizzles and misty lush green hills",
      tags: ["Cherrapunji Mist", "Endless Hills", "Western Ghats"],
      images: {
        default: "https://images.unsplash.com/photo-1508490581621-53d71e62a138?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.July]: {
      season: "Monsoon",
      subtitle: "Spectacular rivers and magnificent floating houseboats",
      tags: ["Kerala Houseboats", "Athirappilly Falls", "Valley Trekking"],
      images: {
        default: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.August]: {
      season: "Monsoon",
      subtitle: "Cascading misty waterfalls in deep emerald canyons",
      tags: ["Valley of Flowers", "Wayanad Forests", "Coorg Tea Walks"],
      images: {
        default: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.September]: {
      season: "Autumn",
      subtitle: "Fresh post-rain air and vibrant panoramic mountain ridges",
      tags: ["Himachal Valleys", "Coorg Waterfalls", "Lahaul Hikes"],
      images: {
        default: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1600100397561-4e460980fac4?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.October]: {
      season: "Autumn",
      subtitle: "Vibrant oil lamps of Diwali celebrations and cooling breezes",
      tags: ["Varanasi Diwali", "Durga Celebrations", "Pleasant Hampi"],
      images: {
        default: "https://images.unsplash.com/photo-1510133769066-217d80133b43?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.November]: {
      season: "Autumn",
      subtitle: "Vast golden dunes and pleasant temperatures for historic ruins",
      tags: ["Rajasthan Palaces", "Camel Festivals", "Hampi Ruins"],
      images: {
        default: "https://images.unsplash.com/photo-1600100397561-4e460980fac4?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.December]: {
      season: "Winter",
      subtitle: "Bustling coastal carnivals & magnificent snowy mountains",
      tags: ["Goa Carnivals", "Early Shimla Snow", "Winter Peaks"],
      images: {
        default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1610116306796-6ebd3051c3d8?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
      }
    }
  },
  global: {
    [TravelMonth.January]: {
      season: "Winter",
      subtitle: "Vast snowy mountain slopes and spectacular dancing auroras",
      tags: ["Norway Aurora", "Alps Skiing", "Japan Snow"],
      images: {
        default: "https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.February]: {
      season: "Winter",
      subtitle: "Mysterious romantic alleys and historic quiet cities",
      tags: ["Paris Winter", "Venice Carnivals", "Iceland Glaciers"],
      images: {
        default: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.March]: {
      season: "Spring",
      subtitle: "Magical rose cherry blossom parks and temple gardens",
      tags: ["Kyoto Sakuras", "Tokyo Gardens", "Blossoms Trip"],
      images: {
        default: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1528360983277-13d9b152c6d4?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.April]: {
      season: "Spring",
      subtitle: "Vivid fields of millions of blooming tulips and fresh wind",
      tags: ["Amsterdam Tulips", "London Parks", "Rome Breezes"],
      images: {
        default: "https://images.unsplash.com/photo-1533929736458-ca588eb77445?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.May]: {
      season: "Summer",
      subtitle: "Stunning cobalt seas and sun-bathed mountainside towns",
      tags: ["Amalfi Coast", "Santorini Domes", "Mediterranean"],
      images: {
        default: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.June]: {
      season: "Summer",
      subtitle: "High sun over spectacular valleys and blooming wildflower meadows",
      tags: ["Swiss Meadows", "Norway Fjords", "Midnight Sun"],
      images: {
        default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.July]: {
      season: "Monsoon",
      subtitle: "Breathtaking sandy island paradises and turquoise lagoons",
      tags: ["Bali Beaches", "Maldives Lagoons", "Greece Sunsets"],
      images: {
        default: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.August]: {
      season: "Monsoon",
      subtitle: "Majestic savannah horizons and incredible wild animals",
      tags: ["Serengeti Safari", "Kenyan Lions", "Grand Canyon Hikes"],
      images: {
        default: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.September]: {
      season: "Autumn",
      subtitle: "Bavarian cottage magic, golden fests and mountain hikes",
      tags: ["Munich Oktoberfest", "Swiss Alps Hikes", "Japan Autumns"],
      images: {
        default: "https://images.unsplash.com/photo-1535451801241-b5395e1d4a1b?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.October]: {
      season: "Autumn",
      subtitle: "Warm crimson forests and foggy golden sunsets",
      tags: ["New England Foliage", "Kyoto Temples", "Autumn Castles"],
      images: {
        default: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.November]: {
      season: "Autumn",
      subtitle: "Vast metropolis lights and lovely jazz street cafes",
      tags: ["London City Glow", "NYC Autumn Jazz", "Tokyo Skyline"],
      images: {
        default: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1536489885071-87983c3e2859?auto=format&fit=crop&w=1000&q=85"
      }
    },
    [TravelMonth.December]: {
      season: "Winter",
      subtitle: "Charming traditional food wooden chalets, light show & hot cocoa",
      tags: ["Prague Markets", "NYC Central Park", "Vienna Classical"],
      images: {
        default: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1000&q=85",
        active: "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?auto=format&fit=crop&w=1000&q=85",
        leisure: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        heritage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85",
        culinary: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=85"
      }
    }
  }
};

interface IntentFormProps {
  onSubmit: (prefs: UserPreferences) => void;
}

const COMPANION_IMAGES: Record<CompanionType, string> = {
  [CompanionType.Solo]: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
  [CompanionType.Couple]: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80",
  [CompanionType.Family]: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
  [CompanionType.Group]: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
};

const COMPANION_DESCRIPTIONS: Record<CompanionType, string> = {
  [CompanionType.Solo]: "Embark on a soulful journey of self-discovery.",
  [CompanionType.Couple]: "Create timeless memories in a romantic setting.",
  [CompanionType.Family]: "Safe and engaging experiences for all ages.",
  [CompanionType.Group]: "Unforgettable adventures with your squad.",
};

const IntentForm: React.FC<IntentFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [prefs, setPrefs] = useState<UserPreferences>({
    intent: UserIntent.Relaxation,
    days: 4,
    budget: 5000,
    companions: CompanionType.Solo,
    locationScope: LocationScope.India,
    month: TravelMonth.October,
    transport: TransportPreference.NoPreference,
    accommodation: AccommodationPreference.MidRange,
  });

  const [selectedVibes, setSelectedVibes] = useState<UserIntent[]>([prefs.intent]);

  const toggleVibe = (intent: UserIntent) => {
    setSelectedVibes(prev => {
      let next;
      if (prev.includes(intent)) {
        if (prev.length === 1) return prev;
        next = prev.filter(v => v !== intent);
      } else {
        next = [...prev, intent];
      }
      setPrefs(p => ({ ...p, intent: next[next.length - 1] }));
      return next;
    });
  };

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    // Guard: ensure days and budget are valid numbers
    const safeDays = (typeof prefs.days === 'number' && prefs.days > 0) ? prefs.days : 4;
    const safeBudget = (typeof prefs.budget === 'number' && prefs.budget > 0) ? prefs.budget : 5000;
    onSubmit({ ...prefs, days: safeDays, budget: safeBudget });
  };

  const getBudgetLabel = (amount: number) => {
    if (amount <= 2000) return { label: 'Budget', color: 'text-emerald-600 dark:text-emerald-400' };
    if (amount <= 6000) return { label: 'Value', color: 'text-brand-600 dark:text-brand-400' };
    if (amount <= 15000) return { label: 'Premium', color: 'text-purple-600 dark:text-purple-400' };
    return { label: 'Elite', color: 'text-amber-600 dark:text-amber-400' };
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800/80 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-700 min-h-[650px] flex flex-col relative overflow-hidden transition-all duration-500 backdrop-blur-xl">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-slate-700/30">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 via-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${((step - 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Premium Step Navigation Hub */}
      <div className="px-8 sm:px-12 pt-8 pb-3 border-b border-gray-50 dark:border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar scroll-smooth active:cursor-grabbing">
         {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={`step-indicator-${stepNum}`} className="flex items-center gap-2 shrink-0">
                 <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-500 shadow-sm
                       ${isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-100' 
                          : isActive 
                             ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.4)] scale-110 font-bold ring-2 ring-brand-400/20' 
                             : 'bg-white dark:bg-slate-800 border-gray-150 dark:border-slate-700 text-gray-400 dark:text-gray-500'}`}
                    >
                       {isCompleted ? <Check className="w-4 h-4 stroke-[4]" /> : stepNum}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase hidden sm:inline-block transition-colors duration-500
                       ${isActive 
                          ? 'text-brand-600 dark:text-brand-400' 
                          : isCompleted 
                             ? 'text-emerald-600 dark:text-emerald-400' 
                             : 'text-gray-400 dark:text-gray-500'}`}
                    >
                       {getStepTitle(stepNum)}
                    </span>
                 </div>
                 {stepNum < totalSteps && (
                    <div className="hidden lg:block w-8 xl:w-16 h-[2px] bg-gray-100 dark:bg-slate-800/80 transition-colors" />
                 )}
              </div>
            );
         })}
      </div>

      <div className="flex-1 p-8 sm:p-12 flex flex-col">
        {step === 1 && (
           <div className="flex-1 flex flex-col animate-fade-in-up">
             <div className="text-center mb-10 space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-widest shadow-sm border border-brand-100 dark:border-brand-900/50">
                    <Sparkles className="w-3.5 h-3.5" /> Start Your Journey
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                    Where to next?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-md mx-auto">
                    Select the region that matches your curiosity.
                </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 items-center max-w-3xl mx-auto w-full">
                <LocationOption
                  selected={prefs.locationScope === LocationScope.India}
                  onClick={() => setPrefs({ ...prefs, locationScope: LocationScope.India })}
                  image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800"
                  label="In India"
                  subLabel="Spiritual retreats, mountain peaks, and vibrant heritage."
                />
                <LocationOption
                  selected={prefs.locationScope === LocationScope.Abroad}
                  onClick={() => setPrefs({ ...prefs, locationScope: LocationScope.Abroad })}
                  image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800"
                  label="Global"
                  subLabel="Iconic world wonders and cosmopolitan explorations."
                />
             </div>
           </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up animate-once">
            <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-widest border border-brand-100/50 dark:border-brand-900/50 shadow-sm">
                    <Compass className="w-3.5 h-3.5 text-brand-500" /> Select Your Vibes
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                    Choose Your Vibe
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base max-w-md mx-auto">
                    Select one or combine multiple vibes to model your dream travel experience.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto w-full px-4 items-stretch justify-center">
              {Object.values(UserIntent).map((intent) => (
                <VibeCard
                  key={intent}
                  selected={selectedVibes.includes(intent)}
                  onClick={() => toggleVibe(intent)}
                  image={getSmartImage('vibe', intent)}
                  label={intent}
                  subLabel={VIBE_TAGLINES[intent]}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3 mb-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase">
                    <Users className="w-3 h-3" /> Step 3
                </span>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Travel companions</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Who is joining this adventure?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {Object.values(CompanionType).map((type) => (
                <CompanionCard
                  key={type}
                  selected={prefs.companions === type}
                  onClick={() => setPrefs({ ...prefs, companions: type })}
                  image={COMPANION_IMAGES[type]}
                  label={type}
                  subLabel={COMPANION_DESCRIPTIONS[type]}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in-up relative overflow-visible">
            {/* Ambient Background Spotlight Glistening Glow */}
            <div 
              className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ease-in-out z-0 opacity-30 dark:opacity-45"
              style={{ backgroundColor: getSeasonColors(prefs.month).bgSpotlight }}
            />
            <div 
              className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-all duration-1000 ease-in-out z-0 opacity-30 dark:opacity-45"
              style={{ backgroundColor: getSeasonColors(prefs.month).bgSpotlight }}
            />

            <div className="text-center space-y-3 mb-8 relative z-10">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-slate-900/10 dark:bg-slate-900/30 text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-sm
                  ${getSeasonColors(prefs.month).accent} border-gray-100 dark:border-white/5`}>
                    <Calendar className="w-3.5 h-3.5" /> step 04
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                    Select a Travel Season
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base max-w-md mx-auto">
                    Choose an atmosphere. Your recommended destinations, weather checks, and activity tags will dynamically update.
                </p>
                <div className="inline-block mt-2">
                  <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border transition-all duration-700 backdrop-blur-md
                    ${getSeasonColors(prefs.month).glow}`}>
                    Atmosphere: <span className="font-bold text-gray-800 dark:text-white">{getSeasonColors(prefs.month).name} Mode</span>
                  </span>
                </div>
            </div>

            {/* Carousel scroll / grid combo */}
            <div className="relative z-10 w-full">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-4xl mx-auto w-full items-stretch justify-start">
                {Object.values(TravelMonth).map((m) => (
                  <MonthExperienceCard
                    key={m}
                    month={m}
                    selected={prefs.month === m}
                    onClick={() => setPrefs({...prefs, month: m})}
                    locationScope={prefs.locationScope}
                    intent={prefs.intent}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-12 animate-fade-in-up relative overflow-visible max-w-5xl mx-auto w-full">
            {/* Ambient Background Spotlight Glistening Glow */}
            <div 
              className="absolute -top-32 -left-20 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ease-in-out z-0 opacity-20 dark:opacity-40"
              style={{ backgroundColor: getSeasonColors(prefs.month).bgSpotlight }}
            />
            <div 
              className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-all duration-1000 ease-in-out z-0 opacity-20 dark:opacity-40"
              style={{ backgroundColor: getSeasonColors(prefs.month).bgSpotlight }}
            />

            <div className="text-center space-y-3 mb-10 relative z-10">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-slate-900/10 dark:bg-slate-900/30 text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-sm
                  ${getSeasonColors(prefs.month).accent} border-gray-100 dark:border-white/5`}>
                    <Compass className="w-3.5 h-3.5" /> step 05
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none text-center">
                    Define Your Travel Style
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base max-w-lg mx-auto text-center">
                    Design your travel lifestyle. Select how you prefer to transit and rest on your epic journey.
                </p>
            </div>
            
            <div className="space-y-12 relative z-10 w-full">
              {/* Transport */}
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-gray-100 dark:border-slate-800 pb-3 mx-4 sm:mx-0">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#38bdf8]" /> Transport Mode
                  </h3>
                  <span className="text-xs text-gray-400 font-bold hidden sm:inline">
                    Active: {prefs.transport || "None Chosen"}
                  </span>
                </div>
                
                {/* Responsive grid: single column stacked on mobile, 2-column on tablet, and 3-column on desktop */}
                <div className="w-full px-4 sm:px-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full items-stretch justify-start">
                    {Object.values(TransportPreference).map((val) => (
                      <TransportPreferenceCard
                        key={val}
                        val={val}
                        selected={prefs.transport === val}
                        onClick={() => setPrefs({...prefs, transport: val})}
                        locationScope={prefs.locationScope}
                        intent={prefs.intent}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-gray-100 dark:border-slate-800 pb-3 mx-4 sm:mx-0">
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#38bdf8]" /> Accommodation Style
                  </h3>
                  <span className="text-xs text-gray-400 font-bold hidden sm:inline">
                    Active: {prefs.accommodation || "None Chosen"}
                  </span>
                </div>

                {/* Horizontal slider on mobile, responsive grid on medium/large devices */}
                <div className="w-full">
                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto w-full items-stretch justify-start">
                    {Object.values(AccommodationPreference).map((val) => (
                      <AccommodationPreferenceCard
                        key={val}
                        val={val}
                        selected={prefs.accommodation === val}
                        onClick={() => setPrefs({...prefs, accommodation: val})}
                        locationScope={prefs.locationScope}
                        intent={prefs.intent}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 animate-fade-in-up max-w-2xl mx-auto w-full">
            <div className="text-center space-y-3 mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase">
                    <DollarSign className="w-3 h-3" /> Final Step
                </span>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Budget & Duration</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Finalize your capacity for this trip.</p>
            </div>
            
            <div className="space-y-12">
              {/* Duration Slider */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <label className="text-gray-900 dark:text-white font-black flex items-center gap-2 uppercase tracking-tight text-sm text-gray-400">
                      <Clock className="w-4 h-4" /> Trip Days
                    </label>
                    <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                        {prefs.days} <span className="text-sm font-medium text-gray-400">Days</span>
                    </span>
                 </div>
                 <input
                    type="range"
                    min="1"
                    max="30"
                    value={prefs.days}
                    onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) setPrefs({ ...prefs, days: Math.max(1, Math.min(30, v)) }); }}
                    className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-brand-500"
                  />
              </div>

              {/* Daily Budget Slider */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <label className="text-gray-900 dark:text-white font-black flex items-center gap-2 uppercase tracking-tight text-sm text-gray-400">
                      <Wallet className="w-4 h-4" /> Daily Budget (Approx)
                    </label>
                    <div className="text-right">
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            ₹{prefs.budget.toLocaleString()}
                        </span>
                        <p className={`text-[10px] font-black uppercase ${getBudgetLabel(prefs.budget).color}`}>
                            {getBudgetLabel(prefs.budget).label} Style
                        </p>
                    </div>
                 </div>
                 <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={prefs.budget}
                    onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) setPrefs({ ...prefs, budget: v }); }}
                    className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-indigo-600 p-8 rounded-3xl shadow-2xl text-white mt-10">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-white/60 text-xs font-black uppercase tracking-wider mb-2">Total Plan Capacity</p>
                        <h3 className="text-4xl font-black">
                            ₹{(prefs.budget * prefs.days).toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl">
                       <Calculator className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 sm:p-12 pt-0 flex items-center gap-6">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all border border-transparent hover:border-brand-100 dark:hover:border-brand-900"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
        )}
        
        <button
          onClick={step === totalSteps ? handleSubmit : handleNext}
          className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 group"
        >
          {step === totalSteps ? 'Generate Best Matches' : 'Continue'}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const LocationOption = ({ selected, onClick, image, label, subLabel }: any) => (
  <button
    onClick={onClick}
    className={`relative w-full h-64 rounded-[2rem] overflow-hidden group transition-all duration-500 ease-out border-4
      ${selected 
        ? 'border-brand-500 shadow-2xl scale-[1.02]' 
        : 'border-transparent opacity-90 hover:opacity-100 scale-100 hover:scale-[1.01]'}`}
  >
    <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${selected ? 'opacity-90' : 'opacity-70 group-hover:opacity-80'}`} />
    <div className="absolute bottom-0 left-0 w-full p-6 text-left">
        <h3 className="text-3xl font-black text-white mb-1 uppercase tracking-tight flex items-center gap-3">
          {label}
          {selected && <div className="bg-white rounded-full p-1"><Check className="w-4 h-4 text-brand-600 stroke-[4]" /></div>}
        </h3>
        <p className="text-xs text-white/80 font-bold leading-tight max-w-[90%]">{subLabel}</p>
    </div>
  </button>
);

const VibeCard = ({ selected, onClick, image, label, subLabel }: any) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-square rounded-[28px] overflow-hidden vibe-card-premium w-full text-left bg-slate-950 border-3 cursor-pointer select-none
        ${selected 
          ? 'vibe-card-selected border-[#38bdf8]' 
          : 'border-transparent hover:border-slate-800'}`}
    >
      <style>{`
        .vibe-card-premium {
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important;
        }
        .vibe-card-premium:hover {
          transform: translateY(-8px) scale(1.03) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(14,165,233,0.25) !important;
        }
        .vibe-card-premium:hover img {
          transform: scale(1.08) !important;
        }
        .vibe-card-selected {
          border: 3px solid #38bdf8 !important;
          box-shadow: 0 0 25px rgba(56,189,248,0.6), 0 20px 60px rgba(0,0,0,0.45) !important;
        }
        @keyframes vibe-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: vibe-shimmer 2s infinite linear;
        }
      `}</style>

      {!loaded && <div className="absolute inset-0 shimmer-bg z-10" />}
      
      <img 
        src={error ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" : image} 
        alt={label} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-[450ms] ease-out
          ${selected ? 'brightness-110 saturate-110' : 'brightness-90 filter grayscale-[10%] group-hover:grayscale-0'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <div 
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
        }}
      />
      {selected && (
        <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-color-dodge z-[6] pointer-events-none" />
      )}
      
      {/* Selection indicators (never overlap block text at bottom) */}
      <div className="absolute top-4 right-4 z-[15]">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${selected 
               ? 'bg-[#38bdf8] border-[#38bdf8] text-white scale-110 shadow-[0_0_12px_rgba(56,189,248,0.6)]' 
               : 'bg-black/40 border-white/15 text-white/50 scale-90 opacity-0 group-hover:opacity-100'}`}
         >
            <Check className="w-4 h-4 stroke-[4]" />
         </div>
      </div>
      
      {/* Cinematic typography block with drop shadows */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 select-none flex flex-col justify-end pointer-events-none">
         <h3 
           className="font-bold text-white uppercase tracking-wider mb-1"
           style={{
             fontSize: '1.4rem',
             textShadow: '0 2px 10px rgba(0,0,0,0.65)',
             letterSpacing: '1px'
           }}
         >
            {label}
         </h3>
         <p 
           className="text-white/95 line-clamp-2"
           style={{
             fontSize: '0.85rem',
             opacity: 0.9,
             lineHeight: '1.5',
             textShadow: '0 2px 10px rgba(0,0,0,0.65)'
           }}
         >
            {subLabel}
         </p>
      </div>
    </button>
  );
};

const CompanionCard = ({ selected, onClick, image, label, subLabel }: any) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[4/3] rounded-[28px] overflow-hidden companion-card-premium w-full text-left bg-slate-950 border-3 cursor-pointer select-none
        ${selected 
          ? 'companion-card-selected border-[#38bdf8]' 
          : 'border-transparent hover:border-slate-800'}`}
    >
      <style>{`
        .companion-card-premium {
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important;
        }
        .companion-card-premium:hover {
          transform: translateY(-8px) scale(1.03) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(14,165,233,0.25) !important;
        }
        .companion-card-premium:hover img {
          transform: scale(1.08) !important;
        }
        .companion-card-selected {
          border: 3px solid #38bdf8 !important;
          box-shadow: 0 0 25px rgba(56,189,248,0.6), 0 20px 60px rgba(0,0,0,0.45) !important;
        }
      `}</style>

      {!loaded && <div className="absolute inset-0 shimmer-bg z-10" />}
      
      <img 
        src={error ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" : image} 
        alt={label} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-[450ms] ease-out
          ${selected ? 'brightness-110 saturate-110' : 'brightness-90 filter grayscale-[10%] group-hover:grayscale-0'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <div 
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
        }}
      />
      {selected && (
        <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-color-dodge z-[6] pointer-events-none" />
      )}
      
      {/* Selection indicators */}
      <div className="absolute top-4 right-4 z-[15]">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${selected 
               ? 'bg-[#38bdf8] border-[#38bdf8] text-white scale-110 shadow-[0_0_12px_rgba(56,189,248,0.6)]' 
               : 'bg-black/40 border-white/15 text-white/50 scale-90 opacity-0 group-hover:opacity-100'}`}
         >
            <Check className="w-4 h-4 stroke-[4]" />
         </div>
      </div>
      
      {/* Cinematic typography block with drop shadows */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 select-none flex flex-col justify-end pointer-events-none">
         <h3 
           className="font-bold text-white uppercase tracking-wider mb-1"
           style={{
             fontSize: '1.4rem',
             textShadow: '0 2px 10px rgba(0,0,0,0.65)',
             letterSpacing: '1px'
           }}
         >
            {label}
         </h3>
         <p 
           className="text-white/95 line-clamp-2"
           style={{
             fontSize: '0.85rem',
             opacity: 0.9,
             lineHeight: '1.5',
             textShadow: '0 2px 10px rgba(0,0,0,0.65)'
           }}
         >
            {subLabel}
         </p>
      </div>
    </button>
  );
};

const MonthExperienceCard = ({ 
  month, 
  selected, 
  onClick, 
  locationScope, 
  intent 
}: { 
  month: TravelMonth; 
  selected: boolean; 
  onClick: () => void; 
  locationScope: LocationScope; 
  intent: UserIntent; 
  key?: React.Key;
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getVibeCategory = (intent: UserIntent): 'leisure' | 'active' | 'heritage' | 'culinary' | 'default' => {
    if (intent === UserIntent.Relaxation || intent === UserIntent.Luxury) return 'leisure';
    if (intent === UserIntent.Adventure || intent === UserIntent.Nature) return 'active';
    if (intent === UserIntent.Spiritual || intent === UserIntent.Culture) return 'heritage';
    if (intent === UserIntent.Food || intent === UserIntent.Nightlife) return 'culinary';
    return 'default';
  };

  const scopeKey = locationScope === LocationScope.India ? 'india' : 'global';
  const monthInfo = SEASONAL_DATA[scopeKey]?.[month] || SEASONAL_DATA.global[month];
  
  const category = getVibeCategory(intent);
  const imageUrl = monthInfo?.images[category] || monthInfo?.images.default || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative aspect-[4/5] rounded-[24px] overflow-hidden month-card-premium w-[220px] sm:w-full shrink-0 snap-center text-left bg-slate-950 border-3 cursor-pointer select-none transition-all duration-300
        ${selected 
          ? 'month-card-selected border-[#38bdf8]' 
          : 'border-transparent hover:border-slate-800'}`}
    >
      <style>{`
        .month-card-premium {
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
        .month-card-premium:hover {
          transform: translateY(-10px) scale(1.03) !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(56,189,248,0.3) !important;
        }
        .month-card-premium:hover img {
          transform: scale(1.08) !important;
        }
        .month-card-selected {
          border: 3px solid #38bdf8 !important;
          box-shadow: 0 0 30px rgba(56,189,248,0.5), 0 20px 60px rgba(0,0,0,0.45) !important;
        }
        @keyframes month-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-month-bg {
          background: linear-gradient(90deg, #090d16 25%, #151d30 50%, #090d16 75%);
          background-size: 200% 100%;
          animation: month-shimmer 2s infinite linear;
        }
      `}</style>

      {!loaded && <div className="absolute inset-0 shimmer-month-bg z-10" />}

      <img 
        src={error ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" : imageUrl} 
        alt={month} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-500 ease-out
          ${selected ? 'brightness-110 saturate-110 scale-105' : 'brightness-[0.72] group-hover:brightness-[0.82]'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      
      {/* Cinematic Gradient Overlay */}
      <div 
        className="absolute inset-y-0 inset-x-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)'
        }}
      />

      {selected && (
        <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-color-dodge z-[6] pointer-events-none" />
      )}

      {/* Premium Selection Indicator in Corner */}
      <div className="absolute top-4 right-4 z-[15]">
         <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${selected 
               ? 'bg-[#38bdf8] border-[#38bdf8] text-white scale-110 shadow-[0_0_12px_rgba(56,189,248,0.6)] animate-pulse' 
               : 'bg-black/40 border-white/10 text-white/40 scale-90 opacity-0 group-hover:opacity-100'}`}
         >
            <Check className="w-3.5 h-3.5 stroke-[4]" />
         </div>
      </div>

      {/* Card Content block */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 select-none flex flex-col justify-end pointer-events-none h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent">
         {/* Season Tag */}
         <div className="mb-1 pointer-events-none">
           <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider">
              {monthInfo?.season}
           </span>
         </div>
         
         {/* Month Title */}
         <h3 
           className="font-extrabold text-white uppercase tracking-wider pointer-events-none"
           style={{
             fontSize: '1.25rem',
             textShadow: '0 2px 10px rgba(0,0,0,0.8)',
             letterSpacing: '1px'
           }}
         >
            {month}
         </h3>

         {/* Subtitle */}
         <p 
           className="text-white/80 text-[11px] leading-snug my-1 h-8 line-clamp-2 pointer-events-none"
           style={{
             textShadow: '0 1px 6px rgba(0,0,0,0.8)'
           }}
         >
            {monthInfo?.subtitle}
         </p>

         {/* Experience Tags */}
         <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/10 pointer-events-none">
           {monthInfo?.tags.slice(0, 2).map((tag: string) => (
             <span key={tag} className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wide">
               • {tag}
             </span>
           ))}
         </div>
      </div>
    </button>
  );
};

const getTransportImageData = (
  transport: TransportPreference,
  locationScope?: LocationScope,
  intent?: UserIntent
) => {
  switch (transport) {
    case TransportPreference.Flight: {
      return {
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Commercial Passenger Flight",
        tagline: "SKY VIEWS & SPEEDY ARRIVAL",
        alt: "Large white passenger commercial jet airplane flying in broad daylight, highly visible and prominent",
        icon: Plane
      };
    }
    case TransportPreference.Train: {
      return {
        image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1000&q=85",
        subtitle: "High-Speed Bullet Train",
        tagline: "SCENIC RAILWAYS & COZY COMFORT",
        alt: "Sleek modern Japanese bullet train front diagonal view traveling fast on railway tracks in daytime",
        icon: Train
      };
    }
    case TransportPreference.Bus: {
      return {
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Luxury Tourist Coach",
        tagline: "LOCAL HIGHWAYS & EASY RECLINERS",
        alt: "Bright red travel tour bus on a sunny street, easily recognizable transit coach",
        icon: Bus
      };
    }
    case TransportPreference.RoadTrip: {
      return {
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Personal Car Adventure",
        tagline: "WINDING ROADS & TOTAL FREEDOM",
        alt: "Bright red SUV car driving down a beautiful winding road in scenic green forest",
        icon: Map
      };
    }
    case TransportPreference.NoPreference:
    default: {
      return {
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Any Transit Available",
        tagline: "ALL TRANSPORT OPTIONS MATCHED",
        alt: "Flat lay travel planning desk with map, passport, magnifying glass, camera, and compass representing flexible multi-modal planning",
        icon: Sparkles
      };
    }
  }
};

const getAccommodationImageData = (
  accommodation: AccommodationPreference,
  locationScope: LocationScope,
  intent: UserIntent
) => {
  switch (accommodation) {
    case AccommodationPreference.Budget: {
      return {
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Cozy Modern Essentials",
        tagline: "Smart Budget • Prime Access",
        icon: Wallet
      };
    }
    case AccommodationPreference.MidRange: {
      return {
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Premium Boutique Comfort",
        tagline: "Polished Interior • Central Local",
        icon: Hotel
      };
    }
    case AccommodationPreference.Luxury: {
      const isIndia = locationScope === LocationScope.India;
      return {
        image: isIndia
          ? "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=85"
          : "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
        subtitle: isIndia ? "Heritage Royal Palace" : "Private Luxury Sanctuary",
        tagline: isIndia ? "Palatial Rooms • Mythic Royalty" : "Infinity Pools • Coral Lagoons",
        icon: Sparkles
      };
    }
    case AccommodationPreference.Hostel: {
      return {
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Social Backpacker Hub",
        tagline: "Lively Atmosphere • Shared Stories",
        icon: Home
      };
    }
    case AccommodationPreference.Homestay: {
      return {
        image: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Charming Warm Neighborhood",
        tagline: "Welcoming Local Host • Quiet Retreat",
        icon: Heart
      };
    }
    case AccommodationPreference.Resort: {
      const isMountain = intent === UserIntent.Nature || intent === UserIntent.Adventure;
      return {
        image: isMountain
          ? "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=85"
          : "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Tranquil Leisure Haven",
        tagline: "Indulgent Spas • Beachfront Bliss",
        icon: Tent
      };
    }
    case AccommodationPreference.Wellness: {
      return {
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Mind-Body Sanctuary",
        tagline: "Holistic Meditation • Hot Springs",
        icon: Heart
      };
    }
    default: {
      return {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
        subtitle: "Curated Travel Stay",
        tagline: "Superb Amenities • Ease Of Mind",
        icon: Hotel
      };
    }
  }
};

const TransportPreferenceCard = ({
  val,
  selected,
  onClick,
  locationScope,
  intent
}: {
  val: TransportPreference;
  selected: boolean;
  onClick: () => void;
  locationScope: LocationScope;
  intent: UserIntent;
  key?: React.Key;
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const data = getTransportImageData(val, locationScope, intent);
  const Icon = data.icon;

  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative w-full h-[180px] rounded-[24px] overflow-hidden transport-card-premium bg-slate-950 border border-transparent cursor-pointer select-none transition-all duration-300
        ${selected ? 'transport-card-selected' : 'hover:border-slate-800'}`}
    >
      <style>{`
        .transport-card-premium {
          height: 180px !important;
          border-radius: 24px !important;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .transport-card-premium:hover {
          transform: translateY(-6px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.45), 0 0 30px rgba(56,189,248,0.3) !important;
          border-color: rgba(56,189,248,0.4) !important;
        }
        .transport-card-premium:hover img {
          transform: scale(1.06) !important;
          filter: brightness(1) saturate(110%) !important;
        }
        .transport-card-selected {
          border: 2px solid #38bdf8 !important;
          box-shadow: 0 0 30px rgba(56,189,248,0.35), 0 15px 40px rgba(0,0,0,0.55) !important;
          transform: translateY(-4px) scale(1.02) !important;
        }
      `}</style>

      {!loaded && <div className="absolute inset-0 shimmer-card-bg z-10 font-sans" />}

      <img 
        src={error ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" : data.image} 
        alt={data.alt} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center block transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${selected ? 'brightness-105 saturate-105 scale-102' : 'brightness-90 group-hover:brightness-95'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      
      {/* Cinematic Gradient Overlay */}
      <div 
        className="absolute inset-y-0 inset-x-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 100%)'
        }}
      />

      {selected && (
        <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-color-dodge z-[6] pointer-events-none" />
      )}

      {/* Premium Selection Indicator in Corner */}
      <div className="absolute top-4 right-4 z-[15]">
         <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${selected 
               ? 'bg-[#38bdf8] border-[#38bdf8] text-white scale-110 shadow-[0_0_12px_rgba(56,189,248,0.6)] animate-pulse' 
               : 'bg-black/40 border-white/10 text-white/40 scale-90 opacity-0 group-hover:opacity-100'}`}
         >
            <Check className="w-3.5 h-3.5 stroke-[4]" />
         </div>
      </div>

      {/* Card Content block (bottom-left placement) */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 select-none flex flex-col justify-end pointer-events-none h-full text-left">
         {/* Icon Tag Pill label */}
         <div className="mb-2 pointer-events-none flex items-center gap-1.5 self-start bg-black/45 hover:bg-black/65 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
           <Icon className="w-3.5 h-3.5 text-[#38bdf8]" />
           <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">
              {val}
           </span>
         </div>
         
         {/* Main Title */}
         <h3 
           className="font-black text-white uppercase tracking-wider pointer-events-none leading-none mb-1 text-xl sm:text-2xl"
           style={{
             textShadow: '0 2px 8px rgba(0,0,0,0.95)',
           }}
         >
            {val}
         </h3>

         {/* Short Description */}
         <p 
           className="text-white/85 text-xs sm:text-sm leading-snug my-1 h-5 line-clamp-1 pointer-events-none font-medium"
           style={{
             textShadow: '0 1px 4px rgba(0,0,0,0.85)'
           }}
         >
            {data.subtitle}
         </p>

         {/* Highlight Tagline */}
         <div className="flex flex-wrap gap-1 mt-1.5 pointer-events-none self-start">
            <span className="text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-widest bg-black/45 px-2.5 py-0.5 rounded border border-sky-500/10">
              {data.tagline}
            </span>
         </div>
      </div>
    </button>
  );
};

const AccommodationPreferenceCard = ({
  val,
  selected,
  onClick,
  locationScope,
  intent
}: {
  val: AccommodationPreference;
  selected: boolean;
  onClick: () => void;
  locationScope: LocationScope;
  intent: UserIntent;
  key?: React.Key;
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const data = getAccommodationImageData(val, locationScope, intent);
  const Icon = data.icon;

  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative aspect-[14/9] rounded-[24px] overflow-hidden accommodation-card-premium w-[240px] md:w-full shrink-0 snap-center text-left bg-slate-950 border-3 cursor-pointer select-none transition-all duration-300
        ${selected 
          ? 'accommodation-card-selected border-[#38bdf8]' 
          : 'border-transparent hover:border-slate-800'}`}
    >
      <style>{`
        .accommodation-card-premium {
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
        .accommodation-card-premium:hover {
          transform: translateY(-8px) scale(1.03) !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.45), 0 0 40px rgba(56,189,248,0.25) !important;
        }
        .accommodation-card-premium:hover img {
          transform: scale(1.08) !important;
        }
        .accommodation-card-selected {
          border: 3px solid #38bdf8 !important;
          box-shadow: 0 0 35px rgba(56,189,248,0.6), 0 25px 70px rgba(0,0,0,0.5) !important;
        }
      `}</style>

      {!loaded && <div className="absolute inset-0 shimmer-card-bg z-10 font-sans" />}

      <img 
        src={error ? "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" : data.image} 
        alt={val} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-500 ease-out
          ${selected ? 'brightness-110 saturate-110 scale-105' : 'brightness-[0.7] group-hover:brightness-[0.8]'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      
      {/* Cinematic Gradient Overlay */}
      <div 
        className="absolute inset-y-0 inset-x-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)'
        }}
      />

      {selected && (
        <div className="absolute inset-0 bg-[#38bdf8]/10 mix-blend-color-dodge z-[6] pointer-events-none" />
      )}

      {/* Premium Selection Indicator in Corner */}
      <div className="absolute top-4 right-4 z-[15]">
         <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${selected 
               ? 'bg-[#38bdf8] border-[#38bdf8] text-white scale-110 shadow-[0_0_12px_rgba(56,189,248,0.6)] animate-pulse' 
               : 'bg-black/40 border-white/10 text-white/40 scale-90 opacity-0 group-hover:opacity-100'}`}
         >
            <Check className="w-3.5 h-3.5 stroke-[4]" />
         </div>
      </div>

      {/* Card Content block */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 select-none flex flex-col justify-end pointer-events-none h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent">
         {/* Icon Tag */}
         <div className="mb-1 pointer-events-none flex items-center gap-1.5">
           <Icon className="w-3.5 h-3.5 text-[#38bdf8]" />
           <span className="inline-block px-1.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider">
              {val}
           </span>
         </div>
         
         {/* Title */}
         <h3 
           className="font-extrabold text-white uppercase tracking-wider pointer-events-none text-shadow"
           style={{
             fontSize: '1.1rem',
             textShadow: '0 2px 10px rgba(0,0,0,0.8)',
             letterSpacing: '1px'
           }}
         >
            {val}
         </h3>

         {/* Subtitle */}
         <p 
           className="text-white/85 text-[12px] leading-snug my-1 h-5 line-clamp-1 pointer-events-none font-medium"
           style={{
             textShadow: '0 1px 6px rgba(0,0,0,0.8)'
           }}
         >
            {data.subtitle}
         </p>

         {/* Tagline text */}
         <div className="flex flex-wrap gap-1 mt-1 pt-1 border-t border-white/10 pointer-events-none">
            <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wide">
              {data.tagline}
            </span>
         </div>
      </div>
    </button>
  );
};

export default IntentForm;

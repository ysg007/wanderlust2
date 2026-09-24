import React, { useState, useEffect } from 'react';
import { TripPlan, DayPlan, ItineraryItem } from '../types';
import { getSmartImage } from '../services/imageEngine';
import { 
  MapPin, ShieldCheck, DollarSign, Clock, 
  Coffee, Sun, Footprints, AlertTriangle,
  Pencil, Save, X, RefreshCw, Navigation, Loader2, ArrowLeft, Map, Globe, Link as LinkIcon, Sparkles,
  Plus, Trash2, Utensils, Ticket, Sunset, Car, Camera, CloudSun, ChevronUp, ChevronDown, CheckCircle2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import LocalGuideView from './LocalGuideView';

interface TripDashboardProps {
  plan: TripPlan;
  onPlanUpdate: (plan: TripPlan) => void;
  onBack: () => void;
  onExplore: (query: string) => void;
}

interface ItineraryCardProps {
  item: ItineraryItem;
  dayIndex: number;
  itemIndex: number;
  isEditing: boolean;
  currency: string;
  updateItineraryItem: (dayIndex: number, itemIndex: number, field: keyof ItineraryItem, value: any) => void;
  removeItineraryItem?: (dayIndex: number, itemIndex: number) => void;
  formatCurrency: (amount: number | undefined | null) => string;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ 
  item, 
  dayIndex, 
  itemIndex,
  isEditing,
  currency,
  updateItineraryItem,
  removeItineraryItem,
  formatCurrency
}) => {
  const [isSelected, setIsSelected] = useState(true);
  
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'food':
        return {
          icon: <Utensils className="w-5 h-5" />,
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-100 dark:border-orange-900/30'
        };
      case 'relax':
        return {
          icon: <Sunset className="w-5 h-5" />,
          bg: 'bg-rose-50 dark:bg-rose-900/20',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-100 dark:border-rose-900/30'
        };
      case 'travel':
        return {
          icon: <Car className="w-5 h-5" />,
          bg: 'bg-indigo-50 dark:bg-indigo-900/20',
          text: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-100 dark:border-indigo-900/30'
        };
      case 'activity':
      default:
        return {
          icon: <Ticket className="w-5 h-5" />,
          bg: 'bg-brand-50 dark:bg-brand-900/20',
          text: 'text-brand-600 dark:text-brand-400',
          border: 'border-brand-100 dark:border-brand-900/30'
        };
    }
  };

  const style = getTypeStyles(item.type);

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-brand-300 dark:border-brand-700 shadow-lg flex flex-col gap-4 relative animate-fade-in">
        <div className="flex gap-3 items-start">
          {/* Time Input */}
          <div className="flex flex-col gap-1 w-20 shrink-0">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</label>
              <input 
                  type="text"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-bold bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
                  value={item.time}
                  onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'time', e.target.value)}
                  placeholder="00:00"
              />
          </div>

          {/* Type Select */}
          <div className="flex flex-col gap-1 w-28 shrink-0">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                    className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-bold bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors appearance-none"
                    value={item.type}
                    onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'type', e.target.value)}
                >
                    <option value="activity">Activity</option>
                    <option value="food">Food</option>
                    <option value="relax">Relax</option>
                    <option value="travel">Travel</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                   <ChevronDownIcon className="w-3 h-3" />
                </div>
              </div>
          </div>

          {/* Activity Name Input */}
          <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activity Name</label>
              <input 
                  type="text"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg font-bold text-gray-900 dark:text-white text-sm bg-gray-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
                  value={item.activity}
                  onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'activity', e.target.value)}
                  placeholder="e.g. Visit Eiffel Tower"
              />
          </div>
          
          {/* Delete Button */}
          {removeItineraryItem && (
            <button 
                onClick={() => removeItineraryItem(dayIndex, itemIndex)}
                className="mt-6 p-2 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-xl transition-colors"
                title="Delete Activity"
            >
                <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Description Input */}
        <div className="flex flex-col gap-1">
           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
           <textarea 
              className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors resize-none"
              rows={2}
              value={item.description}
              onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'description', e.target.value)}
              placeholder="What are we doing here?"
           />
        </div>

        {/* Location & Cost Inputs */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
              <input 
                  type="text"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
                  value={item.location}
                  onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'location', e.target.value)}
                  placeholder="Address or Area"
              />
          </div>
           <div className="flex flex-col gap-1 w-32">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cost ({currency})</label>
              <input 
                  type="number"
                  className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-lg text-xs bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-brand-500 focus:outline-none transition-colors"
                  value={item.costEstimate}
                  onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'costEstimate', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
              />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 relative group">
       {/* Timeline Node */}
       <div className="flex flex-col items-center mt-1">
          <div className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10 transition-all duration-300 ${
            isSelected 
              ? `${style.bg.replace('/20', '')} ${style.text.replace('text-', 'bg-')} scale-110` 
              : 'bg-gray-200 dark:bg-slate-700 scale-90'
          }`}></div>
          <div className="w-0.5 grow bg-gray-200 dark:bg-slate-700 mt-2 mb-2 group-last:hidden"></div>
       </div>

       {/* Card Content & Interaction */}
       <div 
         onClick={() => !isEditing && setIsSelected(!isSelected)}
         className={`flex-1 p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col ${
           isEditing ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1'
         } ${
           isSelected 
             ? `bg-white dark:bg-slate-800 ${style.border} border-opacity-90 shadow hover:shadow-lg hover:border-emerald-400` 
             : 'bg-gray-50/50 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 opacity-60 hover:opacity-100'
         }`}
       >
          <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
                <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                  isSelected 
                    ? 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700' 
                    : 'text-gray-400 bg-gray-150/50 dark:bg-slate-800'
                }`}>
                   {item.time}
                </span>
                <h4 className={`font-bold text-lg transition-all ${
                  isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 line-through decoration-gray-400/50'
                }`}>
                  {item.activity}
                </h4>
             </div>
             <div className="flex items-center gap-2">
               {isSelected ? (
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 px-2.5 py-1 rounded-lg flex items-center gap-1 uppercase">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 stroke-[3]" >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                       </svg>
                       Selected
                    </span>
                    <div className={`p-2 rounded-xl transition-all ${style.bg} ${style.text}`}>
                       {style.icon}
                    </div>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black tracking-widest text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg uppercase">
                       Skipped
                    </span>
                    <div className="p-2 rounded-xl bg-gray-100/60 dark:bg-slate-800 text-gray-300">
                       {style.icon}
                    </div>
                  </div>
               )}
            </div>
          </div>

          <p className={`text-sm leading-relaxed mb-6 font-medium italic transition-colors ${
            isSelected ? 'text-gray-650 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
          }`}>
             "{item.description}"
          </p>

          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest pt-4 border-t border-gray-50 dark:border-slate-700/40">
             <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-xl border border-gray-100 dark:border-slate-700">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{item.location}</span>
             </div>
             {isSelected && (
               <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-950/10 ml-auto select-none">
                  <DollarSign className="w-3 h-3" />
                  <span>Est. {formatCurrency(item.costEstimate)}</span>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

// Helper component for chevron in select
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

const TripDashboard: React.FC<TripDashboardProps> = ({ plan, onPlanUpdate, onBack, onExplore }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'guide'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<TripPlan>(plan);
  const [showSources, setShowSources] = useState(false);
  
  // Location Logic
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Currency Logic
  const [showInINR, setShowInINR] = useState(false);
  const isForeign = plan.currency !== 'INR';

  const formatCurrency = (amount: number | undefined | null) => {
    // Safely handle undefined/null amounts
    const val = (typeof amount === 'number' && !isNaN(amount)) ? amount : 0;

    if (showInINR && isForeign) {
      const rate = plan.exchangeRateToINR || 1;
      const converted = Math.round(val * rate);
      return `₹${converted.toLocaleString('en-IN')}`;
    }
    
    // Fallback if currency is missing from plan
    const curr = plan.currency || 'USD';
    return `${val.toLocaleString()} ${curr}`;
  };

  // Sync editedPlan if prop plan changes (e.g. from parent reset), but only if not currently editing
  useEffect(() => {
    if (!isEditing) {
      setEditedPlan(plan);
    }
  }, [plan, isEditing]);

  const handleSave = () => {
    onPlanUpdate(editedPlan);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  const updateItineraryItem = (dayIndex: number, itemIndex: number, field: keyof ItineraryItem, value: any) => {
    const newItinerary = [...editedPlan.itinerary];
    if (!newItinerary[dayIndex]) return;
    
    const day = { ...newItinerary[dayIndex] };
    const items = [...(day.items || [])];
    
    if (items[itemIndex]) {
        // Handle cost updates specially to update the total
        let newTotal = editedPlan.totalEstimatedCost;
        
        if (field === 'costEstimate') {
            const oldCost = items[itemIndex].costEstimate || 0;
            const newCost = typeof value === 'number' ? value : parseFloat(value) || 0;
            newTotal = newTotal - oldCost + newCost;
        }

        items[itemIndex] = { ...items[itemIndex], [field]: value };
        day.items = items;
        newItinerary[dayIndex] = day;
        
        setEditedPlan({ ...editedPlan, itinerary: newItinerary, totalEstimatedCost: newTotal });
    }
  };

  const addItineraryItem = (dayIndex: number) => {
    const newItinerary = [...editedPlan.itinerary];
    const day = { ...newItinerary[dayIndex] };
    day.items = [
      ...(day.items || []),
      {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
        time: "18:00",
        activity: "New Activity",
        location: "Location",
        description: "Tap edit to customize this activity.",
        costEstimate: 0,
        type: "activity" as const
      }
    ];
    newItinerary[dayIndex] = day;
    setEditedPlan({ ...editedPlan, itinerary: newItinerary });
  };

  const removeItineraryItem = (dayIndex: number, itemIndex: number) => {
    const newItinerary = [...editedPlan.itinerary];
    const day = { ...newItinerary[dayIndex] };
    const items = [...(day.items || [])];
    
    // Subtract removed item's cost from total
    const itemCost = items[itemIndex].costEstimate || 0;
    const newTotal = editedPlan.totalEstimatedCost - itemCost;
    
    items.splice(itemIndex, 1);
    day.items = items;
    newItinerary[dayIndex] = day;
    setEditedPlan({ ...editedPlan, itinerary: newItinerary, totalEstimatedCost: newTotal });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Unable to retrieve your location. Please check permissions.");
        setIsLocating(false);
      }
    );
  };

  const openDirections = () => {
      if (!userLocation) return;
      const origin = `${userLocation.lat},${userLocation.lng}`;
      const destination = encodeURIComponent(`${plan.destination}, ${plan.country}`);
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank');
  };

  const SafetyChart = ({ score }: { score: number }) => {
    const data = [
      { name: 'Safe', value: score },
      { name: 'Risk', value: 100 - score },
    ];
    // Dark mode compatible colors
    const COLORS = ['#10b981', '#334155']; // Emerald for safe, Slate-700 for remaining

    return (
      <div className="h-32 w-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`safety-cell-${index}`} fill={COLORS[index]} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{score}</span>
          <span className="text-[10px] text-gray-400 uppercase font-bold">Safety</span>
        </div>
      </div>
    );
  };

  const currentPlan = isEditing ? editedPlan : plan;

  return (
    <div className="pb-24 max-w-2xl mx-auto pt-4 px-4 sm:px-0">
      {/* Back Button */}
      <button 
           onClick={onBack}
           className="group mb-4 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors sm:ml-4"
        >
           <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform border border-gray-100 dark:border-slate-700">
             <ArrowLeft className="w-4 h-4" />
           </div>
           Back to Top Picks
      </button>

      {/* Header Image */}
      <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 relative overflow-hidden rounded-[2.5rem] shadow-xl border border-white/10 group">
        <img 
          src={getSmartImage('destination', plan.destination, plan.country)} 
          alt={plan.destination}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'; }}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95 animate-fade-in" />
        <div className="absolute bottom-0 left-0 w-full p-8">
           <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">{plan.destination}</h1>
           <p className="text-white/90 text-sm font-medium tracking-tight max-w-md line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{plan.country} • {plan.description}</p>
        </div>
      </div>

      {/* Tabs & Actions */}
      <div className="flex p-2 bg-white dark:bg-slate-900 sticky top-0 z-40 shadow-sm gap-2 transition-colors mt-4 rounded-xl items-center flex-wrap sm:flex-nowrap">
        <div className="flex flex-1 gap-2 bg-gray-50 dark:bg-slate-800 p-1 rounded-lg min-w-full sm:min-w-0">
            <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 font-medium text-sm rounded-md transition-all ${activeTab === 'overview' ? 'text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
            Overview
            </button>
            <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-2 font-medium text-sm rounded-md transition-all ${activeTab === 'itinerary' ? 'text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
            Itinerary
            </button>
            <button 
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 font-bold text-sm rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'guide' ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
            <Sparkles className="w-3 h-3" />
            Guide
            </button>
        </div>
        
        {/* Currency Toggle & Rate Display */}
        {isForeign && activeTab !== 'guide' && (
             <div className="flex items-center gap-2 ml-auto sm:ml-0">
                 <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Exchange Rate</span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700">
                        1 {plan.currency} ≈ ₹{plan.exchangeRateToINR}
                    </span>
                 </div>
                 <button 
                    onClick={() => setShowInINR(!showInINR)}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 border font-bold text-xs shadow-sm ${
                        showInINR 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                    }`}
                    title={`Switch to ${showInINR ? 'Local Currency' : 'INR'}`}
                 >
                    <RefreshCw className={`w-3.5 h-3.5 ${showInINR ? 'animate-spin-once' : ''}`} />
                    {showInINR ? 'INR' : plan.currency}
                 </button>
             </div>
        )}

        {/* Edit Actions */}
        {activeTab === 'itinerary' && (
            <div className="flex gap-2 ml-auto sm:ml-0">
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg font-semibold text-sm hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors flex items-center gap-2"
                    >
                        <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={handleCancel}
                            className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title="Cancel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
                        </button>
                    </>
                )}
            </div>
        )}
      </div>

      <div className="p-4 space-y-8">
        {/* Conversion Header (New) */}
        {activeTab !== 'guide' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-brand-100 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                   <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Ready to lock it in?</h3>
                   <p className="text-sm font-medium text-gray-500">Save this plan to your profile or export as PDF.</p>
                </div>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-6 py-4 bg-brand-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-105 transition-all">
                   Save Trip
                </button>
                <button className="flex-1 sm:flex-none px-6 py-4 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl font-black text-xs uppercase tracking-widest border border-gray-200 dark:border-slate-700 hover:border-brand-500 transition-all">
                   Export
                </button>
             </div>
          </div>
        )}

        {/* Local Guide Tab */}
        {activeTab === 'guide' && (
            <div className="h-full">
                <LocalGuideView plan={plan} />
            </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Safety Section */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Safety Score
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Based on current data & intent.</p>
                <div className="flex gap-2">
                   <button className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> SOS Info
                   </button>
                </div>
              </div>
              <SafetyChart score={plan.safetyScore} />
            </div>

            {/* Travel Distance / Location */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-brand-500" />
                    Distance & Directions
                </h3>
                
                {!userLocation ? (
                    <div className="flex flex-col items-start gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enable your location to plan your route to {plan.destination}.
                        </p>
                        {locationError && <p className="text-xs text-red-500">{locationError}</p>}
                        <button 
                            onClick={handleGetLocation}
                            disabled={isLocating}
                            className="mt-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                        >
                            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                            {isLocating ? "Locating..." : "Use Current Location"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                            <MapPin className="w-4 h-4" />
                            <span>Location detected successfully</span>
                        </div>
                        
                        <button 
                            onClick={openDirections}
                            className="w-full px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                            Get Directions to {plan.destination}
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                            Opens Google Maps with route from your current location.
                        </p>
                    </div>
                )}
            </div>



            {/* Hotel Rec */}
            {plan.hotelRecommendation && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h3 className="font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Where to Stay</h3>
                    <div className="flex gap-4 items-start">
                        <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-lg">
                            <MapPin className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-900 dark:text-brand-100 text-lg uppercase tracking-tight">{plan.hotelRecommendation.area}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic leading-relaxed">"{plan.hotelRecommendation.reason}"</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white mt-4 flex items-center gap-2">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Est. Cost</span>
                                {formatCurrency(plan.hotelRecommendation.avgPrice)} / night
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Budget Breakdown (Startup Grade) */}
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8">
               <div className="flex justify-between items-center">
                  <div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter">Budget Protocol</h3>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Intelligence Estimate</p>
                  </div>
                  <div className="text-right">
                     <h2 className="text-4xl font-black text-brand-400 leading-none">{formatCurrency(plan.totalEstimatedCost)}</h2>
                  </div>
               </div>

               <div className="space-y-4">
                  {Object.entries(plan.budgetBreakdown || {}).map(([key, rawValue]) => {
                    const value = rawValue as number;
                    return (
                      <div key={key} className="space-y-1">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span>{formatCurrency(value)}</span>
                         </div>
                         <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-brand-500 rounded-full" 
                               style={{ width: `${Math.min(100, (value / (plan.totalEstimatedCost || 1)) * 100)}%` }}
                            />
                         </div>
                      </div>
                    );
                  })}
               </div>

               <div className="flex gap-4 pt-4">
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Stay Index</span>
                     <span className="text-xl font-bold">{formatCurrency(plan.budgetBreakdown?.stay || 0)}</span>
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Food Index</span>
                     <span className="text-xl font-bold">{formatCurrency(plan.budgetBreakdown?.food || 0)}</span>
                  </div>
               </div>
            </div>

            {/* Google Search Sources (New Section) */}
            {plan.sourceUrls && plan.sourceUrls.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                    <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setShowSources(!showSources)}
                    >
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            Information Sources
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {showSources ? 'Hide' : 'Show'} {plan.sourceUrls.length} Sources
                        </span>
                    </div>
                    
                    {showSources && (
                        <div className="mt-4 space-y-2 animate-fade-in">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Data grounded by Google Search:
                            </p>
                            {plan.sourceUrls.slice(0, 5).map((url, idx) => {
                                let hostname = url;
                                try { hostname = new URL(url).hostname; } catch {}
                                return (
                                <a 
                                    key={`source-${idx}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-300 hover:underline truncate"
                                >
                                    <LinkIcon className="w-3 h-3 shrink-0" />
                                    {hostname}
                                </a>
                                );
                            })}
                            {plan.sourceUrls.length > 5 && (
                                <p className="text-xs text-gray-400 italic">...and {plan.sourceUrls.length - 5} more</p>
                            )}
                        </div>
                    )}
                </div>
            )}

          </div>
        )}
        
        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="space-y-8 animate-fade-in pb-20">
            
            {/* Climate Intelligence Alert */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 flex items-center gap-6 shadow-sm mb-8">
               <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-inner border border-amber-100">
                  <CloudSun className="w-8 h-8 text-amber-500" />
               </div>
               <div className="flex-1">
                  <h4 className="text-sm font-black text-amber-900 dark:text-amber-100 tracking-widest uppercase mb-1">Climate Intelligence</h4>
                  <p className="text-xs font-bold text-amber-700/80 dark:text-amber-400">
                     Outdoor activities on Day 2 & 3 might be affected by typical {plan.destination} monsoons in September. 
                     <button className="ml-2 underline font-black uppercase text-[10px] tracking-widest hover:text-amber-900 block mt-2 sm:inline sm:mt-0 transition-colors">Swap for Indoor Plans</button>
                  </p>
               </div>
            </div>
            
            {/* Edit Mode Total Cost Indicator */}
            {isEditing && (
                <div className="sticky top-16 z-30 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-brand-200 dark:border-brand-900 mb-6 flex justify-between items-center animate-fade-in-up">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Trip Cost</p>
                        <h3 className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                             {formatCurrency(currentPlan.totalEstimatedCost)}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-xs text-gray-400">Updates as you edit activities</span>
                         <button onClick={handleSave} className="text-xs font-bold text-brand-600 hover:underline mt-1">
                             Save Changes
                         </button>
                    </div>
                </div>
            )}

            {currentPlan.itinerary && currentPlan.itinerary.length > 0 ? (
                currentPlan.itinerary.map((dayPlan: DayPlan, dIdx: number) => (
                  <div key={`day-${dayPlan.day}-${dIdx}`} className="space-y-4">
                    <div className="sticky top-16 z-0 bg-gray-50 dark:bg-slate-900 py-2 transition-colors flex justify-between items-center">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md">
                            {dayPlan.day}
                          </span>
                          {dayPlan.theme}
                       </h3>
                    </div>
                    <div className="space-y-4 pl-4 border-l-2 border-dashed border-gray-200 dark:border-slate-700 ml-4 pb-4">
                      {dayPlan.items?.map((item, iIdx) => (
                        <ItineraryCard 
                          key={`item-${dIdx}-${iIdx}`} 
                          item={item} 
                          dayIndex={dIdx} 
                          itemIndex={iIdx}
                          isEditing={isEditing}
                          updateItineraryItem={updateItineraryItem}
                          removeItineraryItem={isEditing ? removeItineraryItem : undefined}
                          formatCurrency={formatCurrency}
                          currency={plan.currency}
                        />
                      ))}
                      {isEditing && (
                        <button 
                            onClick={() => addItineraryItem(dIdx)}
                            className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 dark:hover:border-brand-400 dark:hover:text-brand-400 transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Activity
                        </button>
                      )}
                    </div>
                  </div>
                ))
            ) : (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                    <p>No itinerary available for this trip yet.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDashboard;
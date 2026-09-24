import React, { useState } from 'react';
import { TripPlan, LocalGuideInsights, LocalGuideCategory } from '../types';
import { generateLocalGuideInsights, generateSpeech } from '../services/geminiService';
import { 
  Volume2, StopCircle, Utensils, Bed, Compass, Car, Gem, 
  ChevronDown, ChevronUp, Loader2, Sparkles, Navigation, AlertCircle, RefreshCw,
  ShieldAlert, Package, Info, MapPin
} from 'lucide-react';

interface LocalGuideViewProps {
  plan: TripPlan;
}

const LocalGuideView: React.FC<LocalGuideViewProps> = ({ plan }) => {
  const [insights, setInsights] = useState<LocalGuideInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudioSource, setActiveAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLocalGuideInsights(plan);
      setInsights(data);
      if (data.categories && data.categories.length > 0) {
        setExpandedCategory(data.categories[0].title);
      }
    } catch (error) {
      console.error(error);
      setError("We couldn't connect to the local guide network. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isPlaying && activeAudioSource) {
      activeAudioSource.stop();
      setIsPlaying(false);
      return;
    }

    try {
      const source = await generateSpeech(text);
      setActiveAudioSource(source);
      setIsPlaying(true);
      source.start();
      source.onended = () => setIsPlaying(false);
    } catch (error: any) {
      const msg = error?.message || "";
      setError(msg.includes("unavailable") || msg.includes("TTS") || msg.includes("503")
        ? "Voice guide is not available on your API tier. Read the insights below instead."
        : "Audio playback failed. Please try again.");
      console.error("Failed to play audio", error);
    }
  };

  const getCategoryTheme = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('food') || t.includes('eat') || t.includes('gourmet'))
      return { icon: <Utensils className="w-5 h-5" />, iconBg: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' };
    if (t.includes('stay') || t.includes('hotel') || t.includes('boutique') || t.includes('resort'))
      return { icon: <Bed className="w-5 h-5" />, iconBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' };
    if (t.includes('travel') || t.includes('transport') || t.includes('transit') || t.includes('getting'))
      return { icon: <Car className="w-5 h-5" />, iconBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' };
    if (t.includes('emergency') || t.includes('trust') || t.includes('safety') || t.includes('warning'))
      return { icon: <ShieldAlert className="w-5 h-5" />, iconBg: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' };
    return { icon: <Sparkles className="w-5 h-5" />, iconBg: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' };
  };

  if (error && !insights && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6 m-4 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-lg">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Couldn't Load Guide</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{error}</p>
        </div>
        <button onClick={handleGenerateInsights}
          className="px-6 py-3 bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-brand-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  if (!insights && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl m-4">
        <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/40 rounded-full flex items-center justify-center mb-8 animate-pulse-slow">
           <Sparkles className="w-12 h-12 text-brand-600" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Meet Your Personal Concierge</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-10 text-lg font-medium leading-relaxed">
          Unlock deep destination intelligence, neighborhood safety reports, and local transport hacks specifically for your vibe.
        </p>
        <button
          onClick={handleGenerateInsights}
          className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl shadow-brand-500/30 transition-all flex items-center gap-3 active:scale-95"
        >
          <Sparkles className="w-5 h-5" /> Initialize Guide Engine
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-8 h-full">
        <div className="relative">
           <div className="w-32 h-32 border-4 border-brand-100 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
               <Compass className="w-12 h-12 text-brand-600 animate-pulse" />
           </div>
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Grounding Search Active</h3>
           <p className="text-sm text-gray-500 font-mono tracking-widest">VERIFYING NEIGHBORHOOD SAFETY • FETCHING EMERGENCY CONTACTS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-4 sm:p-6 pb-32">
      {/* Concierge Intro */}
      <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
               <div className="inline-flex items-center gap-2 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30 text-[10px] font-black uppercase tracking-widest text-brand-400">
                  <Sparkles className="w-3 h-3" /> Concierge Briefing
               </div>
               <button 
                    onClick={() => handleSpeak(insights?.intro || "")}
                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                    {isPlaying ? <StopCircle className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
                </button>
            </div>
            <p className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white/90">
              {insights?.intro}
            </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Trust Blocks (Avoid & Gems) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20 space-y-4">
            <h3 className="text-lg font-black text-red-900 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
               <ShieldAlert className="w-5 h-5" /> Safety Warnings
            </h3>
            <div className="space-y-2">
               {plan.thingsToAvoid.map((t) => (
                  <div key={`avoid-${t.slice(0, 20)}`} className="flex gap-3 text-sm font-bold text-red-700 dark:text-red-300">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                     {t}
                  </div>
               ))}
            </div>
         </div>
         <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 space-y-4">
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
               <Gem className="w-5 h-5" /> Hidden Gems
            </h3>
            <div className="space-y-2">
               {plan.hiddenGems.map((t) => (
                  <div key={`gem-${t.slice(0, 20)}`} className="flex gap-3 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                     {t}
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Intelligence Categories */}
      <div className="space-y-4">
        {insights?.categories?.map((cat) => {
           const isExpanded = expandedCategory === cat.title;
           const theme = getCategoryTheme(cat.title);
           
           return (
             <div key={`cat-${cat.title}`} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-500">
                <button 
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.title)}
                    className={`w-full p-6 flex items-center justify-between group ${isExpanded ? 'bg-gray-50/50 dark:bg-slate-700/50' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl shadow-inner ${theme.iconBg}`}>
                            {theme.icon}
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tight uppercase">{cat.title}</h3>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                       {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                </button>
                
                {isExpanded && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 dark:bg-slate-900/10 border-t border-gray-50 dark:border-slate-700 animate-fade-in">
                        {cat.options?.map((option) => (
                            <div key={`opt-${cat.title}-${option.name}`} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col hover:border-brand-300 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">{option.name}</h4>
                                    <span className="text-[10px] font-black px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded uppercase">
                                        {option.priceRange}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 flex-1 italic">
                                    "{option.description}"
                                </p>
                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50 dark:border-slate-700">
                                   <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">
                                      BEST FOR: {option.bestFor}
                                   </span>
                                   <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                                      <Sparkles className="w-4 h-4 text-orange-500" /> {option.rating}
                                   </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
           );
        })}
      </div>

      {/* Packing Summary */}
      <div className="bg-sky-50 dark:bg-sky-900/10 p-8 rounded-[2.5rem] border border-sky-100 dark:border-sky-900/20">
         <div className="flex items-center gap-4 mb-8">
            <div className="bg-sky-600 p-4 rounded-2xl shadow-lg shadow-sky-600/20">
               <Package className="w-6 h-6 text-white" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Smart Packing Guide</h3>
               <p className="text-sm font-bold text-sky-600 dark:text-sky-400">CURATED FOR {plan.destination}</p>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plan.packingList.map((item) => (
               <div key={`pack-${item}`} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-sky-100 dark:border-sky-800 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {item}
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default LocalGuideView;

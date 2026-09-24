import React, { useState } from 'react';
import { DestinationOption } from '../types';
import { getSmartImage } from '../services/imageEngine';
import {
  MapPin, ArrowRight, ArrowLeft, CloudSun, Users as UsersIcon,
  ShieldCheck, TrendingUp, Star, Clock, Camera, Globe, Zap,
  ThumbsUp, Wind, Thermometer, DollarSign, Info, X
} from 'lucide-react';

interface DestinationSelectionProps {
  options: DestinationOption[];
  onSelect: (option: DestinationOption) => void;
  onBack: () => void;
}

// Verified real Unsplash photo IDs per destination keyword
const DESTINATION_HERO_IMAGES: Record<string, string> = {
  'goa':          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=90',
  'kerala':       'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=90',
  'munnar':       'https://images.unsplash.com/photo-1593693411515-c202e974eb05?auto=format&fit=crop&w=1400&q=90',
  'alleppey':     'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=90',
  'rajasthan':    'https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1400&q=90',
  'jaipur':       'https://images.unsplash.com/photo-1477584308802-e9cb72a4e2ef?auto=format&fit=crop&w=1400&q=90',
  'udaipur':      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=90',
  'ladakh':       'https://images.unsplash.com/photo-1596120206411-bd56a8cf1031?auto=format&fit=crop&w=1400&q=90',
  'leh':          'https://images.unsplash.com/photo-1596120206411-bd56a8cf1031?auto=format&fit=crop&w=1400&q=90',
  'himachal':     'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=90',
  'manali':       'https://images.unsplash.com/photo-1617387399813-f43e1d7cf9d5?auto=format&fit=crop&w=1400&q=90',
  'dharamshala':  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=90',
  'andaman':      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=90',
  'havelock':     'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=90',
  'nicobar':      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90',
  'rishikesh':    'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?auto=format&fit=crop&w=1400&q=90',
  'varanasi':     'https://images.unsplash.com/photo-1561361058-c24e021e858b?auto=format&fit=crop&w=1400&q=90',
  'kashmir':      'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=1400&q=90',
  'srinagar':     'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=1400&q=90',
  'coorg':        'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=1400&q=90',
  'ooty':         'https://images.unsplash.com/photo-1589136775550-189338a9aa4c?auto=format&fit=crop&w=1400&q=90',
  'hampi':        'https://images.unsplash.com/photo-1600100397608-f010e5218dc3?auto=format&fit=crop&w=1400&q=90',
  'bali':         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=90',
  'maldives':     'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=90',
  'paris':        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=90',
  'tokyo':        'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1400&q=90',
  'dubai':        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90',
  'singapore':    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=90',
  'thailand':     'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=90',
  'bangkok':      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=90',
  'switzerland':  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=90',
  'new york':     'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1400&q=90',
  'london':       'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=1400&q=90',
  'rome':         'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=90',
  'barcelona':    'https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=1400&q=90',
  'sydney':       'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=90',
  'agra':         'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=90',
  'mumbai':       'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=90',
  'delhi':        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=90',
  'spiti':        'https://images.unsplash.com/photo-1620054236968-fd25d4817d2a?auto=format&fit=crop&w=1400&q=90',
  'sikkim':       'https://images.unsplash.com/photo-1604328471151-b52226907017?auto=format&fit=crop&w=1400&q=90',
  'meghalaya':    'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=1400&q=90',
};

function getDestinationImage(name: string, country: string, fallbackUrl?: string): string {
  const lower = (name + ' ' + country).toLowerCase();
  for (const key of Object.keys(DESTINATION_HERO_IMAGES)) {
    if (lower.includes(key)) return DESTINATION_HERO_IMAGES[key];
  }
  if (fallbackUrl) return fallbackUrl;
  return getSmartImage('destination', name, country);
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80';

function safeImg(src: string): string { return src || FALLBACK_IMAGE; }

const CrowdBadge = ({ level }: { level: 'Low' | 'Moderate' | 'Peak' }) => {
  const styles = {
    Low:      'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    Moderate: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    Peak:     'bg-rose-500/20 text-rose-300 border-rose-400/30',
  };
  const dots = { Low: 'bg-emerald-400', Moderate: 'bg-amber-400', Peak: 'bg-rose-400' };
  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${styles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level]}`} />
      {level === 'Peak' ? 'Busy Season' : `${level} Crowds`}
    </span>
  );
};

const MatchRing = ({ score }: { score: number }) => {
  const color = score >= 95 ? '#10b981' : score >= 85 ? '#3b82f6' : '#f59e0b';
  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4"/>
          <circle
            cx="32" cy="32" r="26" fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - score / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-black text-sm leading-none">{score}%</span>
          <span className="text-white/70 text-[8px] font-bold uppercase leading-none mt-0.5">Match</span>
        </div>
      </div>
    </div>
  );
};

const DestinationCard: React.FC<{ option: DestinationOption; onSelect: () => void; onDetail: () => void }> = ({ option, onSelect, onDetail }) => {
  const [imgSrc, setImgSrc] = useState(() => getDestinationImage(option.name, option.country, option.imageUrl));
  const score = option.matchScore || 90;
  const crowdLevel = (option.crowdLevel || 'Moderate') as 'Low' | 'Moderate' | 'Peak';
  const accentColor = score >= 95 ? 'from-emerald-500' : score >= 85 ? 'from-brand-500' : 'from-amber-500';

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-[2rem] shadow-xl border border-gray-100/80 dark:border-slate-700/60 overflow-hidden hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer">
      {/* Image */}
      <div className="h-60 relative overflow-hidden">
        <MatchRing score={score} />
        <img
          src={safeImg(imgSrc)}
          alt={`${option.name}, ${option.country}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Weather pill */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
          <CloudSun className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white text-[11px] font-bold">{option.weather?.temp}</span>
          <span className="text-white/50 text-[10px]">•</span>
          <span className="text-white/80 text-[10px] font-medium">{option.weather?.condition}</span>
        </div>

        {/* Destination name */}
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xl mb-1.5">
            {option.name}
          </h3>
          <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-brand-400" />
            <span>{option.country}</span>
          </div>
        </div>

        {/* Accent bar */}
        <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${accentColor} to-transparent opacity-80`} />
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Match reasons */}
        <div className="flex flex-wrap gap-1.5">
          {option.matchReasons?.slice(0, 3).map((reason, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <CheckIcon className="w-2.5 h-2.5" />{reason}
            </span>
          ))}
        </div>

        {/* Crowd + Safety */}
        <div className="flex items-center justify-between">
          <CrowdBadge level={crowdLevel} />
          <div className="flex items-center gap-1.5 text-[11px] font-black text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-gray-900 dark:text-white">{option.safetyScore}</span>
            <span className="text-gray-400">/100</span>
          </div>
        </div>

        {/* Highlight */}
        <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2 border-l-2 border-brand-300/50 pl-3">
          "{option.highlightActivity}"
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-slate-700/60 flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Est. Total</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              ₹{option.estimatedTotalCost?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onDetail(); }}
              className="px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className="px-5 py-2.5 bg-slate-900 dark:bg-brand-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-brand-700 dark:hover:bg-brand-500 transition-all flex items-center gap-1.5 shadow-lg shadow-black/10"
            >
              Plan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailModal: React.FC<{ option: DestinationOption; onClose: () => void; onSelect: () => void }> = ({ option, onClose, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(() => getDestinationImage(option.name, option.country, option.imageUrl));

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="h-72 sm:h-80 relative shrink-0">
          <img
            src={safeImg(imgSrc)}
            className="w-full h-full object-cover"
            alt={option.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">{option.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-white/70 text-xs font-bold uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />{option.country}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="px-2.5 py-1 bg-brand-500/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-400/30">
                    {option.matchScore}% Match
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px] font-black uppercase mb-1">Est. Budget</p>
                <p className="text-2xl font-black text-white">₹{option.estimatedTotalCost?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Stats bar */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-slate-700 border-b border-gray-100 dark:border-slate-700">
            {[
              { icon: <Thermometer className="w-4 h-4 text-orange-500" />, label: 'Weather', value: option.weather?.temp || 'Seasonal' },
              { icon: <UsersIcon className="w-4 h-4 text-brand-500" />, label: 'Crowds', value: option.crowdLevel || 'Moderate' },
              { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'Safety', value: `${option.safetyScore}/100` },
            ].map((stat, i) => (
              <div key={i} className="py-4 flex flex-col items-center gap-1">
                {stat.icon}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Description */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" /> About This Destination
              </h4>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{option.description || `${option.name} is a remarkable destination in ${option.country}, offering experiences that perfectly match your travel style — from breathtaking landscapes and rich local culture to unforgettable cuisine and warm hospitality.`}</p>
            </div>

            {/* Why picked */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-500" /> Why We Picked This For You
              </h4>
              <div className="space-y-2">
                {option.matchReasons?.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight activity */}
            <div className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-brand-100 dark:border-brand-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-brand-500" />
                <h4 className="text-xs font-black uppercase text-brand-600 dark:text-brand-400 tracking-widest">Signature Experience</h4>
              </div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-200 italic leading-relaxed">
                "{option.highlightActivity}"
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
          >
            Back to Feed
          </button>
          <button
            onClick={onSelect}
            className="flex-[2] py-4 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 dark:shadow-brand-500/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Build Full Itinerary <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DestinationSelection: React.FC<DestinationSelectionProps> = ({ options, onSelect, onBack }) => {
  const [detailOption, setDetailOption] = useState<DestinationOption | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fade-in pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-100 dark:bg-brand-900/40 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                Intelligence Feed
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">
                {options?.length || 0} destinations • 420+ variables analyzed
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-200 dark:border-slate-700 hover:border-brand-400 hover:text-brand-600 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Refine Search
        </button>
      </div>

      {/* Sort indicator */}
      <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        Sorted by AI match score
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {options?.map((option, i) => (
          <div key={option.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <DestinationCard
              option={option}
              onSelect={() => onSelect(option)}
              onDetail={() => setDetailOption(option)}
            />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-12 font-medium">
        Scores based on your preferences, season, budget, and travel style · Updated in real-time
      </p>

      {/* Detail Modal */}
      {detailOption && (
        <DetailModal
          option={detailOption}
          onClose={() => setDetailOption(null)}
          onSelect={() => { setDetailOption(null); onSelect(detailOption); }}
        />
      )}
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default DestinationSelection;

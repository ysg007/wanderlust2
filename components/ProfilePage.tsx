import React, { useState, useRef } from 'react';
import { User, UserPreferences } from '../types';
import {
  LogOut, MapPin, CreditCard, Shield, Settings, User as UserIcon,
  Camera, Award, ArrowLeft, Check, ChevronRight, Mail, Phone, Globe,
  Plus, Trash2, Calendar, Bell, AlertCircle, CheckCircle2,
  Plane, Star, TrendingUp, Compass, Edit3, Lock, Eye, EyeOff, Zap
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  prefs: UserPreferences | null;
  tripPlan?: { destination: string; country: string; totalEstimatedCost?: number } | null;
  onLogout: () => void;
  onBack: () => void;
}

type SectionType = 'info' | 'payment' | 'calendar' | 'security' | null;

const TRAVEL_BADGES = [
  { icon: '🌄', label: 'First Trip', desc: 'Planned your first adventure', unlocked: true, color: 'from-amber-400 to-orange-500' },
  { icon: '🏔️', label: 'Peak Seeker', desc: 'Explored a mountain destination', unlocked: true, color: 'from-blue-400 to-indigo-500' },
  { icon: '🌊', label: 'Coastal Soul', desc: 'Beach destination planned', unlocked: true, color: 'from-cyan-400 to-blue-500' },
  { icon: '🗺️', label: 'Cartographer', desc: 'Explored 5 destinations', unlocked: false, color: 'from-gray-400 to-gray-500' },
  { icon: '✈️', label: 'Globetrotter', desc: 'International trip planned', unlocked: false, color: 'from-gray-400 to-gray-500' },
  { icon: '⭐', label: 'Elite Planner', desc: 'Complete 10 trips', unlocked: false, color: 'from-gray-400 to-gray-500' },
];

const MOCK_TRIPS = [
  { dest: 'Goa, India', date: 'Dec 2024', cost: '₹28,500', icon: '🌊' },
  { dest: 'Kerala, India', date: 'Aug 2024', cost: '₹35,200', icon: '🌴' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ user, prefs, tripPlan, onLogout, onBack }) => {
  const [activeSection, setActiveSection] = useState<SectionType>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);

  const storageKey = `wanderlust_profile_${user.id}`;
  const savedProfile = (() => { try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; } })();

  const [userInfo, setUserInfo] = useState({
    name: savedProfile.name || user.name,
    email: savedProfile.email || user.email,
    phone: savedProfile.phone || '',
    bio: savedProfile.bio || 'Passionate traveler exploring the world one city at a time.',
    location: savedProfile.location || 'India',
    passport: savedProfile.passport || '',
  });

  const [calendars, setCalendars] = useState({ google: true, apple: false, outlook: false });

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(userInfo)); } catch {}
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); setActiveSection(null); }, 1200);
    }, 800);
  };

  const maskCard = (num: string) => showCardNumbers ? num : num.replace(/\d(?=\d{4})/g, '•');

  const settingsItems: { key: SectionType; icon: React.ReactNode; label: string; desc: string; color: string; accent: string }[] = [
    { key: 'info', icon: <UserIcon className="w-5 h-5" />, label: 'Personal Information', desc: 'Name, email, bio & location', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', accent: 'hover:border-blue-300' },
    { key: 'payment', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', desc: 'Cards & billing history', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', accent: 'hover:border-emerald-300' },
    { key: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Sync Calendar', desc: 'Google, Apple & Outlook', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', accent: 'hover:border-purple-300' },
    { key: 'security', icon: <Lock className="w-5 h-5" />, label: 'Security & Privacy', desc: 'Password, 2FA & data', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400', accent: 'hover:border-rose-300' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 animate-fade-in">

      {/* Hero Cover */}
      <div className="relative h-56 bg-gradient-to-br from-slate-900 via-brand-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

        <button
          onClick={onBack}
          className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-all border border-white/15"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span className="px-3 py-1.5 bg-yellow-400/20 backdrop-blur-md text-yellow-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-400/30 flex items-center gap-1.5">
            <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Pro Traveler
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Shield className="w-48 h-48 text-brand-500" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-brand-500/30 ring-4 ring-white dark:ring-slate-800">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 rounded-xl shadow-lg border border-gray-100 dark:border-slate-600 hover:scale-105 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white truncate">{userInfo.name}</h1>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="truncate">{userInfo.location} · {userInfo.email}</span>
              </div>

              {/* Stats */}
              <div className="flex gap-5">
                {[
                  { val: tripPlan ? '3' : '2', label: 'Trips', icon: <Compass className="w-3.5 h-3.5 text-brand-500" /> },
                  { val: '5', label: 'Countries', icon: <Globe className="w-3.5 h-3.5 text-indigo-500" /> },
                  { val: '4.8', label: 'Rating', icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="w-px bg-gray-100 dark:bg-slate-700" />}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 mb-0.5">{stat.icon}<span className="text-xl font-black text-gray-900 dark:text-white">{stat.val}</span></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setActiveSection('info')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-slate-700 text-red-500 font-bold rounded-xl text-sm border border-red-50 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Bio */}
          {userInfo.bio && (
            <div className="mt-6 pt-5 border-t border-gray-50 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">"{userInfo.bio}"</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="space-y-5">

            {/* Active Trip Style */}
            {prefs && (
              <div className="relative bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10 text-white/80">
                  <TrendingUp className="w-4 h-4 text-brand-400" /> Active Style
                </h3>
                <div className="space-y-2.5 relative z-10">
                  {[
                    { label: 'Vibe', value: prefs.intent },
                    { label: 'Duration', value: `${prefs.days} Days` },
                    { label: 'Budget', value: `₹${prefs.budget?.toLocaleString()}/day` },
                    { label: 'Travel', value: prefs.companions },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/8 rounded-xl border border-white/8 backdrop-blur-sm">
                      <span className="text-xs text-white/60 font-bold uppercase tracking-wider">{row.label}</span>
                      <span className="text-sm font-black text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onBack}
                  className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all border border-white/15 relative z-10"
                >
                  Refine Preferences
                </button>
              </div>
            )}

            {/* Travel Badges */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-500" /> Achievements
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {TRAVEL_BADGES.map((badge, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all cursor-default ${badge.unlocked ? '' : 'opacity-30 grayscale'} hover:scale-105`}
                    title={badge.desc}
                  >
                    <div className={`w-full h-full absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-10`} />
                    <span className="text-2xl mb-1 relative z-10">{badge.icon}</span>
                    <span className="text-[9px] font-black text-gray-600 dark:text-gray-300 uppercase leading-tight relative z-10">{badge.label}</span>
                    {badge.unlocked && (
                      <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">3 of 6 unlocked · Keep exploring!</p>
            </div>

            {/* Recent Trips */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                <Plane className="w-4 h-4 text-brand-500" /> Recent Trips
              </h3>
              <div className="space-y-2.5">
                {tripPlan && (
                  <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800/30 cursor-pointer">
                    <span className="text-xl shrink-0">✈️</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-brand-700 dark:text-brand-300 truncate">{tripPlan.destination}, {tripPlan.country}</p>
                      <p className="text-[10px] text-brand-500/70 font-bold uppercase tracking-wider">Current Plan · Active</p>
                    </div>
                    <span className="text-xs font-black text-brand-600 dark:text-brand-400 shrink-0">
                      {tripPlan.totalEstimatedCost ? `₹${tripPlan.totalEstimatedCost.toLocaleString('en-IN')}` : 'Planned'}
                    </span>
                  </div>
                )}
                {MOCK_TRIPS.map((trip, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                    <span className="text-xl shrink-0">{trip.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{trip.dest}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{trip.date}</p>
                    </div>
                    <span className="text-xs font-black text-gray-600 dark:text-gray-300 shrink-0">{trip.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[500px]">

              {/* Navigation list */}
              {!activeSection && (
                <div className="p-6 sm:p-8 animate-fade-in">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-gray-400" /> Account Settings
                  </h3>
                  <div className="space-y-2">
                    {settingsItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-2xl transition-all group border border-transparent ${item.accent} dark:hover:border-slate-600`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${item.color} rounded-xl`}>{item.icon}</div>
                          <div className="text-left">
                            <p className="font-black text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-gray-100 dark:border-slate-700">
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Info */}
              {activeSection === 'info' && (
                <div className="p-6 sm:p-8 animate-in slide-in-from-right-8 duration-300">
                  <SectionHeader title="Personal Information" icon={<UserIcon className="w-5 h-5" />} onBack={() => setActiveSection(null)} />
                  <form onSubmit={handleSaveInfo} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', key: 'name', type: 'text', icon: <UserIcon className="w-4 h-4" />, placeholder: 'Your full name' },
                        { label: 'Email', key: 'email', type: 'email', icon: <Mail className="w-4 h-4" />, placeholder: 'your@email.com' },
                        { label: 'Phone', key: 'phone', type: 'tel', icon: <Phone className="w-4 h-4" />, placeholder: '+91 9876543210' },
                        { label: 'Home Base', key: 'location', type: 'text', icon: <Globe className="w-4 h-4" />, placeholder: 'City, Country' },
                      ].map(field => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{field.label}</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">{field.icon}</span>
                            <input
                              type={field.type}
                              value={(userInfo as any)[field.key]}
                              onChange={e => setUserInfo({ ...userInfo, [field.key]: e.target.value })}
                              placeholder={field.placeholder}
                              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 focus:outline-none dark:text-white text-sm font-medium transition-all"
                            />
                          </div>
                        </div>
                      ))}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Bio</label>
                        <textarea
                          rows={3}
                          value={userInfo.bio}
                          onChange={e => setUserInfo({ ...userInfo, bio: e.target.value })}
                          className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 focus:outline-none dark:text-white text-sm font-medium resize-none transition-all"
                          placeholder="Tell us about your travel style..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSaving || saveSuccess}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-70"
                      >
                        {saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        {saveSuccess ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Payment */}
              {activeSection === 'payment' && (
                <div className="p-6 sm:p-8 animate-in slide-in-from-right-8 duration-300">
                  <SectionHeader title="Payment Methods" icon={<CreditCard className="w-5 h-5" />} onBack={() => setActiveSection(null)} />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400 font-medium">2 cards saved</p>
                    <button
                      onClick={() => setShowCardNumbers(n => !n)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      {showCardNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showCardNumbers ? 'Hide' : 'Reveal'} Numbers
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { type: 'Visa', number: '4242 4242 4242 4242', expiry: '12/28', gradient: 'from-gray-900 via-gray-800 to-slate-900' },
                      { type: 'Mastercard', number: '5555 5555 5555 5555', expiry: '09/26', gradient: 'from-blue-700 via-indigo-700 to-indigo-800' },
                    ].map((card, i) => (
                      <div key={i} className={`relative h-44 rounded-2xl p-5 text-white bg-gradient-to-br ${card.gradient} shadow-xl group overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
                        <div className="flex justify-between items-start mb-5">
                          <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
                          <span className="text-sm font-black italic opacity-90">{card.type}</span>
                        </div>
                        <p className="font-mono text-base tracking-widest mb-4">{maskCard(card.number)}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[9px] opacity-60 uppercase tracking-wider">Holder</p>
                            <p className="text-xs font-black">{userInfo.name.toUpperCase().slice(0, 18)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] opacity-60 uppercase tracking-wider">Expires</p>
                            <p className="text-xs font-black">{card.expiry}</p>
                          </div>
                        </div>
                        <button className="absolute top-3 right-3 p-1.5 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50 text-white/70 hover:text-white">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button className="h-44 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-brand-500 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-slate-700/50 transition-all">
                      <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">Add Method</span>
                    </button>
                  </div>

                  <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-3">Transaction History</h4>
                  <div className="space-y-2">
                    {MOCK_TRIPS.map((trip, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white dark:bg-slate-600 rounded-xl flex items-center justify-center shadow-sm text-base">{trip.icon}</div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Trip to {trip.dest}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{trip.date} · Visa ••••4242</p>
                          </div>
                        </div>
                        <span className="font-black text-sm text-gray-900 dark:text-white">{trip.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              {activeSection === 'calendar' && (
                <div className="p-6 sm:p-8 animate-in slide-in-from-right-8 duration-300">
                  <SectionHeader title="Sync Calendar" icon={<Calendar className="w-5 h-5" />} onBack={() => setActiveSection(null)} />
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3 mb-6 border border-blue-100 dark:border-blue-800/30">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                      Sync your calendar to automatically add trip itineraries and get reminders before departure.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'google' as const, name: 'Google Calendar', sub: calendars.google ? `Connected · ${userInfo.email}` : 'Not connected', color: 'bg-white dark:bg-slate-800', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
                      { key: 'apple' as const, name: 'Apple Calendar', sub: calendars.apple ? 'Connected' : 'Not connected', color: 'bg-gray-900', logo: null },
                      { key: 'outlook' as const, name: 'Outlook Calendar', sub: calendars.outlook ? 'Connected' : 'Not connected', color: 'bg-blue-600', logo: null },
                    ].map(cal => (
                      <div key={cal.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 ${cal.color} rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-600 overflow-hidden`}>
                            {cal.logo
                              ? <img src={cal.logo} alt={cal.name} className="w-7 h-7 object-contain" />
                              : <Calendar className="w-5 h-5 text-white" />
                            }
                          </div>
                          <div>
                            <p className="font-black text-sm text-gray-900 dark:text-white">{cal.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{cal.sub}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCalendars(prev => ({ ...prev, [cal.key]: !prev[cal.key] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${calendars[cal.key] ? 'bg-brand-600' : 'bg-gray-200 dark:bg-slate-600'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${calendars[cal.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">
                      <Bell className="w-4 h-4" /> Notification Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div className="p-6 sm:p-8 animate-in slide-in-from-right-8 duration-300">
                  <SectionHeader title="Security & Privacy" icon={<Shield className="w-5 h-5" />} onBack={() => setActiveSection(null)} />
                  <div className="space-y-3">
                    {[
                      { icon: <Lock className="w-5 h-5" />, label: 'Change Password', desc: 'Last changed 3 months ago', badge: null, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
                      { icon: <Zap className="w-5 h-5" />, label: 'Two-Factor Auth', desc: 'Adds extra security to your account', badge: 'Recommended', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
                      { icon: <Globe className="w-5 h-5" />, label: 'Active Sessions', desc: '2 devices logged in', badge: null, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
                      { icon: <Trash2 className="w-5 h-5" />, label: 'Data & Privacy', desc: 'Download or delete your data', badge: null, color: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400' },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 ${item.color} rounded-xl`}>{item.icon}</div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-black text-sm text-gray-900 dark:text-white">{item.label}</p>
                              {item.badge && <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase rounded-full">{item.badge}</span>}
                            </div>
                            <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon, onBack }: { title: string; icon: React.ReactNode; onBack: () => void }) => (
  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-slate-700">
    <button
      onClick={onBack}
      className="p-2 -ml-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
    </button>
    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">{icon}</div>
    <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
  </div>
);

export default ProfilePage;

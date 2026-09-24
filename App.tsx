import React, { useState, useEffect } from 'react';
import { UserPreferences, TripPlan, DestinationOption, User } from './types';
import IntentForm from './components/IntentForm';
import DestinationSelection from './components/DestinationSelection';
import TripDashboard from './components/TripDashboard';
import ChatAssistant from './components/ChatAssistant';
import AuthForms from './components/AuthForms';
import ProfilePage from './components/ProfilePage';
import { generateTripPlan, generateDestinationOptions } from './services/geminiService';
import { Plane, Moon, Sun, LogOut, User as UserIcon, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'onboarding' | 'planning' | 'selecting' | 'generating' | 'dashboard' | 'profile'>('onboarding');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [destinationOptions, setDestinationOptions] = useState<DestinationOption[]>([]);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // State to trigger chat queries from dashboard
  const [chatTrigger, setChatTrigger] = useState<{query: string, ts: number} | null>(null);

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auth Handler
  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    
    setView('onboarding');
  };

  // Restore session on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('wanderlust_session');
      if (saved) { const u = JSON.parse(saved); if (u?.id && u?.email) setUser(u); }
    } catch {}
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('wanderlust_session'); } catch {}
    setUser(null);
    setTripPlan(null);
    setUserPrefs(null);
    setDestinationOptions([]);
    setView('onboarding');
  };

  const handleStartPlanning = () => {
    setView('planning');
  };

  // Step 1: User submits preferences -> Generate Options
  const handlePrefsSubmit = async (prefs: UserPreferences) => {
    setUserPrefs(prefs);
    setView('generating');
    setError(null);
    try {
      const options = await generateDestinationOptions(prefs);
      setDestinationOptions(options);
      setView('selecting');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to find destinations. Please try again.");
      setView('planning');
    }
  };

  // Step 2: User selects a destination -> Generate Full Plan
  const handleDestinationSelect = async (option: DestinationOption) => {
    if (!userPrefs) return;
    
    setView('generating');
    setError(null);
    try {
      const plan = await generateTripPlan(userPrefs, option);
      setTripPlan(plan);
      setView('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate detailed itinerary. Please try again.");
      setView('selecting');
    }
  };

  // 1. Show Auth Flow if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 font-sans transition-colors duration-300">
         <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-yellow-400 shadow-md border border-gray-200 dark:border-slate-700 hover:scale-110 transition-transform"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <AuthForms onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // 2. Main App Flow
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* User Badge - Click to go to Profile */}
        <button 
            onClick={() => setView('profile')}
            className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full shadow-lg border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:scale-105 transition-transform cursor-pointer group"
        >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-xs text-white">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{user.name}</span>
        </button>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur text-gray-800 dark:text-yellow-400 shadow-lg border border-gray-200 dark:border-slate-700 hover:scale-110 transition-transform"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Onboarding View (Hero Section) */}
      {view === 'onboarding' && (
        <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 z-0">
                 <img 
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80" 
                    alt="Background" 
                    className="w-full h-full object-cover animate-pulse-slow opacity-90"
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center">
                 
                 <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-2xl animate-fade-in-up delay-100">
                    Discover the World,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300">Designed for You.</span>
                 </h1>
                 
                 <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md animate-fade-in-up delay-200">
                    Your personal AI guide that scouts, plans, and adapts your perfect journey in seconds.
                 </p>
                 
                 <button
                    onClick={handleStartPlanning}
                    className="group relative px-10 py-5 bg-white text-brand-900 text-lg font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] animate-fade-in-up delay-300 overflow-hidden"
                 >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Planning Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-50 via-white to-brand-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </button>
                 
                 {/* Footer Info */}
                 <div className="absolute bottom-8 left-0 w-full text-center text-white/50 text-xs animate-fade-in delay-500">
                     Powered by Gemini 2.5 Pro • Real-time Grounding
                 </div>
            </div>
        </div>
      )}

      {/* Profile View */}
      {view === 'profile' && user && (
          <ProfilePage 
             user={user} 
             prefs={userPrefs}
             tripPlan={tripPlan}
             onLogout={handleLogout} 
             onBack={() => setView(tripPlan ? 'dashboard' : 'onboarding')}
          />
      )}

      {/* Planning View (Intent Form) */}
      {view === 'planning' && (
        <div className="min-h-screen flex flex-col py-10 px-4">
           <div className="mb-8 text-center">
              <button onClick={() => setView('onboarding')} className="text-sm text-gray-500 hover:text-brand-600 mb-4 block mx-auto">← Back to Home</button>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Plan Your Trip</h2>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
           </div>
           <IntentForm onSubmit={handlePrefsSubmit} />
        </div>
      )}

      {/* Generating View (Loading) */}
      {view === 'generating' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-brand-200 dark:border-slate-700 border-t-brand-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Plane className="w-8 h-8 text-brand-600 animate-pulse" />
             </div>
          </div>
          <h2 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
            {destinationOptions.length === 0 ? 'Scouting locations...' : 'Crafting your itinerary...'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 animate-pulse text-lg">
            Analyzing vibes, checking budgets, and finding hidden gems.
          </p>
        </div>
      )}

      {/* Selecting View (List of Options) */}
      {view === 'selecting' && (
        <div className="min-h-screen flex flex-col py-10 px-4">
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}
            <DestinationSelection 
              options={destinationOptions} 
              onSelect={handleDestinationSelect}
              onBack={() => setView('planning')} 
            />
        </div>
      )}

      {/* Dashboard View */}
      {view === 'dashboard' && tripPlan && (
        <div className="relative min-h-screen bg-gray-50 dark:bg-slate-900">
           <TripDashboard 
              plan={tripPlan} 
              onPlanUpdate={setTripPlan} 
              onBack={() => setView(destinationOptions.length > 0 ? 'selecting' : 'onboarding')}
              onExplore={(query) => setChatTrigger({ query, ts: Date.now() })}
           />
           
           {/* Persistent Chat Assistant */}
           <ChatAssistant 
              tripContext={tripPlan} 
              trigger={chatTrigger}
           />
        </div>
      )}
    </div>
  );
};

export default App;
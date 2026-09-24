import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { login, signup, forgotPassword } from '../services/authService';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Loader2, Plane, AlertCircle, CheckCircle, Chrome, MapPin, Star } from 'lucide-react';

interface AuthFormsProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

// Curated high-quality travel backgrounds
const BACKGROUNDS = [
  {
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80",
    location: "Swiss Alps, Switzerland",
    quote: "The mountains are calling and I must go."
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
    location: "Paris, France",
    quote: "A walk about Paris will provide lessons in history, beauty, and in the point of life."
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    location: "Krabi, Thailand",
    quote: "To travel is to discover that everyone is wrong about other countries."
  },
  {
    url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1920&q=80",
    location: "London, UK",
    quote: "London is a roost for every bird."
  }
];

const AuthForms: React.FC<AuthFormsProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Cycle Backgrounds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(email, password);
        onAuthSuccess(user);
      } else if (mode === 'signup') {
        const user = await signup(name, email, password);
        onAuthSuccess(user);
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setSuccessMsg("Reset link sent to your email.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  const currentBg = BACKGROUNDS[bgIndex];

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden bg-white dark:bg-slate-900">
      
      {/* LEFT SIDE - Cinematic Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {BACKGROUNDS.map((bg, index) => (
          <div 
            key={bg.url}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
          >
             <img 
               src={bg.url} 
               alt={bg.location} 
               className={`w-full h-full object-cover ${index === bgIndex ? 'animate-pan-slow' : ''}`}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          </div>
        ))}

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div className="flex items-center gap-3 animate-fade-in-up">
             <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Plane className="w-8 h-8 text-white" />
             </div>
             <span className="text-2xl font-bold tracking-tight">Wanderlust AI</span>
          </div>

          <div className="space-y-6 max-w-lg mb-12 animate-fade-in-up delay-100">
             <div className="flex items-center gap-2 text-brand-300 font-bold uppercase tracking-wider text-xs">
                <MapPin className="w-4 h-4" />
                {currentBg.location}
             </div>
             <h2 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
               "{currentBg.quote}"
             </h2>
             
             {/* Social Proof */}
             <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-gray-900" alt="User" />
                   ))}
                </div>
                <div className="text-sm">
                   <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400" />
                   </div>
                   <p className="text-gray-300">Loved by 10,000+ travelers</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8 animate-fade-in">
          
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
               {mode === 'login' && 'Welcome back'}
               {mode === 'signup' && 'Start your journey'}
               {mode === 'forgot' && 'Reset password'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
               {mode === 'login' && 'Please enter your details to sign in.'}
               {mode === 'signup' && 'Create an account to save your trips.'}
               {mode === 'forgot' && 'Enter your email to restore access.'}
            </p>
          </div>

          {/* Social Buttons */}
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-4">
              <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group">
                 <Chrome className="w-5 h-5 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors" />
                 <span className="font-semibold text-gray-600 dark:text-gray-300">Sign in with Google</span>
              </button>
            </div>
          )}

          {mode !== 'forgot' && (
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-700"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-gray-400 font-bold">Or continue with email</span></div>
             </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3 animate-fade-in border border-red-100 dark:border-red-900/50">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-3 animate-fade-in border border-green-100 dark:border-green-900/50">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                   </div>
                   <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                     className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                     placeholder="John Doe"
                   />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                   placeholder="name@example.com"
                 />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                   {mode === 'login' && (
                     <button type="button" onClick={() => setMode('forgot')} className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                       Forgot password?
                     </button>
                   )}
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                   </div>
                   <input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
                     placeholder="••••••••"
                   />
                   <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transform transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Sign In to Account'}
                  {mode === 'signup' && 'Create Free Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switching */}
          <div className="text-center">
            {mode === 'login' && (
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
                  Sign up for free
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} className="font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 mx-auto transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Sign In
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Background Hint */}
        <div className="absolute inset-0 -z-10 lg:hidden">
            <img src={BACKGROUNDS[0].url} className="w-full h-full object-cover opacity-5" alt="bg" />
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
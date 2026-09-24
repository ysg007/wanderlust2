import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TripPlan, ChatMessage } from '../types';
import { sendChatMessage, findNearbyPlaces } from '../services/geminiService';
import {
  MessageCircle, X, Send, Map, Loader2, Navigation, Utensils,
  Sparkles, ShieldAlert, Car, MapPin, ExternalLink, ChevronDown,
  Mic, Hotel, Camera, Clock, Lightbulb, RefreshCcw
} from 'lucide-react';

interface ChatAssistantProps {
  tripContext: TripPlan | null;
  trigger?: { query: string; ts: number } | null;
}

// Simple inline markdown renderer (bold, italic, bullet lists, line breaks)
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, li) => {
    const trimmed = line.trim();
    const isBullet = /^[-*•]\s/.test(trimmed);
    const content = isBullet ? trimmed.replace(/^[-*•]\s/, '') : line;

    // Process inline bold/italic
    const parts: React.ReactNode[] = [];
    let remaining = content;
    let key = 0;
    const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
    let match;
    let lastIndex = 0;
    while ((match = pattern.exec(content)) !== null) {
      if (match.index > lastIndex) parts.push(<span key={key++}>{content.slice(lastIndex, match.index)}</span>);
      if (match[2]) parts.push(<strong key={key++} className="font-bold">{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>);
      else if (match[4]) parts.push(<code key={key++} className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{match[4]}</code>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);

    const inner = parts.length > 0 ? parts : [<span key={0}>{content}</span>];

    if (isBullet) return (
      <div key={li} className="flex items-start gap-2 my-0.5">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
        <span>{inner}</span>
      </div>
    );
    if (trimmed === '') return <div key={li} className="h-2" />;
    return <div key={li}>{inner}</div>;
  });
}

const TypingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }}
      />
    ))}
  </div>
);

const QuickChip: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; color?: string }> =
  ({ icon, label, onClick, disabled, color = 'bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 ${color} text-[10px] font-black uppercase tracking-wider rounded-xl border shrink-0 hover:opacity-80 active:scale-95 transition-all disabled:opacity-40`}
    >
      {icon}{label}
    </button>
  );

const ChatAssistant: React.FC<ChatAssistantProps> = ({ tripContext, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'model',
    text: tripContext
      ? `Hi! I'm your **Concierge AI** for **${tripContext.destination}** 🌍\n\nYour ${tripContext.itinerary?.length}-day plan is ready. I can help with:\n- Local restaurant & café recommendations\n- Transport & navigation tips\n- Hidden gems & secret spots\n- Real-time safety & emergency info\n\nWhat would you like to know?`
      : `Hi! I'm your **AI Travel Concierge** ✈️\n\nI can help you discover destinations, plan activities, find restaurants, answer travel questions, and more.\n\nWhat's on your travel bucket list?`,
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTriggerTs = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) { scrollToBottom(); setUnread(0); }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (trigger && trigger.ts !== lastTriggerTs.current) {
      lastTriggerTs.current = trigger.ts;
      setIsOpen(true);
      setTimeout(() => handleSend(trigger.query), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend || isLoading) return;
    if (!overrideText) setInput('');
    setIsLoading(true);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!isOpen) setUnread(n => n + 1);

    try {
      const isMapQuery = /nearby|restaurant|cafe|coffee|hotel|museum|park|location|map|place|route|path|hike|drive|walk|petrol|atm|hospital|pharmacy|police/i.test(textToSend);

      if (isMapQuery) {
        const destination = tripContext?.destination || '';
        const result = await findNearbyPlaces(`${textToSend} in ${destination}`);
        const mapMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: result.text || 'Here are some results I found.',
          isMapResult: true,
          mapChunks: result.chunks,
        };
        setMessages(prev => [...prev, mapMsg]);
        if (!isOpen) setUnread(n => n + 1);
      } else {
        const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        const msgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: msgId, role: 'model', text: '' }]);
        let fullText = '';
        try {
          const streamIterable = await sendChatMessage(history, textToSend, tripContext);
          for await (const chunk of streamIterable) {
            const chunkText = (chunk?.text as string) || '';
            if (chunkText) {
              fullText += chunkText;
              setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fullText } : m));
            }
          }
        } catch (streamErr) {
          console.error('Stream error:', streamErr);
          fullText = fullText || '⚠️ Connection interrupted. Please try again.';
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fullText } : m));
        }
        if (!fullText) {
          setMessages(prev => prev.map(m => m.id === msgId
            ? { ...m, text: 'I received your message but got an empty response. Please try again.' }
            : m));
        }
        if (!isOpen) setUnread(n => n + 1);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, I hit a snag. Please try again — I\'m still here to help! 🙏',
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: tripContext
        ? `Chat cleared! Still here for **${tripContext.destination}** — ask me anything.`
        : `Chat cleared! Ask me anything about your travels.`,
    }]);
  };

  const quickActions = tripContext ? [
    { icon: <Utensils className="w-3 h-3" />, label: 'Best Eats', query: 'What are the best local restaurants and street food spots here?', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/30' },
    { icon: <Hotel className="w-3 h-3" />, label: 'Stay Tips', query: 'What neighbourhood should I stay in and any hotel tips?', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30' },
    { icon: <Camera className="w-3 h-3" />, label: 'Must-See', query: 'What are the top 5 must-see attractions and hidden gems?', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/30' },
    { icon: <Car className="w-3 h-3" />, label: 'Transport', query: 'Best way to get around — auto, cab, metro or bike?', color: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-800/30' },
    { icon: <Clock className="w-3 h-3" />, label: 'Day Plan', query: 'Give me the perfect 1-day itinerary for a first-timer.', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' },
    { icon: <ShieldAlert className="w-3 h-3" />, label: 'Emergency', query: 'Nearest hospital, police station and emergency numbers here?', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30' },
  ] : [
    { icon: <Lightbulb className="w-3 h-3" />, label: 'Inspire Me', query: 'Suggest a unique travel destination for a solo adventurer in July.', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' },
    { icon: <MapPin className="w-3 h-3" />, label: 'India Gems', query: 'What are the most underrated travel destinations in India?', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' },
    { icon: <Utensils className="w-3 h-3" />, label: 'Food Trail', query: 'Plan a food-focused trip in India under ₹20,000.', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/30' },
  ];

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setUnread(0); }}
          className="fixed bottom-6 right-6 w-15 h-15 bg-slate-900 text-white rounded-[1.4rem] shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-center hover:bg-black hover:scale-105 transition-all z-50 border border-white/10 group"
          style={{ width: 60, height: 60 }}
        >
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              {unread}
            </span>
          )}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform" />
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:h-[680px] bg-white dark:bg-slate-900 sm:rounded-[2rem] sm:shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden border border-gray-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500">

          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 px-5 py-4 text-white flex items-center gap-3 relative overflow-hidden shrink-0">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 shrink-0 relative z-10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-black text-base tracking-tight leading-none">
                {tripContext ? `${tripContext.destination} Concierge` : 'AI Travel Concierge'}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online · Powered by Gemini</span>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/80 dark:bg-slate-900 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 bg-slate-900 dark:bg-brand-600 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-tl-sm'
                }`}>
                  {msg.role === 'model' ? renderMarkdown(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}

                  {msg.isMapResult && msg.mapChunks && msg.mapChunks.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Found Nearby:</p>
                      {msg.mapChunks.map((chunk, idx) => chunk.maps?.uri ? (
                        <a
                          key={idx}
                          href={chunk.maps.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-slate-800 hover:border-brand-200 transition-colors group"
                        >
                          <Map className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300 flex-1 truncate">{chunk.maps.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0" />
                        </a>
                      ) : null)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-slate-900 dark:bg-brand-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-slate-700 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto border-t border-gray-50 dark:border-slate-800/60 no-scrollbar shrink-0">
            {quickActions.map((action, i) => (
              <QuickChip
                key={i}
                icon={action.icon}
                label={action.label}
                onClick={() => handleSend(action.query)}
                disabled={isLoading}
                color={action.color}
              />
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-gray-50 dark:border-slate-800/60 flex gap-2.5 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={tripContext ? `Ask about ${tripContext.destination}...` : 'Ask anything about travel...'}
              className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/40 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10 shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;

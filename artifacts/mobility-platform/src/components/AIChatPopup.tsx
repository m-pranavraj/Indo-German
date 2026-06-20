import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, X, Send, Bot, User as UserIcon, ExternalLink, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useLocation } from 'wouter';

const ACCENT = '#A855F7';
const NAVY = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const BORDER = 'rgba(168,85,247,0.2)';
const TEXT2 = '#C4B5FD';

interface Message {
  role: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  links?: { label: string; path: string }[];
}

const WELCOME_MSG: Message = {
  role: 'ai',
  content: "Namaste! 🇮🇳→🇩🇪 I'm your Indo German AI Guide — powered by Groq LLaMA.\n\nAsk me anything about:\n• Visa pathways & requirements\n• Language training (A1–B2)\n• Qualification recognition (ZAB)\n• Salary expectations in Germany\n• Costs, timelines, and next steps",
  suggestions: ["What documents do I need?", "How long will it take?", "What salary can I expect?", "Which visa type do I need?"],
};

export function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, getToken } = useAuth();
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (msg?: string) => {
    const text = (msg ?? message).trim();
    if (!text || isLoading) return;
    setMessage('');
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token = getToken();
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
      const res = await axios.post('/api/ai/chat', {
        message: text,
        context: { role: user?.role },
        history,
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

      const data = res.data;
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response || "I'm having trouble connecting. Please try again.",
        suggestions: data.suggestions || [],
        links: data.links || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I'm having trouble connecting right now. Quick answers:\n\n• **Visa**: EU Blue Card for graduates, §18a for skilled workers\n• **Language**: B1 for most jobs, B2 for nursing\n• **Timeline**: 14–20 months total\n• **Recognition**: ZAB takes 12–16 weeks\n\nPlease try again in a moment!",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: NAVY, border: `2px solid ${ACCENT}` }}
        title="Indo German AI Guide — Powered by Groq"
      >
        {isOpen ? (
          <X className="w-5 h-5" style={{ color: ACCENT }} />
        ) : (
          <div className="flex flex-col items-center">
            <Sparkles className="w-5 h-5" style={{ color: ACCENT }} />
            <span className="text-[8px] font-black mt-0.5" style={{ color: ACCENT }}>AI</span>
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[390px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '540px', border: `1px solid ${BORDER}`, background: NAVY }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ACCENT }}>
              <Bot className="w-4 h-4" style={{ color: NAVY }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">Indo German AI Guide</div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" style={{ color: ACCENT }} />
                <div className="text-[10px] font-medium" style={{ color: TEXT2 }}>Powered by Groq LLaMA · Instant answers</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0, background: CARD2 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: ACCENT }}>
                    <Bot className="w-3 h-3" style={{ color: NAVY }} />
                  </div>
                )}
                <div className="max-w-[85%] space-y-2">
                  <div
                    className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.role === 'user'
                        ? { background: ACCENT, color: NAVY, borderRadius: '18px 18px 4px 18px' }
                        : { background: CARD, color: '#E8EDF5', border: `1px solid ${BORDER}`, borderRadius: '18px 18px 18px 4px' }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.links.map((link, j) => (
                        <button key={j} onClick={() => { setLocation(link.path); setIsOpen(false); }}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium hover:opacity-80 transition-all"
                          style={{ borderColor: ACCENT, color: ACCENT }}>
                          <ExternalLink className="w-3 h-3" />
                          {link.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, j) => (
                        <button key={j} onClick={() => handleSend(s)}
                          className="text-xs px-2.5 py-1 rounded-full border transition-all hover:border-[#A855F7]/50"
                          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: TEXT2 }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <UserIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ACCENT }}>
                  <Bot className="w-3 h-3" style={{ color: NAVY }} />
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: ACCENT, animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 flex-shrink-0" style={{ background: CARD, borderTop: `1px solid ${BORDER}` }}>
            <Input
              ref={inputRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about visa, language, salary…"
              className="flex-1 text-sm text-white placeholder:text-slate-500 border focus:border-[#A855F7]"
              style={{ background: CARD2, borderColor: 'rgba(255,255,255,0.1)' }}
            />
            <Button size="sm" onClick={() => handleSend()} disabled={!message.trim() || isLoading}
              className="px-3 flex-shrink-0 disabled:opacity-40"
              style={{ background: ACCENT }}>
              <Send className="w-4 h-4" style={{ color: NAVY }} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

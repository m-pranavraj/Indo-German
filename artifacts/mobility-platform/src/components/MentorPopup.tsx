import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Phone, Mic, Send, ChevronDown, ChevronUp, Video, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ACCENT = '#A855F7';
const NAVY = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const BORDER = 'rgba(168,85,247,0.2)';
const TEXT2 = '#C4B5FD';
const SUCCESS = '#00C853';

interface ChatMsg { from: 'me' | 'mentor'; text: string; time: string; }

const MENTOR = {
  name: 'Dr. Pradeep Menon',
  title: 'Senior Migration Counsellor',
  org: 'MSDE · Indo-German Corridor',
  avatar: 'PM',
  rating: 4.9,
  sessions: 312,
  languages: ['English', 'Hindi', 'Malayalam'],
  available: true,
  nextSlot: 'Today 4:00 PM',
};

const SAMPLE_MSGS: ChatMsg[] = [
  { from: 'mentor', text: 'Namaste! 🙏 I am Dr. Pradeep, your assigned government mentor. How can I help you today?', time: '10:02 AM' },
];

export function MentorPopup() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chat' | 'call' | 'info'>('chat');
  const [msgs, setMsgs] = useState<ChatMsg[]>(SAMPLE_MSGS);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, open]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs(prev => [...prev, { from: 'me', text: t, time: now }]);
    setInput('');
    setTimeout(() => {
      const replies = [
        "Great question! I'll review your case and get back within 24 hours.",
        "I've noted this. You can also check the Documents section for the latest updates.",
        "For this, you'll need to submit Form ZAB-3. I can guide you step by step.",
        "Your visa application looks on track. I'll escalate to the embassy team today.",
      ];
      setMsgs(prev => [...prev, {
        from: 'mentor',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  const toggleRecord = () => {
    if (recording) {
      clearInterval(timerRef.current);
      setRecording(false);
      const secs = recordSecs;
      setRecordSecs(0);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMsgs(prev => [...prev, { from: 'me', text: `🎤 Voice message (${secs}s)`, time: now }]);
      setTimeout(() => {
        setMsgs(prev => [...prev, {
          from: 'mentor',
          text: 'I received your voice message. I\'ll listen and respond shortly. 👍',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 1500);
    } else {
      setRecording(true);
      setRecordSecs(0);
      timerRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000);
    }
  };

  const quickQuestions = [
    'What documents are pending?',
    'When is my visa interview?',
    'Is my qualification recognised?',
    'Next steps for language test?',
  ];

  return (
    <>
      {/* Floating button — bottom left */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: NAVY, border: `2px solid #818CF8` }}
        title="Connect with your Government Mentor"
      >
        {open
          ? <X className="w-5 h-5" style={{ color: '#818CF8' }} />
          : (
            <div className="flex flex-col items-center">
              <MessageCircle className="w-5 h-5" style={{ color: '#818CF8' }} />
              <span className="text-[8px] font-black mt-0.5" style={{ color: '#818CF8' }}>MENTOR</span>
            </div>
          )
        }
        {/* Online dot */}
        {!open && <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2" style={{ background: SUCCESS, borderColor: NAVY }} />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 left-6 z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: 380, maxHeight: 560, border: `1px solid rgba(129,140,248,0.35)`, background: NAVY }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1A0B3B, #160930)', borderBottom: `1px solid rgba(129,140,248,0.2)` }}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
                {MENTOR.avatar}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: SUCCESS, borderColor: NAVY }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">{MENTOR.name}</div>
              <div className="text-[10px]" style={{ color: '#A5B4FC' }}>{MENTOR.title} · {MENTOR.org}</div>
            </div>
            <div className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#F59E0B' }}>
              <Star className="w-3 h-3 fill-current" />{MENTOR.rating}
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex flex-shrink-0" style={{ background: CARD2, borderBottom: `1px solid rgba(129,140,248,0.15)` }}>
            {(['chat', 'call', 'info'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-xs font-semibold capitalize transition-all"
                style={{
                  color: tab === t ? '#818CF8' : TEXT2,
                  borderBottom: tab === t ? '2px solid #818CF8' : '2px solid transparent',
                  background: 'transparent',
                }}>
                {t === 'chat' ? '💬 Chat' : t === 'call' ? '📞 Call' : 'ℹ️ Info'}
              </button>
            ))}
          </div>

          {/* ── CHAT TAB ── */}
          {tab === 'chat' && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" style={{ background: CARD2, minHeight: 0 }}>
                {msgs.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {m.from === 'mentor' && (
                      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-black text-white"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>PM</div>
                    )}
                    <div className="max-w-[78%]">
                      <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                        style={m.from === 'me'
                          ? { background: '#818CF8', color: '#fff', borderRadius: '18px 18px 4px 18px' }
                          : { background: CARD, color: '#E8EDF5', border: `1px solid rgba(129,140,248,0.2)`, borderRadius: '18px 18px 18px 4px' }
                        }>
                        {m.text}
                      </div>
                      <div className="text-[9px] mt-0.5 px-1" style={{ color: 'rgba(196,181,253,0.5)', textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick questions */}
              <div className="px-3 pt-2 flex gap-1.5 flex-wrap flex-shrink-0" style={{ background: CARD }}>
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="text-[10px] px-2.5 py-1 rounded-full border transition-all hover:opacity-80"
                    style={{ borderColor: 'rgba(129,140,248,0.3)', color: '#A5B4FC', background: 'rgba(129,140,248,0.06)' }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex gap-2 p-3 flex-shrink-0" style={{ background: CARD, borderTop: `1px solid rgba(129,140,248,0.15)` }}>
                <button onClick={toggleRecord}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: recording ? '#EF4444' : 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)' }}
                  title={recording ? `Stop recording (${recordSecs}s)` : 'Send voice message'}>
                  <Mic className="w-4 h-4" style={{ color: recording ? '#fff' : '#818CF8' }} />
                </button>
                {recording
                  ? <div className="flex-1 flex items-center gap-2 px-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <span className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
                      <span className="text-sm text-red-400 font-medium">Recording… {recordSecs}s</span>
                    </div>
                  : <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') send(); }}
                      placeholder="Ask your mentor…"
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-purple-400/50"
                      style={{ padding: '0.4rem 0.75rem', borderRadius: 12, border: '1px solid rgba(129,140,248,0.2)', background: CARD2 }}
                    />
                }
                <button onClick={() => send()}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90"
                  style={{ background: '#818CF8' }}>
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          )}

          {/* ── CALL TAB ── */}
          {tab === 'call' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6" style={{ background: CARD2 }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', boxShadow: '0 0 24px rgba(129,140,248,0.4)' }}>
                {MENTOR.avatar}
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">{MENTOR.name}</div>
                <div className="text-sm mt-0.5" style={{ color: TEXT2 }}>{MENTOR.title}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: SUCCESS }} />
                  <span className="text-xs font-medium" style={{ color: SUCCESS }}>Available now</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#818CF8' }}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Voice Call</span>
                  <span className="text-[10px]" style={{ color: TEXT2 }}>Instant connect</span>
                </button>

                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#6366F1' }}>
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">Video Call</span>
                  <span className="text-[10px]" style={{ color: TEXT2 }}>Face to face</span>
                </button>
              </div>

              <div className="w-full p-3 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5" style={{ color: '#818CF8' }} />
                  <span className="text-xs font-semibold text-white">Next Available Slot</span>
                </div>
                <div className="text-sm font-bold" style={{ color: '#818CF8' }}>{MENTOR.nextSlot}</div>
                <button className="mt-2 w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
                  Book Appointment
                </button>
              </div>
            </div>
          )}

          {/* ── INFO TAB ── */}
          {tab === 'info' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: CARD2 }}>
              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid rgba(129,140,248,0.2)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>{MENTOR.avatar}</div>
                  <div>
                    <div className="font-bold text-white">{MENTOR.name}</div>
                    <div className="text-xs" style={{ color: TEXT2 }}>{MENTOR.title}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Sessions', val: MENTOR.sessions + '+', color: '#818CF8' },
                    { label: 'Rating', val: MENTOR.rating + '/5', color: '#F59E0B' },
                    { label: 'Languages', val: MENTOR.languages.length + ' langs', color: SUCCESS },
                    { label: 'Response', val: '< 2 hrs', color: ACCENT },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3 text-center" style={{ background: CARD2 }}>
                      <div className="text-lg font-black" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[10px]" style={{ color: TEXT2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid rgba(129,140,248,0.2)` }}>
                <div className="text-xs font-bold text-white mb-2">Assigned by</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg">🏛️</div>
                  <div>
                    <div className="text-sm font-semibold text-white">Ministry of Skill Development</div>
                    <div className="text-[10px]" style={{ color: TEXT2 }}>MSDE · Government of India</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid rgba(129,140,248,0.2)` }}>
                <div className="text-xs font-bold text-white mb-2">Languages</div>
                <div className="flex gap-2 flex-wrap">
                  {MENTOR.languages.map(l => (
                    <span key={l} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(129,140,248,0.12)', color: '#A5B4FC', border: '1px solid rgba(129,140,248,0.25)' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid rgba(129,140,248,0.2)` }}>
                <div className="text-xs font-bold text-white mb-2">Expertise</div>
                <div className="space-y-1.5">
                  {['Visa & Immigration Law', 'Qualification Recognition (ZAB)', 'Skill Assessment & Gap Analysis', 'Post-Arrival Integration'].map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: TEXT2 }}>
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: SUCCESS }} />
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

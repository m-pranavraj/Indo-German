import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Bot, Sparkles, ArrowRight, CheckCircle2, Download, RotateCcw, Loader2, Euro, Clock, ChevronRight, Plane } from 'lucide-react';
import axios from 'axios';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const PURPLE = '#C084FC';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2 = '#C4B5FD';

type Gender = 'male' | 'female' | 'other';

const QUESTIONS = [
  { id: 'name', question: "नमस्ते! 🇮🇳 I'm your Indo German AI guide.\n\nMay I know your full name?", placeholder: 'e.g. Rahul Sharma', autoFill: 'Rahul Sharma', type: 'text', readinessContrib: 3 },
  { id: 'age', question: "Great to meet you, {name}! 😊\n\nHow old are you?", placeholder: 'e.g. 26', autoFill: '26', type: 'number', readinessContrib: 3 },
  { id: 'education', question: "What is your highest educational qualification?\n\n(e.g. ITI Certificate, Diploma, B.Tech, B.Sc Nursing…)", placeholder: 'e.g. Diploma in Mechanical Engineering', autoFill: 'Diploma in Automotive Engineering (3 years)', type: 'text', readinessContrib: 10 },
  { id: 'occupation', question: "What trade or profession do you currently work in, {name}?", placeholder: 'e.g. Automotive Mechanic, Nurse, Electrician…', autoFill: 'Automotive Mechanic (Kfz-Mechatroniker)', type: 'text', readinessContrib: 10 },
  { id: 'experience', question: "How many years of experience do you have in {occupation}?", placeholder: 'e.g. 4', autoFill: '4', type: 'number', readinessContrib: 10 },
  { id: 'city', question: "Which city or district in India are you currently based in?", placeholder: 'e.g. Pune, Nashik, Nagpur…', autoFill: 'Pune', type: 'text', readinessContrib: 4 },
  { id: 'germanLevel', question: "What is your current German language level? 🇩🇪\n\n(Even A0 / None is totally fine — we have training programs!)", placeholder: '', autoFill: 'A2 (Basic)', type: 'select', options: ['None / A0 — Just starting', 'A1 (Beginner)', 'A2 (Basic)', 'B1 (Intermediate)', 'B2 (Upper-Intermediate)', 'C1 (Advanced)'], readinessContrib: 15 },
  { id: 'hasPassport', question: "Do you hold a valid Indian passport? 🛂", placeholder: '', autoFill: 'Yes, valid passport', type: 'select', options: ['Yes, valid passport', 'No — need to apply', 'Applied — awaiting'], readinessContrib: 10 },
  { id: 'sector', question: "Which sector interests you most for working in Germany? 🇩🇪", placeholder: '', autoFill: 'Automotive / Engineering', type: 'select', options: ['Automotive / Engineering', 'Healthcare / Nursing', 'Construction / Civil', 'Hospitality / Tourism', 'IT / Technology', 'Agriculture / Food', 'Logistics / Transport'], readinessContrib: 5 },
  { id: 'motivation', question: "Finally, {name} — what motivates you most to work in Germany? ✨\n\nTell us in your own words.", placeholder: 'e.g. Better career growth, higher income, global experience…', autoFill: 'I want better career opportunities and a higher standard of living for my family.', type: 'text', readinessContrib: 5 },
];

// ── Flight Countdown Banner ──
function FlightCountdownBanner({ timeline, name }: { timeline?: string; name?: string }) {
  const [planePos, setPlanePos] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  // Parse months from timeline string like "14–18 months", "12 months", "About 10 months"
  const months = React.useMemo(() => {
    if (!timeline) return 12;
    const nums = timeline.match(/\d+/g);
    if (!nums) return 12;
    const parsed = nums.map(Number);
    return Math.round(parsed.reduce((a, b) => a + b, 0) / parsed.length);
  }, [timeline]);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2400;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPlanePos(eased * 85);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    if (visible) frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const getColor = () => months <= 8 ? '#00C853' : months <= 14 ? '#A855F7' : '#C084FC';
  const getMessage = () => months <= 6 ? 'Almost there! 🚀' : months <= 12 ? 'Great progress — keep going!' : 'Your journey is mapped out!';

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-700"
      style={{
        background: 'linear-gradient(135deg, #030E1E 0%, #0F0520 40%, #0D1F3C 100%)',
        border: `1px solid ${getColor()}40`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        boxShadow: `0 0 40px ${getColor()}15`,
      }}
    >
      {/* Stars background */}
      <div className="relative p-6 md:p-8">
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                background: '#fff',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇮🇳</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs font-medium px-2" style={{ color: 'rgba(255,255,255,0.4)' }}>your flight path</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-2xl">🇩🇪</span>
          </div>

          {/* Main headline */}
          <div className="text-center mb-6">
            <div className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {name ? `${name}, you are` : 'You are'}
            </div>
            <div className="flex items-baseline justify-center gap-3 flex-wrap">
              <span
                className="font-black leading-none"
                style={{
                  fontSize: 'clamp(3rem, 10vw, 5rem)',
                  color: getColor(),
                  textShadow: `0 0 30px ${getColor()}60`,
                }}
              >
                {months}
              </span>
              <span className="text-2xl font-bold text-white">months</span>
              <span className="text-xl font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>away from</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                flying to Germany
                <span className="text-3xl">✈️</span>
              </span>
            </div>
            <div className="mt-2 text-sm font-medium" style={{ color: getColor() }}>{getMessage()}</div>
          </div>

          {/* Animated flight path */}
          <div className="relative h-12 mb-4">
            {/* Ground track */}
            <div className="absolute inset-y-1/2 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            {/* Dashed completed path */}
            <div
              className="absolute inset-y-1/2 left-0 h-0.5 rounded-full transition-all"
              style={{
                width: `${planePos}%`,
                background: `linear-gradient(90deg, ${getColor()}, ${getColor()}80)`,
                boxShadow: `0 0 6px ${getColor()}`,
              }}
            />
            {/* Plane icon */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-none"
              style={{ left: `${planePos}%`, transform: `translateX(-50%) translateY(-50%)` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: getColor(), boxShadow: `0 0 12px ${getColor()}` }}
              >
                <Plane className="w-4 h-4 text-white rotate-45" />
              </div>
            </div>
            {/* Origin / Destination */}
            <div className="absolute left-0 -bottom-1 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>🇮🇳 India</div>
            <div className="absolute right-0 -bottom-1 text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Germany 🇩🇪</div>
          </div>

          {/* Month markers */}
          <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Training', months: Math.round(months * 0.25) },
              { label: 'Credential Recognition', months: Math.round(months * 0.5) },
              { label: 'Employer Match', months: Math.round(months * 0.7) },
              { label: '✈ Fly to Germany', months },
            ].map((milestone, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                  style={{ background: `${getColor()}20`, border: `1px solid ${getColor()}50`, color: getColor() }}>
                  {i + 1}
                </div>
                <div className="text-[10px] font-medium text-white hidden sm:block">{milestone.label}</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Mo. {milestone.months}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Typing animation hook
function useTypewriter(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    ref.current = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(ref.current!);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(ref.current!);
  }, [text]);

  return { displayed, done };
}

// Animated readiness bar
function ReadinessBar({ score, label }: { score: number; label: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const color = score >= 70 ? SUCCESS : score >= 40 ? ACCENT : '#EF4444';
  return (
    <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: TEXT2 }}>Germany Readiness Score</span>
        <span className="text-2xl font-black" style={{ color }}>{score}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: `linear-gradient(90deg,${color},${color}99)` }}
        />
      </div>
      <div className="text-xs mt-2" style={{ color }}>{label}</div>
    </div>
  );
}

export function AIOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'welcome' | 'questions' | 'result'>('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillText, setAutoFillText] = useState('');
  const [readinessScore, setReadinessScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  const q = QUESTIONS[currentQ];
  const questionText = q?.question
    .replace('{name}', answers.name || 'friend')
    .replace('{occupation}', answers.occupation || 'your field');
  const { displayed: questionDisplayed, done: questionDone } = useTypewriter(step === 'questions' ? (questionText || '') : '', 20);

  // Auto-fill animation
  const startAutoFill = () => {
    if (!q) return;
    setIsAutoFilling(true);
    setAutoFillText('');
    let i = 0;
    const text = q.autoFill;
    const interval = setInterval(() => {
      setAutoFillText(text.slice(0, i + 1));
      setInputValue(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsAutoFilling(false);
      }
    }, 40);
  };

  const handleNext = () => {
    const val = inputValue.trim();
    if (!val) return;
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);

    // Update readiness score
    const newScore = Math.min(95, readinessScore + q.readinessContrib);
    setReadinessScore(newScore);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setInputValue('');
      setAutoFillText('');
    } else {
      // All questions done — call AI
      generateAIResult(newAnswers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAutoFilling) handleNext();
  };

  const generateAIResult = async (profileAnswers: Record<string, string>) => {
    setStep('result');
    setIsGenerating(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/onboard', {
        profile: {
          name: profileAnswers.name || 'Candidate',
          age: profileAnswers.age || '25',
          education: profileAnswers.education || 'Diploma',
          occupation: profileAnswers.occupation || 'Skilled Worker',
          experience: profileAnswers.experience || '3',
          city: profileAnswers.city || 'India',
          germanLevel: profileAnswers.germanLevel || 'None / A0',
          hasPassport: (profileAnswers.hasPassport || '').toLowerCase().startsWith('yes'),
          sector: profileAnswers.sector || 'General',
          motivation: profileAnswers.motivation || '',
          targetRole: profileAnswers.occupation,
        },
      });
      setAiResult(res.data);
      setReadinessScore(res.data.readinessScore || readinessScore);
    } catch (err: any) {
      setError('Could not reach AI service. Showing a sample result below.');
      setAiResult({
        readinessScore: readinessScore,
        readinessLabel: 'Good — Pathway Active',
        roadmap: [
          { phase: 1, title: 'Language Training', duration: '4–6 months', actions: ['Enroll in A1/A2 at Goethe-Institut', 'Practice daily'], cost: '₹18,000' },
          { phase: 2, title: 'Qualification Recognition', duration: '3–4 months', actions: ['Submit to ZAB', 'Pay ~€200 fee'], cost: '₹18,000' },
          { phase: 3, title: 'Employer Matching', duration: '2–3 months', actions: ['Apply on platform', 'Attend interviews'], cost: '₹0' },
          { phase: 4, title: 'Visa Application', duration: '2–3 months', actions: ['Book VFS appointment', 'Submit documents'], cost: '₹30,000' },
        ],
        keyStrengths: [`${profileAnswers.experience} years experience`, `${profileAnswers.education}`, 'India–Germany corridor eligible'],
        nextSteps: ['Start German A1 course', 'Submit documents to ZAB', 'Complete platform profile'],
        estimatedTimeline: '14–20 months',
        estimatedCost: '₹76,000–₹1,08,000',
        targetSalary: '€32,000–€52,000/year',
        germanResume: `LEBENSLAUF\n\nName: ${profileAnswers.name}\nNationalität: Indisch\n\nBerufsprofil\nErfahrener ${profileAnswers.occupation} mit ${profileAnswers.experience} Jahren Berufserfahrung.\n\nSprachkenntnisse\nDeutsch: ${profileAnswers.germanLevel}\nEnglisch: B1`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadResume = () => {
    if (!aiResult?.germanResume) return;
    const blob = new Blob(['\ufeff' + aiResult.germanResume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lebenslauf_${answers.name?.replace(' ', '_') || 'Candidate'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const readinessLabel =
    readinessScore >= 80 ? '🟢 Germany Ready!' :
    readinessScore >= 55 ? '🟡 Pathway Active' :
    readinessScore >= 30 ? '🟠 Getting Started' : '⚪ Early Stage';

  // ── WELCOME SCREEN ──
  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: BG }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-orange"
            style={{ background: 'rgba(168,85,247,0.15)', border: `2px solid ${ACCENT}` }}>
            <Bot className="w-10 h-10" style={{ color: ACCENT }} />
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" style={{ color: PURPLE }} />
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: PURPLE }}>AI Onboarding — Powered by Groq LLaMA</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your journey to<br /><span style={{ color: ACCENT }}>Germany</span> starts here
          </h1>

          <p className="text-base mb-8 leading-relaxed" style={{ color: TEXT2 }}>
            Our AI will ask you <strong style={{ color: '#FFFFFF' }}>10 conversational questions</strong> about your skills and background — then instantly generate your <strong style={{ color: '#FFFFFF' }}>German Lebenslauf</strong>, calculate your <strong style={{ color: ACCENT }}>readiness score</strong>, and create a personalised <strong style={{ color: SUCCESS }}>migration roadmap</strong>.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { n: '10', l: 'Quick Questions', icon: '❓' },
              { n: '~90s', l: 'To complete', icon: '⏱️' },
              { n: '100%', l: 'Free & Private', icon: '🔒' },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="text-xl font-black" style={{ color: ACCENT }}>{s.n}</div>
                <div className="text-xs" style={{ color: TEXT2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('questions')}
            className="w-full py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            style={{ background: ACCENT, color: '#0F0520' }}
          >
            Start AI Journey <ArrowRight className="w-5 h-5" />
          </button>

          <button onClick={() => setLocation('/')} className="mt-4 text-sm" style={{ color: TEXT2 }}>
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  // ── QUESTIONS SCREEN ──
  if (step === 'questions') {
    const progress = ((currentQ) / QUESTIONS.length) * 100;
    return (
      <div className="min-h-screen flex flex-col" style={{ background: BG }}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
              <Bot className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <span className="font-bold text-white text-sm">Indo German AI Guide</span>
          </div>
          <div className="text-sm" style={{ color: TEXT2 }}>{currentQ + 1} / {QUESTIONS.length}</div>
        </div>

        {/* Progress bar */}
        <div className="h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-1 transition-all duration-500" style={{ width: `${progress}%`, background: ACCENT }} />
        </div>

        <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full p-6 gap-8">
          {/* Left: Chat / Questions */}
          <div className="flex-1 space-y-6">
            {/* AI message */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${ACCENT}20` }}>
                <Bot className="w-5 h-5" style={{ color: ACCENT }} />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-5 py-4 max-w-sm"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{questionDisplayed}</p>
                {!questionDone && <span className="inline-block w-1 h-4 ml-1 animate-pulse" style={{ background: ACCENT }} />}
              </div>
            </div>

            {/* Full conversation history */}
            {Object.entries(answers).map(([key, val], idx) => {
              const prevQ = QUESTIONS.find(q2 => q2.id === key);
              const qText = prevQ?.question
                .replace('{name}', answers.name || 'friend')
                .replace('{occupation}', answers.occupation || 'your field')
                .split('\n')[0];
              return (
                <React.Fragment key={key}>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center opacity-60" style={{ background: `${ACCENT}20` }}>
                      <Bot className="w-4 h-4" style={{ color: ACCENT }} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm opacity-60"
                      style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <p className="text-xs text-white whitespace-pre-wrap">{qText}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs"
                      style={{ background: 'rgba(168,85,247,0.15)', color: ACCENT, border: `1px solid rgba(168,85,247,0.25)` }}>
                      {val}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Input */}
            {questionDone && (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  {q.type === 'select' ? (
                    <select
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none"
                      style={{ background: CARD, borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}
                    >
                      <option value="">Select…</option>
                      {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={q.type}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={q.placeholder}
                      className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none"
                      style={{ background: CARD, borderColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}
                      autoFocus
                    />
                  )}
                </div>
                <button onClick={handleNext} disabled={!inputValue.trim()}
                  className="px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-all"
                  style={{ background: ACCENT, color: '#0F0520' }}>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Auto-fill button */}
            {questionDone && !isAutoFilling && !inputValue && (
              <button onClick={startAutoFill}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(192,132,252,0.1)', color: PURPLE, border: `1px solid rgba(192,132,252,0.2)` }}>
                🤖 Auto-fill demo answer
              </button>
            )}
          </div>

          {/* Right: Live readiness */}
          <div className="lg:w-72 space-y-4">
            <ReadinessBar score={readinessScore} label={readinessLabel} />

            <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h4 className="text-sm font-bold text-white mb-3">Profile Progress</h4>
              <div className="space-y-2">
                {QUESTIONS.map((q, i) => {
                  const answered = !!answers[q.id];
                  const current = i === currentQ;
                  return (
                    <div key={q.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{
                          background: answered ? `${SUCCESS}20` : current ? `${ACCENT}20` : 'rgba(255,255,255,0.06)',
                        }}>
                        {answered ? <CheckCircle2 className="w-3 h-3" style={{ color: SUCCESS }} /> :
                          current ? <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} /> : null}
                      </div>
                      <span style={{ color: answered ? SUCCESS : current ? ACCENT : TEXT2 }}>
                        {q.id.charAt(0).toUpperCase() + q.id.slice(1)}
                      </span>
                      {answered && <span className="ml-auto truncate max-w-24" style={{ color: TEXT2 }}>{answers[q.id]}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if (step === 'result') {
    return (
      <div className="min-h-screen" style={{ background: BG }}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" style={{ color: ACCENT }} />
            <span className="font-bold text-white">Your AI Onboarding Report</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setStep('questions'); setCurrentQ(0); setAnswers({}); setReadinessScore(0); setAiResult(null); setInputValue(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: CARD2, color: TEXT2, border: `1px solid ${BORDER}` }}>
              <RotateCcw className="w-3 h-3" /> Start Over
            </button>
            <button onClick={() => setLocation('/')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: ACCENT, color: '#0F0520' }}>
              Sign In to Platform →
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {isGenerating ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${PURPLE}20` }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: PURPLE }} />
              </div>
              <div className="text-xl font-bold text-white mb-2">AI is building your profile…</div>
              <div className="text-sm" style={{ color: TEXT2 }}>Generating German resume, readiness score, and personalised roadmap</div>
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: PURPLE, animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          ) : aiResult ? (
            <>
              {error && <div className="text-sm text-purple-300 bg-amber-400/10 border border-amber-400/20 rounded-lg p-3">{error}</div>}

              {/* ✈ "Months Away" Flight Animation Banner */}
              <FlightCountdownBanner timeline={aiResult.estimatedTimeline} name={answers.name} />

              {/* Hero readiness */}
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,#130828,#1A0B3B)', border: `1px solid ${BORDER}` }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="text-sm mb-1" style={{ color: TEXT2 }}>Hello, {answers.name || 'Candidate'}! Here's your profile:</div>
                    <h2 className="text-2xl font-bold text-white mb-1">{aiResult.readinessLabel}</h2>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div><div className="text-lg font-bold" style={{ color: ACCENT }}>{aiResult.estimatedTimeline}</div><div className="text-xs" style={{ color: TEXT2 }}>Timeline</div></div>
                      <div><div className="text-lg font-bold" style={{ color: SUCCESS }}>{aiResult.targetSalary}</div><div className="text-xs" style={{ color: TEXT2 }}>Target Salary</div></div>
                      <div><div className="text-lg font-bold" style={{ color: PURPLE }}>{aiResult.estimatedCost}</div><div className="text-xs" style={{ color: TEXT2 }}>Investment</div></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-7xl font-black" style={{ color: aiResult.readinessScore >= 70 ? SUCCESS : aiResult.readinessScore >= 45 ? ACCENT : '#EF4444' }}>
                      {aiResult.readinessScore}
                    </div>
                    <div className="text-sm" style={{ color: TEXT2 }}>/ 100</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roadmap */}
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h3 className="text-lg font-bold text-white mb-4">🗺️ Your Migration Roadmap</h3>
                  <div className="space-y-4">
                    {(aiResult.roadmap || []).map((phase: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: ACCENT, color: '#0F0520' }}>{phase.phase}</div>
                          {i < aiResult.roadmap.length - 1 && <div className="w-0.5 h-full mx-auto mt-1" style={{ background: 'rgba(168,85,247,0.2)' }} />}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{phase.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${ACCENT}15`, color: ACCENT }}>{phase.duration}</span>
                          </div>
                          <ul className="space-y-0.5">
                            {(phase.actions || []).map((a: string, j: number) => (
                              <li key={j} className="text-xs flex items-center gap-1" style={{ color: TEXT2 }}>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: ACCENT }} />{a}
                              </li>
                            ))}
                          </ul>
                          {phase.cost && <div className="text-xs mt-1.5 font-medium" style={{ color: SUCCESS }}>Cost: {phase.cost}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* German Resume preview + download */}
                <div className="space-y-4">
                  <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid rgba(0,200,83,0.2)` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: SUCCESS }}>🇩🇪 German Lebenslauf Generated</span>
                      </div>
                      <button onClick={handleDownloadResume}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: SUCCESS, color: '#0F0520' }}>
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                    <div className="rounded-xl p-3 font-mono text-xs overflow-y-auto max-h-52"
                      style={{ background: '#020D1A', color: '#E8EDF5', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'pre-wrap' }}>
                      {aiResult.germanResume}
                    </div>
                  </div>

                  {/* Strengths + next steps */}
                  <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <h4 className="text-sm font-bold text-white mb-2">✅ Your Key Strengths</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(aiResult.keyStrengths || []).map((s: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,200,83,0.1)', color: SUCCESS }}>{s}</span>
                      ))}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">🚀 Immediate Next Steps</h4>
                    <div className="space-y-1.5">
                      {(aiResult.nextSteps || []).map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: ACCENT, color: '#0F0520' }}>{i + 1}</div>
                          <span style={{ color: TEXT2 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(192,132,252,0.1))', border: `1px solid ${BORDER}` }}>
                <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: ACCENT }} />
                <h3 className="text-xl font-bold text-white mb-2">Ready to begin your Germany journey?</h3>
                <p className="text-sm mb-4" style={{ color: TEXT2 }}>Create your free account to access the full platform — language training, recognition support, employer matching, and visa assistance.</p>
                <button onClick={() => setLocation('/')}
                  className="px-8 py-3 rounded-xl font-bold text-base"
                  style={{ background: ACCENT, color: '#0F0520' }}>
                  Sign In to Platform →
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}

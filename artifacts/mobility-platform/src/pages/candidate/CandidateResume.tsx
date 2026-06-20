import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Upload, Download, AlertCircle, CheckCircle2, ChevronRight, BarChart3, Bot, Zap, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import axios from 'axios';

const CARD = '#183256';
const CARD2 = '#102544';
const ACCENT = '#FF9D00';
const SUCCESS = '#00C853';
const PURPLE = '#8B5CF6';
const BORDER = 'rgba(255,157,0,0.15)';
const TEXT2 = '#B8C4D9';
const DANGER = '#EF4444';

const MOCK_ATS = {
  atsScore: 68,
  scoreBreakdown: [
    { name: 'Format', score: 85 },
    { name: 'Keywords', score: 45 },
    { name: 'Experience', score: 70 },
    { name: 'Education', score: 90 },
    { name: 'Language', score: 50 },
  ],
  suggestions: [
    { id: 1, priority: 'HIGH', section: 'Professional Summary', text: 'Your summary lacks specific German industry keywords. German employers prefer direct statements of technical competence over soft skills.', example: 'IHK-recognized Automotive Mechanic with 4 years experience in EV diagnostics. Certified in high-voltage systems (Level 2). B1 German proficiency.' },
    { id: 2, priority: 'HIGH', section: 'Work Experience', text: 'Format dates to MM.YYYY - MM.YYYY standard. Ensure job titles match standard German occupation profiles (Berufsprofile).', example: '04.2020 - 08.2023 | Kfz-Mechatroniker | Tata Motors, Pune' },
    { id: 3, priority: 'MEDIUM', section: 'Language Skills', text: 'Use the CEFR framework (A1-C2) strictly. Do not use "Fluent" or "Native" without CEFR context.', example: 'Deutsch: B1 (Goethe-Zertifikat, 2023) | Englisch: C1' },
  ],
  keywords: ['Kfz-Mechatroniker', 'Diagnosetechnik', 'Hochvoltsysteme', 'Wartung', 'Reparatur', 'B1-Niveau', 'IHK FOSA'],
};

const SAMPLE_RESUME = `Rahul Sharma
rahul.sharma@email.com | +91-9876543210 | Pune, Maharashtra

PROFESSIONAL SUMMARY
Experienced Automotive Mechanic with 4 years of hands-on experience in vehicle maintenance, diagnostics, and repair at Tata Motors. Skilled in engine overhauling, brake systems, and electrical troubleshooting. Currently learning German (A2 level).

WORK EXPERIENCE
Automotive Mechanic | Tata Motors, Pune | April 2020 – Present
- Performed routine maintenance and complex repairs on passenger vehicles
- Diagnosed engine, transmission, and electrical system faults
- Completed 200+ service orders monthly with 98% customer satisfaction
- Trained 3 junior technicians on diagnostic equipment

Junior Mechanic | AutoCare Workshop, Pune | June 2018 – March 2020
- Oil changes, tire rotations, brake pad replacements
- Vehicle inspection and pre-delivery checks

EDUCATION
Diploma in Automotive Engineering | Government Polytechnic Pune | 2018
Secondary School Certificate | Maharashtra Board | 2015

SKILLS
- Engine Diagnostics & Repair
- Electrical Systems
- Hydraulic Systems
- Computer Diagnostics (OBD2)

LANGUAGES
English: Intermediate
Hindi: Native
German: A2 (Currently enrolled in B1 course)`;

const TARGET_ROLES = [
  'Kfz-Mechatroniker (Automotive Mechanic)',
  'Krankenpfleger / Krankenschwester (Nurse)',
  'Elektriker (Electrician)',
  'Installateur (Plumber)',
  'Softwareentwickler (Software Developer)',
  'Koch (Chef)',
  'Altenpfleger (Care Worker)',
  'Berufskraftfahrer (Truck Driver)',
  'Friseur (Hair Stylist)',
  'Bauarbeiter (Construction Worker)',
];

// ── Robotic Scan Animation Component ─────────────────────────────
function RoboticScanner({ progress }: { progress: number }) {
  const chars = '01ABCDEFGHIJKLMNOPRSTUVWXYZ'.split('');
  const [matrixChars, setMatrixChars] = useState<string[]>(() => Array.from({ length: 120 }, () => chars[Math.floor(Math.random() * chars.length)]));

  useEffect(() => {
    const interval = setInterval(() => {
      setMatrixChars(prev => prev.map(() => chars[Math.floor(Math.random() * chars.length)]));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ background: '#020D1A', border: '1px solid rgba(255,157,0,0.4)', minHeight: 280 }}>
      {/* Matrix background */}
      <div className="absolute inset-0 grid grid-cols-12 gap-1 p-4 opacity-30 font-mono text-xs overflow-hidden">
        {matrixChars.map((c, i) => (
          <span key={i} style={{ color: i % 7 === 0 ? ACCENT : '#1E5C2A', opacity: Math.random() > 0.5 ? 1 : 0.3 }}>{c}</span>
        ))}
      </div>

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-0.5 z-10 transition-all duration-300"
        style={{ top: `${progress}%`, background: `linear-gradient(90deg, transparent, ${ACCENT}, ${ACCENT}, transparent)`, boxShadow: `0 0 20px ${ACCENT}` }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 glow-orange"
          style={{ background: 'rgba(255,157,0,0.15)', border: `2px solid ${ACCENT}` }}>
          <Bot className="w-8 h-8" style={{ color: ACCENT }} />
        </div>
        <div className="font-mono text-sm font-bold mb-2" style={{ color: ACCENT }}>
          TRANSLATING DOCUMENT...
        </div>
        <div className="font-mono text-xs mb-4" style={{ color: TEXT2 }}>
          {progress < 30 ? 'PARSING STRUCTURE...' : progress < 60 ? 'CONVERTING TO DEUTSCH...' : progress < 85 ? 'FORMATTING LEBENSLAUF...' : 'FINALISING...'}
        </div>
        <div className="w-64 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${ACCENT}, #FFD700)` }} />
        </div>
        <div className="mt-2 font-mono text-xs" style={{ color: ACCENT }}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

// ── Document Page Component ────────────────────────────────────────
function DocumentPage({ title, content, lang }: { title: string; content: string; lang: 'en' | 'de' }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4" style={{ color: lang === 'de' ? SUCCESS : ACCENT }} />
        <span className="text-sm font-bold" style={{ color: lang === 'de' ? SUCCESS : ACCENT }}>{title}</span>
        {lang === 'de' && <Badge className="text-[10px] border-none" style={{ background: 'rgba(0,200,83,0.2)', color: SUCCESS }}>German Lebenslauf</Badge>}
      </div>
      <div
        className="flex-1 rounded-xl p-5 font-mono text-xs leading-relaxed overflow-y-auto"
        style={{
          background: lang === 'de' ? 'rgba(0,200,83,0.04)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${lang === 'de' ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.1)'}`,
          color: '#E8EDF5',
          whiteSpace: 'pre-wrap',
          minHeight: 400,
          maxHeight: 520,
        }}
      >
        {content}
      </div>
    </div>
  );
}

export function CandidateResume() {
  const [activeTab, setActiveTab] = useState<'advisor' | 'translate' | 'gap'>('advisor');
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  // Translation tab state
  const [resumeText, setResumeText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [germanResume, setGermanResume] = useState('');
  const [translateError, setTranslateError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gap analysis state
  const [gapResumeText, setGapResumeText] = useState('');
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [gapResult, setGapResult] = useState<any>(null);
  const [gapError, setGapError] = useState('');

  const toggleOpen = (id: number) => setOpenStates(prev => ({ ...prev, [id]: !prev[id] }));

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target?.result as string || '');
    reader.readAsText(file);
  };

  // Resume translation
  const handleTranslate = async () => {
    const text = resumeText || SAMPLE_RESUME;
    if (text.trim().length < 50) { setTranslateError('Please paste your resume text or upload a file.'); return; }
    setTranslateError('');
    setGermanResume('');
    setIsTranslating(true);
    setScanProgress(0);

    // Animate progress
    const progressInterval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 90) { clearInterval(progressInterval); return 90; }
        return p + (Math.random() * 8 + 2);
      });
    }, 200);

    try {
      const res = await axios.post('/api/ai/translate-resume', { resumeText: text });
      clearInterval(progressInterval);
      setScanProgress(100);
      await new Promise(r => setTimeout(r, 400));
      setGermanResume(res.data.germanResume);
    } catch (err: any) {
      clearInterval(progressInterval);
      setTranslateError(err?.response?.data?.error || 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Download German resume
  const handleDownload = () => {
    if (!germanResume) return;
    const bom = '\ufeff';
    const blob = new Blob([bom + germanResume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lebenslauf_Deutschland.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Gap analysis
  const handleGapAnalysis = async () => {
    const text = gapResumeText || SAMPLE_RESUME;
    if (!targetRole) { setGapError('Please select a target role.'); return; }
    setGapError('');
    setGapResult(null);
    setIsAnalysing(true);
    try {
      const res = await axios.post('/api/ai/gap-analysis', { resumeText: text, targetRole });
      setGapResult(res.data);
    } catch (err: any) {
      setGapError(err?.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalysing(false);
    }
  };

  const tabs = [
    { id: 'advisor', label: '🤖 AI Advisor', badge: null },
    { id: 'translate', label: '🇩🇪 German Translator', badge: 'Groq AI' },
    { id: 'gap', label: '📊 Gap Analysis', badge: 'Groq AI' },
  ] as const;

  return (
    <div className="space-y-6 min-h-screen" style={{ background: '#07142B' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7" style={{ color: ACCENT }} />
            AI Resume Suite
          </h1>
          <p className="mt-1" style={{ color: TEXT2 }}>Powered by Groq LLaMA — Optimize for German ATS, translate to Lebenslauf, and identify skill gaps</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? (tab.id === 'advisor' ? ACCENT : PURPLE) : CARD2,
              color: activeTab === tab.id ? '#07142B' : TEXT2,
              border: `1px solid ${activeTab === tab.id ? (tab.id === 'advisor' ? ACCENT : PURPLE) : BORDER}`,
            }}>
            {tab.label}
            {tab.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: activeTab === tab.id ? '#07142B' : PURPLE }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: AI ADVISOR ────────────────────────────────── */}
      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ATS Score */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg,#07142B,#102544)' }}>
                <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: TEXT2 }}>German ATS Score</div>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56"
                      stroke={ACCENT} strokeWidth="12" fill="none"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={(2 * Math.PI * 56) * (1 - MOCK_ATS.atsScore / 100)}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute">
                    <span className="text-4xl font-black text-white">{MOCK_ATS.atsScore}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium" style={{ color: TEXT2 }}>Needs Improvement</div>
              </div>
              <div className="p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: TEXT2 }}>
                  <BarChart3 className="w-4 h-4" /> Score Breakdown
                </h3>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_ATS.scoreBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT2 }} width={70} />
                      <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                        {MOCK_ATS.scoreBreakdown.map((e, i) => (
                          <Cell key={i} fill={e.score >= 80 ? SUCCESS : e.score >= 60 ? ACCENT : DANGER} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-sm font-bold text-white mb-3">German Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_ATS.keywords.map((kw, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,157,0,0.12)', color: ACCENT }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white">AI Improvement Suggestions</h2>
            {MOCK_ATS.suggestions.map(sug => (
              <div key={sug.id} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: sug.priority === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(255,157,0,0.2)', color: sug.priority === 'HIGH' ? '#EF4444' : ACCENT }}>
                    {sug.priority}
                  </span>
                  <h3 className="font-bold text-white">{sug.section}</h3>
                </div>
                <div className="flex gap-3 mb-3">
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${sug.priority === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                  <p className="text-sm" style={{ color: TEXT2 }}>{sug.text}</p>
                </div>
                <Collapsible open={openStates[sug.id]} onOpenChange={() => toggleOpen(sug.id)}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-1 text-xs font-semibold" style={{ color: ACCENT }}>
                      <ChevronRight className={`w-3 h-3 transition-transform ${openStates[sug.id] ? 'rotate-90' : ''}`} />
                      View Example
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="rounded-lg p-3 text-xs font-mono border-l-4" style={{ background: '#020D1A', borderColor: ACCENT, color: '#E8EDF5' }}>
                      {sug.example}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: GERMAN TRANSLATOR ──────────────────────────── */}
      {activeTab === 'translate' && (
        <div className="space-y-6">
          {!germanResume && !isTranslating && (
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5" style={{ color: PURPLE }} />
                <h2 className="text-lg font-bold text-white">Translate Resume to German Lebenslauf</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: PURPLE }}>Groq LLaMA</span>
              </div>
              <p className="text-sm mb-5" style={{ color: TEXT2 }}>
                Paste your resume text below or upload a .txt file. Our AI will convert it to a professional German Lebenslauf following DIN 5008 standards.
              </p>

              {/* Upload area */}
              <div
                className="rounded-xl border-2 border-dashed p-4 text-center mb-4 cursor-pointer transition-all hover:border-[#FF9D00]"
                style={{ borderColor: 'rgba(255,255,255,0.1)', background: CARD2 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: TEXT2 }} />
                <div className="text-sm text-white font-medium">Click to upload .txt file</div>
                <div className="text-xs mt-1" style={{ color: TEXT2 }}>Or paste your resume below</div>
                <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </div>

              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder={`Paste your resume here…\n\nExample:\nJohn Smith\njohn@email.com\n\nExperience:\n- Automotive Mechanic at Tata Motors (2020-2024)\n…`}
                rows={10}
                className="w-full rounded-xl p-4 text-sm font-mono border focus:outline-none resize-none"
                style={{ background: '#020D1A', borderColor: 'rgba(255,255,255,0.1)', color: '#E8EDF5' }}
              />

              {translateError && (
                <div className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{translateError}</div>
              )}

              <div className="flex gap-3 mt-4">
                <button onClick={handleTranslate}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: PURPLE, color: '#FFFFFF' }}>
                  <Zap className="w-4 h-4" />
                  Translate to German
                </button>
                {!resumeText && (
                  <button onClick={() => setResumeText(SAMPLE_RESUME)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium"
                    style={{ background: CARD2, color: TEXT2, border: `1px solid ${BORDER}` }}>
                    Use Sample Resume
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scanning Animation */}
          {isTranslating && (
            <RoboticScanner progress={scanProgress} />
          )}

          {/* Side-by-Side Result */}
          {germanResume && !isTranslating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: SUCCESS }} />
                  <span className="font-bold text-white">Translation Complete!</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setGermanResume(''); setResumeText(''); setScanProgress(0); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                    style={{ background: CARD2, color: TEXT2, border: `1px solid ${BORDER}` }}>
                    <RefreshCw className="w-3.5 h-3.5" /> New Translation
                  </button>
                  <button onClick={handleDownload}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: SUCCESS, color: '#07142B' }}>
                    <Download className="w-3.5 h-3.5" /> Download Lebenslauf
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <DocumentPage title="Original Resume (English)" content={resumeText || SAMPLE_RESUME} lang="en" />
                </div>
                <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid rgba(0,200,83,0.2)` }}>
                  <DocumentPage title="German Lebenslauf (Translated)" content={germanResume} lang="de" />
                </div>
              </div>

              <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)', color: TEXT2 }}>
                <strong style={{ color: SUCCESS }}>✅ Translation complete.</strong> Your German Lebenslauf follows DIN 5008 standards and is formatted for German ATS systems. Download as .txt and convert to PDF using Word or Google Docs.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: GAP ANALYSIS ───────────────────────────────── */}
      {activeTab === 'gap' && (
        <div className="space-y-6">
          {!gapResult && !isAnalysing && (
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" style={{ color: PURPLE }} />
                <h2 className="text-lg font-bold text-white">Resume Gap Analysis</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: PURPLE }}>Groq AI</span>
              </div>
              <p className="text-sm mb-5" style={{ color: TEXT2 }}>
                Select your target German role and provide your resume. AI will identify gaps and recommend actions to boost your match score.
              </p>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block" style={{ color: TEXT2 }}>Target German Role</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm border"
                  style={{ background: CARD2, borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
                >
                  {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block" style={{ color: TEXT2 }}>Your Resume (paste below, or leave blank for demo)</label>
                <textarea
                  value={gapResumeText}
                  onChange={e => setGapResumeText(e.target.value)}
                  placeholder="Paste your resume here, or leave blank to use sample resume…"
                  rows={8}
                  className="w-full rounded-xl p-4 text-sm font-mono border focus:outline-none resize-none"
                  style={{ background: '#020D1A', borderColor: 'rgba(255,255,255,0.1)', color: '#E8EDF5' }}
                />
              </div>

              {gapError && (
                <div className="mb-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{gapError}</div>
              )}

              <button onClick={handleGapAnalysis}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: PURPLE, color: '#FFFFFF' }}>
                <Zap className="w-4 h-4" />
                Analyse My Profile
              </button>
            </div>
          )}

          {isAnalysing && (
            <div className="rounded-2xl p-12 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(139,92,246,0.2)' }}>
                <Bot className="w-8 h-8 animate-pulse" style={{ color: PURPLE }} />
              </div>
              <div className="text-lg font-bold text-white mb-2">Analysing Your Profile…</div>
              <div className="text-sm" style={{ color: TEXT2 }}>AI is comparing your resume against {targetRole}</div>
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: PURPLE, animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {gapResult && !isAnalysing && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: SUCCESS }} />
                  <span className="font-bold text-white">Analysis Complete</span>
                </div>
                <button onClick={() => setGapResult(null)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
                  style={{ background: CARD2, color: TEXT2, border: `1px solid ${BORDER}` }}>
                  <RefreshCw className="w-3.5 h-3.5" /> New Analysis
                </button>
              </div>

              {/* Overall Score */}
              <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,#102544,#183256)', border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ color: TEXT2 }}>Overall Match for</div>
                    <div className="text-lg font-bold text-white">{targetRole}</div>
                    <div className="text-sm mt-1" style={{ color: TEXT2 }}>{gapResult.matchLabel}</div>
                    <div className="mt-3 flex gap-6">
                      <div><div className="text-xl font-bold" style={{ color: ACCENT }}>~{gapResult.timelineWeeks}w</div><div className="text-xs" style={{ color: TEXT2 }}>Timeline</div></div>
                      <div><div className="text-xl font-bold" style={{ color: SUCCESS }}>₹{(gapResult.estimatedCostINR / 1000).toFixed(0)}K</div><div className="text-xs" style={{ color: TEXT2 }}>Invest</div></div>
                      <div><div className="text-xl font-bold" style={{ color: BLUE }}>{gapResult.languageRequirement}</div><div className="text-xs" style={{ color: TEXT2 }}>Lang req.</div></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-7xl font-black" style={{ color: gapResult.overallMatch >= 75 ? SUCCESS : gapResult.overallMatch >= 55 ? ACCENT : DANGER }}>
                      {gapResult.overallMatch}
                    </div>
                    <div className="text-sm" style={{ color: TEXT2 }}>/ 100</div>
                  </div>
                </div>
              </div>

              {/* Section Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(gapResult.sections || []).map((sec: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-white">{sec.category}</span>
                      <span className="text-xl font-black" style={{ color: sec.score >= 70 ? SUCCESS : sec.score >= 50 ? ACCENT : DANGER }}>{sec.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${sec.score}%`, background: sec.score >= 70 ? SUCCESS : sec.score >= 50 ? ACCENT : DANGER }} />
                    </div>
                    <div className="text-xs mb-1" style={{ color: TEXT2 }}>Gap: {sec.gap}</div>
                    <div className="text-xs font-medium" style={{ color: ACCENT }}>→ {sec.action}</div>
                  </div>
                ))}
              </div>

              {/* Missing skills + strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h4 className="text-sm font-bold mb-3" style={{ color: DANGER }}>❌ Missing / Gaps</h4>
                  <div className="flex flex-wrap gap-2">
                    {(gapResult.missingSkills || []).map((s: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h4 className="text-sm font-bold mb-3" style={{ color: SUCCESS }}>✅ Your Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {(gapResult.strengths || []).map((s: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,200,83,0.1)', color: SUCCESS }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Urgent actions */}
              <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <h4 className="text-sm font-bold text-white mb-3">🚀 Urgent Next Steps</h4>
                <div className="space-y-2">
                  {(gapResult.urgentActions || []).map((action: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: ACCENT, color: '#07142B' }}>{i + 1}</div>
                      <span style={{ color: TEXT2 }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const BLUE = '#3B82F6';

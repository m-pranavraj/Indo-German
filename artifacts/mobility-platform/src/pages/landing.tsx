import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Loader2, Sparkles, ArrowRight, Globe, CheckCircle2, ShieldCheck,
  ChevronDown, ChevronUp, Bot, Zap, Users, Building, MapPin, Star
} from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'wouter';

const ACCENT = '#A855F7';
const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.2)';
const SUCCESS = '#00C853';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const DEMO_CANDIDATE = {
  name: 'Arjun Sharma',
  role: 'Automotive Mechanic',
  location: 'Pune, Maharashtra',
  email: 'arjun.sharma@gmail.com',
  password: 'Demo@1234',
  readiness: 78,
  stage: 'Employer Matching',
  langLevel: 'B1',
  employer: 'Bosch GmbH — Interview Scheduled',
  tags: ['IHK Recognized', 'B1 Certified', 'Visa Ready'],
};

export function LandingPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const handleDemoLogin = async () => {
    setIsLoading(true); setLoginError(null);
    try {
      const res = await axios.post('/api/auth/login', {
        email: DEMO_CANDIDATE.email,
        password: DEMO_CANDIDATE.password,
      });
      login(res.data.user, res.data.token);
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally { setIsLoading(false); }
  };

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true); setLoginError(null);
    try {
      const res = await axios.post('/api/auth/login', { email: data.email, password: data.password });
      login(res.data.user, res.data.token);
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Invalid credentials.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: BG }}>

      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full opacity-[0.08] blur-3xl" style={{ background: 'radial-gradient(circle, #C084FC, transparent)' }} />
      </div>

      {/* ── LEFT HERO PANEL ── */}
      <div className="relative z-10 lg:w-[58%] text-white p-10 lg:p-16 flex flex-col justify-between"
        style={{ background: 'linear-gradient(150deg, #0A0118 0%, #130828 50%, #1A0B3B 100%)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #A855F7)', boxShadow: '0 0 24px rgba(168,85,247,0.45)' }}>
            IG
          </div>
          <div>
            <div className="font-black text-xl tracking-tight">Indo German</div>
            <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#6B3FA0' }}>Mobility Corridor Platform</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 w-fit"
            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#C4B5FD' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: SUCCESS }} />
            Live · 24,318 Candidates · 523 German Employers
          </div>

          <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-6">
            Your career<br />
            in{' '}
            <span style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #C084FC 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Germany
            </span>
            <br />starts here.
          </h1>

          <p className="text-base leading-relaxed mb-10" style={{ color: '#8B6DB2' }}>
            A verified digital pipeline connecting Indian skilled workers with German employers —
            language training, credential recognition, visa support, and post-arrival integration.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { n: '10,847', l: 'Active Job Openings' },
              { n: '96.4%', l: 'Visa Success Rate' },
              { n: '€52,400', l: 'Avg. Annual Salary' },
              { n: '3,612', l: 'Successful Placements' },
              { n: '47', l: 'Training Institutes' },
              { n: '16', l: 'German States Hiring' },
            ].map(s => (
              <div key={s.l} className="rounded-2xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}>
                <div className="text-2xl font-black mb-0.5" style={{ color: ACCENT }}>{s.n}</div>
                <div className="text-xs leading-tight" style={{ color: '#6B3FA0' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Journey steps */}
          <div className="space-y-2.5">
            {[
              'Registration & Eligibility Assessment',
              'Language Training (A1 → B2)',
              'Qualification Recognition (ZAB / ANABIN)',
              'Employer Matching & Interviews',
              'Visa Application & Pre-departure',
              'Arrival & Integration in Germany 🇩🇪',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: '#7C5BA8' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${i < 2 ? '#6D28D9,#A855F7' : i < 4 ? '#A855F7,#C084FC' : '#C084FC,#E879F9'})`, color: '#fff' }}>
                  {i + 1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-[11px]" style={{ color: '#2D1555' }}>
          © {new Date().getFullYear()} Indo German Mobility Corridor · Indo–German Partnership Initiative
        </div>
      </div>

      {/* ── RIGHT LOGIN PANEL ── */}
      <div className="relative z-10 lg:w-[42%] flex items-center justify-center p-8 lg:p-12 overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #0D0520 0%, #0A0118 100%)' }}>
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Welcome</h2>
            <p className="text-sm" style={{ color: TEXT2 }}>Choose how you'd like to explore the platform.</p>
          </div>

          {/* ── Card 1: Demo Candidate ── */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full text-left mb-4 rounded-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] group disabled:opacity-70"
            style={{
              background: 'linear-gradient(135deg, #1E0D3F 0%, #2A1258 100%)',
              border: '1.5px solid rgba(168,85,247,0.35)',
              boxShadow: '0 8px 32px rgba(168,85,247,0.12)',
            }}
          >
            {/* Card header */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-base"
                    style={{ background: 'linear-gradient(135deg, #6D28D9, #A855F7)', boxShadow: '0 0 12px rgba(168,85,247,0.4)' }}>
                    A
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{DEMO_CANDIDATE.name}</div>
                    <div className="text-xs" style={{ color: TEXT2 }}>{DEMO_CANDIDATE.role} · {DEMO_CANDIDATE.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: SUCCESS }}>{DEMO_CANDIDATE.readiness}</div>
                  <div className="text-[9px] uppercase tracking-widest" style={{ color: TEXT2 }}>/ 100</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${DEMO_CANDIDATE.readiness}%`, background: `linear-gradient(90deg, ${ACCENT}, ${SUCCESS})` }} />
              </div>

              {/* Metric pills */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(168,85,247,0.08)' }}>
                  <div className="text-[10px]" style={{ color: TEXT2 }}>Stage</div>
                  <div className="text-xs font-bold text-white truncate">{DEMO_CANDIDATE.stage}</div>
                </div>
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(168,85,247,0.08)' }}>
                  <div className="text-[10px]" style={{ color: TEXT2 }}>German</div>
                  <div className="text-xs font-bold" style={{ color: ACCENT }}>{DEMO_CANDIDATE.langLevel}</div>
                </div>
                <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(0,200,83,0.08)' }}>
                  <div className="text-[10px]" style={{ color: TEXT2 }}>Status</div>
                  <div className="text-xs font-bold" style={{ color: SUCCESS }}>Active</div>
                </div>
              </div>

              <div className="text-xs mb-3 rounded-lg px-3 py-2" style={{ background: 'rgba(0,200,83,0.08)', color: SUCCESS, border: '1px solid rgba(0,200,83,0.2)' }}>
                🏢 {DEMO_CANDIDATE.employer}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {DEMO_CANDIDATE.tags.map(t => (
                  <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(168,85,247,0.12)', color: ACCENT, border: '1px solid rgba(168,85,247,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA footer */}
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(168,85,247,0.15)', background: 'rgba(168,85,247,0.04)' }}>
              <span className="text-xs font-semibold" style={{ color: TEXT2 }}>View full candidate journey</span>
              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all group-hover:translate-x-0.5"
                style={{ background: ACCENT, color: '#0F0520' }}>
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><span>Enter as Arjun</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </div>
            </div>
          </button>

          {/* ── Card 2: AI Onboarding ── */}
          <button
            onClick={() => setLocation('/onboarding')}
            className="w-full text-left mb-6 rounded-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] group"
            style={{
              background: 'linear-gradient(135deg, #1A0830 0%, #220B42 100%)',
              border: '1.5px solid rgba(232,121,249,0.3)',
              boxShadow: '0 8px 32px rgba(232,121,249,0.08)',
            }}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Illustration */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(232,121,249,0.2))', border: '1.5px solid rgba(232,121,249,0.3)' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Chat bubbles illustration */}
                    <div className="relative">
                      <div className="absolute -top-3 -left-4 w-6 h-4 rounded-full rounded-bl-none" style={{ background: 'rgba(232,121,249,0.4)' }} />
                      <div className="absolute -bottom-2 -right-4 w-8 h-4 rounded-full rounded-br-none" style={{ background: 'rgba(168,85,247,0.5)' }} />
                      <Bot className="w-6 h-6 relative z-10" style={{ color: '#E879F9' }} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-base">New to Germany?</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(232,121,249,0.15)', color: '#E879F9', border: '1px solid rgba(232,121,249,0.25)' }}>AI</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: TEXT2 }}>
                    Our AI guide asks you 10 conversational questions, then instantly builds your
                    German <strong className="text-white">Lebenslauf</strong>, calculates your{' '}
                    <strong style={{ color: ACCENT }}>readiness score</strong>, and maps your{' '}
                    <strong style={{ color: SUCCESS }}>migration timeline</strong>.
                  </p>
                  <div className="flex gap-3 text-[11px]" style={{ color: '#9B7DB6' }}>
                    <span>✦ 10 questions</span>
                    <span>✦ ~90 seconds</span>
                    <span>✦ Free &amp; private</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(232,121,249,0.12)', background: 'rgba(232,121,249,0.04)' }}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#E879F9' }} />
                <span className="text-xs font-semibold" style={{ color: '#E879F9' }}>Powered by Groq LLaMA</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg group-hover:translate-x-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff' }}>
                Start AI Journey <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>

          {/* Demo login error — always visible */}
          {loginError && !showForm && (
            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2 mb-3">{loginError}</div>
          )}

          {/* Manual login toggle */}
          <div>
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center justify-between w-full text-xs mb-3"
              style={{ color: '#9B7DB6' }}
            >
              <span>Sign in with credentials</span>
              {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showForm && (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
                  <FormField control={loginForm.control} name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Email address"
                            className="text-white placeholder:text-purple-400/40 text-sm border"
                            style={{ background: CARD, borderColor: 'rgba(168,85,247,0.2)', color: '#fff', borderRadius: 12 }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={loginForm.control} name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Password"
                            className="text-white placeholder:text-purple-400/40 text-sm border"
                            style={{ background: CARD, borderColor: 'rgba(168,85,247,0.2)', color: '#fff', borderRadius: 12 }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  {loginError && (
                    <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">{loginError}</div>
                  )}

                  <button type="submit" disabled={isLoading}
                    className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #6D28D9, #A855F7)' }}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                  </button>
                </form>
              </Form>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-5">
            {[
              { icon: <CheckCircle2 className="w-3 h-3" />, text: 'MSDE Aligned' },
              { icon: <Globe className="w-3 h-3" />, text: 'FOSA Verified' },
              { icon: <ShieldCheck className="w-3 h-3" />, text: 'GDPR Compliant' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] font-medium" style={{ color: '#7C5BA8' }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

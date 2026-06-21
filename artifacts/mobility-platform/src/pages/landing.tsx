import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Briefcase, GraduationCap, Map, Building, ShieldCheck, Zap, ChevronDown, ChevronUp, Loader2, Sparkles, Bot, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'wouter';

const ACCENT = '#A855F7';
const ACCENT2 = '#C084FC';
const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.2)';
const SUCCESS = '#00C853';

const roles = [
  { id: 'candidate',    title: 'Candidate',    icon: <User className="w-3.5 h-3.5" /> },
  { id: 'employer',     title: 'Employer',     icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'trainer',      title: 'Trainer',      icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { id: 'facilitator',  title: 'Facilitator',  icon: <Map className="w-3.5 h-3.5" /> },
  { id: 'government',   title: 'Government',   icon: <Building className="w-3.5 h-3.5" /> },
  { id: 'admin',        title: 'Admin',        icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

const demoCreds = [
  { role: 'candidate', label: 'Arjun Sharma',       sub: 'Automotive Mechanic · Employer Matching', email: 'arjun.sharma@gmail.com',     password: 'Demo@1234', badge: '78% Ready',      color: ACCENT },
  { role: 'candidate', label: 'Priya Nair',          sub: 'Nurse · Visa Readiness — Offer received!',  email: 'priya.nair@gmail.com',        password: 'Demo@1234', badge: '91% Ready',      color: SUCCESS },
  { role: 'candidate', label: 'Ravi Kumar',          sub: 'Electrician · Language Training (B1)',       email: 'ravi.kumar@gmail.com',        password: 'Demo@1234', badge: '52% Ready',      color: ACCENT2 },
  { role: 'fresh',     label: 'New to Germany?',     sub: 'AI asks your details, builds your German resume & roadmap', email: '', password: '', badge: '🤖 AI Onboarding', color: '#E879F9' },
  { role: 'employer',  label: 'Robert Bosch GmbH',   sub: 'Automotive · Stuttgart',                     email: 'hr@bosch-germany.de',         password: 'Demo@1234', badge: 'Employer',       color: '#818CF8' },
  { role: 'employer',  label: 'BerlinCare Pflege',   sub: 'Healthcare · Berlin',                        email: 'jobs@carehome-berlin.de',     password: 'Demo@1234', badge: 'Employer',       color: '#818CF8' },
  { role: 'trainer',   label: 'Goethe-Institut Pune',sub: 'Language Training · A1–B2',                  email: 'admin@goethe-pune.in',        password: 'Demo@1234', badge: 'Trainer',        color: '#34D399' },
  { role: 'facilitator',label:'Indo-German Careers', sub: 'Migration Support Agency',                   email: 'ops@indiagermanyjobs.in',     password: 'Demo@1234', badge: 'Facilitator',    color: ACCENT },
  { role: 'government',label: 'MSDE Official',       sub: 'Ministry of Skill Development',              email: 'official@msde.gov.in',        password: 'Demo@1234', badge: 'Government',     color: '#F59E0B' },
  { role: 'admin',     label: 'Platform Admin',      sub: 'Indo German System Admin',                   email: 'admin@mobicorridor.in',       password: 'Demo@1234', badge: 'Admin',          color: '#EF4444' },
];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export function LandingPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string>('candidate');
  const [showDemo, setShowDemo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const handleQuickFill = async (cred: typeof demoCreds[0]) => {
    if (cred.role === 'fresh') { setLocation('/onboarding'); return; }
    setSelectedRole(cred.role);
    setLoginError(null);
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email: cred.email, password: cred.password });
      login(res.data.user, res.data.token);
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Invalid credentials.');
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

  const filteredDemos = demoCreds.filter(d => d.role === selectedRole || (selectedRole === 'candidate' && d.role === 'fresh'));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: BG }}>

      {/* ── Animated BG blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #C084FC, transparent)' }} />
      </div>

      {/* ── Left Panel ── */}
      <div className="relative z-10 lg:w-[55%] text-white p-8 lg:p-14 flex flex-col justify-between"
        style={{ background: 'linear-gradient(145deg, #0F0520 0%, #1A0B3B 60%, #200D45 100%)' }}>

        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
              <span className="relative z-10 text-white">IG</span>
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white">Indo German</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: TEXT2 }}>Mobility Corridor Platform</div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: ACCENT2 }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: SUCCESS }} />
              Live Platform · 24,000+ Candidates Active
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.05] mb-4">
              Your career in<br />
              <span className="relative">
                <span style={{ background: 'linear-gradient(90deg, #A855F7, #C084FC, #E879F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Germany
                </span>
              </span>
              <br />starts here.
            </h1>
            <p className="text-base leading-relaxed max-w-lg" style={{ color: TEXT2 }}>
              A verified digital pipeline connecting Indian skilled workers with German employers — language training, credential recognition, visa support &amp; post-arrival, end-to-end.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { n: '10,000+',    l: 'Active Job Openings' },
              { n: '500+',       l: 'Verified German Employers' },
              { n: '3,500+',     l: 'Successful Placements' },
              { n: '96%',        l: 'Visa Success Rate' },
              { n: '€35K–€70K', l: 'Average Salary Range' },
              { n: '16',         l: 'German States Hiring' },
            ].map(s => (
              <div key={s.l} className="rounded-2xl p-4 relative overflow-hidden group transition-all hover:scale-105"
                style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(168,85,247,0.05)' }} />
                <div className="text-xl font-black mb-1" style={{ color: ACCENT }}>{s.n}</div>
                <div className="text-xs font-medium leading-tight" style={{ color: TEXT2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Journey steps */}
          <div className="space-y-2">
            {[
              'Registration & Eligibility Assessment',
              'Language Training (A1 → B2)',
              'Qualification Recognition (ZAB / ANABIN)',
              'Document Vault & Verification',
              'Employer Matching & Interviews',
              'Visa Application & Pre-departure',
              'Arrival & Integration in Germany 🇩🇪',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: TEXT2 }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${i < 3 ? '#7C3AED' : '#A855F7'}, ${i < 3 ? '#A855F7' : '#C084FC'})`, color: '#fff' }}>
                  {i + 1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs" style={{ color: '#3D2060' }}>
          © {new Date().getFullYear()} Indo German Mobility Corridor Platform · Indo-German Partnership Initiative
        </div>
      </div>

      {/* ── Right Panel (Login) ── */}
      <div className="relative z-10 lg:w-[45%] flex items-start lg:items-center justify-center p-6 lg:p-10 overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #130828 0%, #0F0520 100%)' }}>
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-1">Sign in to your dashboard</h2>
            <p className="text-sm" style={{ color: TEXT2 }}>Select a role and use a quick demo login, or enter credentials.</p>
          </div>

          {/* Role selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {roles.map(r => (
              <button key={r.id} onClick={() => setSelectedRole(r.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: selectedRole === r.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedRole === r.id ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                  color: selectedRole === r.id ? ACCENT : TEXT2,
                  boxShadow: selectedRole === r.id ? '0 0 12px rgba(168,85,247,0.2)' : 'none',
                }}>
                {r.icon}{r.title}
              </button>
            ))}
          </div>

          {/* Demo logins */}
          <div className="mb-5">
            <button className="flex items-center justify-between w-full text-sm font-semibold mb-3"
              style={{ color: TEXT2 }} onClick={() => setShowDemo(v => !v)}>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: ACCENT }} />
                Quick Demo Logins
              </span>
              {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDemo && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                {filteredDemos.map((cred, i) => {
                  const isFresh = cred.role === 'fresh';
                  return (
                    <button key={i} onClick={() => handleQuickFill(cred)} disabled={isLoading}
                      className="w-full text-left p-3 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 group"
                      style={{
                        background: `rgba(${isFresh ? '232,121,249' : '168,85,247'},0.06)`,
                        border: `1px solid rgba(${isFresh ? '232,121,249' : '168,85,247'},0.2)`,
                      }}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                            style={{ background: `${cred.color}20`, color: cred.color }}>
                            {isFresh ? <Bot className="w-4 h-4" /> : cred.label.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{cred.label}</div>
                            <div className="text-xs truncate" style={{ color: TEXT2 }}>{cred.sub}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                          style={{ background: `${cred.color}18`, color: cred.color, border: `1px solid ${cred.color}30` }}>
                          {cred.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.15)' }} />
            <span className="text-xs" style={{ color: '#5B3B8A' }}>or enter credentials</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(168,85,247,0.15)' }} />
          </div>

          {/* Login form */}
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField control={loginForm.control} name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium" style={{ color: TEXT2 }}>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="you@example.com"
                        className="text-white placeholder:text-purple-300 border transition-all focus:ring-2 focus:ring-purple-500/20"
                        style={{ background: '#1A0B3B', borderColor: 'rgba(168,85,247,0.2)', color: '#fff' }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField control={loginForm.control} name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium" style={{ color: TEXT2 }}>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••••"
                        className="text-white placeholder:text-purple-300 border transition-all focus:ring-2 focus:ring-purple-500/20"
                        style={{ background: '#1A0B3B', borderColor: 'rgba(168,85,247,0.2)', color: '#fff' }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              {loginError && (
                <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-3">{loginError}</div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 4px 20px rgba(168,85,247,0.35)' }}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </Form>

          {/* AI Onboarding CTA */}
          <div className="mt-5 p-4 rounded-2xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(232,121,249,0.08))', border: '1px solid rgba(168,85,247,0.25)' }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-xl" style={{ background: '#E879F9' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4" style={{ color: '#E879F9' }} />
                <span className="text-sm font-bold" style={{ color: '#E879F9' }}>AI Onboarding — Fresh Start</span>
              </div>
              <p className="text-xs mb-3" style={{ color: TEXT2 }}>
                New to Germany? Our AI guide builds your German resume &amp; full migration roadmap in minutes.
              </p>
              <button onClick={() => setLocation('/onboarding')}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(232,121,249,0.3))', color: '#E879F9', border: '1px solid rgba(232,121,249,0.3)' }}>
                🤖 Start AI Journey <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-4">
            {[
              { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'MSDE Aligned' },
              { icon: <Globe className="w-3.5 h-3.5" />, text: 'FOSA Verified' },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: 'GDPR Compliant' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] font-medium" style={{ color: '#5B3B8A' }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, GraduationCap, Map, Building, ShieldCheck, Zap, ChevronDown, ChevronUp, Loader2, Sparkles, Bot } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'wouter';

const roles = [
  { id: 'candidate', title: 'Candidate', icon: <User className="w-4 h-4" /> },
  { id: 'employer', title: 'Employer', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'trainer', title: 'Trainer', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'facilitator', title: 'Facilitator', icon: <Map className="w-4 h-4" /> },
  { id: 'government', title: 'Government', icon: <Building className="w-4 h-4" /> },
  { id: 'admin', title: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
];

const demoCreds = [
  { role: 'candidate', label: 'Arjun Sharma', sub: 'Automotive Mechanic · Employer Matching Stage', email: 'arjun.sharma@gmail.com', password: 'Demo@1234', badge: '78% Ready' },
  { role: 'candidate', label: 'Priya Nair', sub: 'Nurse · Visa Readiness — Job offer received!', email: 'priya.nair@gmail.com', password: 'Demo@1234', badge: '91% Ready' },
  { role: 'candidate', label: 'Ravi Kumar', sub: 'Electrician · Language Training (B1)', email: 'ravi.kumar@gmail.com', password: 'Demo@1234', badge: '52% Ready' },
  { role: 'fresh', label: 'New to Germany?', sub: 'AI asks your details, builds your German resume & roadmap', email: '', password: '', badge: '🤖 AI Onboarding' },
  { role: 'employer', label: 'Robert Bosch GmbH', sub: 'Automotive & Manufacturing · Stuttgart', email: 'hr@bosch-germany.de', password: 'Demo@1234', badge: 'Employer' },
  { role: 'employer', label: 'BerlinCare Altenpflege', sub: 'Healthcare & Aged Care · Berlin', email: 'jobs@carehome-berlin.de', password: 'Demo@1234', badge: 'Employer' },
  { role: 'trainer', label: 'Goethe-Institut Pune', sub: 'Language Training Institute · A1–B2', email: 'admin@goethe-pune.in', password: 'Demo@1234', badge: 'Trainer' },
  { role: 'facilitator', label: 'Indo-German Careers', sub: 'Migration Support Agency', email: 'ops@indiagermanyjobs.in', password: 'Demo@1234', badge: 'Facilitator' },
  { role: 'government', label: 'MSDE Official', sub: 'Ministry of Skill Development & Entrepreneurship', email: 'official@msde.gov.in', password: 'Demo@1234', badge: 'Government' },
  { role: 'admin', label: 'Platform Admin', sub: 'Indo German System Administrator', email: 'admin@mobicorridor.in', password: 'Demo@1234', badge: 'Admin' },
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
    if (cred.role === 'fresh') {
      setLocation('/onboarding');
      return;
    }
    setSelectedRole(cred.role);
    setLoginError(null);
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email: cred.email, password: cred.password });
      const { user, token } = res.data;
      login(user, token);
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await axios.post('/api/auth/login', { email: data.email, password: data.password });
      const { user, token } = res.data;
      login(user, token);
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDemos = demoCreds.filter(d =>
    d.role === selectedRole || (selectedRole === 'candidate' && d.role === 'fresh')
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#07142B' }}>
      {/* ── Left Panel ── */}
      <div
        className="lg:w-[55%] text-white p-8 lg:p-14 flex flex-col justify-between"
        style={{ background: 'linear-gradient(135deg,#07142B 0%,#102544 55%,#183256 100%)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: '#FF9D00', color: '#07142B' }}>IG</div>
            <div>
              <span className="font-bold text-2xl tracking-tight">Indo German</span>
              <div className="text-xs mt-0.5 tracking-wider uppercase" style={{ color: '#B8C4D9' }}>Mobility Corridor Platform</div>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif mb-5 leading-tight">
            Your career in<br />
            <span style={{ color: '#FF9D00' }}>Germany</span> starts here.
          </h1>
          <p className="text-base mb-10 max-w-lg leading-relaxed" style={{ color: '#B8C4D9' }}>
            A verified digital pipeline connecting Indian skilled workers with verified German employers — language, recognition, visa &amp; post-arrival, end-to-end.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { n: '10,000+', l: 'Active Job Openings' },
              { n: '500+',    l: 'Verified German Employers' },
              { n: '3,500+', l: 'Successful Placements' },
              { n: '96%',    l: 'Visa Success Rate' },
              { n: '€35K–€70K', l: 'Average Salary Range' },
              { n: '16',     l: 'German States Hiring' },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-4" style={{ background: 'rgba(255,157,0,0.08)', border: '1px solid rgba(255,157,0,0.2)' }}>
                <div className="text-xl font-bold mb-1" style={{ color: '#FF9D00' }}>{s.n}</div>
                <div className="text-xs font-medium leading-tight" style={{ color: '#B8C4D9' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Journey Steps */}
          <div className="space-y-2">
            {[
              'Registration & Eligibility Assessment',
              'Language Training (A1 → B2)',
              'Qualification Recognition (ZAB / ANABIN)',
              'Document Vault & Verification',
              'Employer Matching & Interviews',
              'Visa Application & Pre-departure',
              'Arrival & Integration in Germany',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: '#B8C4D9' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#FF9D00', color: '#07142B' }}>{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs" style={{ color: '#2D3E5A' }}>
          © {new Date().getFullYear()} Indo German Mobility Corridor Platform · Indo-German Partnership Initiative
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="lg:w-[45%] flex items-center justify-center p-8 lg:p-12" style={{ background: '#102544' }}>
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Sign in to your dashboard</h2>
            <p className="text-sm" style={{ color: '#B8C4D9' }}>Select a role and use a quick demo login, or enter credentials.</p>
          </div>

          {/* Role Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{
                  background: selectedRole === r.id ? 'rgba(255,157,0,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: selectedRole === r.id ? '#FF9D00' : 'rgba(255,255,255,0.1)',
                  color: selectedRole === r.id ? '#FF9D00' : '#B8C4D9',
                }}
              >
                {r.icon}{r.title}
              </button>
            ))}
          </div>

          {/* Demo Logins */}
          <div className="mb-5">
            <button
              className="flex items-center justify-between w-full text-sm font-medium mb-3"
              style={{ color: '#B8C4D9' }}
              onClick={() => setShowDemo(v => !v)}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: '#FF9D00' }} />
                Quick Demo Logins
              </span>
              {showDemo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDemo && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                {filteredDemos.map((cred, i) => {
                  const isFresh = cred.role === 'fresh';
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuickFill(cred)}
                      disabled={isLoading}
                      className="w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.01] disabled:opacity-60"
                      style={{
                        background: isFresh ? 'rgba(139,92,246,0.08)' : 'rgba(255,157,0,0.05)',
                        borderColor: isFresh ? 'rgba(139,92,246,0.3)' : 'rgba(255,157,0,0.15)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                            style={{ background: isFresh ? 'rgba(139,92,246,0.2)' : 'rgba(255,157,0,0.2)', color: isFresh ? '#8B5CF6' : '#FF9D00' }}>
                            {isFresh ? <Bot className="w-4 h-4" /> : cred.label.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{cred.label}</div>
                            <div className="text-xs truncate" style={{ color: '#B8C4D9' }}>{cred.sub}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                          style={{ background: isFresh ? 'rgba(139,92,246,0.2)' : 'rgba(255,157,0,0.15)', color: isFresh ? '#8B5CF6' : '#FF9D00' }}>
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
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: '#4A5568' }}>or enter credentials</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm" style={{ color: '#B8C4D9' }}>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="you@example.com"
                        className="text-white placeholder:text-slate-600 border focus:border-[#FF9D00]"
                        style={{ background: '#183256', borderColor: 'rgba(255,255,255,0.1)' }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm" style={{ color: '#B8C4D9' }}>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••••"
                        className="text-white placeholder:text-slate-600 border focus:border-[#FF9D00]"
                        style={{ background: '#183256', borderColor: 'rgba(255,255,255,0.1)' }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{loginError}</div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full font-semibold"
                style={{ background: '#FF9D00', color: '#07142B' }}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </Form>

          {/* AI Onboarding CTA */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: '#8B5CF6' }} />
              <span className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>AI Onboarding — Fresh Start</span>
            </div>
            <p className="text-xs mb-3" style={{ color: '#B8C4D9' }}>
              New to Germany? Let our AI guide ask you about skills &amp; experience, then instantly generate your German resume and migration roadmap.
            </p>
            <button
              onClick={() => setLocation('/onboarding')}
              className="text-xs font-bold px-4 py-2 rounded-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.35)' }}
            >
              🤖 Start AI Journey →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

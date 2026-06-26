import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, Globe, Building, IndianRupee, ShieldCheck,
  MapPin, Briefcase, GraduationCap, Activity, Award, Clock,
  CheckCircle2, ArrowUpRight, ArrowDownRight, Plane, Star
} from 'lucide-react';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const DANGER = '#EF4444';
const PURPLE = '#C084FC';
const BLUE = '#818CF8';
const ORANGE = '#F59E0B';
const CYAN = '#06B6D4';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT = '#FFFFFF';
const TEXT2 = '#C4B5FD';

/* ─────────── DATA ─────────── */

const MONTHLY = [
  { month: 'Jan', migrated: 380, registered: 2100, visas: 310 },
  { month: 'Feb', migrated: 420, registered: 2400, visas: 380 },
  { month: 'Mar', migrated: 510, registered: 2800, visas: 450 },
  { month: 'Apr', migrated: 680, registered: 3100, visas: 590 },
  { month: 'May', migrated: 750, registered: 3400, visas: 680 },
  { month: 'Jun', migrated: 820, registered: 3800, visas: 760 },
  { month: 'Jul', migrated: 900, registered: 4200, visas: 840 },
  { month: 'Aug', migrated: 1050, registered: 4600, visas: 980 },
];

const PIPELINE_STAGES = [
  { stage: 'Profile Created',          icon: '👤', count: 24568, color: ACCENT,   pct: 100 },
  { stage: 'Documents Verified',       icon: '📄', count: 22340, color: '#C084FC', pct: 91 },
  { stage: 'Language Training',        icon: '🗣️', count: 19245, color: BLUE,     pct: 78 },
  { stage: 'Skill Assessment',         icon: '📊', count: 17833, color: PURPLE,   pct: 73 },
  { stage: 'Employer Matched',         icon: '🤝', count: 11456, color: CYAN,     pct: 47 },
  { stage: 'Interview Done',           icon: '💼', count: 6821,  color: '#10B981', pct: 28 },
  { stage: 'Offer Accepted',           icon: '✅', count: 4982,  color: SUCCESS,  pct: 20 },
  { stage: 'Visa Approved',            icon: '🛂', count: 3775,  color: ORANGE,   pct: 15 },
  { stage: 'Arrived in Germany ✈️',    icon: '🇩🇪', count: 7856,  color: '#34D399', pct: 32 },
];

const DEMAND_ROLES = [
  { role: 'Caregivers',    required: 5320, matched: 3200, color: ACCENT },
  { role: 'Nurses',        required: 4230, matched: 2890, color: BLUE },
  { role: 'Electricians',  required: 2432, matched: 1845, color: SUCCESS },
  { role: 'Hospitality',   required: 2421, matched: 1540, color: PURPLE },
  { role: 'Drivers',       required: 1980, matched: 1120, color: ORANGE },
  { role: 'Plumbers',      required: 1342, matched: 880,  color: CYAN },
];

const VISA_TYPES = [
  { type: 'EU Blue Card',             count: 3245, pct: 41, color: BLUE },
  { type: 'Skilled Worker (§18a)',    count: 2890, pct: 37, color: ACCENT },
  { type: 'Recognition Visa (§17b)', count: 1120, pct: 14, color: PURPLE },
  { type: 'Qualification (§17)',     count:  590, pct:  8, color: SUCCESS },
];

const LANG_LEVELS = [
  { level: 'A1', done: 18500, color: ACCENT },
  { level: 'A2', done: 14230, color: PURPLE },
  { level: 'B1', done:  8900, color: BLUE },
  { level: 'B2', done:  4540, color: SUCCESS },
  { level: 'In Progress', done: 6210, color: ORANGE },
];

const RECOGNITION = [
  { label: 'Full Recognition',    pct: 65, count: 12340, color: SUCCESS },
  { label: 'Partial Recognition', pct: 25, count: 4743,  color: ACCENT },
  { label: 'Pending Review',      pct:  8, count: 1517,  color: BLUE },
  { label: 'Not Recognised',      pct:  2, count: 379,   color: DANGER },
];

/* ─── Maharashtra Districts (top 15) ─── */
const DISTRICTS = [
  { name: 'Pune',          candidates: 1245, placed: 312, rate: 72, lang: 'B1', sector: 'Automotive' },
  { name: 'Mumbai City',   candidates:  892, placed: 198, rate: 68, lang: 'A2', sector: 'Healthcare' },
  { name: 'Nashik',        candidates:  687, placed: 187, rate: 81, lang: 'B1', sector: 'Electricians' },
  { name: 'Nagpur',        candidates:  623, placed: 154, rate: 74, lang: 'B1', sector: 'Automotive' },
  { name: 'Thane',         candidates:  598, placed: 142, rate: 69, lang: 'A2', sector: 'IT Services' },
  { name: 'Aurangabad',    candidates:  534, placed: 128, rate: 76, lang: 'A1', sector: 'Manufacturing' },
  { name: 'Solapur',       candidates:  487, placed: 118, rate: 78, lang: 'A1', sector: 'Textiles' },
  { name: 'Kolhapur',      candidates:  423, placed: 104, rate: 83, lang: 'B1', sector: 'Engineering' },
  { name: 'Ahmednagar',    candidates:  398, placed:  87, rate: 71, lang: 'A2', sector: 'Agriculture' },
  { name: 'Satara',        candidates:  367, placed:  92, rate: 85, lang: 'B2', sector: 'Nursing' },
  { name: 'Sangli',        candidates:  342, placed:  77, rate: 79, lang: 'B1', sector: 'Healthcare' },
  { name: 'Latur',         candidates:  298, placed:  61, rate: 66, lang: 'A1', sector: 'Construction' },
  { name: 'Jalgaon',       candidates:  287, placed:  69, rate: 74, lang: 'A2', sector: 'Electricians' },
  { name: 'Amravati',      candidates:  276, placed:  58, rate: 72, lang: 'A2', sector: 'Hospitality' },
  { name: 'Nanded',        candidates:  243, placed:  48, rate: 68, lang: 'A1', sector: 'Caregivers' },
];

/* ─────────── HELPERS ─────────── */

function KpiCard({ label, value, sub, icon, color, trend }: {
  label: string; value: string; sub: string; icon: React.ReactNode; color: string; trend?: 'up' | 'down' | null;
}) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: CARD, border: `1px solid ${color}20` }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-5" style={{ background: color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}18` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: trend === 'up' ? `${SUCCESS}18` : `${DANGER}18`, color: trend === 'up' ? SUCCESS : DANGER }}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend === 'up' ? '+12%' : '-3%'}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-white leading-tight">{value}</div>
      <div className="text-sm font-semibold text-white mt-0.5">{label}</div>
      <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{sub}</div>
    </div>
  );
}

function RadialScore({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 42, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="transform -rotate-90">
          <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
          <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white">{pct}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-center" style={{ color: TEXT2 }}>{label}</span>
    </div>
  );
}

/* ─────────── MAIN COMPONENT ─────────── */
export function GovernmentDashboard() {
  const [tab, setTab] = useState<'overview' | 'pipeline' | 'districts' | 'visa' | 'skills' | 'financial' | 'infra'>('overview');
  const [sortDistrict, setSortDistrict] = useState<'candidates' | 'placed' | 'rate'>('candidates');

  const tabs: { id: typeof tab; label: string; icon: string }[] = [
    { id: 'overview',   label: 'Overview',   icon: '🏛️' },
    { id: 'pipeline',   label: 'Pipeline',   icon: '🔄' },
    { id: 'districts',  label: 'Districts',  icon: '📍' },
    { id: 'visa',       label: 'Visa',       icon: '🛂' },
    { id: 'skills',     label: 'Skills',     icon: '📚' },
    { id: 'financial',  label: 'Financial',  icon: '💰' },
  ];

  const sortedDistricts = [...DISTRICTS].sort((a, b) => b[sortDistrict] - a[sortDistrict]);

  return (
    <div className="space-y-6" style={{ background: BG }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: SUCCESS }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: SUCCESS }}>Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Government of Maharashtra</h1>
          <p className="mt-1 text-sm" style={{ color: TEXT2 }}>Indo-German Mobility Command Center · Real-time analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Clock className="w-4 h-4" style={{ color: ACCENT }} />
          <span className="text-sm text-white">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: tab === t.id ? ACCENT : CARD2,
              color: tab === t.id ? '#0F0520' : TEXT2,
              border: `1px solid ${tab === t.id ? ACCENT : BORDER}`,
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Registered" value="24,568" sub="Candidates on platform" icon={<Users className="w-5 h-5" />} color={ACCENT} trend="up" />
            <KpiCard label="Successfully Migrated" value="7,856" sub="Now working in Germany" icon={<Plane className="w-5 h-5" />} color={SUCCESS} trend="up" />
            <KpiCard label="Active Pipeline" value="18,342" sub="In progress right now" icon={<Activity className="w-5 h-5" />} color={BLUE} trend="up" />
            <KpiCard label="Visa Success Rate" value="96.2%" sub="Of all applications" icon={<ShieldCheck className="w-5 h-5" />} color={SUCCESS} trend={null} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="German Employers" value="523" sub="Onboarded & active" icon={<Building className="w-5 h-5" />} color={PURPLE} trend="up" />
            <KpiCard label="Open Vacancies" value="12,430" sub="Ready to hire" icon={<Briefcase className="w-5 h-5" />} color={CYAN} trend="up" />
            <KpiCard label="Avg. Time to Place" value="84 Days" sub="Profile → Germany" icon={<Clock className="w-5 h-5" />} color={ORANGE} trend={null} />
            <KpiCard label="Salary Remittances" value="₹780 Cr" sub="Annual India ← Germany" icon={<IndianRupee className="w-5 h-5" />} color={SUCCESS} trend="up" />
          </div>

          {/* Radial progress section */}
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-base font-bold text-white mb-6">Key Performance Indicators</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              <RadialScore pct={96} color={SUCCESS} label="Visa Approval" />
              <RadialScore pct={78} color={ACCENT} label="Doc Verified" />
              <RadialScore pct={65} color={BLUE} label="Lang Certified" />
              <RadialScore pct={32} color={PURPLE} label="Migrated" />
              <RadialScore pct={47} color={CYAN} label="Employer Match" />
              <RadialScore pct={34} color={ORANGE} label="Women Share" />
            </div>
          </div>

          {/* Trend chart + Demand chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-0.5">Registration & Migration Trend</div>
              <div className="text-xs mb-5" style={{ color: TEXT2 }}>Monthly new registrations vs successful migrations</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={SUCCESS} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Area type="monotone" dataKey="registered" name="Registered" stroke={ACCENT} fill="url(#rg1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="migrated" name="Migrated" stroke={SUCCESS} fill="url(#mg1)" strokeWidth={2} />
                  <Legend wrapperStyle={{ color: TEXT2, fontSize: 11 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-0.5">Germany Demand vs Supply Gap</div>
              <div className="text-xs mb-5" style={{ color: TEXT2 }}>Roles with highest unfilled demand</div>
              <div className="space-y-4">
                {DEMAND_ROLES.map((r, i) => {
                  const gap = r.required - r.matched;
                  const matchPct = Math.round((r.matched / r.required) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-white">{r.role}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: r.color }}>{r.matched.toLocaleString()}/{r.required.toLocaleString()}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: `${DANGER}18`, color: DANGER }}>
                            −{gap.toLocaleString()} gap
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${matchPct}%`, background: `linear-gradient(90deg, ${r.color}99, ${r.color})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PIPELINE ─── */}
      {tab === 'pipeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="font-bold text-white mb-0.5">10-Stage Migration Funnel</div>
            <div className="text-xs mb-6" style={{ color: TEXT2 }}>Candidate count at each critical stage of the journey</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PIPELINE_STAGES.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{ background: CARD2, border: `1px solid ${s.color}25` }}>
                  <div className="text-2xl w-9 flex-shrink-0">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white truncate">{s.stage}</span>
                      <span className="text-xs font-black ml-2 flex-shrink-0" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color: s.color }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="font-bold text-white mb-0.5">Monthly Progress Trend</div>
            <div className="text-xs mb-4" style={{ color: TEXT2 }}>Registered, migrated and visa approvals per month</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                <Bar dataKey="registered" name="Registered" fill={ACCENT} radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="visas" name="Visa Approved" fill={BLUE} radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="migrated" name="Migrated" fill={SUCCESS} radius={[4, 4, 0, 0]} barSize={14} />
                <Legend wrapperStyle={{ color: TEXT2, fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── DISTRICTS ─── */}
      {tab === 'districts' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="font-bold text-white">Maharashtra — District-wise Analytics</div>
                <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>Top 15 contributing districts · Source: MSDE State Portal</div>
              </div>
              <div className="flex gap-2">
                {(['candidates', 'placed', 'rate'] as const).map(s => (
                  <button key={s} onClick={() => setSortDistrict(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                    style={{
                      background: sortDistrict === s ? ACCENT : CARD2,
                      color: sortDistrict === s ? '#0F0520' : TEXT2,
                      border: `1px solid ${sortDistrict === s ? ACCENT : BORDER}`,
                    }}>
                    Sort: {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Total Candidates', value: DISTRICTS.reduce((s, d) => s + d.candidates, 0).toLocaleString(), color: ACCENT },
                { label: 'Total Placed', value: DISTRICTS.reduce((s, d) => s + d.placed, 0).toLocaleString(), color: SUCCESS },
                { label: 'Avg Success Rate', value: Math.round(DISTRICTS.reduce((s, d) => s + d.rate, 0) / DISTRICTS.length) + '%', color: BLUE },
              ].map((m, i) => (
                <div key={i} className="rounded-xl p-4 text-center" style={{ background: CARD2, border: `1px solid ${m.color}20` }}>
                  <div className="text-2xl font-black" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* District cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {sortedDistricts.map((d, i) => {
                const rankColor = i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : TEXT2;
                const rateColor = d.rate >= 80 ? SUCCESS : d.rate >= 70 ? ACCENT : ORANGE;
                return (
                  <div key={d.name} className="rounded-2xl p-4" style={{ background: CARD2, border: `1px solid rgba(168,85,247,0.12)` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black w-6 text-center" style={{ color: rankColor }}>#{i + 1}</span>
                        <div>
                          <div className="font-bold text-white leading-tight">{d.name}</div>
                          <div className="text-[10px]" style={{ color: TEXT2 }}>{d.sector} · Lang: {d.lang}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: `${rateColor}18`, color: rateColor, border: `1px solid ${rateColor}30` }}>
                        {d.rate}% placed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-xl p-2.5 text-center" style={{ background: CARD }}>
                        <div className="text-lg font-black" style={{ color: ACCENT }}>{d.candidates.toLocaleString()}</div>
                        <div className="text-[10px]" style={{ color: TEXT2 }}>Registered</div>
                      </div>
                      <div className="rounded-xl p-2.5 text-center" style={{ background: CARD }}>
                        <div className="text-lg font-black" style={{ color: SUCCESS }}>{d.placed.toLocaleString()}</div>
                        <div className="text-[10px]" style={{ color: TEXT2 }}>Placed in Germany</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span style={{ color: TEXT2 }}>Placement rate</span>
                        <span style={{ color: rateColor }}>{d.rate}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${d.rate}%`, background: `linear-gradient(90deg, ${rateColor}80, ${rateColor})` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── VISA ─── */}
      {tab === 'visa' && (
        <div className="space-y-6">
          {/* Hero visa rate */}
          <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #130828 0%, #1A0B3B 100%)', border: `1px solid ${SUCCESS}30` }}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <svg width="160" height="160" className="transform -rotate-90">
                  <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="68" stroke={SUCCESS} strokeWidth="12" fill="none"
                    strokeDasharray={2 * Math.PI * 68} strokeDashoffset={2 * Math.PI * 68 * (1 - 0.962)}
                    strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${SUCCESS})` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">96.2%</span>
                  <span className="text-xs" style={{ color: SUCCESS }}>Visa Success</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-2">World-Class Visa Approval Rate</h2>
                <p className="text-sm mb-4" style={{ color: TEXT2 }}>7,542 of 7,845 applications approved — exceeding the India-Germany migration corridor benchmark of 89%</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Approved', val: '7,542', color: SUCCESS },
                    { label: 'Pending', val: '100', color: BLUE },
                    { label: 'Rejected', val: '203', color: DANGER },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3 text-center" style={{ background: CARD2, border: `1px solid ${s.color}20` }}>
                      <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visa type breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-0.5">Visa Pathway Distribution</div>
              <div className="text-xs mb-5" style={{ color: TEXT2 }}>Applications by visa category</div>
              <div className="space-y-4">
                {VISA_TYPES.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl" style={{ background: CARD2, border: `1px solid ${v.color}20` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{v.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: v.color }}>{v.count.toLocaleString()}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${v.color}18`, color: v.color }}>{v.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-0.5">Processing Timeline</div>
              <div className="text-xs mb-5" style={{ color: TEXT2 }}>Average days at each visa stage</div>
              <div className="space-y-3">
                {[
                  { stage: 'Document Submission', days: 8, max: 30, color: BLUE },
                  { stage: 'Embassy Review', days: 14, max: 30, color: ACCENT },
                  { stage: 'Medical Check', days: 7, max: 30, color: PURPLE },
                  { stage: 'Biometrics', days: 5, max: 30, color: CYAN },
                  { stage: 'Final Decision', days: 12, max: 30, color: SUCCESS },
                  { stage: 'Visa Stamping', days: 4, max: 30, color: ORANGE },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-xs text-right w-36 flex-shrink-0" style={{ color: TEXT2 }}>{s.stage}</div>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(s.days / s.max) * 100}%`, background: s.color }} />
                    </div>
                    <div className="text-xs font-bold w-12 flex-shrink-0" style={{ color: s.color }}>{s.days} days</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: `${SUCCESS}10`, border: `1px solid ${SUCCESS}25` }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: SUCCESS }} />
                <span className="text-xs text-white">Total avg. processing: <strong>50 days</strong> — 20% faster than national average</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SKILLS ─── */}
      {tab === 'skills' && (
        <div className="space-y-6">
          {/* Language levels */}
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="font-bold text-white mb-0.5">CEFR Language Training Progress</div>
            <div className="text-xs mb-6" style={{ color: TEXT2 }}>Candidates who completed or are in each level</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {LANG_LEVELS.map((l, i) => (
                <div key={i} className="rounded-2xl p-4 text-center flex flex-col items-center gap-3"
                  style={{ background: CARD2, border: `1px solid ${l.color}25` }}>
                  <div className="text-2xl font-black px-3 py-1 rounded-xl"
                    style={{ background: `${l.color}15`, color: l.color }}>{l.level}</div>
                  <div className="text-xl font-black text-white">{(l.done / 1000).toFixed(1)}K</div>
                  <div className="text-[11px]" style={{ color: TEXT2 }}>candidates</div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(l.done / 18500) * 100}%`, background: l.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualification recognition */}
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="font-bold text-white mb-0.5">Qualification Recognition — ZAB / ANABIN</div>
            <div className="text-xs mb-5" style={{ color: TEXT2 }}>Outcome of credential equivalence assessments</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RECOGNITION.map((r, i) => (
                <div key={i} className="rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
                  style={{ background: CARD2, border: `1px solid ${r.color}20` }}>
                  <div className="relative w-16 h-16">
                    <svg width="64" height="64" className="transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                      <circle cx="32" cy="32" r="26" stroke={r.color} strokeWidth="6" fill="none"
                        strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - r.pct / 100)}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-black text-white">{r.pct}%</span>
                    </div>
                  </div>
                  <div className="text-lg font-black" style={{ color: r.color }}>{r.count.toLocaleString()}</div>
                  <div className="text-xs font-semibold text-white">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FINANCIAL ─── */}
      {tab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 col-span-2" style={{ background: 'linear-gradient(135deg, #130828, #1A0B3B)', border: `1px solid ${BORDER}` }}>
              <div className="text-sm font-medium mb-1" style={{ color: TEXT2 }}>Total Government Investment</div>
              <div className="text-5xl font-black mb-1" style={{ color: ACCENT }}>₹48 Cr</div>
              <div className="text-sm" style={{ color: TEXT2 }}>Training · Language · Visa · Technology</div>
              <div className="mt-4 flex gap-6">
                <div><div className="text-2xl font-bold" style={{ color: SUCCESS }}>₹2,600 Cr</div><div className="text-xs" style={{ color: TEXT2 }}>Total salary generated</div></div>
                <div><div className="text-2xl font-bold" style={{ color: ACCENT }}>54×</div><div className="text-xs" style={{ color: TEXT2 }}>Return on investment</div></div>
                <div><div className="text-2xl font-bold" style={{ color: BLUE }}>₹780 Cr</div><div className="text-xs" style={{ color: TEXT2 }}>Remittances expected</div></div>
              </div>
            </div>
            <KpiCard label="Training Budget" value="₹18 Cr" sub="Skill development" icon={<GraduationCap className="w-5 h-5" />} color={ACCENT} trend={null} />
            <KpiCard label="Language Training" value="₹12 Cr" sub="A1→B2 programs" icon={<Award className="w-5 h-5" />} color={PURPLE} trend={null} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Visa Support" value="₹5 Cr" sub="Application & legal" icon={<ShieldCheck className="w-5 h-5" />} color={BLUE} trend={null} />
            <KpiCard label="Assessment" value="₹4 Cr" sub="Skill evaluation" icon={<Star className="w-5 h-5" />} color={SUCCESS} trend={null} />
            <KpiCard label="Technology" value="₹3 Cr" sub="This platform" icon={<Activity className="w-5 h-5" />} color={CYAN} trend={null} />
            <KpiCard label="Administrative" value="₹6 Cr" sub="Ops & compliance" icon={<Building className="w-5 h-5" />} color={ORANGE} trend={null} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-4">Budget Allocation (₹48 Crore)</div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={[
                    { label: 'Training', value: 18, color: ACCENT },
                    { label: 'Language', value: 12, color: PURPLE },
                    { label: 'Admin', value: 6, color: ORANGE },
                    { label: 'Visa', value: 5, color: BLUE },
                    { label: 'Assessment', value: 4, color: SUCCESS },
                    { label: 'Technology', value: 3, color: CYAN },
                  ]} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3}>
                    {[ACCENT, PURPLE, ORANGE, BLUE, SUCCESS, CYAN].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12 }} formatter={(v: any) => [`₹${v} Cr`, '']} />
                  <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="font-bold text-white mb-4">Employment Financials</div>
              <div className="space-y-3">
                {[
                  { label: 'Total Offers Issued', value: '12,430', color: ACCENT },
                  { label: 'Offers Accepted', value: '8,542', color: SUCCESS },
                  { label: 'Avg CTC (Germany)', value: '€42,000/yr', color: BLUE },
                  { label: 'Net Salary (avg/candidate)', value: '€34,000/yr', color: SUCCESS },
                  { label: 'Total Salary Pool', value: '€287 Million', color: ORANGE },
                  { label: 'Agency Fee (avg)', value: '₹50,000/hire', color: PURPLE },
                  { label: 'Platform Revenue', value: '₹184 Cr', color: SUCCESS },
                  { label: 'Net Remittances (India)', value: '₹780 Cr/yr', color: CYAN },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-sm" style={{ color: TEXT2 }}>{row.label}</span>
                    <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

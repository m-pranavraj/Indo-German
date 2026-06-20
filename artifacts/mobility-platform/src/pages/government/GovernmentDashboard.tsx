import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, FunnelChart, Funnel, LabelList
} from 'recharts';
import {
  Users, Globe, Building, TrendingUp, IndianRupee, Euro, ShieldCheck,
  MapPin, Briefcase, GraduationCap, Activity, Heart, Award, Clock
} from 'lucide-react';

const BG = '#07142B';
const CARD = '#183256';
const CARD2 = '#102544';
const ACCENT = '#FF9D00';
const SUCCESS = '#00C853';
const DANGER = '#EF4444';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';
const BORDER = 'rgba(255,157,0,0.15)';
const TEXT = '#FFFFFF';
const TEXT2 = '#B8C4D9';

const KPI_DATA = {
  totalRegistered: 24568,
  activePipeline: 18342,
  migrated: 7856,
  employers: 523,
  vacancies: 12430,
  visaRate: 96.2,
  salaryGenerated: 287,
  govtInvestment: 48,
  roi: 54,
  women: 8432,
  rural: 13578,
  avgDays: 84,
};

const PIPELINE_DATA = [
  { stage: 'Profile Created', count: 24568, color: ACCENT },
  { stage: 'Doc Verified', count: 22340, color: '#FFB938' },
  { stage: 'Lang Training', count: 19245, color: BLUE },
  { stage: 'Skill Assessment', count: 17833, color: PURPLE },
  { stage: 'Employer Match', count: 11456, color: '#06B6D4' },
  { stage: 'Interview', count: 6821, color: '#10B981' },
  { stage: 'Offer Issued', count: 4982, color: SUCCESS },
  { stage: 'Visa Processing', count: 3775, color: '#F59E0B' },
  { stage: 'Migrated ✈', count: 7856, color: '#34D399' },
];

const FINANCIAL_DATA = [
  { label: 'Training Cost', value: 18, color: ACCENT },
  { label: 'Language Training', value: 12, color: '#FFB938' },
  { label: 'Assessment', value: 4, color: PURPLE },
  { label: 'Visa Support', value: 5, color: BLUE },
  { label: 'Technology', value: 3, color: '#06B6D4' },
  { label: 'Administrative', value: 6, color: '#10B981' },
];

const LANGUAGE_DATA = [
  { level: 'A1', completed: 18500 },
  { level: 'A2', completed: 14230 },
  { level: 'B1', completed: 8900 },
  { level: 'B2', completed: 4540 },
  { level: 'In Progress', completed: 6210 },
];

const VISA_DATA = [
  { name: 'Approved', value: 7542, color: SUCCESS },
  { name: 'Pending', value: 100, color: ACCENT },
  { name: 'Rejected', value: 203, color: DANGER },
];

const DEMAND_DATA = [
  { role: 'Caregivers', required: 5320, matched: 3200 },
  { role: 'Nurses', required: 4230, matched: 2890 },
  { role: 'Electricians', required: 2432, matched: 1845 },
  { role: 'Hospitality', required: 2421, matched: 1540 },
  { role: 'Drivers', required: 1980, matched: 1120 },
  { role: 'Plumbers', required: 1342, matched: 880 },
];

const DEMO_DATA = [
  { month: 'Jan', migrated: 380, registered: 2100 },
  { month: 'Feb', migrated: 420, registered: 2400 },
  { month: 'Mar', migrated: 510, registered: 2800 },
  { month: 'Apr', migrated: 680, registered: 3100 },
  { month: 'May', migrated: 750, registered: 3400 },
  { month: 'Jun', migrated: 820, registered: 3800 },
  { month: 'Jul', migrated: 900, registered: 4200 },
  { month: 'Aug', migrated: 1050, registered: 4600 },
];

const AGE_DATA = [
  { age: '18–25', count: 11230 },
  { age: '26–35', count: 9540 },
  { age: '36–45', count: 3798 },
];

function StatCard({ label, value, sub, icon, accent, format: fmt }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; accent: string; format?: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background: `${accent}18` }}>
          <div style={{ color: accent }}>{icon}</div>
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-semibold text-white mb-0.5">{label}</div>
      {sub && <div className="text-xs" style={{ color: TEXT2 }}>{sub}</div>}
    </div>
  );
}

export function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'pipeline' | 'visa' | 'skills' | 'demographics'>('overview');

  const tabs = ['overview', 'financial', 'pipeline', 'visa', 'skills', 'demographics'] as const;

  return (
    <div className="space-y-6 min-h-screen" style={{ background: BG }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: SUCCESS }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: SUCCESS }}>Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Indo-German Corridor Command Center</h1>
          <p className="mt-1" style={{ color: TEXT2 }}>Ministry of Skill Development · Real-time migration analytics & financial intelligence</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Clock className="w-4 h-4" style={{ color: ACCENT }} />
          <span className="text-sm text-white">Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: activeTab === tab ? ACCENT : CARD2,
              color: activeTab === tab ? '#07142B' : TEXT2,
              border: `1px solid ${activeTab === tab ? ACCENT : BORDER}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Total Registered" value="24,568" sub="Candidates" icon={<Users className="w-5 h-5" />} accent={ACCENT} />
            <StatCard label="Active Pipeline" value="18,342" sub="In progress" icon={<Activity className="w-5 h-5" />} accent={BLUE} />
            <StatCard label="Successfully Migrated" value="7,856" sub="To Germany ✈" icon={<Globe className="w-5 h-5" />} accent={SUCCESS} />
            <StatCard label="German Employers" value="523" sub="Onboarded" icon={<Building className="w-5 h-5" />} accent={PURPLE} />
            <StatCard label="Active Vacancies" value="12,430" sub="Open roles" icon={<Briefcase className="w-5 h-5" />} accent="#06B6D4" />
            <StatCard label="Visa Success Rate" value="96.2%" sub="Of applications" icon={<ShieldCheck className="w-5 h-5" />} accent={SUCCESS} />
          </div>

          {/* KPI Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Salary Generated" value="€287M" sub="Abroad annually" icon={<Euro className="w-5 h-5" />} accent={ACCENT} />
            <StatCard label="Govt Investment" value="₹48 Cr" sub="Total outlay" icon={<IndianRupee className="w-5 h-5" />} accent={BLUE} />
            <StatCard label="ROI on Investment" value="54×" sub="₹2,600 Cr salary" icon={<TrendingUp className="w-5 h-5" />} accent={SUCCESS} />
            <StatCard label="Women Candidates" value="8,432" sub="34.3% of total" icon={<Heart className="w-5 h-5" />} accent="#EC4899" />
            <StatCard label="Rural Candidates" value="13,578" sub="55.3% rural" icon={<MapPin className="w-5 h-5" />} accent={PURPLE} />
            <StatCard label="Avg Placement Time" value="84 Days" sub="Profile → Migration" icon={<Clock className="w-5 h-5" />} accent="#F59E0B" />
          </div>

          {/* Monthly Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Registration & Migration Trend</h3>
              <p className="text-sm mb-6" style={{ color: TEXT2 }}>Monthly comparison of new registrations vs successful migrations</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={DEMO_DATA}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="migGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={SUCCESS} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Area type="monotone" dataKey="registered" name="Registered" stroke={ACCENT} fill="url(#regGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="migrated" name="Migrated" stroke={SUCCESS} fill="url(#migGrad)" strokeWidth={2} />
                  <Legend wrapperStyle={{ color: TEXT2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Germany Demand vs Supply</h3>
              <p className="text-sm mb-6" style={{ color: TEXT2 }}>Required positions vs matched/available candidates</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DEMAND_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="role" type="category" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Bar dataKey="required" name="Germany Needs" fill={ACCENT} radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="matched" name="Matched Candidates" fill={SUCCESS} radius={[0, 4, 4, 0]} barSize={10} />
                  <Legend wrapperStyle={{ color: TEXT2 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── FINANCIAL TAB ─── */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Financial KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 col-span-2" style={{ background: 'linear-gradient(135deg, #102544, #183256)', border: `1px solid ${BORDER}` }}>
              <div className="text-sm font-medium mb-1" style={{ color: TEXT2 }}>Total Government Investment</div>
              <div className="text-5xl font-black mb-1" style={{ color: ACCENT }}>₹48 Cr</div>
              <div className="text-sm" style={{ color: TEXT2 }}>Across training, language, visa & technology</div>
              <div className="mt-4 flex gap-4">
                <div>
                  <div className="text-2xl font-bold" style={{ color: SUCCESS }}>₹2,600 Cr</div>
                  <div className="text-xs" style={{ color: TEXT2 }}>Total salary generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: ACCENT }}>54×</div>
                  <div className="text-xs" style={{ color: TEXT2 }}>Return on investment</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: BLUE }}>₹780 Cr</div>
                  <div className="text-xs" style={{ color: TEXT2 }}>Remittances expected</div>
                </div>
              </div>
            </div>
            <StatCard label="Training Budget" value="₹18 Cr" sub="Skill development" icon={<GraduationCap className="w-5 h-5" />} accent={ACCENT} />
            <StatCard label="Language Training" value="₹12 Cr" sub="A1→B2 programs" icon={<Award className="w-5 h-5" />} accent={PURPLE} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Visa Support" value="₹5 Cr" sub="Application & legal" icon={<ShieldCheck className="w-5 h-5" />} accent={BLUE} />
            <StatCard label="Assessment Centres" value="₹4 Cr" sub="Skill evaluation" icon={<CheckCircle className="w-5 h-5" />} accent={SUCCESS} />
            <StatCard label="Technology Platform" value="₹3 Cr" sub="This platform" icon={<Activity className="w-5 h-5" />} accent="#06B6D4" />
            <StatCard label="Administrative" value="₹6 Cr" sub="Ops & compliance" icon={<Building className="w-5 h-5" />} accent="#F59E0B" />
          </div>

          {/* Budget breakdown pie + ROI table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Budget Allocation</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>₹48 Crore breakdown by category</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={FINANCIAL_DATA} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3}>
                    {FINANCIAL_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} formatter={(v: any) => [`₹${v} Cr`, '']} />
                  <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Employment Outcome Financials</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Hiring & offer statistics with salary data</p>
              <div className="space-y-3">
                {[
                  { label: 'Total Job Offers Issued', value: '12,430', color: ACCENT },
                  { label: 'Offers Accepted', value: '8,542', color: SUCCESS },
                  { label: 'Offers Rejected', value: '1,245', color: DANGER },
                  { label: 'Interviews Scheduled', value: '9,845', color: BLUE },
                  { label: 'Interviews Completed', value: '8,943', color: PURPLE },
                  { label: 'Average CTC (Germany)', value: '€42,000/yr', color: ACCENT },
                  { label: 'Net Salary (avg) per candidate', value: '€34,000/yr', color: SUCCESS },
                  { label: 'Total Salary Pool (all placed)', value: '€287 Million', color: '#F59E0B' },
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

      {/* ─── PIPELINE TAB ─── */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-1">10-Stage Migration Pipeline Funnel</h3>
            <p className="text-sm mb-6" style={{ color: TEXT2 }}>Candidate progression across all stages of the migration journey</p>
            <div className="space-y-3">
              {PIPELINE_DATA.map((stage, i) => {
                const pct = Math.round((stage.count / 24568) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white">{stage.stage}</span>
                      <div className="flex gap-3">
                        <span className="text-sm font-bold" style={{ color: stage.color }}>{stage.count.toLocaleString()}</span>
                        <span className="text-xs" style={{ color: TEXT2 }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: stage.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-1">Stage Count Comparison</h3>
            <p className="text-sm mb-4" style={{ color: TEXT2 }}>Visual breakdown of candidates at each stage</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PIPELINE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fill: TEXT2, fontSize: 10 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                  {PIPELINE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── VISA TAB ─── */}
      {activeTab === 'visa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Applications Submitted" value="7,845" sub="Total filed" icon={<ShieldCheck className="w-5 h-5" />} accent={ACCENT} />
            <StatCard label="Approved" value="7,542" sub="96.1% rate" icon={<Activity className="w-5 h-5" />} accent={SUCCESS} />
            <StatCard label="Rejected" value="203" sub="2.6% rate" icon={<Globe className="w-5 h-5" />} accent={DANGER} />
            <StatCard label="Pending" value="100" sub="Awaiting decision" icon={<Clock className="w-5 h-5" />} accent={BLUE} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Visa Application Outcomes</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Breakdown by decision status</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={VISA_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3}>
                    {VISA_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Legend wrapperStyle={{ color: TEXT2 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Visa Pathway Breakdown</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Applications by visa type</p>
              <div className="space-y-4">
                {[
                  { type: 'EU Blue Card', count: 3245, pct: 41, color: BLUE },
                  { type: 'Skilled Worker Visa (§18a)', count: 2890, pct: 37, color: ACCENT },
                  { type: 'Recognition Visa (§17b)', count: 1120, pct: 14, color: PURPLE },
                  { type: 'Visa for Qualification (§17)', count: 590, pct: 8, color: SUCCESS },
                ].map((row, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white">{row.type}</span>
                      <span className="text-sm font-bold" style={{ color: row.color }}>{row.count.toLocaleString()} ({row.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SKILLS TAB ─── */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Language Training Progress</h3>
              <p className="text-sm mb-6" style={{ color: TEXT2 }}>Candidates who completed each CEFR level</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={LANGUAGE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="level" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Bar dataKey="completed" name="Completed" fill={ACCENT} radius={[6, 6, 0, 0]}>
                    {LANGUAGE_DATA.map((_, i) => (
                      <Cell key={i} fill={[ACCENT, '#FFB938', BLUE, SUCCESS, PURPLE][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Recognition Outcomes</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Qualification equivalence decisions from ZAB / ANABIN</p>
              <div className="space-y-4">
                {[
                  { label: 'Full Recognition', count: 12340, pct: 65, color: SUCCESS },
                  { label: 'Partial Recognition', count: 4743, pct: 25, color: ACCENT },
                  { label: 'Pending Review', count: 1517, pct: 8, color: BLUE },
                  { label: 'Not Recognised', count: 379, pct: 2, color: DANGER },
                ].map((row, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white">{row.label}</span>
                      <span className="text-sm font-bold" style={{ color: row.color }}>{row.count.toLocaleString()} ({row.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DEMOGRAPHICS TAB ─── */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Male Candidates" value="15,600" sub="63.5%" icon={<Users className="w-5 h-5" />} accent={BLUE} />
            <StatCard label="Female Candidates" value="8,432" sub="34.3%" icon={<Heart className="w-5 h-5" />} accent="#EC4899" />
            <StatCard label="Rural Background" value="13,578" sub="55.3%" icon={<MapPin className="w-5 h-5" />} accent={SUCCESS} />
            <StatCard label="Urban Background" value="10,990" sub="44.7%" icon={<Building className="w-5 h-5" />} accent={PURPLE} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Age Distribution</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Candidate breakdown by age group</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={AGE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="age" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Bar dataKey="count" name="Candidates" fill={ACCENT} radius={[6, 6, 0, 0]}>
                    {AGE_DATA.map((_, i) => (
                      <Cell key={i} fill={[ACCENT, BLUE, PURPLE][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">State-wise Origin (Top 8)</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Indian states contributing most candidates</p>
              <div className="space-y-3">
                {[
                  { state: 'Kerala', count: 6840, pct: 27 },
                  { state: 'Maharashtra', count: 4912, pct: 20 },
                  { state: 'Tamil Nadu', count: 3685, pct: 15 },
                  { state: 'Punjab', count: 2948, pct: 12 },
                  { state: 'Gujarat', count: 2211, pct: 9 },
                  { state: 'Karnataka', count: 1965, pct: 8 },
                  { state: 'Uttar Pradesh', count: 1228, pct: 5 },
                  { state: 'West Bengal', count: 779, pct: 3 },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-right text-xs" style={{ color: TEXT2 }}>{row.state}</div>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${row.pct * 3}%`, background: [ACCENT, BLUE, SUCCESS, PURPLE, '#06B6D4', '#F59E0B', '#EC4899', '#10B981'][i] }} />
                    </div>
                    <div className="text-xs font-medium text-white w-14 text-right">{row.count.toLocaleString()}</div>
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

function CheckCircle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>;
}

import React, { useState } from 'react';
import { useGetPipelineStats } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { Activity, Users, FileCheck, Building2, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, Globe, Zap, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BG = '#07142B';
const CARD = '#183256';
const CARD2 = '#102544';
const ACCENT = '#FF9D00';
const SUCCESS = '#00C853';
const DANGER = '#EF4444';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const BORDER = 'rgba(255,157,0,0.15)';
const TEXT = '#FFFFFF';
const TEXT2 = '#B8C4D9';

const mockStats = {
  totalCandidates: 24568,
  germanyReadyCount: 4982,
  avgReadiness: 58,
  byStage: [
    { stage: 'discovery', label: 'Discovery', count: 4500 },
    { stage: 'registration', label: 'Registration', count: 2800 },
    { stage: 'eligibility', label: 'Eligibility', count: 2100 },
    { stage: 'language_training', label: 'Language', count: 1800 },
    { stage: 'qualification_recognition', label: 'Recognition', count: 650 },
    { stage: 'employer_matching', label: 'Matching', count: 350 },
    { stage: 'visa_readiness', label: 'Visa Ready', count: 150 },
    { stage: 'post_arrival', label: 'Migrated', count: 100 }
  ]
};

const systemHealth = [
  { service: 'API Server', status: 'operational', latency: '45ms', uptime: '99.97%' },
  { service: 'Database', status: 'operational', latency: '12ms', uptime: '99.99%' },
  { service: 'AI Services', status: 'operational', latency: '890ms', uptime: '99.85%' },
  { service: 'Document Vault', status: 'operational', latency: '120ms', uptime: '99.92%' },
  { service: 'Visa API', status: 'operational', latency: '340ms', uptime: '99.78%' },
  { service: 'Email Service', status: 'operational', latency: '210ms', uptime: '99.95%' },
];

const platformActivity = [
  { time: '00:00', logins: 12, api_calls: 340 },
  { time: '04:00', logins: 8, api_calls: 180 },
  { time: '08:00', logins: 145, api_calls: 2840 },
  { time: '12:00', logins: 238, api_calls: 5200 },
  { time: '16:00', logins: 198, api_calls: 4100 },
  { time: '20:00', logins: 89, api_calls: 1900 },
];

const roleBreakdown = [
  { name: 'Candidates', value: 18342, color: ACCENT },
  { name: 'Employers', value: 523, color: BLUE },
  { name: 'Trainers', value: 145, color: PURPLE },
  { name: 'Facilitators', value: 89, color: SUCCESS },
  { name: 'Government', value: 34, color: '#06B6D4' },
  { name: 'Admins', value: 12, color: '#F59E0B' },
];

const pendingVerifications = [
  { type: 'Document Verifications', count: 84, urgency: 'high' },
  { type: 'Employer Onboarding', count: 23, urgency: 'medium' },
  { type: 'Recognition Cases', count: 156, urgency: 'high' },
  { type: 'Visa Case Reviews', count: 31, urgency: 'medium' },
  { type: 'Welfare Escalations', count: 8, urgency: 'urgent' },
  { type: 'AI Report Flags', count: 12, urgency: 'low' },
];

export function AdminDashboard() {
  const { data: statsData } = useGetPipelineStats();
  const stats = statsData || mockStats;
  const [activeTab, setActiveTab] = useState<'overview' | 'system' | 'users' | 'security'>('overview');

  const tabs = ['overview', 'system', 'users', 'security'] as const;

  return (
    <div className="space-y-6 min-h-screen" style={{ background: BG }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Administration</h1>
          <p className="mt-1" style={{ color: TEXT2 }}>Platform health, analytics, user management, and compliance control.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: `${SUCCESS}15`, border: `1px solid ${SUCCESS}40` }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: SUCCESS }} />
          <span className="text-sm font-medium" style={{ color: SUCCESS }}>All Systems Operational</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
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

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Primary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Total Platform Users', value: '19,145', icon: <Users className="w-5 h-5" />, color: ACCENT, sub: 'All roles combined' },
              { title: 'Verified Employers', value: '523', icon: <Building2 className="w-5 h-5" />, color: BLUE, sub: '47 pending review' },
              { title: 'Germany-Ready', value: '4,982', icon: <Globe className="w-5 h-5" />, color: SUCCESS, sub: 'Placement eligible' },
              { title: 'Pending Actions', value: '314', icon: <AlertTriangle className="w-5 h-5" />, color: DANGER, sub: 'Require attention' },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="p-2 rounded-xl w-fit mb-3" style={{ background: `${stat.color}18` }}>
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-white mb-0.5">{stat.title}</div>
                <div className="text-xs" style={{ color: TEXT2 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Platform Activity + Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Platform Activity (Today)</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Login sessions and API calls by hour</p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={platformActivity}>
                  <defs>
                    <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Area type="monotone" dataKey="logins" name="Active Logins" stroke={ACCENT} fill="url(#loginGrad)" strokeWidth={2} />
                  <Legend wrapperStyle={{ color: TEXT2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">Global Pipeline Funnel</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Candidate count at each migration stage</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.byStage}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: TEXT2 }} angle={-25} textAnchor="end" height={50} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: TEXT2 }} />
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.byStage.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index > 4 ? SUCCESS : ACCENT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-4">Pending Verifications & Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingVerifications.map((item, i) => {
                const urgencyColor = item.urgency === 'urgent' ? DANGER : item.urgency === 'high' ? ACCENT : item.urgency === 'medium' ? BLUE : TEXT2;
                return (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl" style={{ background: CARD2, border: `1px solid rgba(255,255,255,0.06)` }}>
                    <div>
                      <div className="text-sm font-medium text-white">{item.type}</div>
                      <div className="text-xs capitalize" style={{ color: urgencyColor }}>{item.urgency} priority</div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: urgencyColor }}>{item.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-1">User Distribution by Role</h3>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>Active users across all platform roles</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={roleBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3}>
                    {roleBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
                  <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-lg font-bold text-white mb-4">Platform Metrics Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Avg Platform Session Time', value: '18 min', color: ACCENT },
                  { label: 'Daily Active Users', value: '4,821', color: SUCCESS },
                  { label: 'AI Queries Today', value: '1,234', color: PURPLE },
                  { label: 'Documents Uploaded (24h)', value: '892', color: BLUE },
                  { label: 'Resumes Translated (24h)', value: '47', color: ACCENT },
                  { label: 'Visa Cases Updated', value: '23', color: '#06B6D4' },
                  { label: 'Welfare Tickets Resolved', value: '12', color: SUCCESS },
                  { label: 'Employer Matches Made', value: '156', color: '#F59E0B' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-sm" style={{ color: TEXT2 }}>{row.label}</span>
                    <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-4">Service Health Monitor</h3>
            <div className="space-y-3">
              {systemHealth.map((svc, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl" style={{ background: CARD2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: SUCCESS }} />
                    <span className="font-medium text-white">{svc.service}</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <div className="text-xs" style={{ color: TEXT2 }}>Latency</div>
                      <div className="text-sm font-bold" style={{ color: parseInt(svc.latency) > 500 ? ACCENT : SUCCESS }}>{svc.latency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: TEXT2 }}>Uptime</div>
                      <div className="text-sm font-bold" style={{ color: SUCCESS }}>{svc.uptime}</div>
                    </div>
                    <Badge style={{ background: `${SUCCESS}15`, color: SUCCESS, border: 'none' }}>Operational</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roleBreakdown.map((role, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="text-3xl font-bold mb-1" style={{ color: role.color }}>{role.value.toLocaleString()}</div>
                <div className="text-sm text-white">{role.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-4">Security & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Failed Login Attempts (24h)', value: '23', color: ACCENT },
                { label: 'Suspicious Activity Flags', value: '2', color: DANGER },
                { label: 'Data Requests Processed', value: '156', color: SUCCESS },
                { label: 'GDPR Compliance Score', value: '98%', color: SUCCESS },
                { label: 'Document Encryption Status', value: 'AES-256', color: BLUE },
                { label: 'Last Security Audit', value: '7 days ago', color: TEXT2 },
              ].map((row, i) => (
                <div key={i} className="flex justify-between p-3 rounded-xl" style={{ background: CARD2 }}>
                  <span className="text-sm" style={{ color: TEXT2 }}>{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

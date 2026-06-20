import React, { useState } from 'react';
import { useGetEmployerDashboard, useListApplications } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Briefcase, Users, CheckCircle, Calendar, Award, TrendingUp, XCircle, ThumbsDown, ThumbsUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const DANGER = '#EF4444';
const BLUE = '#818CF8';
const PURPLE = '#C084FC';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT = '#FFFFFF';
const TEXT2 = '#C4B5FD';

const mockDashboard = {
  activeVacancies: 5,
  candidatesMatched: 142,
  shortlisted: 28,
  interviewsScheduled: 12,
  offersIssued: 9,
  offersAccepted: 6,
  offersRejected: 3,
  joiningForecast: 5,
  readinessDistribution: [
    { label: 'Germany-Ready', count: 18 },
    { label: 'Pathway Active', count: 84 },
    { label: 'Training Req.', count: 32 },
    { label: 'Early Stage', count: 8 }
  ]
};

const mockRecentApps = [
  { id: 1, candidateName: 'Aarav Patel', vacancyTitle: 'Kfz-Mechatroniker', status: 'shortlisted', appliedAt: '2024-06-01T10:00:00Z', readiness: 82 },
  { id: 2, candidateName: 'Priya Sharma', vacancyTitle: 'Altenpflegerin', status: 'interview_scheduled', appliedAt: '2024-05-28T10:00:00Z', readiness: 91 },
  { id: 3, candidateName: 'Rahul Kumar', vacancyTitle: 'Kfz-Mechatroniker', status: 'applied', appliedAt: '2024-06-02T10:00:00Z', readiness: 68 },
  { id: 4, candidateName: 'Meena Pillai', vacancyTitle: 'Krankenpflegerin', status: 'offer_accepted', appliedAt: '2024-05-20T10:00:00Z', readiness: 95 },
  { id: 5, candidateName: 'Suresh Reddy', vacancyTitle: 'Elektriker', status: 'offer_rejected', appliedAt: '2024-05-15T10:00:00Z', readiness: 74 },
];

const offerFunnelData = [
  { stage: 'Matched', count: 142, color: BLUE },
  { stage: 'Shortlisted', count: 28, color: PURPLE },
  { stage: 'Interviewed', count: 14, color: ACCENT },
  { stage: 'Offered', count: 9, color: '#F59E0B' },
  { stage: 'Accepted', count: 6, color: SUCCESS },
];

const offerDecisionData = [
  { name: 'Accepted', value: 6, color: SUCCESS },
  { name: 'Rejected', value: 3, color: DANGER },
  { name: 'Pending', value: 0, color: ACCENT },
];

const rejectReasonData = [
  { reason: 'Salary too low', count: 38, color: DANGER },
  { reason: 'Role mismatch', count: 24, color: ACCENT },
  { reason: 'Location concern', count: 18, color: PURPLE },
  { reason: 'Chose other offer', count: 12, color: BLUE },
  { reason: 'Family reasons', count: 8, color: '#F59E0B' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  applied: { label: 'Applied', color: BLUE },
  shortlisted: { label: 'Shortlisted', color: PURPLE },
  interview_scheduled: { label: 'Interview Scheduled', color: ACCENT },
  interview_done: { label: 'Interview Done', color: '#06B6D4' },
  offer_issued: { label: 'Offer Issued', color: '#F59E0B' },
  offer_accepted: { label: 'Offer Accepted', color: SUCCESS },
  offer_rejected: { label: 'Offer Rejected', color: DANGER },
  withdrawn: { label: 'Withdrawn', color: '#64748B' },
};

export function EmployerDashboard() {
  const { data: dashboardData } = useGetEmployerDashboard();
  const { data: appsData } = useListApplications({ status: 'applied' });

  const dashboard = dashboardData || mockDashboard;
  const recentApps = appsData && appsData.length > 0 ? appsData.slice(0, 5) : mockRecentApps;

  const acceptRate = Math.round((dashboard.offersAccepted / (dashboard.offersIssued || 1)) * 100);
  const rejectRate = Math.round((dashboard.offersRejected / (dashboard.offersIssued || 1)) * 100);

  return (
    <div className="space-y-6 min-h-screen" style={{ background: BG }}>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Hiring Dashboard</h1>
        <p className="mt-1" style={{ color: TEXT2 }}>Real-time overview of your India recruitment pipeline.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Active Vacancies', value: dashboard.activeVacancies, icon: <Briefcase className="w-5 h-5" />, color: BLUE },
          { title: 'Matched Candidates', value: dashboard.candidatesMatched, icon: <Users className="w-5 h-5" />, color: PURPLE },
          { title: 'Shortlisted', value: dashboard.shortlisted, icon: <CheckCircle className="w-5 h-5" />, color: ACCENT },
          { title: 'Upcoming Interviews', value: dashboard.interviewsScheduled, icon: <Calendar className="w-5 h-5" />, color: '#06B6D4' },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="p-2 rounded-xl w-fit mb-3" style={{ background: `${stat.color}18` }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm" style={{ color: TEXT2 }}>{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Offer Stats — the KEY section */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #130828, #1A0B3B)', border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5" style={{ color: ACCENT }} />
          <h2 className="text-lg font-bold text-white">Offer Intelligence</h2>
          <Badge className="text-xs" style={{ background: `${ACCENT}20`, color: ACCENT, border: 'none' }}>Live</Badge>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: ACCENT }}>{dashboard.offersIssued}</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Total Offers Issued</div>
          </div>
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: SUCCESS }}>{dashboard.offersAccepted}</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Accepted</div>
          </div>
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: DANGER }}>{dashboard.offersRejected}</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Rejected</div>
          </div>
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: SUCCESS }}>{acceptRate}%</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Accept Rate</div>
          </div>
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: DANGER }}>{rejectRate}%</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Reject Rate</div>
          </div>
          <div className="col-span-1">
            <div className="text-4xl font-black mb-1" style={{ color: BLUE }}>{dashboard.joiningForecast}</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Joining Soon</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Funnel */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-lg font-bold text-white mb-1">Hiring Funnel</h3>
          <p className="text-sm mb-4" style={{ color: TEXT2 }}>From matched candidates to accepted offers</p>
          <div className="space-y-3">
            {offerFunnelData.map((stage, i) => {
              const pct = Math.round((stage.count / 142) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{stage.stage}</span>
                    <span className="text-sm font-bold" style={{ color: stage.color }}>{stage.count}</span>
                  </div>
                  <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: stage.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offer Decision Breakdown */}
        <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h3 className="text-lg font-bold text-white mb-1">Offer Decisions</h3>
          <p className="text-sm mb-4" style={{ color: TEXT2 }}>Accept vs reject breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={offerDecisionData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {offerDecisionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>

          <h4 className="text-sm font-semibold text-white mt-4 mb-3">Rejection Reasons</h4>
          <div className="space-y-2">
            {rejectReasonData.map((row, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span style={{ color: TEXT2 }}>{row.reason}</span>
                <span className="font-semibold" style={{ color: row.color }}>{row.count}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-lg font-bold text-white mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {recentApps.map((app: any, i: number) => {
            const cfg = statusConfig[app.status] || { label: app.status, color: TEXT2 };
            return (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl" style={{ background: CARD2 }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                    {app.candidateName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{app.candidateName}</p>
                    <p className="text-xs" style={{ color: TEXT2 }}>{app.vacancyTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {app.readiness && (
                    <div className="text-xs px-2 py-1 rounded-lg" style={{ background: `${SUCCESS}15`, color: SUCCESS }}>
                      {app.readiness}% ready
                    </div>
                  )}
                  <div className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                    {cfg.label}
                  </div>
                  <div className="text-xs" style={{ color: TEXT2 }}>{format(new Date(app.appliedAt), 'MMM d')}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Readiness Distribution */}
      <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-lg font-bold text-white mb-1">Matched Candidates by Readiness</h3>
        <p className="text-sm mb-4" style={{ color: TEXT2 }}>Distribution of candidates in your pipeline by Germany readiness score</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dashboard.readinessDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, color: TEXT }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {(dashboard.readinessDistribution || []).map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={
                  entry.label === 'Germany-Ready' ? SUCCESS :
                  entry.label === 'Pathway Active' ? BLUE :
                  entry.label === 'Training Req.' ? ACCENT : '#64748B'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

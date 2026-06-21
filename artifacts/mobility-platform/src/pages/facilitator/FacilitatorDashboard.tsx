import React from 'react';
import { useGetFacilitatorAnalytics } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, FileText, Award, MapPin, Users, TrendingUp } from 'lucide-react';

const mockAnalytics = {
  candidatesByStage: [
    { stage: 'Discovery', count: 120 },
    { stage: 'Language Training', count: 350 },
    { stage: 'Qual. Recognition', count: 180 },
    { stage: 'Employer Matching', count: 95 },
    { stage: 'Visa Readiness', count: 45 },
    { stage: 'Post-Arrival', count: 20 },
  ],
  documentsPending: 42,
  recognitionPending: 28,
  visaPending: 15,
  interviewsThisWeek: 34,
  offerConversionRate: 65,
  welfareAlerts: 3
};

export function FacilitatorDashboard() {
  const { data: analyticsData } = useGetFacilitatorAnalytics();
  const analytics = analyticsData || mockAnalytics;

  const alerts = [
    { title: 'Documents to Review', value: analytics.documentsPending, icon: <FileText className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'Recognition Cases', value: analytics.recognitionPending, icon: <Award className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: 'Visa Cases Pending', value: analytics.visaPending, icon: <MapPin className="w-5 h-5" />, color: 'text-purple-400 bg-purple-900/20 border-amber-100' },
    { title: 'Welfare Alerts', value: analytics.welfareAlerts, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-50 border-red-100' },
    { title: 'Interviews This Week', value: analytics.interviewsThisWeek, icon: <Users className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { title: 'Offer Conversion', value: `${analytics.offerConversionRate}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Pipeline Dashboard</h1>
        <p className="text-purple-300 mt-1">Monitor candidate progression and manage operational bottlenecks.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {alerts.map((alert, idx) => (
          <Card key={idx} className={`border ${alert.color} shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                {alert.icon}
                <span className="text-2xl font-bold leading-none">{alert.value}</span>
              </div>
              <p className="text-xs font-medium opacity-80">{alert.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>Candidates by Journey Stage</CardTitle>
          <CardDescription>Current snapshot of where candidates are in the migration pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={analytics.candidatesByStage} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={120} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                {analytics.candidatesByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#9333ea" /> // purple-600
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

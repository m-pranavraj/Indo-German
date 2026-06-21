import React from 'react';
import { useGetPipelineStats } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockStats = {
  totalCandidates: 12450,
  germanyReadyCount: 850,
  avgReadiness: 42,
  byStage: [
    { stage: 'discovery', label: 'Discovery', count: 4500 },
    { stage: 'registration', label: 'Registration', count: 2800 },
    { stage: 'eligibility', label: 'Eligibility', count: 2100 },
    { stage: 'language_training', label: 'Language Training', count: 1800 },
    { stage: 'qualification_recognition', label: 'Recognition', count: 650 },
    { stage: 'employer_matching', label: 'Matching', count: 350 },
    { stage: 'visa_readiness', label: 'Visa Readiness', count: 150 },
    { stage: 'post_arrival', label: 'Post-Arrival', count: 100 }
  ]
};

export function GovernmentPipeline() {
  const { data: statsData } = useGetPipelineStats();
  const stats = statsData || mockStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Pipeline Funnel</h1>
        <p className="text-purple-300 mt-1">Detailed view of candidate progression and drop-off rates.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>End-to-End Migration Funnel</CardTitle>
          <CardDescription>Number of candidates at each stage of the Indo-German corridor process.</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={stats.byStage} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={120} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                {stats.byStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    index >= 6 ? '#10b981' : // green for advanced stages
                    index >= 4 ? '#3b82f6' : // blue for middle stages
                    '#94a3b8' // slate for early stages
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

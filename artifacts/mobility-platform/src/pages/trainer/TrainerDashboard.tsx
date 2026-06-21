import React from 'react';
import { useGetTrainingDashboard } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, BookOpen, CheckCircle, TrendingUp, Award } from 'lucide-react';

const mockDashboard = {
  activeBatches: 12,
  studentsEnrolled: 245,
  avgAttendance: 88.5,
  certificatesIssued: 850,
  placementOutcomes: 72,
  completionByLevel: [
    { level: 'A1', completed: 420, total: 500 },
    { level: 'A2', completed: 280, total: 350 },
    { level: 'B1', completed: 150, total: 200 },
    { level: 'B2', completed: 60, total: 80 }
  ]
};

export function TrainerDashboard() {
  const { data: dashboardData } = useGetTrainingDashboard();
  const dashboard = dashboardData || mockDashboard;

  const statCards = [
    { title: 'Active Batches', value: dashboard.activeBatches, icon: <BookOpen className="w-5 h-5" />, color: 'bg-teal-50 text-teal-600' },
    { title: 'Students Enrolled', value: dashboard.studentsEnrolled, icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Avg Attendance', value: `${dashboard.avgAttendance}%`, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Certificates Issued', value: dashboard.certificatesIssued, icon: <Award className="w-5 h-5" />, color: 'bg-purple-900/20 text-purple-400' },
    { title: 'Placement Rate', value: `${dashboard.placementOutcomes}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Institute Dashboard</h1>
        <p className="text-purple-300 mt-1">Overview of your language training performance and candidate progress.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-purple-900 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`p-2 rounded-lg ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs font-medium text-purple-300 mt-1">{stat.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>Completion by Language Level</CardTitle>
          <CardDescription>Number of students who successfully completed courses compared to total enrollments.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.completionByLevel} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="completed" name="Successfully Completed" stackId="a" fill="#0d9488" radius={[0, 0, 4, 4]} />
              <Bar dataKey="total" name="Total Enrolled" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

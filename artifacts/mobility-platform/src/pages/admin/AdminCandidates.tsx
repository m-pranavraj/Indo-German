import React from 'react';
import { useListCandidates } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const mockCandidates = [
  { id: 1, userId: 101, name: 'Aarav Patel', occupation: 'Software Engineer', stage: 'visa_readiness', readinessScore: 92, district: 'Ernakulam', createdAt: '2023-01-10T10:00:00Z' },
  { id: 2, userId: 102, name: 'Priya Sharma', occupation: 'Registered Nurse', stage: 'language_training', readinessScore: 45, district: 'Thiruvananthapuram', createdAt: '2023-02-15T10:00:00Z' },
  { id: 3, userId: 103, name: 'Rahul Kumar', occupation: 'Electrician', stage: 'qualification_recognition', readinessScore: 68, district: 'Thrissur', createdAt: '2023-03-20T10:00:00Z' },
];

export function AdminCandidates() {
  const { data: candidatesData } = useListCandidates();
  const candidates = candidatesData || mockCandidates;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Candidates</h1>
        <p className="text-slate-500 mt-1">Global view of all registered candidates.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Readiness</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs text-slate-500 font-mono">{c.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{c.occupation || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 capitalize font-normal border-slate-200">
                      {c.stage.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.readinessScore >= 80 ? 'bg-green-500' : c.readinessScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{c.readinessScore}/100</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {format(new Date(c.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

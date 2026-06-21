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
        <h1 className="text-3xl font-bold text-white tracking-tight">System Candidates</h1>
        <p className="text-purple-300 mt-1">Global view of all registered candidates.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
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
                  <TableCell className="text-xs text-purple-300 font-mono">{c.id}</TableCell>
                  <TableCell className="font-medium text-white">{c.name}</TableCell>
                  <TableCell className="text-sm text-purple-300">{c.occupation || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-950/60 text-purple-200 capitalize font-normal border-purple-900">
                      {c.stage.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.readinessScore >= 80 ? 'bg-green-500' : c.readinessScore >= 50 ? 'bg-purple-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{c.readinessScore}/100</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-purple-300">
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

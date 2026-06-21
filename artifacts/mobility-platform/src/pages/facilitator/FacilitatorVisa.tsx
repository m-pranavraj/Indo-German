import React from 'react';
import { useListVisaCases } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockCases = [
  { id: 1, candidateId: 101, candidateName: 'Aarav Patel', pathwayType: 'EU Blue Card', status: 'checklist_in_progress', checklistProgress: 8, checklistTotal: 11, travelDate: null },
  { id: 2, candidateId: 102, candidateName: 'Priya Sharma', pathwayType: 'Skilled Worker', status: 'decision_pending', checklistProgress: 11, checklistTotal: 11, travelDate: null },
  { id: 3, candidateId: 103, candidateName: 'Rahul Kumar', pathwayType: 'Job Seeker', status: 'approved', checklistProgress: 11, checklistTotal: 11, travelDate: '2023-11-15T00:00:00Z' },
];

export function FacilitatorVisa() {
  const { data: casesData } = useListVisaCases();
  const cases = casesData || mockCases;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'checklist_in_progress': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">Preparing Docs</Badge>;
      case 'documents_ready': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ready for Appt</Badge>;
      case 'appointment_pending': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Appt Scheduled</Badge>;
      case 'decision_pending': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Under Review</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      default: return <Badge variant="outline" className="capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Visa Case Management</h1>
        <p className="text-purple-300 mt-1">Track visa application readiness and consulate decisions.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Visa Type</TableHead>
                <TableHead>Checklist Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => {
                const percent = Math.round((c.checklistProgress || 0) / (c.checklistTotal || 1) * 100);
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium text-white">{c.candidateName}</div>
                      <div className="text-xs text-purple-300">ID: {c.candidateId}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-purple-200">{c.pathwayType || 'Not Set'}</span>
                    </TableCell>
                    <TableCell className="w-1/4">
                      <div className="space-y-1.5 pr-8">
                        <div className="flex justify-between text-xs">
                          <span className="text-purple-300">{c.checklistProgress}/{c.checklistTotal} Docs</span>
                          <span className="font-medium text-purple-200">{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" indicatorClassName={percent === 100 ? "bg-green-500" : "bg-purple-500"} />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Update Case</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { useListApplications, useUpdateApplication } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const mockApplications = [
  { id: 1, candidateId: 1, vacancyId: 101, candidateName: 'Aarav Patel', vacancyTitle: 'Senior React Developer', employerName: 'TechCorp GmbH', status: 'shortlisted', appliedAt: '2023-05-01T10:00:00Z', createdAt: '2023-05-01T10:00:00Z' },
  { id: 2, candidateId: 2, vacancyId: 101, candidateName: 'Priya Sharma', vacancyTitle: 'Senior React Developer', employerName: 'TechCorp GmbH', status: 'applied', appliedAt: '2023-05-02T10:00:00Z', createdAt: '2023-05-02T10:00:00Z' },
  { id: 3, candidateId: 3, vacancyId: 102, candidateName: 'Rahul Kumar', vacancyTitle: 'Frontend Engineer', employerName: 'TechCorp GmbH', status: 'interview_scheduled', appliedAt: '2023-04-20T10:00:00Z', createdAt: '2023-04-20T10:00:00Z' },
];

export function EmployerApplications() {
  const { data: applicationsData, refetch } = useListApplications();
  const updateApp = useUpdateApplication();
  
  const applications = applicationsData || mockApplications;

  const handleStatusChange = (id: number, newStatus: string) => {
    updateApp.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => refetch()
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, color: string }> = {
      'applied': { label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'shortlisted': { label: 'Shortlisted', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      'interview_scheduled': { label: 'Interviewing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      'interview_done': { label: 'Interview Done', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      'offer_issued': { label: 'Offer Issued', color: 'bg-green-50 text-green-700 border-green-200' },
      'offer_accepted': { label: 'Hired', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'offer_rejected': { label: 'Declined Offer', color: 'bg-red-50 text-red-700 border-red-200' },
      'withdrawn': { label: 'Withdrawn', color: 'bg-slate-100 text-slate-500 border-slate-200' },
    };

    const config = statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applications</h1>
        <p className="text-slate-500 mt-1">Review and manage candidates who have applied to your vacancies.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Vacancy</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{app.candidateName}</div>
                    <div className="text-xs text-blue-600 hover:underline cursor-pointer">View Profile</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-700">{app.vacancyTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {app.appliedAt ? format(new Date(app.appliedAt), 'MMM d, yyyy') : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(app.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Select 
                        value={app.status} 
                        onValueChange={(v) => handleStatusChange(app.id, v)}
                        disabled={updateApp.isPending}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">New</SelectItem>
                          <SelectItem value="shortlisted">Shortlist</SelectItem>
                          <SelectItem value="interview_scheduled">Schedule Interview</SelectItem>
                          <SelectItem value="offer_issued">Issue Offer</SelectItem>
                          <SelectItem value="withdrawn">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

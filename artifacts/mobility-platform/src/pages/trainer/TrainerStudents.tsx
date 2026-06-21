import React from 'react';
import { useListEnrollments } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const mockEnrollments = [
  { id: 1, candidateId: 101, candidateName: 'Aarav Patel', batchId: 1, batchName: 'Intensive A1 German', languageLevel: 'A1', status: 'passed', attendancePercent: 95, assessmentScore: 88, certificateIssued: true, enrolledAt: '2023-08-01T10:00:00Z' },
  { id: 2, candidateId: 102, candidateName: 'Priya Sharma', batchId: 1, batchName: 'Intensive A1 German', languageLevel: 'A1', status: 'attending', attendancePercent: 82, assessmentScore: null, certificateIssued: false, enrolledAt: '2023-08-01T10:00:00Z' },
  { id: 3, candidateId: 103, candidateName: 'Rahul Kumar', batchId: 2, batchName: 'B1 Professional German', languageLevel: 'B1', status: 'dropped', attendancePercent: 45, assessmentScore: null, certificateIssued: false, enrolledAt: '2023-09-15T10:00:00Z' },
];

export function TrainerStudents() {
  const { data: enrollmentsData } = useListEnrollments();
  const enrollments = enrollmentsData || mockEnrollments;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'enrolled': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Enrolled</Badge>;
      case 'attending': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">Attending</Badge>;
      case 'passed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Passed</Badge>;
      case 'failed': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'dropped': return <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-900">Dropped</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Student Enrollments</h1>
        <p className="text-purple-300 mt-1">Track student progress, attendance, and assessment outcomes.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Batch & Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <div className="font-medium text-white">{enrollment.candidateName}</div>
                    <div className="text-xs text-purple-300">ID: {enrollment.candidateId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-purple-200">{enrollment.batchName}</div>
                    <Badge variant="secondary" className="mt-1 bg-teal-50 text-teal-700 text-xs px-1.5 py-0">{enrollment.languageLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enrollment.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${enrollment.attendancePercent && enrollment.attendancePercent < 75 ? 'text-red-600' : 'text-purple-200'}`}>
                      {enrollment.attendancePercent ? `${enrollment.attendancePercent}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-white">
                      {enrollment.assessmentScore !== null ? `${enrollment.assessmentScore}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {enrollment.certificateIssued ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Issued</Badge>
                    ) : (
                      <span className="text-xs text-purple-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-purple-300">
                    No enrollments found.
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
